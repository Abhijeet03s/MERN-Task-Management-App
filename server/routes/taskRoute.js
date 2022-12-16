const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  editTask,
  deleteTask,
} = require("../controllers/taskController");

router.route("/get_tasks/:todoId").get(getTasks);
router.route("/create_task/:todoId").post(createTask);
router.route("/edit_task/:todoId").put(editTask);
router.route("/delete_task/:todoId").delete(deleteTask);

module.exports = router;
