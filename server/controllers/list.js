import { List } from "../models/List.js";

export const getLists = async (req, res, next) => {
  try {
    res.json(await List.find().populate('tasks'))
  } catch (err) {
    next(err);
  }
}

export const addList = async (req, res, next) => {
  try {
    const data = { ...req.body, createdTime: new Date().toISOString(), updatedTime: new Date().toISOString(), tasks: [] };
    const result = await new List(data).save();
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const updateList = async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data._id;
    res.json(await List.updateOne({ _id: req.body?._id }, { $set: { ...data, updatedTime: new Date().toISOString() } }))
  } catch (err) {
    next(err);
  }
}

export const deleteList = async (req, res, next) => {
  try {
    const _id = req.body?._id;
    const task = await List.deleteOne({ _id });
    res.json(task)
  } catch (err) {
    next(err)
  }
}