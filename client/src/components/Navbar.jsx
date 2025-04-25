import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Button } from "./ui/button";
import { LogOut, User, CheckSquare, Menu, X } from "lucide-react";
import { toast } from "sonner";

export default function Navbar() {
  const { user, handleLogOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUserDisplayName = () => {
    if (!user) return "";
    const fullName = user.user_metadata?.full_name;
    if (fullName) {
      return fullName;
    }

    // Fall back to email
    if (user.email) {
      return user.email.split('@')[0];
    }

    return "User";
  };

  const handleLogOutClick = () => {
    handleLogOut();
    toast.success('Logged out successfully');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="relative">
      <header className="border-b border-dark-100/40 bg-dark-300 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="container mx-auto px-4 flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-light-100"
          >
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text hidden sm:block">Task Manager</h1>
          </Link>

          <div className="flex-1 max-w-md mx-auto">
            {/* Empty div to maintain layout spacing */}
          </div>

          <div className="hidden sm:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 bg-dark-400/60 px-3 py-1.5 rounded-full border border-dark-100/20">
                  <div className="bg-primary-600/20 rounded-full p-1">
                    <User className="h-3.5 w-3.5 text-primary-400" />
                  </div>
                  <span className="text-sm text-light-300">{getUserDisplayName()}</span>
                </div>
                <Button
                  onClick={handleLogOutClick}
                  variant="ghost"
                  size="sm"
                  className="group"
                >
                  <LogOut className="h-4 w-4 mr-2 group-hover:text-accent-red" />
                  Logout
                </Button>
              </div>
            ) : (
              <div>
                <Link to="/login" className="w-20">
                  <Button size="sm" className="w-full">Login</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="sm:hidden p-1.5 text-light-100 focus:outline-none"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {
          mobileMenuOpen && (
            <div className="sm:hidden p-4 bg-dark-300 border-t border-dark-100/20">
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 py-2">
                    <div className="bg-primary-600/20 rounded-full p-1.5">
                      <User className="h-4 w-4 text-primary-400" />
                    </div>
                    <span className="text-sm text-light-300">{getUserDisplayName()}</span>
                  </div>
                  <Button
                    onClick={handleLogOutClick}
                    variant="ghost"
                    size="sm"
                    className="justify-start group"
                  >
                    <LogOut className="h-4 w-4 mr-2 group-hover:text-accent-red" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Login</Button>
                  </Link>
                  <Link to="/signup" className="flex-1">
                    <Button size="sm" className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          )
        }
      </header>
    </div>
  );
}
