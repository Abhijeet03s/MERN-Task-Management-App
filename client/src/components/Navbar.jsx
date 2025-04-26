import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
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
    setMobileMenuOpen(false);
    handleLogOut();
    toast.success('Logged out successfully');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [user]);

  const handleNavLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative">
      <header className="border-b border-dark-100/40 bg-dark-300 sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="container mx-auto px-4 sm:px-6 flex justify-between items-center h-14 sm:h-16">
          <Link
            to="/"
            className="flex items-center gap-1.5 sm:gap-2 font-semibold text-light-100"
          >
            <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-primary-600 flex items-center justify-center shadow-glow transition-transform hover:scale-105">
              <CheckSquare className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold gradient-text hidden sm:block transition-colors hover:text-primary-400">Task Manager</h1>
          </Link>

          <div className="hidden sm:flex items-center gap-3 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="hidden md:flex items-center gap-2 py-1.5 rounded-full border border-dark-100/20 transition-colors hover:bg-dark-400/80">
                  <div className="bg-primary-600/20 rounded-full p-1">
                    <User className="h-3.5 w-3.5 text-primary-400" />
                  </div>
                  <span className="text-sm text-light-300 truncate max-w-[150px]">{getUserDisplayName()}</span>
                </div>
                <Button
                  onClick={handleLogOutClick}
                  variant="ghost"
                  size="sm"
                  className="group hover:bg-accent-red/10"
                >
                  <LogOut className="h-4 w-4 mr-2 transition-colors group-hover:text-accent-red" />
                  <span className="transition-colors group-hover:text-accent-red">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="px-4">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="px-4">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={toggleMobileMenu}
            className="sm:hidden p-1.5 text-light-100 focus:outline-none hover:bg-dark-400/40 rounded-lg transition-colors"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden p-4 bg-dark-300 border-t border-dark-100/20 animate-in slide-in-from-top duration-200">
            {user ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 py-2 rounded-lg">
                  <div className="bg-primary-600/20 rounded-full p-1.5">
                    <User className="h-4 w-4 text-primary-400" />
                  </div>
                  <span className="text-sm text-light-300 truncate">{getUserDisplayName()}</span>
                </div>
                <Button
                  onClick={handleLogOutClick}
                  variant="ghost"
                  size="sm"
                  className="justify-start group hover:bg-accent-red/10"
                >
                  <LogOut className="h-4 w-4 mr-2 transition-colors group-hover:text-accent-red" />
                  <span className="transition-colors group-hover:text-accent-red">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link to="/login" className="w-full" onClick={handleNavLinkClick}>
                  <Button variant="outline" size="sm" className="w-full">Login</Button>
                </Link>
                <Link to="/signup" className="w-full" onClick={handleNavLinkClick}>
                  <Button size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>
    </div>
  );
}
