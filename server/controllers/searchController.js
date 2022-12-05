const TodoSchema = require("../models/todoModel");

exports.searchTask = async (req, res) => {
  try {
    const { query } = req.body;
    const searchTodo = await TodoSchema.aggregate().search({
      index: "default",
      text: {
        query: query,
        path: ["title", "tasks"],
      },
    });
    res.status(200).json({
        success:true,
        message:"Search result found.",
        searchTodo
    });
  } catch (error) {
    res.status(403).json({
      success: true,
      message: error.message,
    });
  }
};


