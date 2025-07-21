import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  User, 
  Settings, 
  PlusCircle,
  Trophy,
  Clock,
  Gavel,
  TrendingUp,
  Heart,
  History
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [location, isMobile]);

  const sidebarItems = [
    {
      title: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
        { icon: PlusCircle, label: 'Create Auction', href: '/create-auction' },
      ]
    },
    {
      title: 'My Activity',
      items: [
        { icon: Gavel, label: 'My Auctions', href: '/dashboard/auctions' },
        { icon: TrendingUp, label: 'My Bids', href: '/dashboard/bids' },
        { icon: Trophy, label: 'Won Auctions', href: '/dashboard/wins' },
        { icon: Heart, label: 'Watchlist', href: '/dashboard/watchlist' },
        { icon: History, label: 'History', href: '/dashboard/history' },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile', href: '/dashboard/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
      ]
    }
  ];

  const isActiveRoute = (href) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen bg-neutral-50">
      {/* Sidebar Overlay for Mobile */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isSidebarOpen && !isMobile ? 'md:w-0 md:overflow-hidden' : ''}
      `}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900">{user?.name}</h3>
                <p className="text-xs text-neutral-500">Dashboard</p>
              </div>
            </div>
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-8">
              {sidebarItems.map((section) => (
                <div key={section.title}>
                  <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                    {section.title}
                  </h4>
                  <div className="space-y-2">
                    {section.items.map((item) => {
                      const IconComponent = item.icon;
                      const isActive = isActiveRoute(item.href);
                      
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium
                            transition-all duration-300 group
                            ${isActive
                              ? 'bg-primary-50 text-primary-700 shadow-sm'
                              : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                            }
                          `}
                        >
                          <IconComponent 
                            size={18} 
                            className={`
                              ${isActive ? 'text-primary-600' : 'text-neutral-400 group-hover:text-neutral-600'}
                            `}
                          />
                          {item.label}
                          {isActive && (
                            <div className="ml-auto w-2 h-2 bg-primary-600 rounded-full" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-neutral-200">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl p-4 text-white">
              <h4 className="font-semibold mb-1">Need Help?</h4>
              <p className="text-sm text-white/80 mb-3">
                Check our guide for auction tips
              </p>
              <button className="w-full bg-white/20 hover:bg-white/30 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                View Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-neutral-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors md:hidden"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900">
                  {location.pathname === '/dashboard' 
                    ? 'Dashboard' 
                    : location.pathname.split('/').pop()?.charAt(0).toUpperCase() + 
                      location.pathname.split('/').pop()?.slice(1) || 'Dashboard'
                  }
                </h1>
                <p className="text-sm text-neutral-500">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Link
                to="/create-auction"
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-md"
              >
                <PlusCircle size={18} />
                Create Auction
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
