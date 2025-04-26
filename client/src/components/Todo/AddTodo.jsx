import React, { useState, useEffect, useRef, useCallback } from "react";
import TodoList from "./TodoList";
import { todoApi, searchApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { PlusCircle, Search, X } from "lucide-react";

export default function AddTodo() {
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [todo, setTodo] = useState("");
  const [editTodo, setEditTodo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const { user } = useAuth();
  const searchInputRef = useRef(null);

  // Cache control
  const todosCache = useRef({
    data: null,
    timestamp: 0,
    loading: false
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

  // Getting todos with caching
  const getTodos = useCallback(async (forceRefresh = false) => {
    if (todosCache.current.loading) return;

    const now = Date.now();
    if (
      !forceRefresh &&
      todosCache.current.data &&
      now - todosCache.current.timestamp < CACHE_LIFETIME
    ) {
      setTodos(todosCache.current.data);
      setFilteredTodos(todosCache.current.data);
      return;
    }

    try {
      setLoading(true);
      todosCache.current.loading = true;
      setError('');

      const response = await todoApi.getAllTodos();

      // Update cache
      todosCache.current.data = response.data;
      todosCache.current.timestamp = now;

      setTodos(response.data);
      setFilteredTodos(response.data);
    } catch (error) {
      toast.error('Failed to load todos');
    } finally {
      setLoading(false);
      todosCache.current.loading = false;
    }
  }, []);

  useEffect(() => {
    if (user) {
      getTodos();
    }
  }, [user, getTodos]);

  // Filter todos when search query changes
  useEffect(() => {
    if (!searchResults && searchQuery.trim() === "") {
      setFilteredTodos(todos);
    } else if (!searchResults && searchQuery.trim().length > 0) {
      const lowercaseQuery = searchQuery.toLowerCase();
      const filtered = todos.filter(todo =>
        todo.title.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredTodos(filtered);
    } else if (searchResults) {
      setFilteredTodos(searchResults.todos || []);
    }
  }, [searchQuery, todos, searchResults]);

  // Creating todo
  const createTodo = async (e) => {
    e.preventDefault();
    if (todo.trim().length === 0) {
      toast.error('Todo cannot be empty');
      return;
    }

    setLoading(true);
    setError('');

    const toastId = toast.loading(editTodo ? 'Updating todo...' : 'Creating todo...');

    try {
      if (!editTodo) {
        // Create new todo
        const response = await todoApi.createTodo({
          title: todo,
          description: ''
        });

        // Update local state with the new todo
        const newTodo = response.data;
        if (newTodo) {
          // Add new todo to the state and cache
          setTodos(prevTodos => [newTodo, ...prevTodos]);
          setFilteredTodos(prevTodos => [newTodo, ...prevTodos]);

          // Update cache
          todosCache.current.data = [newTodo, ...(todosCache.current.data || [])];
          todosCache.current.timestamp = Date.now();
        }

        toast.success('Todo created successfully', { id: toastId });
      } else {
        // Update existing todo
        const response = await todoApi.updateTodo(editTodo.id, { title: todo });
        const updatedTodo = response.data.todo;

        // Update local state with the updated todo
        if (updatedTodo) {
          const updateTodos = (prevTodos) =>
            prevTodos.map(t => t.id === updatedTodo.id ? updatedTodo : t);

          setTodos(updateTodos);
          setFilteredTodos(updateTodos);

          // Update cache
          if (todosCache.current.data) {
            todosCache.current.data = todosCache.current.data.map(t =>
              t.id === updatedTodo.id ? updatedTodo : t
            );
            todosCache.current.timestamp = Date.now();
          }
        }

        toast.info('Todo updated successfully', { id: toastId });
        setEditTodo(null);
      }

      setTodo("");

      // Still refresh todos in the background to ensure everything is in sync
      getTodos(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      setSearchResults(null);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await searchApi.search(searchQuery);

      const filteredResults = {
        ...response.data,
        tasks: [],
        total: response.data.todos?.length || 0,
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

  // Set up edit mode
  const handleEditMode = (todoItem) => {
    setEditTodo(todoItem);
    setTodo(todoItem.title);
  };

  const refreshTodos = () => {
    getTodos(true);
  };

  return (
    <div className="container mx-auto px-4 max-w-3xl py-6 md:py-10">
      <Card hover className="mb-6 overflow-hidden">
        <CardHeader className="pb-0 pt-4 md:pt-6">
          <CardTitle className={`${editTodo ? 'text-primary-400' : 'gradient-text'}`}>
            {editTodo ? 'Edit Todo' : 'Create New Todo'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6">
          {error && (
            <div className="mb-4 p-3 bg-accent-red/10 border-l-4 border-accent-red rounded-r-lg text-light-100 animate-pulse-slow">
              {error}
            </div>
          )}

          <form onSubmit={createTodo} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <Input
                name="title"
                id="title"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                placeholder="What needs to be done?"
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
                    <span>{editTodo ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <PlusCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{editTodo ? 'Update' : 'Add'}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row items-center justify-between mb-3 gap-3">
        <h2 className="text-base sm:text-xl font-semibold gradient-text truncate w-full sm:w-auto text-center sm:text-left">
          {searchResults ? `Search: "${searchResults.query}"` : 'Your Todos'}
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

      <TodoList
        todos={filteredTodos}
        loading={loading}
        onEdit={handleEditMode}
        refreshTodos={refreshTodos}
        searchQuery={searchQuery}
        searchResults={searchResults}
      />
    </div>
  );
}
