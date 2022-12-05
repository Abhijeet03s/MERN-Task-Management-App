const express = require("express");
const mongodbConnect = require("./config/todoDB");
const app = express();
const todoRoute = require("./routes/todoRoute");
const taskRoute = require("./routes/taskRoute");
const search = require('./routes/searchRoute')

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DatabaseConnections
mongodbConnect();

// Routes
app.use("/", todoRoute);
app.use("/", taskRoute);
app.use("/", search);

module.exports = app;
