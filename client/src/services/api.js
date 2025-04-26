import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

const api = axios.create({
   baseURL: API_URL,
   headers: {
      'Content-Type': 'application/json'
   }
});

// This interceptor automatically adds the authentication token to all API requests

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

export const todoApi = {
   getAllTodos: () => api.get('/api/get_todos'),
   getTodo: (todoId) => api.get(`/api/get_todo/${todoId}`),
   createTodo: (todoData) => api.post('/api/create_todo', todoData),
   updateTodo: (todoId, todoData) => api.put(`/api/edit_todo/${todoId}`, todoData),
   deleteTodo: (todoId) => api.delete(`/api/delete_todo/${todoId}`)
};

export const taskApi = {
   getTasks: (todoId) => api.get(`/api/get_tasks/${todoId}`),
   createTask: (todoId, taskData) => api.post(`/api/create_task/${todoId}`, taskData),
   updateTask: (todoId, taskData) => api.put(`/api/edit_task/${todoId}`, taskData),
   deleteTask: (todoId, taskId) => api.delete(`/api/delete_task/${todoId}`, { data: { taskId } })
};

export const searchApi = {
   search: (query) => api.post('/api/search', { query })
};

export default api;
