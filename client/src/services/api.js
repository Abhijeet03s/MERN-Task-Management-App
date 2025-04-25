import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-Type': 'application/json'
   }
});

// Add authentication interceptor
api.interceptors.request.use(
   (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error)
);

// Todo API calls
export const todoApi = {
   getAllTodos: () => api.get('/get_todos'),
   getTodo: (todoId) => api.get(`/get_todo/${todoId}`),
   createTodo: (todoData) => api.post('/create_todo', todoData),
   updateTodo: (todoId, todoData) => api.put(`/edit_todo/${todoId}`, todoData),
   deleteTodo: (todoId) => api.delete(`/delete_todo/${todoId}`)
};

// Task API calls
export const taskApi = {
   getTasks: (todoId) => api.get(`/get_tasks/${todoId}`),
   createTask: (todoId, taskData) => api.post(`/create_task/${todoId}`, taskData),
   updateTask: (todoId, taskData) => api.put(`/edit_task/${todoId}`, taskData),
   deleteTask: (todoId, taskId) => api.delete(`/delete_task/${todoId}`, { data: { taskId } })
};

// Search API calls
export const searchApi = {
   search: (query) => api.post('/search', { query })
};

export default api;
