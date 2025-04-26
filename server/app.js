const cors = require("cors");
const express = require("express");
const app = express();
const todoRoute = require("./routes/todoRoute");
const taskRoute = require("./routes/taskRoute");
const searchRoute = require("./routes/searchRoute");

// Middleware
app.use(
  cors({
    origin: [
      'https://task-manager.abhijeetsh.com',
      'https://mern-task-management-app-szno.vercel.app',
      'http://localhost:5173'
    ],
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use("/api", todoRoute);
app.use("/api", taskRoute);
app.use("/api/search", searchRoute);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
