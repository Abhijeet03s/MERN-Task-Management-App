import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export default function AddTodo() {
  const { todoId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState("");

  const getTasks = async (todoId) => {
    const res = await axios.get(`${API_BASE}/get_tasks/${todoId}`, {
      tasks,
    });
    console.log(res.data.tasks);
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // creating task
  const createTask = async (todoId, e) => {
    e.preventDefault();
    if (task.length === 0) {
      alert("todo cannot be empty");
    }
    if (!editTask) {
      try {
        await axios.post(`${API_BASE}/create_task/${todoId}`, {
          ...tasks,
          tasks: task,
        });
        setTasks(res.data.task);
        getTasks();
        setTask("");
      } catch (error) {
        console.log(error.message);
      }
    } else {
      updateTodo(editTask.todoId, task);
    }
  };

  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <form
            onSubmit={createTask}
            className="flex flex-col justify-center space-y-3"
          >
            <label
              className="text-[20px] sm:text-[2rem] text-white font-bold"
              htmlFor="tasks"
            >
              Add Task:
            </label>
            <div className="space-x-2">
              <input
                className="w-[230px] sm:w-[600px] mt-3 p-2 rounded-[4px]"
                name="tasks"
                id="tasks"
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
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
            <h1 className="text-2xl text-white font-bold">Task List:</h1>
            {tasks &&
              tasks.map((task) => (
                <div key={task._id} className="flex items-center space-x-2">
                  <h1 className="w-[230px] sm:w-[400px] text-white  rounded-[4px]">
                    {task.task}
                  </h1>
                  <button
                    // onClick={editTodoHandler}
                    className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out"
                  >
                    <FiEdit />
                  </button>
                  <button
                    // onClick={() => deleteTodoHandler(task._id)}
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
