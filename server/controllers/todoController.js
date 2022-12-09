const TodoSchema = require("../models/todoModel");

// home route

exports.home = (req, res) => {
  res.send("Welcome to my Todo App");
};

// create todo

exports.createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      res.json({
        success: true,
        message: "Title is required, Enter title to create a todo",
      });
    }
    const todoData = await TodoSchema.create({ title });
    const todo = await todoData.save();
    res.status(200).json({
      success: true,
      todo,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// get todos

exports.getTodos = async (req, res) => {
  try {
    const todo = await TodoSchema.find();
    res.status(200).json({
      success: true,
      message: "Todos is retrieved successfully",
      todo,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// get todo

exports.getTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const todo = await TodoSchema.findById(todoId);
    if (todoId) {
      res.status(200).json({
        success: true,
        message: "Todo retrieved successfully",
        todo,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Todo not available in the list",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "error.message",
    });
  }
};

// edit todo

exports.editTodo = async (req, res) => {
  const { todoId } = req.params;
  const { title } = req.body;
  const todo = await TodoSchema.findByIdAndUpdate(todoId, { title });
  try {
    if (!todo) {
      throw new Error("Todo ID is required to fetch the todo");
    }
    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// delete todo

exports.deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  const todo = await TodoSchema.findByIdAndDelete(todoId);
  try {
    if (todo) {
      res.json({
        success: true,
        message: "Todo deleted successfully",
        todo,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Todo not available in the list",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
