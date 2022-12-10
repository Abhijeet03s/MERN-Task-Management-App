import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import TodoList from "./TodoList";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AddTodo() {
  const [todo, setTodo] = useState("");

  // Create Todo
  const createTodo = async () => {
    if (todo.length === 0) {
      alert("todo cannot be empty");
    }
    const data = { title: todo };
    console.log(data);
    try {
      await axios.post(`${API_BASE}/create_todo`, data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Submit Todo
  const handleSubmitForm = (e) => {
    e.preventDefault();
    createTodo();
    setTodo("");
  };

  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <form
            onSubmit={handleSubmitForm}
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
      <TodoList />
    </>
  );
}
