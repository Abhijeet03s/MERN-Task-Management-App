const supabase = require('../config/supabaseConfig');

exports.searchTask = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    // Search todos
    const { data: todos } = await supabase
      .from('todos')
      .select()
      .ilike('title', `%${query}%`)
      .eq('user_id', userId);

    // Search tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select()
      .ilike('title', `%${query}%`)
      .eq('user_id', userId);

    res.status(200).json({ todos, tasks });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};


