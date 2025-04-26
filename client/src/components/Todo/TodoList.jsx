import { useNavigate } from "react-router-dom";
import { Trash2, Pencil, ChevronRight, ListChecks, Search } from "lucide-react";
import { todoApi } from "../../services/api";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function TodoList({ todos, loading, onEdit, onDelete, refreshTodos, searchQuery, searchResults }) {
  const navigate = useNavigate();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');

  // Delete todo
  const deleteTodoHandler = async (todoId) => {
    try {
      setDeletingId(todoId);
      setDeleteLoading(true);

      const toastId = toast.loading('Deleting todo...');

      await todoApi.deleteTodo(todoId);
      toast.success('Todo deleted successfully', { id: toastId });

      if (onDelete) {
        onDelete();
      } else if (refreshTodos) {
        refreshTodos();
      }
    } catch (err) {
      toast.error('Failed to delete todo');
    } finally {
      setDeleteLoading(false);
      setDeletingId(null);
    }
  };

  const hasTaskResults = searchResults && searchResults.tasks && searchResults.tasks.length > 0;

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="h-7 bg-dark-300 rounded w-32"></div>
          <div className="h-5 bg-dark-300 rounded w-16"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-14 bg-dark-300 rounded"></div>
          <div className="h-14 bg-dark-300 rounded"></div>
          <div className="h-14 bg-dark-300 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Todos Section */}
      <Card hover>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <ListChecks className="w-5 h-5 text-primary-400" />
            <CardTitle>
              {searchQuery && !searchResults ? 'Filtered Todos' : (searchResults ? 'Todo Results' : 'Todo List')}
            </CardTitle>
          </div>
          {todos?.length > 0 && (
            <span className="text-sm font-medium px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-400">
              {todos.length} todo{todos.length !== 1 ? 's' : ''}
            </span>
          )}
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-accent-red/10 border-l-4 border-accent-red rounded-r-lg text-light-100">
              {error}
            </div>
          )}

          <div className="space-y-3">
            {todos && todos.length > 0 ? (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="group relative flex items-center gap-3 p-4 rounded-lg bg-dark-350 hover:bg-dark-400 border border-dark-100/10 hover:border-primary-500/20 transition-all duration-200"
                >
                  <div
                    onClick={() => navigate(`/${todo.id}`)}
                    className="flex-1 cursor-pointer group-hover:text-primary-400 transition-colors flex items-center"
                  >
                    <span className="font-medium">{todo.title}</span>
                    <ChevronRight className="ml-1.5 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(todo)}
                      disabled={deleteLoading}
                      className="h-8 w-8 text-primary-400"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodoHandler(todo.id)}
                      disabled={deleteLoading}
                      className="h-8 w-8 text-accent-red"
                    >
                      {deletingId === todo.id ? (
                        <span className="h-4 w-4 border-2 border-accent-red border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-light-500/60">
                <ListChecks className="h-12 w-12 mb-3 opacity-20" />
                {searchQuery ? (
                  <>
                    <p className="text-center text-lg">No todos match your search</p>
                    <p className="text-center text-sm">Try a different search term</p>
                  </>
                ) : (
                  <>
                    <p className="text-center text-lg">No todos found</p>
                    <p className="text-center text-sm">Create one above to get started</p>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section*/}
      {hasTaskResults && (
        <Card hover>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-primary-400" />
              <CardTitle>Task Results</CardTitle>
            </div>
            <span className="text-sm font-medium px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-400">
              {searchResults.tasks.length} task{searchResults.tasks.length !== 1 ? 's' : ''}
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {searchResults.tasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative flex items-center gap-3 p-4 rounded-lg bg-dark-350 hover:bg-dark-400 border border-dark-100/10 hover:border-primary-500/20 transition-all duration-200"
                >
                  <div
                    onClick={() => navigate(`/${task.todo_id}`)}
                    className="flex-1 cursor-pointer group-hover:text-primary-400 transition-colors"
                  >
                    <div className="flex items-center">
                      <span className="font-medium">{task.title}</span>
                      <ChevronRight className="ml-1.5 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-1.5 py-0.5 bg-primary-500/10 rounded text-primary-400">
                        {task.todo_title || "Unknown Todo"}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded ${task.status === 'completed'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-amber-500/10 text-amber-400'
                        }`}>
                        {task.status || 'pending'}
                      </span>
                    </div>
                  </div>
                  <span className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
