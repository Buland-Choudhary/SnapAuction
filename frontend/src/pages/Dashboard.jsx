import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import React from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  TrendingUp, 
  Gavel, 
  Trophy, 
  Eye,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2
} from "lucide-react";

const fetchDashboard = async () => {
  try {
    const response = await axios.get("/users/dashboard");
    const data = response.data;
    return {
      ...data,
      created: data.created.map((a) => ({
        ...a,
        endTime: new Date(a.endTime).toLocaleString(),
      })),
      follows: data.follows.map((a) => ({
        ...a,
        endTime: new Date(a.endTime).toLocaleString(),
      })),
      bids: data.bids.map((b) => ({
        ...b,
        auction: {
          ...b.auction,
          endTime: new Date(b.auction.endTime).toLocaleString(),
        },
        // b.isHighest is already present
      })),
      wins: data.wins.map((a) => ({
        ...a,
        // format other fields if needed…
      })),
    };
  } catch (err) {
    console.error('[Dashboard] Failed to fetch dashboard:', err);
    throw err;
  }
};

export default function Dashboard() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 60 * 1000,
  });

  if (isLoading)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <div className="text-lg font-medium text-neutral-600">Loading dashboard...</div>
          </div>
        </div>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-error-500 mx-auto mb-4" />
            <div className="text-lg font-medium text-error-600">
              Failed to load dashboard
            </div>
            <p className="text-neutral-500 mt-2">Please try refreshing the page</p>
          </div>
        </div>
      </DashboardLayout>
    );

  const { created, follows, bids, wins } = dashboard;

  // Calculate stats
  const stats = [
    {
      label: "Active Auctions",
      value: created.length,
      icon: Gavel,
      color: "primary",
      change: "+12%",
      changeType: "positive"
    },
    {
      label: "Total Bids",
      value: bids.length,
      icon: TrendingUp,
      color: "secondary",
      change: "+8%",
      changeType: "positive"
    },
    {
      label: "Watching",
      value: follows.length,
      icon: Eye,
      color: "warning",
      change: "+3%",
      changeType: "positive"
    },
    {
      label: "Won Auctions",
      value: wins.length,
      icon: Trophy,
      color: "success",
      change: "+2",
      changeType: "positive"
    }
  ];

  const StatCard = ({ stat }) => {
    const IconComponent = stat.icon;
    const colorClasses = {
      primary: "bg-primary-50 text-primary-600 border-primary-200",
      secondary: "bg-secondary-50 text-secondary-600 border-secondary-200",
      warning: "bg-warning-50 text-warning-600 border-warning-200",
      success: "bg-success-50 text-success-600 border-success-200"
    };

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-neutral-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
            <p className={`text-sm font-medium ${stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'}`}>
              {stat.change}
            </p>
          </div>
          <div className={`p-3 rounded-xl border ${colorClasses[stat.color]}`}>
            <IconComponent size={24} />
          </div>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const SectionCard = ({ title, icon: Icon, children, className = "" }) => (
    <div className={`bg-white rounded-2xl shadow-sm border border-neutral-200 ${className}`}>
      <div className="flex items-center gap-3 p-6 border-b border-neutral-100">
        <div className="p-2 bg-primary-50 rounded-lg">
          <Icon size={20} className="text-primary-600" />
        </div>
        <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const AuctionList = ({ items, renderItem, emptyMessage }) =>
    items.length ? (
      <div className="space-y-3">{items.map(renderItem)}</div>
    ) : (
      <div className="text-center py-8">
        <p className="text-neutral-500">{emptyMessage}</p>
      </div>
    );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* My Created Auctions */}
          <SectionCard title="My Created Auctions" icon={Gavel}>
            <AuctionList
              items={created}
              emptyMessage="No auctions created yet. Create your first auction!"
              renderItem={(a) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div>
                    <h4 className="font-medium text-neutral-900">{a.title}</h4>
                    <p className="text-sm text-neutral-500">Ends: {a.endTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-success-600" />
                    <span className="font-semibold text-success-600">${a.currentPrice || a.startingPrice}</span>
                  </div>
                </div>
              )}
            />
          </SectionCard>

          {/* Auctions I Follow */}
          <SectionCard title="Watching" icon={Eye}>
            <AuctionList
              items={follows}
              emptyMessage="No auctions in your watchlist yet."
              renderItem={(a) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition-colors">
                  <div>
                    <h4 className="font-medium text-neutral-900">{a.title}</h4>
                    <p className="text-sm text-neutral-500">Ends: {a.endTime}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-warning-600" />
                    <span className="text-sm font-medium text-warning-600">Active</span>
                  </div>
                </div>
              )}
            />
          </SectionCard>
        </div>

        {/* My Bids - Full Width */}
        <SectionCard title="My Bids" icon={TrendingUp}>
          <AuctionList
            items={bids}
            emptyMessage="No bids placed yet. Start bidding on auctions!"
            renderItem={(b) => (
              <div
                key={b.id}
                className={`p-4 rounded-xl border transition-all ${
                  b.isHighest
                    ? "bg-success-50 border-success-200"
                    : "bg-neutral-50 border-neutral-200 hover:bg-neutral-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-neutral-900">{b.auction.title}</h4>
                      {b.isHighest && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-success-100 text-success-700 text-xs font-medium rounded-full">
                          <CheckCircle2 size={12} />
                          Highest Bid
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <span>Your bid: <span className="font-semibold text-neutral-900">${b.amount}</span></span>
                      <span>Ends: {b.auction.endTime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    {!b.isHighest && (
                      <div className="text-sm text-error-600 font-medium">
                        Outbid - Current: ${b.auction.currentPrice}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          />
        </SectionCard>

        {/* Auctions I've Won */}
        {wins.length > 0 && (
          <SectionCard title="Won Auctions" icon={Trophy}>
            <AuctionList
              items={wins}
              emptyMessage="No auctions won yet."
              renderItem={(a) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-success-50 rounded-xl">
                  <div>
                    <h4 className="font-medium text-neutral-900">{a.title}</h4>
                    <p className="text-sm text-neutral-500">Congratulations! You won this auction.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={16} className="text-success-600" />
                    <span className="font-semibold text-success-600">${a.currentPrice}</span>
                  </div>
                </div>
              )}
            />
          </SectionCard>
        )}
      </div>
    </DashboardLayout>
  );
}
