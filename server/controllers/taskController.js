const supabase = require('../config/supabaseConfig');

// Get all tasks for a specific todo
const getTasks = async (req, res) => {
   try {
      const { todoId } = req.params;
      const { data, error } = await supabase
         .from('tasks')
         .select('*')
         .eq('todo_id', todoId)
         .eq('user_id', req.user?.id);

      if (error) throw error;
      res.status(200).json(data);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Create a new task
const createTask = async (req, res) => {
   try {
      const { todoId } = req.params;
      const { title, description, status } = req.body;

      const { data, error } = await supabase
         .from('tasks')
         .insert([
            {
               title,
               description,
               status: status || 'pending',
               todo_id: todoId,
               user_id: req.user?.id
            }
         ])
         .select();

      if (error) throw error;
      res.status(201).json(data[0]);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Edit a task
const editTask = async (req, res) => {
   try {
      const { todoId } = req.params;
      const { taskId } = req.body;
      const updateData = { ...req.body };

      // Remove fields that shouldn't be updated
      delete updateData.taskId;
      delete updateData.id;
      delete updateData.user_id;
      delete updateData.todo_id;

      const { data, error } = await supabase
         .from('tasks')
         .update(updateData)
         .eq('id', taskId)
         .eq('todo_id', todoId)
         .eq('user_id', req.user?.id)
         .select();

      if (error) throw error;

      if (data.length === 0) {
         return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json(data[0]);
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

// Delete a task
const deleteTask = async (req, res) => {
   try {
      const { todoId } = req.params;
      const { taskId } = req.body;

      const { data, error } = await supabase
         .from('tasks')
         .delete()
         .eq('id', taskId)
         .eq('todo_id', todoId)
         .eq('user_id', req.user?.id)
         .select();

      if (error) throw error;

      if (data.length === 0) {
         return res.status(404).json({ message: "Task not found" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
   } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error', error: error.message });
   }
};

module.exports = {
   getTasks,
   createTask,
   editTask,
   deleteTask
};