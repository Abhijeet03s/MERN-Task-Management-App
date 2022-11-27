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

router.get("/", home);
router.post("/create_todo", createTodo);
router.get("/get_todos", getTodos);
router.get("/get_todo/:todoId", getTodo);
router.put("/edit_todo/:todoId", editTodo);
router.delete("/delete_todo/:todoId", deleteTodo);

module.exports = router;
