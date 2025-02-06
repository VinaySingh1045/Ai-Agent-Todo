import mongoose, { Schema } from "mongoose";
import { ITodo } from "../types/todo";

const TodoSchema: Schema = new Schema({
    description: String,
    status: { type: String, enum: ["inprogress", "done"], default: "inprogress" },
}, { timestamps: true })

export default mongoose.model<ITodo>("todo", TodoSchema);