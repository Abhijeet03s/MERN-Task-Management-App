const TodoSchema = require("../models/todoModel");

// create task

exports.createTask = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { tasks } = req.body;
    console.log(tasks);
    const todo = await TodoSchema.findById(todoId);
    if (!todo) throw new Error("Todo doesn't exists");

    tasks.forEach((task) => {
      todo.tasks.push(task);
    });
    await todo.save();
    console.log(todo);

    res.status(200).json({
      success: true,
      message: "Task added successfully",
      todo,
    });
  } catch (error) {
    res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};

// edit task

exports.editTask = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { tasks } = req.body;
    console.log(tasks);
    const todo = await TodoSchema.findByIdAndUpdate(todoId, { tasks });
    if (!todo) throw new Error("Todo doesn't exists");
    await todo.save();
    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo,
    });
  } catch (error) {
    res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};

// delete task

exports.deleteTask = async (req, res) => {
  const { todoId } = req.params;
  const task = req.body;

  if (!todoId) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong",
    });
  }

  try {
    if (!task) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    const todo = await TodoSchema.findOne({ _id: todoId });
    todo.tasks.pull(task);
    console.log(todo);
    todo.save();
  } catch (error) {
    res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};
