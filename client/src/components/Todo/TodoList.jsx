import axios from "axios";
import { useState, useEffect } from "react";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [editTodoTitle, setEditTodoTitle] = useState("");

  // get Todos
  const getTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_todos`);
      console.log(res.data);
      const data = res.data.todo;
      setTodos(data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // edit Todo
  const editTodoHandler = async (todoId) => {};

  // delete Todo
  const deleteTodoHandler = async (todoId) => {
    try {
      await axios.delete(`${API_BASE}/delete_todo/${todoId}`);
      setTodos(todos.filter((todo) => todo._id !== todoId));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 mb-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <div className="flex flex-col justify-center space-y-3">
            <h1 className="text-2xl text-white font-bold">Todo List:</h1>
            {todos &&
              todos.map((todo) => (
                <div key={todo._id} className="flex items-center space-x-2">
                  <h1 className="w-[230px] sm:w-[400px] text-white  rounded-[4px]">
                    {todo.title}
                  </h1>
                  <button
                    onClick={() => editTodoHandler(todo._id)}
                    className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteTodoHandler(todo._id)}
                    className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out"
                  >
                    <AiFillDelete />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
