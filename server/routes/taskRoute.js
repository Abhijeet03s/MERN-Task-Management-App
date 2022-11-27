const express = require("express");
const router = express.Router();
const {
  createTask,
  editTask,
  deleteTask,
} = require("../controllers/taskController");

router.post("/create_task/:todoId", createTask);
router.put("/edit_task/:todoId", editTask);
router.delete("/delete_task/:todoId", deleteTask);

module.exports = router;
