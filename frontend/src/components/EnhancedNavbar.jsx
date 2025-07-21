import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  Gavel, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  Bell, 
  Home,
  PlusCircle,
  LayoutDashboard,
  ChevronDown
} from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";

export default function EnhancedNavbar() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const isActive = (path) => location.pathname === path;

  if (loading) return null;

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
        : 'bg-white dark:bg-gray-900'
      }
      border-b border-gray-100 dark:border-gray-800
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-all duration-200 group"
            aria-label="SnapAuction Home"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Gavel className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              SnapAuction
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive('/') 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <Home className="w-4 h-4" />
              Browse
            </Link>
            
            <Link
              to="/create"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive('/create') 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                  : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }
              `}
            >
              <PlusCircle className="w-4 h-4" />
              Create
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive('/dashboard') 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Notifications */}
                <button 
                  className="p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>

                {/* Dark Mode Toggle */}
                <DarkModeToggle />

                {/* User Menu */}
                <div className="relative user-menu-container">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 group"
                    aria-label="User menu"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 animate-slide-down">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                      
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      
                      <Link
                        to="/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      
                      <hr className="my-2 border-gray-200 dark:border-gray-600" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <DarkModeToggle />
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-slide-down">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
                  ${isActive('/') 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Home className="w-5 h-5" />
                Browse Auctions
              </Link>
              
              <Link
                to="/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
                  ${isActive('/create') 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                <PlusCircle className="w-5 h-5" />
                Create Auction
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
                      ${isActive('/dashboard') 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                  </Link>
                  
                  <Link
                    to="/settings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
                  >
                    <Settings className="w-5 h-5" />
                    Settings
                  </Link>
                  
                  <hr className="my-2 border-gray-200 dark:border-gray-600" />
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-xl transition-colors duration-200"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </nav>
  );
}
