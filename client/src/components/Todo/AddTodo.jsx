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
        await todoApi.createTodo({
          title: todo,
          description: ''
        });
        toast.success('Todo created successfully', { id: toastId });
        getTodos(true);
      } else {
        await todoApi.updateTodo(editTodo.id, { title: todo });
        toast.info('Todo updated successfully', { id: toastId });
        getTodos(true);
        setEditTodo(null);
      }
      setTodo("");
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
    <div className="container mx-auto px-4 max-w-3xl py-10">
      <Card hover className="mb-6 overflow-hidden">
        <CardHeader className="pb-0 pt-6">
          <CardTitle className={`${editTodo ? 'text-primary-400' : 'gradient-text'}`}>
            {editTodo ? 'Edit Todo' : 'Create New Todo'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {error && (
            <div className="mb-4 p-3 bg-accent-red/10 border-l-4 border-accent-red rounded-r-lg text-light-100 animate-pulse-slow">
              {error}
            </div>
          )}

          <form onSubmit={createTodo} className="space-y-4">
            <div className="flex gap-2 items-center">
              <Input
                name="title"
                id="title"
                type="text"
                placeholder={editTodo ? "Update your todo..." : "Enter your todo..."}
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
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
                {editTodo ? 'Update' : 'Add'}
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
          placeholder="Search todos... (Ctrl+K)"
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
      {searchResults && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-light-100">
            <span className="font-medium">Search Results</span>
            <span className="ml-2 text-sm text-light-500">
              {searchResults.total} results for "{searchResults.query}"
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="text-light-500 hover:text-light-100"
          >
            Clear
          </Button>
        </div>
      )}

      <TodoList
        todos={filteredTodos}
        loading={loading || searchLoading}
        onEdit={handleEditMode}
        onDelete={getTodos}
        refreshTodos={refreshTodos}
        searchQuery={searchQuery}
        searchResults={searchResults}
      />
    </div>
  );
}
