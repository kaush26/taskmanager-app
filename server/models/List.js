import mongoose from "mongoose";
const { Schema } = mongoose;

const listSchema = new Schema({
  label: { type: String, required: true },
  ragColor: { type: String, required: true },
  createdTime: { type: Date, required: true },
  updatedTime: { type: Date, required: true },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: 'Task'
  }]
});

export const List = mongoose.model('List', listSchema);