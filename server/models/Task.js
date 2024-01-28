import mongoose from "mongoose";
const { Schema } = mongoose;

export const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdTime: { type: Date, required: true },
  updatedTime: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, required: false },
  list: {
    type: Schema.Types.ObjectId,
    ref: 'List'
  }
})

export const Task = mongoose.model('Task', taskSchema);