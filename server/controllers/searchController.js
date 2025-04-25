const supabase = require('../config/supabaseConfig');

exports.searchTask = async (req, res) => {
  try {
    const { query } = req.body;
    const userId = req.user.id;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters' });
    }

    // Search todos
    const { data: todos, error: todoError } = await supabase
      .from('todos')
      .select(`
        *,
        tasks_count:tasks!tasks_todo_id_fkey(count)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('user_id', userId);

    if (todoError) throw todoError;

    // Search tasks
    const { data: tasks, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        todo:todos!tasks_todo_id_fkey(id, title)
      `)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .eq('user_id', userId);

    if (taskError) throw taskError;

    // Process todo results to include task count
    const processedTodos = todos.map(todo => ({
      ...todo,
      tasks_count: todo.tasks_count?.[0]?.count || 0
    }));

    // Process task results to include todo info
    const processedTasks = tasks.map(task => ({
      ...task,
      todo_title: task.todo?.[0]?.title || 'Unknown'
    }));

    res.status(200).json({
      todos: processedTodos,
      tasks: processedTasks,
      total: processedTodos.length + processedTasks.length,
      query
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};


