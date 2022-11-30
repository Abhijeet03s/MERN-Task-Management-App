const todoRoute = require("./routes/todoRoute");
const taskRoute = require("./routes/taskRoute");
const express = require("express");
const app = express();
const mongodbConnect = require("./config/todoDB");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongodbConnect();
// Routes
app.use("/", todoRoute);
app.use("/", taskRoute);


module.exports = app;
