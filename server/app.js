const cors = require("cors");
const express = require("express");
const app = express();
const todoRoute = require("./routes/todoRoute");
const taskRoute = require("./routes/taskRoute");
const searchRoute = require("./routes/searchRoute");

// Middleware
app.use(
  cors({
    origin: ['https://task-manager.abhijeetsh.com', 'https://task-manager-abhijeetsh.pages.dev'],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", todoRoute);
app.use("/", taskRoute);
app.use("/search", searchRoute);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
