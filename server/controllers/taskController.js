const TodoSchema = require("../models/todoModel");

// create task

exports.createTask = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { text } = req.body;
    const checkTodoExists = await TodoSchema.findById(todoId);
    if (!checkTodoExists) throw new Error("Todo doesn't exists");

    const todo = await TodoSchema.findById(todoId);
    todo.tasks.push(text);
    const saveTask = await TodoSchema.findByIdAndUpdate(todoId, todo);
    res.status(200).json({
      success: true,
      message: "Task added successfully",
      saveTask,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// edit task

exports.editTask = async (req, res) => {};

// delete task

exports.deleteTask = async (req, res) => {};
