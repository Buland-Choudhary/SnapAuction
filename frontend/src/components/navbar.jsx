import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { 
  PlusCircle, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronDown,
  Home,
  LayoutDashboard,
  Gavel
} from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
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
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };
    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  if (loading) return null;

  const isActivePage = (path) => location.pathname === path;

  const navLinks = user ? [
    { to: "/", label: "Home", icon: Home },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  ] : [];

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-neutral-200/50' 
          : 'bg-primary-950/95 backdrop-blur-lg'
        }
      `}>
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link 
                to="/" 
                className={`
                  font-display text-2xl font-bold transition-all duration-300 hover:scale-105
                  ${isScrolled ? 'text-primary-900' : 'text-white'}
                `}
              >
                <span className="flex items-center gap-2">
                  <Gavel className="w-7 h-7 text-secondary-500" />
                  SnapAuction
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              
              {// eslint-disable-next-line no-unused-vars 
              navLinks.map(({ to, label, icon: IconComponent }) => (
                <Link
                  key={to}
                  to={to}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-300
                    hover:scale-105 hover:-translate-y-0.5
                    ${isActivePage(to)
                      ? isScrolled 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-secondary-400 bg-white/10'
                      : isScrolled
                        ? 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50'
                        : 'text-neutral-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <IconComponent size={18} />
                  {label}
                </Link>
              ))}
            </div>

            {/* Right Section: CTA + User Menu */}
            <div className="flex items-center gap-4">
              
              {/* Create Auction CTA - Desktop */}
              {user && (
                <Link
                  to="/create-auction"
                  className={`
                    hidden md:flex items-center gap-2 px-4 py-2 rounded-xl font-semibold
                    transition-all duration-300 hover:scale-105 hover:shadow-lg
                    bg-gradient-to-r from-secondary-500 to-secondary-600 
                    hover:from-secondary-600 hover:to-secondary-700 
                    text-white shadow-md
                  `}
                >
                  <PlusCircle size={18} />
                  Create Auction
                </Link>
              )}

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl font-medium
                      transition-all duration-300 hover:scale-105
                      ${isScrolled 
                        ? 'text-neutral-700 hover:bg-neutral-100' 
                        : 'text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      ${isScrolled ? 'bg-primary-100 text-primary-700' : 'bg-white/20 text-white'}
                    `}>
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="hidden sm:block max-w-24 truncate">
                      {user.name}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* User Dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-200 py-2 animate-slide-down">
                      <div className="px-4 py-3 border-b border-neutral-100">
                        <p className="text-sm font-semibold text-neutral-900">{user.name}</p>
                        <p className="text-xs text-neutral-500">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          Dashboard
                        </Link>
                        
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Auth Links */
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/login"
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all duration-300
                      ${isScrolled 
                        ? 'text-neutral-600 hover:text-primary-600 hover:bg-primary-50' 
                        : 'text-neutral-300 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 rounded-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white transition-all duration-300 hover:scale-105 shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`
                  md:hidden p-2 rounded-lg transition-all duration-300
                  ${isScrolled 
                    ? 'text-neutral-600 hover:bg-neutral-100' 
                    : 'text-white hover:bg-white/10'
                  }
                `}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-neutral-200 shadow-lg animate-slide-down">
            <div className="px-6 py-4 space-y-4">
              
              {/* Mobile Navigation Links */}
              { // eslint-disable-next-line no-unused-vars
              navLinks.map(({ to, label, icon: IconComponent }) => (
                <Link
                  key={to}
                  to={to}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                    ${isActivePage(to)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:text-primary-600 hover:bg-neutral-50'
                    }
                  `}
                >
                  <IconComponent size={20} />
                  {label}
                </Link>
              ))}

              {/* Mobile CTA */}
              {user && (
                <Link
                  to="/create-auction"
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-secondary-500 to-secondary-600 text-white shadow-md"
                >
                  <PlusCircle size={20} />
                  Create Auction
                </Link>
              )}

              {/* Mobile Auth */}
              {!user && (
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <Link
                    to="/login"
                    className="block w-full text-center px-4 py-3 rounded-xl font-medium text-neutral-600 border border-neutral-300 hover:bg-neutral-50 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full text-center px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-16"></div>
    </>
  );
}
