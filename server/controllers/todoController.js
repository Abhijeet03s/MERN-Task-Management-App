const supabase = require('../config/supabaseConfig');

// home route

exports.home = (req, res) => {
  res.send("Welcome to my Todo App");
};

// create todo

exports.createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    const { data, error } = await supabase
      .from('todos')
      .insert([
        { title, description, user_id: req.user?.id }
      ])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// get todos

exports.getAllTodos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', req.user?.id);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// get todo

exports.getTodo = async (req, res) => {
  try {
    const { todoId } = req.params;
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('id', todoId)
      .eq('user_id', req.user?.id);

    if (error) throw error;
    if (data.length > 0) {
      res.status(200).json(data[0]);
    } else {
      res.status(400).json({
        success: false,
        message: "Todo not available in the list",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// edit todo

exports.editTodo = async (req, res) => {
  try {
    const { todoId } = req.params;

    // Add validation
    if (!todoId) {
      throw new Error("Todo ID is required to fetch the todo");
    }

    const { title } = req.body;
    const { data, error } = await supabase
      .from('todos')
      .update({ title })
      .eq('id', todoId)
      .eq('user_id', req.user?.id)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: data[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// delete todo

exports.deleteTodo = async (req, res) => {
  const { todoId } = req.params;
  try {
    const { data, error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId)
      .eq('user_id', req.user?.id)
      .select();

    if (error) throw error;

    // Fix the null check:
    if (!data || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Todo not available in the list",
      });
    }

    res.json({
      success: true,
      message: "Todo deleted successfully",
      todo: data[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Example function - update your existing function
exports.getTodos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server Error',
      error: error.message
    });
  }
};
