import { useState } from "react";
import { 
  Clock, 
  Eye, 
  Gavel, 
  Filter as FilterIcon,
  X,
  ChevronDown,
  SlidersHorizontal
} from "lucide-react";

const AuctionFilters = ({ filter, setFilter, auctions, getStatus, searchTerm, setSearchTerm }) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  const filters = [
    { 
      key: "All", 
      label: "All Auctions", 
      icon: SlidersHorizontal,
      color: "text-gray-600",
      bgColor: "bg-gray-100 hover:bg-gray-200",
      activeColor: "bg-blue-600 text-white"
    },
    { 
      key: "Live", 
      label: "Live Now", 
      icon: Gavel,
      color: "text-red-600",
      bgColor: "bg-red-50 hover:bg-red-100 border-red-200",
      activeColor: "bg-red-600 text-white"
    },
    { 
      key: "Upcoming", 
      label: "Starting Soon", 
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-50 hover:bg-amber-100 border-amber-200",
      activeColor: "bg-amber-600 text-white"
    },
    { 
      key: "Ended", 
      label: "Completed", 
      icon: Eye,
      color: "text-gray-600",
      bgColor: "bg-gray-50 hover:bg-gray-100 border-gray-200",
      activeColor: "bg-gray-600 text-white"
    },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "ending", label: "Ending Soon" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "popular", label: "Most Popular" },
  ];

  const getFilterCount = (filterKey) => {
    if (filterKey === "All") return auctions.length;
    return auctions.filter(a => getStatus(a) === filterKey).length;
  };

  const clearAllFilters = () => {
    setFilter("All");
    setSearchTerm("");
    setSortBy("newest");
    setPriceRange({ min: "", max: "" });
    setShowAdvancedFilters(false);
  };

  return (
    <div className="space-y-6">
      {/* Main Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((filterItem) => {
          const Icon = filterItem.icon;
          const isActive = filter === filterItem.key;
          const count = getFilterCount(filterItem.key);
          
          return (
            <button
              key={filterItem.key}
              onClick={() => setFilter(filterItem.key)}
              className={`
                group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 border
                ${isActive 
                  ? `${filterItem.activeColor} shadow-lg border-transparent` 
                  : `${filterItem.bgColor} ${filterItem.color} border-gray-200 hover:border-gray-300`
                }
              `}
            >
              <div className="flex items-center gap-2">
                <Icon size={18} />
                <span>{filterItem.label}</span>
                <span className={`
                  ml-1 px-2 py-0.5 text-xs rounded-full font-semibold
                  ${isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-white text-gray-600'
                  }
                `}>
                  {count}
                </span>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search auctions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover:border-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={16} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
        >
          <FilterIcon size={16} />
          Advanced Filters
          <ChevronDown 
            size={16} 
            className={`transform transition-transform duration-200 ${showAdvancedFilters ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                className="w-full px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200 hover:border-red-300"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {(searchTerm || filter !== "All" || showAdvancedFilters) && (
        <div className="flex flex-wrap gap-2 justify-center">
          {filter !== "All" && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
              Status: {filter}
              <button
                onClick={() => setFilter("All")}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              Search: "{searchTerm}"
              <button
                onClick={() => setSearchTerm("")}
                className="ml-1 hover:bg-green-200 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default AuctionFilters;
