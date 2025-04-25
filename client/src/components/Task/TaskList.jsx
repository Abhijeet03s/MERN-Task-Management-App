import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { taskApi, todoApi, searchApi } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { PlusCircle, Pencil, Trash2, ListChecks, ArrowLeft, CheckCircle, Search, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function TaskList() {
  const { todoId } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [todoTitle, setTodoTitle] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const searchInputRef = useRef(null);

  // Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }

      if (e.key === 'Escape' && searchQuery) {
        clearSearch();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [searchQuery]);

  // Get todo details
  const getTodoDetails = async () => {
    if (!todoId || !user) return;

    try {
      const response = await todoApi.getTodo(todoId);
      setTodoTitle(response.data.title);
    } catch (error) {
      toast.error("Failed to load todo details");
    }
  };

  // Get all tasks for a todo
  const getTasks = async () => {
    if (!todoId || !user) return;

    try {
      setLoading(true);
      setError("");
      const response = await taskApi.getTasks(todoId);
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getTasks();
      getTodoDetails();
    }
  }, [todoId, user]);

  // Filter tasks when search query changes
  useEffect(() => {
    if (!searchResults && searchQuery.trim() === "") {
      setFilteredTasks(tasks);
    } else if (!searchResults && searchQuery.trim().length > 0) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = tasks.filter(task =>
        task.title.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredTasks(filtered);
    } else if (searchResults) {
      // Show tasks from search results that belong to this todo
      const tasksFromSearch = searchResults.tasks?.filter(task =>
        task.todo_id === todoId
      ) || [];
      setFilteredTasks(tasksFromSearch);
    }
  }, [searchQuery, tasks, searchResults, todoId]);

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await searchApi.search(searchQuery);

      const filteredTasks = response.data.tasks?.filter(task => task.todo_id === todoId) || [];

      const filteredResults = {
        ...response.data,
        todos: [],
        tasks: filteredTasks,
        total: filteredTasks.length,
        query: response.data.query
      };

      setSearchResults(filteredResults);
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setSearchLoading(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults(null);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  // Creating task
  const createTask = async (e) => {
    e.preventDefault();

    if (task.trim().length === 0) {
      toast.error("Task cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const toastId = toast.loading(editTaskId ? "Updating task..." : "Creating task...");

      if (editTaskId) {
        // Update existing task
        await taskApi.updateTask(todoId, {
          taskId: editTaskId,
          title: task,
        });
        toast.success("Task updated successfully", { id: toastId });
        setEditTaskId(null);
      } else {
        // Create new task
        await taskApi.createTask(todoId, {
          title: task,
          description: "",
          status: "pending"
        });
        toast.success("Task created successfully", { id: toastId });
      }

      getTasks();
      setTask("");
      // Clear search if active
      if (searchQuery) {
        clearSearch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
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
      setDeletingId(taskId);
      setLoading(true);
      setError("");

      const toastId = toast.loading("Deleting task...");

      await taskApi.deleteTask(todoId, taskId);
      toast.success("Task deleted successfully", { id: toastId });

      getTasks();
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setLoading(false);
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl py-10">
      <Link to="/" className="inline-flex items-center text-primary-400 hover:text-primary-500 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to todos
      </Link>

      <Card hover className="mb-6 overflow-hidden">
        <CardHeader className="pb-0 pt-6">
          <div className="flex items-center justify-between">
            <CardTitle className={`${editTaskId ? 'text-primary-400' : 'gradient-text'}`}>
              {todoTitle ? `Tasks for: ${todoTitle}` : 'Add Tasks'}
            </CardTitle>
            <span className="text-sm font-medium px-2.5 py-1 rounded-full bg-primary-500/10 text-primary-400">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-3 bg-accent-red/10 border-l-4 border-accent-red rounded-r-lg text-light-100 animate-pulse-slow">
              {error}
            </div>
          )}

          <form onSubmit={createTask} className="space-y-4">
            <div className="flex gap-2 items-center">
              <Input
                name="task"
                id="task"
                type="text"
                placeholder={editTaskId ? "Update your task..." : "Enter your task..."}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                disabled={loading}
                className="flex-1 h-12 text-base"
              />
              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="rounded-lg"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                {editTaskId ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Search className="h-4 w-4" />
        </div>
        <Input
          ref={searchInputRef}
          placeholder="Search tasks... (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 h-12 bg-dark-400/50 rounded-lg border-dark-100/40 focus:border-primary-500"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {searchLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
          )}
          {searchQuery ? (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-500 hover:text-light-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="hidden sm:flex items-center justify-center h-5 w-7 text-[10px] font-medium text-gray-500 bg-dark-100/50 border border-dark-100/30 rounded transition-colors hover:bg-dark-100/70 hover:text-gray-400">
              {navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
            </kbd>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-light-100">
            <span className="font-medium">
              {searchResults ? 'Search Results' : 'Filtered Tasks'}
            </span>
            {searchResults && (
              <span className="ml-2 text-sm text-light-500">
                for "{searchResults.query}"
              </span>
            )}
          </div>
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="text-light-500 hover:text-light-100"
            >
              Clear
            </Button>
          )}
        </div>
      )}

      <Card hover>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary-400" />
            <h2 className="text-xl font-semibold text-light-100">
              {searchQuery ? 'Task Results' : 'Task List'}
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {!loading && filteredTasks && filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative flex items-center gap-3 p-4 rounded-lg bg-dark-350 hover:bg-dark-400 border border-dark-100/10 hover:border-primary-500/20 transition-all duration-200"
                >
                  <div className="flex-1">
                    <span className="font-medium text-light-100">{task.title}</span>
                    {task.description && searchResults && (
                      <p className="text-sm text-light-500 mt-1 line-clamp-1">{task.description}</p>
                    )}
                    {searchResults && task.status && (
                      <div className="mt-1">
                        <span className={`text-xs px-1.5 py-0.5 rounded inline-block ${task.status === 'completed'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-amber-500/10 text-amber-400'
                          }`}>
                          {task.status}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditTask(task)}
                      disabled={loading}
                      className="h-8 w-8 text-primary-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTaskHandler(task.id)}
                      disabled={loading}
                      className="h-8 w-8 text-accent-red"
                    >
                      {deletingId === task.id ? (
                        <span className="h-4 w-4 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              !loading && (
                <div className="flex flex-col items-center justify-center py-12 text-light-500/60">
                  <ListChecks className="h-12 w-12 mb-3 opacity-20" />
                  {searchQuery ? (
                    <>
                      <p className="text-center text-lg">No tasks match your search</p>
                      <p className="text-center text-sm">Try a different search term</p>
                    </>
                  ) : (
                    <>
                      <p className="text-center text-lg">No tasks found</p>
                      <p className="text-center text-sm">Add a task above to get started</p>
                    </>
                  )}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}