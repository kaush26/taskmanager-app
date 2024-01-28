import "dotenv/config";
import path from "path";
import fs from "fs";
import morgan from "morgan";
import express from "express";
import bodyParser from "body-parser";
import mongoose from 'mongoose'
import { addTask, deleteTask, getTasks, updateTask } from "./controllers/task.js";
import { addList, deleteList, getLists, updateList } from "./controllers/list.js";
import auth from "./middleware/auth.js";
import { login, signUp } from "./controllers/user.js";
import cors from 'cors';

const app = express();

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Origin, Content-Type, Authorization");

//   next();
// });

app.use(cors())

const accessLogStream = fs.createWriteStream(path.join(".", "access.log"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));
app.use(bodyParser.json({ limit: "75mb" }));

app.post('/signup', signUp);
app.post('/login', login);

app.get('/auth', auth, (req, res) => res.json({ statusCode: 200, message: 'success' }));

app.use('/tasks', auth);
app.get('/tasks', getTasks);
app.post('/tasks/add', addTask);
app.post('/tasks/update', updateTask);
app.post('/tasks/delete', deleteTask)


app.use('/lists', auth);
app.get('/lists', getLists);
app.post('/lists/add', addList);
app.post('/lists/update', updateList);
app.post('/lists/delete', deleteList)


app.use((error, req, res, next) => {
  const code = error.code || 500;
  res.status(code).json({
    statusCode: error.code || 500,
    error: { message: error.message },
  });
});

const PORT = process.env.NODE_PORT || 4026;
mongoose.connect('mongodb://127.0.0.1:27017/task', { useNewUrlParser: true }).then((res) => {
  app.listen(PORT, () => {
    console.log(
      `🚀 Server is running on http://localhost:${PORT} \n❌ Press Ctrl + C to Stop the server.`
    );
  });
}).catch(err => console.log('err', err))
// connect((db) => {
//   console.log("Connecting to Database...");
//   if (!db) {
//     console.log("Connecting to Database Failed!");
//     return;
//   }
// });