const supabase = require('../config/supabaseConfig');

/**
 * Creates a new task
 * @param {Object} taskData - The task data
 * @param {string} userId - The user ID
 * @returns {Promise} - The Supabase query result
 */
exports.createTask = async (taskData, todoId, userId) => {
   return await supabase
      .from('tasks')
      .insert([{ ...taskData, todo_id: todoId, user_id: userId }])
      .select();
};

/**
 * Retrieves tasks for a todo
 * @param {string} todoId - The todo ID
 * @param {string} userId - The user ID
 * @returns {Promise} - The Supabase query result
 */
exports.getTasks = async (todoId, userId) => {
   return await supabase
      .from('tasks')
      .select('*')
      .eq('todo_id', todoId)
      .eq('user_id', userId);
};

/**
 * Gets a specific task
 * @param {string} taskId - The task ID
 * @param {string} todoId - The todo ID
 * @param {string} userId - The user ID
 * @returns {Promise} - The Supabase query result
 */
exports.getTask = async (taskId, todoId, userId) => {
   return await supabase
      .from('tasks')
      .select('*')
      .eq('id', taskId)
      .eq('todo_id', todoId)
      .eq('user_id', userId);
};

/**
 * Updates a task
 * @param {string} taskId - The task ID
 * @param {Object} taskData - The updated task data
 * @param {string} todoId - The todo ID
 * @param {string} userId - The user ID
 * @returns {Promise} - The Supabase query result
 */
exports.updateTask = async (taskId, taskData, todoId, userId) => {
   return await supabase
      .from('tasks')
      .update(taskData)
      .eq('id', taskId)
      .eq('todo_id', todoId)
      .eq('user_id', userId)
      .select();
};

/**
 * Deletes a task
 * @param {string} taskId - The task ID
 * @param {string} todoId - The todo ID
 * @param {string} userId - The user ID
 * @returns {Promise} - The Supabase query result
 */
exports.deleteTask = async (taskId, todoId, userId) => {
   return await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('todo_id', todoId)
      .eq('user_id', userId);
}; 