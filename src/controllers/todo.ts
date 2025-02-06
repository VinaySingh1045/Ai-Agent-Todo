import { ITodo } from "../types/todo";
import TodoSchema from "../models/todo"
export const addTodo = async (payload: ITodo) => {

    const { description, status } = payload;

    const todo = await TodoSchema.create({
        description,
        status
    })
    if (!todo) {
        throw new Error("Failed to create Todo");
    }

    return {
        message: "Added Successfully",
        todo: todo
    }
}
export const getAllTodos = async () => {
    const todos = await TodoSchema.find()
    if (!todos) {
        throw new Error("Failed to fetch Todos");
    }
    return {
        message: "Todos Fetch Successfully",
        todo: todos
    }
}

export const updateTodo = async (payload: ITodo) => {
    const { description, status, todoId } = payload

    const updateFields: Partial<ITodo> = {};

    if (description !== undefined) {
        updateFields.description = description;
    }

    if (status !== undefined) {
        updateFields.status = status;
    }

    const todo = await TodoSchema.findByIdAndUpdate(
        todoId,
        updateFields, 
        { new: true }
    );

    if (!todo) {
        throw new Error("Failed to update Todo");
    }
    return {
        message: "Updated Successfully",
        todo: todo
    }
}

export const deleteTodo = async (payload: ITodo) => {
    const { todoId } = payload
    const todo = await TodoSchema.findByIdAndDelete(todoId)
    if (!todo) {
        throw new Error("Failed to delete Todo");
    }
    return {
        message: "Deleted Successfully",
        todo
    }
}
