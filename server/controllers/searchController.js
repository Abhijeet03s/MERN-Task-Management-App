const supabase = require('../config/supabaseConfig');

exports.searchTask = async (req, res) => {
  try {
    const { query } = req.body;

    // Search in todos
    const { data: todoResults, error: todoError } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', req.user?.id)
      .ilike('title', `%${query}%`);

    if (todoError) throw todoError;

    // Search in tasks
    const { data: taskResults, error: taskError } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user?.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`);

    if (taskError) throw taskError;

    // Combine results
    const searchResults = {
      todos: todoResults || [],
      tasks: taskResults || []
    };

    res.status(200).json({
      success: true,
      message: "Search results found.",
      searchResults
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


