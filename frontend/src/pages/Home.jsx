import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Search, 
  Filter, 
  Clock, 
  Eye, 
  Gavel, 
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  Star,
  ShoppingBag,
  Grid3X3,
  LayoutGrid
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AuctionCard from "../components/AuctionCard";
import { AuctionGridSkeleton } from "../components/AuctionCardSkeleton";
import AuctionFilters from "../components/AuctionFilters";
import Footer from "../components/Footer";

const fetchAuctions = async () => {
  try {
    const response = await axios.get("/auctions");
    return response.data.map((a) => ({
      ...a,
      startTime: new Date(a.startTime).toLocaleString(),
      endTime:   new Date(a.endTime).toLocaleString(),
    }));
  } catch (err) {
    console.error('[Home] Failed to fetch auctions:', err);
    throw err;
  }
};

export default function Home() {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const { user } = useAuth();
  
  const {
    data: auctions = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["auctions"],
    queryFn: fetchAuctions,
    staleTime: 2 * 60 * 1000,
  });

  // Animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const getStatus = (auction) => {
    const now   = new Date();
    const start = new Date(auction.startTime);
    const end   = new Date(auction.endTime);

    if (now < start)             return "Upcoming";
    if (now >= start && now <= end) return "Live";
    return "Ended";
  };

  // Apply filters and search
  const filtered = auctions.filter((a) => {
    const matchesFilter = filter === "All" || getStatus(a) === filter;
    const matchesSearch = searchTerm === "" || 
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Stats for hero section
  const stats = [
    { icon: Users, label: "Active Users", value: "10K+", color: "text-secondary-400" },
    { icon: Gavel, label: "Live Auctions", value: auctions.filter(a => getStatus(a) === "Live").length || "25+", color: "text-warning-400" },
    { icon: Award, label: "Items Sold", value: "50K+", color: "text-purple-400" },
    { icon: TrendingUp, label: "Success Rate", value: "98%", color: "text-green-400" },
  ];

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary-600/20 via-transparent to-warning-600/20"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-purple-600/10 to-transparent"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-secondary-500/10 rounded-full blur-3xl animate-bounce-gentle"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-warning-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-bounce-gentle" style={{animationDelay: '1s'}}></div>
          
          {/* Sparkle Effects */}
          {[...Array(12)].map((_, i) => (
            <Sparkles 
              key={i}
              className={`absolute text-white/20 animate-pulse`}
              size={Math.random() * 16 + 8}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center">
            
            {/* Main Headline */}
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 text-secondary-300 text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                #1 Auction Platform
                <Star className="w-4 h-4 text-warning-400" />
              </div>
              
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-extrabold text-white mb-6 leading-tight">
                Bid, Win,
                <span className="block bg-gradient-to-r from-secondary-400 via-warning-400 to-secondary-400 bg-clip-text text-transparent animate-glow">
                  Celebrate
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <p className="text-xl md:text-3xl text-primary-100 mb-4 max-w-4xl mx-auto leading-relaxed">
                Discover extraordinary items, place winning bids, and join thousands of collectors in the world's most exciting auction marketplace.
              </p>
              <p className="text-lg text-primary-200 mb-12 max-w-2xl mx-auto">
                From rare collectibles to everyday treasures - your next great find is just one bid away.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                
                {/* Primary CTA */}
                <Link
                  to={user ? "/dashboard" : "/signup"}
                  className="group relative px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-secondary-500/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center gap-3">
                    <ShoppingBag className="w-5 h-5" />
                    {user ? "Go to Dashboard" : "Start Bidding Now"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </Link>

                {/* Secondary CTA */}
                <Link
                  to="/create-auction"
                  className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-lg border border-white/30 hover:border-white/50 text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <Gavel className="w-5 h-5" />
                    Create Auction
                  </div>
                </Link>

                {/* Watch Demo Button */}
                <button className="group flex items-center gap-3 px-6 py-4 text-white hover:text-secondary-300 transition-all duration-300 hover:scale-105">
                  <div className="w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center border border-white/20 group-hover:border-white/40 transition-all duration-300">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                  <span className="font-medium">Watch Demo</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className={`transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <div key={index} className="group text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-300">
                          <IconComponent className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-sm text-primary-200">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Search Bar */}
            <div className={`transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="max-w-2xl mx-auto mt-16">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-secondary-500 to-warning-500 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl border border-white/30 p-2">
                    <div className="flex items-center">
                      <Search className="w-5 h-5 text-white/60 ml-4" />
                      <input
                        type="text"
                        placeholder="Search for auctions, items, or categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 bg-transparent border-0 py-4 px-4 text-white placeholder-white/60 focus:outline-none"
                      />
                      <button className="px-6 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-medium rounded-xl transition-all duration-300 hover:scale-105 mr-1">
                        Search
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Auctions Section */}
      <div className="bg-neutral-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-neutral-900 mb-6">
              Live Auctions
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Discover amazing items up for auction right now. Place your bids and win incredible deals.
            </p>
          </div>

          {/* Enhanced Filters */}
          <AuctionFilters 
            filter={filter}
            setFilter={setFilter}
            auctions={auctions}
            getStatus={getStatus}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

          {/* Results Counter & View Toggle */}
          <div className="flex items-center justify-between mb-8 mt-12">
            <div className="text-sm text-neutral-600">
              {loading ? (
                <span>Loading auctions...</span>
              ) : (
                <span>
                  Showing {filtered.length} of {auctions.length} auctions
                  {searchTerm && ` for "${searchTerm}"`}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === "grid" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === "list" 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Grid3X3 size={18} />
              </button>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <AuctionGridSkeleton count={8} />
          ) : error ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-red-200 max-w-md mx-auto">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gavel className="w-8 h-8 text-red-600" />
                </div>
                <div className="text-red-600 text-xl font-semibold mb-2">
                  Failed to load auctions
                </div>
                <p className="text-neutral-600 mb-6">
                  We're having trouble connecting to our servers. Please check your internet connection and try again.
                </p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gavel className="w-8 h-8 text-gray-400" />
                </div>
                <div className="text-xl font-semibold text-neutral-900 mb-2">No auctions found</div>
                <p className="text-neutral-600 mb-6">
                  {searchTerm 
                    ? `No auctions match "${searchTerm}". Try adjusting your search terms or filters.` 
                    : "No auctions match your current filter selection."
                  }
                </p>
                <div className="flex gap-3 justify-center">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      Clear Search
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setFilter("All");
                      setSearchTerm("");
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    View All Auctions
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className={`
              ${viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-6"
              }
            `}>
              {filtered.slice(0, 12).map((auction) => (
                <AuctionCard 
                  key={auction.id} 
                  auction={auction} 
                  getStatus={getStatus}
                />
              ))}
            </div>
          )}

          {/* View All Button */}
          {filtered.length > 12 && (
            <div className="text-center mt-16">
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 max-w-md mx-auto">
                <p className="text-gray-600 mb-4">
                  Showing 12 of {filtered.length} auctions
                </p>
                <button
                  onClick={() => {
                    // This could navigate to a dedicated auctions page or show more results
                    console.log("Show all auctions");
                  }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <span>View All {filtered.length} Auctions</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
