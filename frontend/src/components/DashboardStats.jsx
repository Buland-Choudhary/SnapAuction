import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Gavel, 
  Eye, 
  Trophy,
  Clock,
  Users,
  Activity,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalBids: 0,
    wonAuctions: 0,
    totalSpent: 0,
    watchedAuctions: 0,
    activeBids: 0,
    successRate: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [animateCounters, setAnimateCounters] = useState(false);

  // Simulate loading stats
  useEffect(() => {
    const loadStats = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalBids: 127,
        wonAuctions: 23,
        totalSpent: 15420.50,
        watchedAuctions: 34,
        activeBids: 8,
        successRate: 18.1
      });
      
      setIsLoading(false);
      setTimeout(() => setAnimateCounters(true), 100);
    };

    loadStats();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const StatCard = ({ icon: Icon, title, value, change, changeType, color, isLoading, delay = 0 }) => (
    <div 
      className={`
        bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl 
        transition-all duration-500 transform hover:scale-105 hover:-translate-y-1
        border border-gray-100 dark:border-gray-700
        ${animateCounters ? 'animate-slide-up' : 'opacity-0'}
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            {isLoading ? (
              <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
            ) : (
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {typeof value === 'number' && title.includes('Spent') 
                  ? `$${value.toLocaleString()}` 
                  : typeof value === 'number' && title.includes('Rate')
                  ? `${value}%`
                  : value.toLocaleString()}
              </p>
            )}
          </div>
        </div>
        
        {change && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            changeType === 'positive' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {changeType === 'positive' ? (
              <ArrowUp className="w-3 h-3" />
            ) : (
              <ArrowDown className="w-3 h-3" />
            )}
            <span>{change}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Activity className="w-4 h-4" />
          <span>Last 30 days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Gavel}
          title="Total Bids Placed"
          value={stats.totalBids}
          change={12}
          changeType="positive"
          color="bg-gradient-to-r from-blue-500 to-blue-600"
          isLoading={isLoading}
          delay={0}
        />
        
        <StatCard
          icon={Trophy}
          title="Auctions Won"
          value={stats.wonAuctions}
          change={8}
          changeType="positive"
          color="bg-gradient-to-r from-green-500 to-green-600"
          isLoading={isLoading}
          delay={100}
        />
        
        <StatCard
          icon={DollarSign}
          title="Total Spent"
          value={stats.totalSpent}
          change={23}
          changeType="positive"
          color="bg-gradient-to-r from-purple-500 to-purple-600"
          isLoading={isLoading}
          delay={200}
        />
        
        <StatCard
          icon={Eye}
          title="Watched Auctions"
          value={stats.watchedAuctions}
          change={5}
          changeType="negative"
          color="bg-gradient-to-r from-orange-500 to-orange-600"
          isLoading={isLoading}
          delay={300}
        />
        
        <StatCard
          icon={Clock}
          title="Active Bids"
          value={stats.activeBids}
          color="bg-gradient-to-r from-red-500 to-red-600"
          isLoading={isLoading}
          delay={400}
        />
        
        <StatCard
          icon={TrendingUp}
          title="Success Rate"
          value={stats.successRate}
          change={3}
          changeType="positive"
          color="bg-gradient-to-r from-indigo-500 to-indigo-600"
          isLoading={isLoading}
          delay={500}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
