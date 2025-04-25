import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { AiFillDelete } from "react-icons/ai";
import { FiEdit } from "react-icons/fi";
import { taskApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function TaskList() {
  const { todoId } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get all tasks for a todo
  const getTasks = async () => {
    if (!todoId || !user) return;

    try {
      setLoading(true);
      setError("");
      const response = await taskApi.getTasks(todoId);
      console.log('Tasks:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error getting tasks:", error);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getTasks();
    }
  }, [todoId, user]);

  // Creating task
  const createTask = async (e) => {
    e.preventDefault();

    if (task.trim().length === 0) {
      setError("Task cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editTaskId) {
        // Update existing task
        await taskApi.updateTask(todoId, {
          taskId: editTaskId,
          title: task,
        });
        setEditTaskId(null);
      } else {
        // Create new task
        await taskApi.createTask(todoId, {
          title: task,
          description: "",
          status: "pending"
        });
      }

      getTasks();
      setTask("");
    } catch (error) {
      console.error("Error with task:", error);
      setError(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Edit task
  const handleEditTask = (taskItem) => {
    setEditTaskId(taskItem.id);
    setTask(taskItem.title);
  };

  // Delete task
  const deleteTaskHandler = async (taskId) => {
    try {
      setLoading(true);
      setError("");
      await taskApi.deleteTask(todoId, taskId);
      getTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form
            onSubmit={createTask}
            className="flex flex-col justify-center space-y-3"
          >
            <label
              className="text-[20px] sm:text-[2rem] text-white font-bold"
              htmlFor="task"
            >
              {editTaskId ? "Edit Task:" : "Add Task:"}
            </label>
            <div className="space-x-2">
              <input
                className="w-[230px] sm:w-[600px] mt-3 p-2 rounded-[4px]"
                name="task"
                id="task"
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
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

      <section className="container mx-auto flex items-center justify-center mt-20">
        <div className="w-fit py-10 px-10 mb-10 sm:px-20 rounded-md border-[1px] border-[#acb6bf]">
          <div className="flex flex-col justify-center space-y-3">
            <h1 className="text-2xl text-white font-bold">Task List:</h1>

            {loading && <p className="text-white">Loading tasks...</p>}

            {!loading && tasks && tasks.length > 0 ? (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-2">
                  <h1 className="w-[230px] sm:w-[400px] text-white rounded-[4px]">
                    {task.title}
                  </h1>
                  <button
                    onClick={() => handleEditTask(task)}
                    className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out hover:bg-[#d86e91]"
                    disabled={loading}
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => deleteTaskHandler(task.id)}
                    className="p-2 rounded-[50%] bg-[#eb7ea1] duration-200 ease-in-out hover:bg-[#d86e91] disabled:opacity-50"
                    disabled={loading}
                  >
                    <AiFillDelete />
                  </button>
                </div>
              ))
            ) : (
              !loading && <p className="text-white">No tasks found. Add one above!</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

// let todoId = window.location.pathname.slice(1);
