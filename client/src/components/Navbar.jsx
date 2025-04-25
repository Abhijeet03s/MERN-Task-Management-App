import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { searchApi } from "../services/api";
import { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const { user, handleLogOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const searchRef = useRef(null);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchResults(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setSearchLoading(true);
      const response = await searchApi.search(searchQuery);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(null);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <header className="text-[#eeeeee] shadow-sm shadow-[#acb6bf]">
        <div className="container mx-auto flex justify-between items-center p-5 flex-col lg:flex-row">
          <Link
            to="/"
            className="flex title-font font-medium items-center mb-4 md:mb-0"
          >
            <h1 className="ml-3 text-2xl">Todo App</h1>
          </Link>
          <form onSubmit={handleSearch} className="max-w-full flex items-center relative">
            <svg
              className="absolute left-4 w-4 h-4"
              aria-hidden="true"
              viewBox="0 0 24 24"
            >
              <g>
                <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
              </g>
            </svg>
            <input
              placeholder="Search"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[35px] pl-10 pr-8 border-2 border-solid border-transparent rounded-[4px] outline-none bg-[#f3f3f4] text-[#0d0c22] transition duration-300 transition-ease"
            />
            {searchLoading && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
              </div>
            )}
          </form>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <h3>{user.email}</h3>
                <button
                  onClick={handleLogOut}
                  className="block text-white bg-[#eb7ea1] hover:bg-[#d86e91] rounded-sm py-1 px-3"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login">
                  <button className="block text-white bg-[#eb7ea1] hover:bg-[#d86e91] rounded-sm py-1 px-3">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="block text-white bg-[#eb7ea1] hover:bg-[#d86e91] rounded-sm py-1 px-3">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
        {searchResults && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg z-50 max-h-[60vh] overflow-y-auto">
            <div className="container mx-auto p-4">
              <h3 className="text-lg font-bold mb-2">Search Results:</h3>
              {searchResults.todos?.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium mb-1">Todos:</h4>
                  {searchResults.todos.map(todo => (
                    <Link
                      key={todo.id}
                      to="/"
                      onClick={() => setSearchResults(null)}
                      className="block p-2 hover:bg-gray-100"
                    >
                      {todo.title}
                    </Link>
                  ))}
                </div>
              )}
              {searchResults.tasks?.length > 0 && (
                <div>
                  <h4 className="font-medium mb-1">Tasks:</h4>
                  {searchResults.tasks.map(task => (
                    <Link
                      key={task.id}
                      to={`/${task.todo_id}`}
                      onClick={() => setSearchResults(null)}
                      className="block p-2 hover:bg-gray-100"
                    >
                      {task.title}
                    </Link>
                  ))}
                </div>
              )}
              {!searchResults.todos?.length && !searchResults.tasks?.length && (
                <p className="text-gray-500">No results found</p>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
