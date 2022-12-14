import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import TodoList from "./TodoList";
import { FiPlus } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [todo, setTodo] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_todos`);
      setTodos(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const createTodo = async (e) => {
    e.preventDefault();
    if (todo.length === 0) {
      alert("todo cannot be empty");
    }
    await axios.post(`${API_BASE}/create_todo`, {
      ...todos,
      title: todo,
    });
    fetchData();
    setTodo("");
  };
  console.log(todos, "todos");

  // Submit Todo
  // const handleSubmitForm = (e) => {
  //   e.preventDefault();

  //   // Create Todo
  //   const createTodo = async () => {
  //     if (todo.length === 0) {
  //       alert("todo cannot be empty");
  //     }
  //     const data = { title: todo };
  //     try {
  //       await axios.post(`${API_BASE}/create_todo`, data);
  //       setTodos(data);
  //     } catch (err) {
  //       console.log(err.message);
  //     }
  //   };
  //   createTodo();
  //   getTodos();
  //   setTodo("");
  // };

  // get Todos
  // const getTodos = async () => {
  //   try {
  //     const res = await axios.get(`${API_BASE}/get_todos`);
  //     const data = res.data.todo;
  //     setTodos(data);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  // };

  // useEffect(() => {
  //   getTodos();
  // }, []);

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
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 mb-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <div className="flex flex-col justify-center space-y-3">
            <h1 className="text-2xl text-white font-bold">Todo List:</h1>
            {todos?.map((todo) => (
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
