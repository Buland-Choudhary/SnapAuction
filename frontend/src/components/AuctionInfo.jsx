import { 
  User, 
  MapPin, 
  Calendar, 
  Tag, 
  Heart, 
  Share2, 
  Eye,
  Star,
  Shield,
  Truck,
  Award,
  Info
} from "lucide-react";

const AuctionInfo = ({ auction, user, isFollowing, followLoading, onFollowToggle }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: auction.title,
          text: `Check out this auction: ${auction.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getStatusInfo = () => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    if (auction.isClosed || now > end) {
      return { 
        status: "Ended", 
        color: "text-gray-600", 
        bgColor: "bg-gray-100",
        message: "This auction has concluded"
      };
    } else if (now < start) {
      return { 
        status: "Upcoming", 
        color: "text-blue-600", 
        bgColor: "bg-blue-100",
        message: "Auction has not started yet"
      };
    } else {
      return { 
        status: "Live", 
        color: "text-green-600", 
        bgColor: "bg-green-100",
        message: "Auction is currently active"
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {auction.title}
          </h1>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
            <div className={`w-2 h-2 rounded-full ${statusInfo.status === 'Live' ? 'bg-green-500 animate-pulse' : 'bg-current'}`}></div>
            {statusInfo.status}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {user && (
            <button
              onClick={onFollowToggle}
              disabled={followLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isFollowing
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } ${followLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
            >
              <Heart size={16} className={isFollowing ? 'fill-current' : ''} />
              {followLoading ? 'Loading...' : isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
          
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-all duration-300 hover:scale-105"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="prose max-w-none">
        <p className="text-gray-700 text-lg leading-relaxed">
          {auction.description}
        </p>
      </div>

      {/* Seller Information */}
      <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} />
          Seller Information
        </h3>
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {auction.seller?.username?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">
                {auction.seller?.username || 'Anonymous Seller'}
              </h4>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                <Shield size={12} />
                Verified
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <span className="flex items-center gap-1">
                <Star size={12} />
                4.8 Rating
              </span>
              <span className="flex items-center gap-1">
                <Award size={12} />
                125 Sales
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Auction Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Timing Information */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} />
            Auction Timeline
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Start Time</div>
              <div className="text-gray-900">{formatDate(auction.startTime)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">End Time</div>
              <div className="text-gray-900">{formatDate(auction.endTime)}</div>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="text-sm text-gray-600 flex items-center gap-2">
                <Info size={14} />
                {statusInfo.message}
              </div>
            </div>
          </div>
        </div>

        {/* Auction Specifications */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag size={20} />
            Auction Details
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Starting Price</div>
                <div className="text-lg font-semibold text-gray-900">
                  ${auction.basePrice?.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Min Increment</div>
                <div className="text-lg font-semibold text-gray-900">
                  ${auction.minIncrement?.toLocaleString()}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Category</div>
                <div className="text-gray-900">{auction.category || 'General'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Condition</div>
                <div className="text-gray-900">{auction.condition || 'Used'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping & Payment */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Truck size={20} />
            Shipping & Payment
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">
                {auction.shippingCost ? `$${auction.shippingCost}` : 'Free Shipping'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Methods</span>
              <span className="font-medium text-gray-900">PayPal, Credit Card</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Return Policy</span>
              <span className="font-medium text-gray-900">30 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span className="font-medium text-gray-900 flex items-center gap-1">
                <MapPin size={14} />
                {auction.location || 'United States'}
              </span>
            </div>
          </div>
        </div>

        {/* Auction Statistics */}
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye size={20} />
            Auction Statistics
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Bids</span>
              <span className="font-medium text-gray-900">{auction.bids?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Unique Bidders</span>
              <span className="font-medium text-gray-900">
                {new Set(auction.bids?.map(bid => bid.userId)).size || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Views</span>
              <span className="font-medium text-gray-900">{auction.views || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Watchers</span>
              <span className="font-medium text-gray-900">{auction.follows?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionInfo;
