import { Link } from "react-router-dom";
import { 
  Clock, 
  Eye, 
  Gavel, 
  ArrowRight,
  Heart,
  Users,
  TrendingUp,
  Zap
} from "lucide-react";
import { useState } from "react";

const AuctionCard = ({ auction, getStatus }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const status = getStatus(auction);
  const statusConfig = {
    Upcoming: { 
      color: "bg-gradient-to-r from-amber-500 to-orange-500 text-white", 
      icon: Clock,
      textColor: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    },
    Live: { 
      color: "bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse", 
      icon: Gavel,
      textColor: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    Ended: { 
      color: "bg-gradient-to-r from-gray-500 to-gray-600 text-white", 
      icon: Eye,
      textColor: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200"
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const firstImage = auction.images?.[0]?.url || `https://picsum.photos/400/300?random=${auction.id}`;

  // Calculate time remaining for live auctions
  const getTimeRemaining = () => {
    if (status !== "Live") return null;
    
    const now = new Date();
    const endTime = new Date(auction.endTime);
    const diff = endTime - now;
    
    if (diff <= 0) return "Auction ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m left`;
    } else {
      return `${minutes}m left`;
    }
  };

  const timeRemaining = getTimeRemaining();

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2 overflow-hidden border border-gray-100 hover:border-gray-200">
      {/* Enhanced Image Section */}
      <div className="relative overflow-hidden">
        {/* Image Loading Skeleton */}
        {!imageLoaded && (
          <div className="w-full h-48 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"></div>
        )}
        
        <img
          src={firstImage}
          alt={auction.title}
          className={`w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${config.color} shadow-lg`}>
            <StatusIcon size={12} />
            {status}
          </span>
        </div>

        {/* Live Indicator */}
        {status === "Live" && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-red-600/90 backdrop-blur-sm rounded-full text-white text-xs font-medium">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              LIVE
            </div>
          </div>
        )}

        {/* Time Remaining for Live Auctions */}
        {status === "Live" && timeRemaining && (
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
              <Clock size={12} />
              {timeRemaining}
            </div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110"
        >
          <Heart 
            size={16} 
            className={`transition-colors duration-200 ${
              isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'
            }`} 
          />
        </button>

        {/* Quick Action Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <span className="text-sm font-medium text-gray-900">View Details</span>
          </div>
        </div>
      </div>

      {/* Enhanced Content Section */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2 leading-tight">
          {auction.title}
        </h3>

        {/* Pricing Section */}
        <div className="space-y-3 mb-4">
          {/* Current Price */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Current Bid</span>
            <div className="text-right">
              <span className="text-xl font-bold text-green-600">
                ${auction.currentPrice || auction.startingPrice}
              </span>
              {auction.currentPrice > auction.startingPrice && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp size={12} />
                  <span>+{Math.round(((auction.currentPrice - auction.startingPrice) / auction.startingPrice) * 100)}%</span>
                </div>
              )}
            </div>
          </div>

          {/* Starting Price Comparison */}
          {auction.currentPrice && auction.currentPrice > auction.startingPrice && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Starting bid</span>
              <span className="text-gray-400 line-through">${auction.startingPrice}</span>
            </div>
          )}
        </div>

        {/* Auction Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Time Info */}
          <div className={`p-2 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
            <div className="flex items-center gap-2 text-sm">
              <Clock size={14} className={config.textColor} />
              <div>
                <div className="text-xs text-gray-500">
                  {status === "Upcoming" ? "Starts" : "Ends"}
                </div>
                <div className="font-medium text-gray-700 text-xs">
                  {new Date(status === "Upcoming" ? auction.startTime : auction.endTime).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Bid Count */}
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2 text-sm">
              <Users size={14} className="text-blue-600" />
              <div>
                <div className="text-xs text-gray-500">Bidders</div>
                <div className="font-medium text-gray-700 text-xs">{auction.bidCount || 0}</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="flex items-center justify-between">
          <Link
            to={`/auction/${auction.id}`}
            className="flex-1 group/cta bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            {status === "Live" ? (
              <>
                <Zap size={16} />
                Bid Now
              </>
            ) : status === "Upcoming" ? (
              <>
                <Eye size={16} />
                Watch
              </>
            ) : (
              <>
                <Eye size={16} />
                View Results
              </>
            )}
            <ArrowRight size={14} className="group-hover/cta:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500/20 transition-colors duration-300 pointer-events-none"></div>
    </div>
  );
};

export default AuctionCard;
