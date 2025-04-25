import { useNavigate } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { todoApi } from "../../services/api";
import { useState } from "react";

export default function TodoList({ todos, loading, onEdit, onDelete, refreshTodos }) {
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  // Delete Todo
  const deleteTodoHandler = async (todoId) => {
    try {
      setDeleteLoading(true);
      setError('');
      await todoApi.deleteTodo(todoId);

      // Refresh the todos list after delete
      if (onDelete) {
        onDelete();
      } else {
        refreshTodos();
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 mb-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <p className="text-white">Loading todos...</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 mb-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <div className="flex flex-col justify-center space-y-3">
            <h1 className="text-2xl text-white font-bold">Todo List:</h1>

            {error && <p className="text-red-500">{error}</p>}

            {todos && todos.length > 0 ? (
              todos.map((todo) => (
                <div key={todo.id} className="flex items-center space-x-2">
                  <h1
                    onClick={() => navigate(`/${todo.id}`)}
                    className="w-[230px] sm:w-[400px] text-white rounded-[4px] cursor-pointer hover:underline"
                  >
                    {todo.title}
                  </h1>
                  <button
                    onClick={() => onEdit(todo)}
                    className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out hover:bg-[#d86e91]"
                    disabled={deleteLoading}
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteTodoHandler(todo.id)}
                    className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out hover:bg-[#d86e91] disabled:opacity-50"
                    disabled={deleteLoading}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-white">No todos found. Create one above!</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
