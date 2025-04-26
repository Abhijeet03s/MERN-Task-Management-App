import React, { useState, useEffect, useRef, useCallback } from "react";
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
  const [localTasks, setLocalTasks] = useState([]);
  const [task, setTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState("");
  const [todoTitle, setTodoTitle] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const searchInputRef = useRef(null);

  // Cache control
  const tasksCache = useRef({
    data: null,
    timestamp: 0,
    loading: false,
    todoId: null
  });

  const todoCache = useRef({
    data: null,
    timestamp: 0,
    loading: false,
    todoId: null
  });

  const CACHE_LIFETIME = 30000;

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

  // Get todo details with caching
  const getTodoDetails = useCallback(async (forceRefresh = false) => {
    if (!todoId || !user) return;
    if (todoCache.current.loading) return;

    const now = Date.now();
    if (
      !forceRefresh &&
      todoCache.current.data &&
      todoCache.current.todoId === todoId &&
      now - todoCache.current.timestamp < CACHE_LIFETIME
    ) {
      setTodoTitle(todoCache.current.data.title);
      return;
    }

    try {
      todoCache.current.loading = true;

      const response = await todoApi.getTodo(todoId);

      // Update cache
      todoCache.current.data = response.data;
      todoCache.current.timestamp = now;
      todoCache.current.todoId = todoId;

      setTodoTitle(response.data.title);
    } catch (error) {
      toast.error("Failed to load todo details");
    } finally {
      todoCache.current.loading = false;
    }
  }, [todoId, user]);

  // Get all tasks for a todo with caching
  const getTasks = useCallback(async (forceRefresh = false) => {
    if (!todoId || !user) return;
    if (tasksCache.current.loading) return;

    const now = Date.now();
    if (
      !forceRefresh &&
      tasksCache.current.data &&
      tasksCache.current.todoId === todoId &&
      now - tasksCache.current.timestamp < CACHE_LIFETIME
    ) {
      setTasks(tasksCache.current.data);
      setFilteredTasks(tasksCache.current.data);
      return;
    }

    try {
      setLoading(true);
      tasksCache.current.loading = true;
      setError("");

      const response = await taskApi.getTasks(todoId);

      // Update cache
      tasksCache.current.data = response.data;
      tasksCache.current.timestamp = now;
      tasksCache.current.todoId = todoId;

      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
      tasksCache.current.loading = false;
    }
  }, [todoId, user]);

  useEffect(() => {
    if (user) {
      getTodoDetails();
      getTasks();
    }
  }, [todoId, user, getTodoDetails, getTasks]);

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

      // Force refresh cache after creating/updating task
      getTasks(true);
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
      setDeleteLoading(true);
      setError("");

      const toastId = toast.loading("Deleting task...");

      await taskApi.deleteTask(todoId, taskId);

      // Immediately update local state to remove the deleted task
      setLocalTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));

      // If we're filtering or searching, also update the filtered list
      if (searchQuery || searchResults) {
        setFilteredTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      }

      toast.success("Task deleted successfully", { id: toastId });

      // Still trigger cache refresh in the background
      getTasks(true);
    } catch (error) {
      toast.error("Failed to delete task");
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  // Force refresh function for child components
  const refreshTasks = () => {
    getTasks(true);
  };

  // Handle task completion toggle
  const handleCompleteTask = async (task) => {
    try {
      setLoading(true);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';

      const response = await taskApi.updateTask(todoId, {
        taskId: task.id,
        status: newStatus
      });

      // Update local state with the updated task
      const updatedTask = response.data.task;

      if (updatedTask) {
        const updateTasks = (prevTasks) =>
          prevTasks.map(t => t.id === updatedTask.id ? updatedTask : t);

        setTasks(updateTasks);
        setFilteredTasks(updateTasks);
        setLocalTasks(updateTasks);
      }

      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update task status");
    } finally {
      setLoading(false);
    }
  };

  // Keep localTasks in sync with tasks
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);


  return (
    <div className="container mx-auto px-4 max-w-3xl py-6 md:py-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-light-500 hover:text-primary-400 transition-colors">
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6 overflow-hidden">
        <CardHeader className="pb-0 pt-4 md:pt-6">
          <CardTitle className="text-lg md:text-xl">Create New Task</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6">
          {error && (
            <div className="mb-4 p-3 bg-accent-red/10 border-l-4 border-accent-red rounded-r-lg text-light-100 animate-pulse-slow">
              {error}
            </div>
          )}

          <form onSubmit={createTask} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Input
                name="title"
                id="title"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Add a new task"
                className="flex-1 text-sm sm:text-base h-9 sm:h-10"
                autoComplete="off"
                disabled={loading}
              />
              <Button
                type="submit"
                className="whitespace-nowrap text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4 w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-1.5">
                    <span className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-light-100 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm sm:text-base">{editTaskId ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-sm sm:text-base">{editTaskId ? 'Update' : 'Add'}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-3 gap-3">
        <h2 className="text-base sm:text-xl font-semibold gradient-text truncate w-full sm:w-auto text-center sm:text-left">
          {searchResults ? `Search: "${searchResults.query}"` : `${todoTitle.charAt(0).toUpperCase() + todoTitle.slice(1)} Tasks`}
        </h2>

        <div className="relative w-full sm:max-w-[240px]">
          <div className="flex items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <Search className="h-3 w-3 sm:h-4 sm:w-4 text-light-500/50" />
              </div>
              <Input
                placeholder="Search... (Ctrl+K)"
                className="pl-7 sm:pl-9 pr-6 sm:pr-8 text-xs sm:text-sm h-8 sm:h-9 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                ref={searchInputRef}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-2.5"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4 text-light-500/70 hover:text-light-100" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Card hover className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary-400" />
            <CardTitle className="text-lg md:text-xl">
              {searchQuery ? 'Search Results' : 'Task List'}
            </CardTitle>
          </div>
          {!loading && filteredTasks.length > 0 && (
            <span className="text-sm font-medium px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-400">
              {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-lg bg-dark-350 animate-pulse"
                >
                  <div className="h-5 w-5 rounded-full bg-dark-300"></div>
                  <div className="flex-1 h-4 bg-dark-300 rounded"></div>
                  <div className="h-8 w-16 bg-dark-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredTasks.length > 0 ? (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`group relative flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg border transition-all duration-200 ${task.status === 'completed'
                    ? 'bg-green-500/5 border-green-500/10'
                    : 'bg-dark-350 hover:bg-dark-400 border-dark-100/10 hover:border-primary-500/20'
                    }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleCompleteTask(task)}
                      className={`flex-shrink-0 h-4 w-4 sm:h-5 sm:w-5 rounded-full transition-colors duration-200 flex items-center justify-center ${task.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-dark-100 hover:bg-primary-500/20'
                        }`}
                    >
                      {task.status === 'completed' && <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </button>
                    <span className={`flex-1 truncate text-sm sm:text-base ${task.status === 'completed' ? 'line-through text-light-500' : 'text-light-100'
                      }`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="flex gap-1 flex-shrink-0">
                    {task.status !== 'completed' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTask(task)}
                        disabled={deleteLoading}
                        className="h-7 w-7 sm:h-8 sm:w-8 text-primary-400"
                      >
                        <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTaskHandler(task.id)}
                      disabled={deleteLoading}
                      className="h-7 w-7 sm:h-8 sm:w-8 text-accent-red"
                    >
                      {deletingId === task.id ? (
                        <span className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </div>

                  {task.status !== 'completed' && (
                    <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-light-500/60">
              <ListChecks className="h-12 w-12 mb-3 opacity-20" />
              {searchQuery ? (
                <>
                  <p className="text-center text-lg">No tasks match your search</p>
                  <p className="text-center text-sm mt-1">Try a different search term</p>
                </>
              ) : (
                <>
                  <p className="text-center text-lg">No tasks yet</p>
                  <p className="text-center text-sm mt-1">Create one to get started</p>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}