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

// delete task

exports.deleteTask = async (req, res) => {
  const { todoId } = req.params;
  const { tasks } = req.body;
  console.log("Task is retreived", tasks);

  if (!todoId) {
    return res.status(400).json({
      success: false,
      message: "TodoId not doesn't exists",
    });
  }

  try {
    if (!tasks) {
      return res.status(400).json({
        success: false,
        message: "Something went wrong",
      });
    }
    const todo = await TodoSchema.findOne({ _id: todoId });
    todo.tasks.pull(tasks);
    await todo.save();
    console.log(todo);
    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
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
    if (!todoId) {
      res.status(400).json({
        success: false,
        message: "Todo ID not present",
      });
    }
    if (!tasks) {
      res.status(400).json({
        success: false,
        message: "Please send correct data",
      });
    }

    const todo = await TodoSchema.findOne({ _id: todoId });
    if (tasks.length > 0) {
      for (let i in tasks) {
        if (tasks[i].task != todo.tasks[i].task) {
          todo.tasks[i].task = tasks[i].task;
        }
      }
    }
    await todo.save();
    console.log(todo);
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      todo,
    });
  } catch (error) {
    res.status(402).json({
      success: false,
      message: error.message,
    });
  }
};
