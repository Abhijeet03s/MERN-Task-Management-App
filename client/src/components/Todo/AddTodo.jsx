import React, { useContext, useState, useEffect } from "react";
import TodoList from "./TodoList";
import { FiPlus } from "react-icons/fi";
import { todoApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  // Getting todos
  const getTodos = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await todoApi.getAllTodos();
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
      setError('Failed to load todos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getTodos();
    }
  }, [user]);

  // Creating todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (todo.trim().length === 0) {
      setError('Todo cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!editTodo) {
        // Create new todo
        const response = await todoApi.createTodo({
          title: todo,
          description: ''
        });
        console.log('Todo created:', response.data);
        getTodos();
      } else {
        // Update existing todo
        await todoApi.updateTodo(editTodo.id, { title: todo });
        getTodos();
        setEditTodo(null);
      }
      setTodo("");
    } catch (error) {
      console.error('Error with todo:', error);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Set up edit mode
  const handleEditMode = (todoItem) => {
    setEditTodo(todoItem);
    setTodo(todoItem.title);
  };

  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form
            onSubmit={createTodo}
            className="flex flex-col justify-center space-y-3"
          >
            <label
              className="text-[20px] sm:text-[2rem] text-white font-bold"
              htmlFor="title"
            >
              {editTodo ? 'Edit Todo:' : 'New Todo:'}
            </label>
            <div className="space-x-2">
              <input
                className="w-[230px] sm:w-[600px] mt-3 p-2 rounded-[4px]"
                name="title"
                id="title"
                type="text"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                disabled={loading}
              />
              <button
                className="p-3 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out disabled:opacity-50"
                disabled={loading}
              >
                <FiPlus />
              </button>
            </div>
          </form>
        </div>
      </section>

      <TodoList
        todos={todos}
        loading={loading}
        onEdit={handleEditMode}
        onDelete={getTodos}
        refreshTodos={getTodos}
      />
    </>
  );
}
