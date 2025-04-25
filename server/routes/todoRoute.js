const express = require("express");
const router = express.Router();
const {
  home,
  createTodo,
  getTodos,
  getTodo,
  editTodo,
  deleteTodo,
} = require("../controllers/todoController");
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.route("/").get(home);
router.route("/create_todo").post(createTodo);
router.route("/get_todos").get(getTodos);
router.route("/get_todo/:todoId").get(getTodo);
router.route("/edit_todo/:todoId").put(editTodo);
router.route("/delete_todo/:todoId").delete(deleteTodo);

module.exports = router;
