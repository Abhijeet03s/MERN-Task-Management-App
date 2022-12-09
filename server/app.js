const cors = require('cors')
const express = require("express");
const mongodbConnect = require("./config/todoDB");
const app = express();
const todoRoute = require("./routes/todoRoute");
const taskRoute = require("./routes/taskRoute");
const search = require("./routes/searchRoute");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", todoRoute);
app.use("/", taskRoute);
app.use("/", search);

// DatabaseConnections
mongodbConnect();

module.exports = app;
