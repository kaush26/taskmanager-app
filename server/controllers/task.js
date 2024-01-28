import { List } from "../models/List.js";
import { Task } from "../models/Task.js"

export const getTasks = async (req, res, next) => {
  try {
    const task = await Task.find().populate('list')
    res.json(task)
  } catch (err) {
    next(err);
  }
}

export const addTask = async (req, res, next) => {
  try {
    const data = { ...req.body, status: 'progress', createdTime: new Date().toISOString(), updatedTime: new Date().toISOString() };
    const listId = data?.list;
    const task = new Task(data);
    const result = await task.save();

    if (listId) {
      const exisitingList = await List.findById(listId);
      exisitingList.tasks.push(result._id);
      await exisitingList.save();
    }

    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const updateTask = async (req, res, next) => {
  try {
    const data = { ...req.body };
    delete data._id;

    const exisitingTask = await Task.findById(req.body?._id);
    const previousListId = exisitingTask?.list?.toString?.();

    for (let key in data) {
      exisitingTask[key] = data[key]
    }
    exisitingTask.updatedTime = new Date().toISOString()
    const result = await exisitingTask.save();

    const listId = data?.list;
    if (listId) {
      const exisitingList = await List.findById(listId);
      if (exisitingList.tasks.includes(req.body._id)) return res.json(result)
      exisitingList.tasks.push(req.body._id);
      await exisitingList.save();

      if (previousListId && previousListId !== listId) {
        let previousList = await List.findById(previousListId);
        previousList.tasks = previousList.tasks.filter(task => task.toString() !== req.body._id)
        await previousList.save()
      }
    }

    res.json(result)
  } catch (err) {
    next(err);
  }
}

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.deleteOne({ _id: req.body?._id });
    res.json(task)
  } catch (err) {
    next(err)
  }
}