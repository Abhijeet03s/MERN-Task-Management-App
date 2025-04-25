const supabase = require('../config/supabaseConfig');

/**
 * Creates a new todo
 * @param {Object} todoData - The todo data
 * @param {string} userId - The user ID
 * @returns {Promise} - The Supabase query result
 */
exports.createTodo = async (todoData, userId) => {
  return await supabase
    .from('todos')
    .insert([{ ...todoData, user_id: userId }])
    .select();
};

/**
 * Retrieves todos for a user
 * @param {string} userId - The user ID
 * @returns {Promise} - The Supabase query result
 */
exports.getTodos = async (userId) => {
  return await supabase
    .from('todos')
    .select('*')
    .eq('user_id', userId);
};

// Export other necessary functions for working with todos
module.exports.getTodo = async (todoId, userId) => {
  return await supabase
    .from('todos')
    .select('*')
    .eq('id', todoId)
    .eq('user_id', userId);
};

module.exports.updateTodo = async (todoId, todoData, userId) => {
  return await supabase
    .from('todos')
    .update(todoData)
    .eq('id', todoId)
    .eq('user_id', userId)
    .select();
};

module.exports.deleteTodo = async (todoId, userId) => {
  return await supabase
    .from('todos')
    .delete()
    .eq('id', todoId)
    .eq('user_id', userId);
};
