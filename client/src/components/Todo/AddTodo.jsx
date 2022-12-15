import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./TodoList";
import { FiPlus } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [editTodo, setEditTodo] = useState("");

  // getting todos

   const getTodos = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_todos`);
      // console.log(res);
      setTodos(res.data.todo);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getTodos();
  }, []);

  // creating todo

  const createTodo = async (e) => {
    e.preventDefault();
    if (todo.length === 0) {
      alert("todo cannot be empty");
    }
    if (!editTodo) {
      try {
        await axios.post(`${API_BASE}/create_todo`, {
          ...todos,
          title: todo,
        });
        getTodos();
        setTodo("");
      } catch (error) {
        console.log(error.message);
      }
    } else {
      updateTodo(editTodo.todoId, todo);
    }
  };

  const updateTodo = (todoId, title) => {
    const newTodoTitle = todos.map((todo) =>
      todo.id === todoId ? { todoId, title } : todo
    );
    setTodos(newTodoTitle);
    setEditTask("");
  };

  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <form
            onSubmit={createTodo}
            className="flex flex-col justify-center space-y-3"
          >
            <label
              className="text-[20px] sm:text-[2rem] text-white font-bold"
              htmlFor="title"
            >
              Todo:
            </label>
            <div className="space-x-2">
              <input
                className="w-[230px] sm:w-[600px] mt-3 p-2 rounded-[4px]"
                name="title"
                id="title"
                type="text"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
              />
              <button className="p-3 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out">
                <FiPlus />
              </button>
            </div>
          </form>
        </div>
      </section>
      <TodoList todos={todos} setTodos={setTodos} getTodos={getTodos} />
    </>
  );
}
