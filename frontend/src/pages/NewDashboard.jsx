import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Settings,
  Bell,
  Heart,
  Clock,
  Trophy
} from "lucide-react";
import DashboardStats from "../components/DashboardStats";
import UserProfile from "../components/UserProfile";
import DarkModeToggle from "../components/DarkModeToggle";

// eslint-disable-next-line no-unused-vars
const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300
      ${active 
        ? 'bg-blue-500 text-white shadow-lg transform scale-105' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
      }
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800
    `}
    role="tab"
    aria-selected={active}
    tabIndex={active ? 0 : -1}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
    {count !== undefined && (
      <span className={`
        px-2 py-1 rounded-full text-xs font-bold
        ${active ? 'bg-white/20' : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300'}
      `}>
        {count}
      </span>
    )}
  </button>
);

const BidHistoryTable = () => {
  const mockBids = [
    { id: 1, item: "Vintage Guitar", amount: 850, status: "won", date: "2024-01-20" },
    { id: 2, item: "Antique Watch", amount: 1200, status: "outbid", date: "2024-01-18" },
    { id: 3, item: "Art Painting", amount: 2500, status: "active", date: "2024-01-15" },
    { id: 4, item: "Classic Car", amount: 15000, status: "won", date: "2024-01-10" },
    { id: 5, item: "Jewelry Set", amount: 750, status: "lost", date: "2024-01-08" },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      won: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      outbid: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      active: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      lost: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Bids</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Item
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Bid Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {mockBids.map((bid) => (
              <tr 
                key={bid.id} 
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{bid.item}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white font-semibold">
                    ${bid.amount.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(bid.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(bid.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const WatchedAuctions = () => {
  const mockWatched = [
    { id: 1, title: "Rare Coin Collection", currentBid: 500, endTime: "2024-01-25T15:00:00" },
    { id: 2, title: "Vintage Camera", currentBid: 320, endTime: "2024-01-24T12:00:00" },
    { id: 3, title: "Antique Furniture", currentBid: 1200, endTime: "2024-01-26T18:00:00" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockWatched.map((auction) => (
        <div 
          key={auction.id}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900"></div>
          <div className="p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{auction.title}</h4>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 dark:text-gray-400">Current bid:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">${auction.currentBid}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Ends: {new Date(auction.endTime).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "bids", label: "My Bids", icon: TrendingUp, count: 12 },
    { id: "watched", label: "Watched", icon: Heart, count: 8 },
    { id: "profile", label: "Profile", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <DashboardStats />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BidHistoryTable />
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-xl text-left transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-gray-900 dark:text-white">View Active Bids</span>
                      </div>
                    </button>
                    <button className="w-full p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-xl text-left transition-colors duration-200">
                      <div className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-gray-900 dark:text-white">View Won Auctions</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "bids":
        return <BidHistoryTable />;
      case "watched":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Watched Auctions</h2>
            <WatchedAuctions />
          </div>
        );
      case "profile":
        return <UserProfile user={user} />;
      case "settings":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Toggle between light and dark themes</p>
                </div>
                <DarkModeToggle />
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Receive updates about your bids</p>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name || 'User'}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Here's what's happening with your auctions today.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-200 hover:scale-105"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <DarkModeToggle />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div 
          className="flex flex-wrap gap-2 mb-8 p-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
          role="tablist"
          aria-label="Dashboard navigation"
        >
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              icon={tab.icon}
              label={tab.label}
              count={tab.count}
            />
          ))}
        </div>

        {/* Tab Content */}
        <div role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
