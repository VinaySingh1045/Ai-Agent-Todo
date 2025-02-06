import { Router, Request, Response } from "express";
import { IResponse } from "../types/IResponse";
import * as todo from "../controllers/todo"
import { parseError } from "../utils/helper";
import { addTodo, getAllTodos, updateTodo, deleteTodo } from "../controllers/todo";
import { ITodo } from "../types/todo";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

const router: Router = Router();

router.post("/addTodo", async (req: Request, res: Response) => {
    let ApiResponse: IResponse = { code: 200, data: null };

    if (!req.body.description) res.status(400).send("Description is required")
    try {

        const payload = {
            ...req.body
        }
        ApiResponse.data = await todo.addTodo(payload);

    } catch (error) {
        ApiResponse = parseError(error);
    }
    finally {
        res.status(ApiResponse.code).send(ApiResponse.data);
    }

});

router.get("/getAllTodo", async (req: Request, res: Response) => {
    let ApiResponse: IResponse = { code: 200, data: null };
    try {
        ApiResponse.data = await todo.getAllTodos();
    } catch (error) {
        ApiResponse = parseError(error);
    }
    finally {
        res.status(ApiResponse.code).send(ApiResponse.data);
    }
})

router.put("/updateTodo/:id", async (req, res) => {
    let ApiResponse: IResponse = { code: 200, data: null };
    const todoId = req.params.id;
    const payload = {
        ...req.body,
        todoId: todoId,
    }
    try {
        ApiResponse.code = 200;
        ApiResponse.data = await todo.updateTodo(payload);
    } catch (error) {
        ApiResponse = parseError(error);
    }
    finally {
        res.status(ApiResponse.code).send(ApiResponse.data);
    }
})

router.delete("/deleteTodo/:id", async (req, res) => {
    let ApiResponse: IResponse = { code: 200, data: null };
    try {
        const todoId = req.params.id;

        const payload = {
            ...req.body,
            todoId: todoId,
        };

        ApiResponse.code = 200;
        ApiResponse.data = await todo.deleteTodo(payload);
    } catch (error) {
        ApiResponse = parseError(error);
    } finally {
        res.status(ApiResponse.code).send(ApiResponse.data);
    }
})


const SYSTEM_PROMPT = `
You are an AI To-do List Assistant with START, PLAN, ACTION, OBSERVATION and OUTPUT State.
Wait for the user prompt and first PLAN using available tools.
After Planning. Take the action with appropriate tools and wait for Observation based on Action.
Once you get the Observations, Return the AI response based on START prompt and Observations

You are an AI To-do List Assistant with START, PLAN, ACTION, OBSERVATION, and OUTPUT states.
You have to reply user with there prompt if there is not provide the function by the user ask about it or reply them.
You manage tasks by adding, updating, deleting and viewing todos in JSON format.

Todo DB Schema:
id: String or number
description: String
status: String (inprogress, done)

Available Tools:
- getAllTodos(): Returns all todos without any input only for the getAllTodos function.
- addTodo(todo: string): Adds a new todo.
- updateTodo(todoId: string, status: string ): update the todo by ID given in the DB.
- deleteTodo({todoId: string}): delete the todo by the given ID from the DB.

Example:
START
{ "type": "user", "user": "ADD a task for shopping groceries." }
{ "type": "plan", "plan": "I will try to get more context on what the user needs." }
{ "type": "output", "output": "Can you specify what items you need?" }
{ "type": "user", "user": "Milk, butter, and paneer." }
{ "type": "plan", "plan": "I will use addTodo to create a new todo." }
{ "type": "action", "function": "addTodo", "input": "Shopping for milk, butter, and paneer." }
{ "type": "observation", "observation": "Todo added successfully." }
{ "type": "output", "output": "Your todo has been added successfully." }
`;

interface AIRequestBody {
    userMessage?: string;
    description?: string;
}

const tools: Record<string, (input: ITodo) => Promise<any>> = {
    getAllTodos,
    addTodo,
    updateTodo,
    deleteTodo,
};

router.post("/ai", async (req: Request<{}, {}, AIRequestBody>, res: Response) => {
    let ApiResponse: IResponse = { code: 200, data: null };
    try {
        const { description } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        ${SYSTEM_PROMPT}
        User Input: "${description}"
        
        **Instruction:** Respond in **valid JSON format** only. Example outputs:
        
        \`\`\`json
        { "type": "output", "output": "Your todo has been added successfully." }
        \`\`\`
        
        or
        
        \`\`\`json
        { "type": "action", "function": "addTodo", "input": { "description": "Build AI Agent Backend", "status": "inprogress" } }
        \`\`\`

        Ensure the response is strictly **valid JSON** with no extra text.
        `;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text().trim();

        // Ensure we extract JSON correctly
        const jsonStart = responseText.indexOf("{");
        const jsonEnd = responseText.lastIndexOf("}");

        if (jsonStart === -1 || jsonEnd === -1) {
            throw new Error("Invalid AI response format. Expected JSON.");
        }

        const jsonResponse = responseText.substring(jsonStart, jsonEnd + 1);

        const action = JSON.parse(jsonResponse);

        if (action.type === "output") {
            ApiResponse = { code: 200, data: { output: action.output } };
        }
        else if (action.type === "plan") {
            ApiResponse = { code: 200, data: { plan: action.plan } };
        } else if (action.type === "action") {
            const fn = tools[action.function] as ((input: ITodo) => Promise<any>) | undefined;
            if (!fn) {
                ApiResponse = { code: 400, data: { error: "Invalid function" } };
            } else if (!action.input) {
                ApiResponse = { code: 400, data: { error: "Missing input for function" } };
            } else {
                const observation = await fn(action.input);
                ApiResponse = { code: 200, data: { observation } };
            }
        }
    } catch (error) {
        console.error("Error processing AI request:", error);
        ApiResponse = { code: 500, data: { error: "Internal Server Error" } };
    }
    res.status(ApiResponse.code).json(ApiResponse.data);
});


export default router;