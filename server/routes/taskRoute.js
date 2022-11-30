const express = require("express");
const router = express.Router();
const {
  createTask,
  editTask,
  deleteTask,
} = require("../controllers/taskController");

router.route("/create_task/:todoId").post(createTask);
router.route("/edit_task/:todoId").put(editTask);
router.route("/delete_task/:todoId").delete(deleteTask);

module.exports = router;
