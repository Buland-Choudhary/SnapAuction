import { useState, useEffect } from "react";
import { 
  Gavel, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Crown,
  Timer
} from "lucide-react";
import Modal from "./Modal";

const BidSection = ({
  auction,
  canBid,
  bidAmount,
  setBidAmount,
  bidError,
  bidSuccess,
  isPlacingBid,
  onPlaceBid,
  restrictionMessage
}) => {
  const [recentBids, setRecentBids] = useState([]);
  const [bidHistory, setBidHistory] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const currentPrice = auction.currentPrice || auction.basePrice;
  const minBidAmount = currentPrice + auction.minIncrement;

  // Update bid history when auction data changes
  useEffect(() => {
    if (auction.bids) {
      const sortedBids = [...auction.bids].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBidHistory(sortedBids);
      
      // Track recent bids for animation
      if (sortedBids.length > recentBids.length) {
        setRecentBids(sortedBids.slice(0, 5));
        setAnimationKey(prev => prev + 1);
      }
    }
  }, [auction.bids, recentBids.length]);

  // Auto-update bid amount to minimum when current price changes
  useEffect(() => {
    if (!bidAmount || parseFloat(bidAmount) < minBidAmount) {
      setBidAmount(minBidAmount.toString());
    }
  }, [minBidAmount, bidAmount, setBidAmount]);

  const handleBidChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBidAmount(value);
    }
  };

  const handleQuickBid = (increment) => {
    const newAmount = currentPrice + increment;
    setBidAmount(newAmount.toString());
  };

  const handleBidSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmBid = async () => {
    setShowConfirmModal(false);
    // Create a synthetic event for the original handler
    const syntheticEvent = {
      preventDefault: () => {},
      target: { bidAmount: { value: bidAmount } }
    };
    await onPlaceBid(syntheticEvent);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateIncreasePercentage = () => {
    if (!auction.basePrice) return 0;
    return ((currentPrice - auction.basePrice) / auction.basePrice * 100);
  };

  const getStatusInfo = () => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    if (auction.isClosed || now > end) {
      return { status: "Ended", color: "text-gray-600", bgColor: "bg-gray-100" };
    } else if (now < start) {
      return { status: "Upcoming", color: "text-blue-600", bgColor: "bg-blue-100" };
    } else {
      return { status: "Live", color: "text-green-600", bgColor: "bg-green-100" };
    }
  };

  const statusInfo = getStatusInfo();
  const isHighValueAuction = currentPrice >= 10000;
  const bidIncreasePercentage = calculateIncreasePercentage();

  return (
    <>
      <div className="space-y-6">
      {/* Current Price Display */}
      <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200">
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Activity size={16} />
            <span>Current High Bid</span>
          </div>
          <div key={animationKey} className="text-4xl font-bold text-blue-600 animate-pulse">
            {formatCurrency(currentPrice)}
          </div>
          {bidIncreasePercentage > 0 && (
            <div className="flex items-center justify-center gap-1 text-green-600">
              <TrendingUp size={16} />
              <span className="text-sm font-medium">
                +{bidIncreasePercentage.toFixed(1)}% from starting price
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Auction Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Users className="w-5 h-5 text-blue-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">{bidHistory.length}</div>
          <div className="text-xs text-gray-600">Total Bids</div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-2" />
          <div className="text-lg font-bold text-gray-900">{formatCurrency(auction.basePrice)}</div>
          <div className="text-xs text-gray-600">Starting Price</div>
        </div>
        <div className="text-center p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <Timer className="w-5 h-5 text-orange-600 mx-auto mb-2" />
          <div className={`text-lg font-bold text-gray-900 px-2 py-1 rounded ${statusInfo.bgColor}`}>
            <span className={statusInfo.color}>{statusInfo.status}</span>
          </div>
          <div className="text-xs text-gray-600">Status</div>
        </div>
      </div>

      {/* Bid Form */}
      {canBid ? (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Gavel className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Place Your Bid</h3>
              {isHighValueAuction && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full flex items-center gap-1">
                  <Crown size={12} />
                  High Value
                </span>
              )}
            </div>

            {/* Quick Bid Buttons */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                auction.minIncrement,
                auction.minIncrement * 2,
                auction.minIncrement * 5,
                auction.minIncrement * 10
              ].map((increment, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickBid(increment)}
                  className="p-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors duration-200 border border-blue-200"
                >
                  +{formatCurrency(increment)}
                </button>
              ))}
            </div>

            {/* Bid Input */}
            <form onSubmit={handleBidSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bid Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={bidAmount}
                    onChange={handleBidChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-lg font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      bidError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder={formatCurrency(minBidAmount)}
                    min={minBidAmount}
                    step="0.01"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Minimum bid: {formatCurrency(minBidAmount)}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPlacingBid || !bidAmount || parseFloat(bidAmount) < minBidAmount}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  isPlacingBid
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl hover:scale-105'
                }`}
              >
                {isPlacingBid ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Placing Bid...
                  </>
                ) : (
                  <>
                    <Zap size={20} />
                    Place Bid
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800">Cannot Place Bid</h3>
              <p className="text-sm text-yellow-700 mt-1">{restrictionMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Status Messages */}
      {bidError && (
        <div className="p-4 bg-red-50 rounded-xl border border-red-200 animate-slide-down">
          <div className="flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700 font-medium">{bidError}</span>
          </div>
        </div>
      )}

      {bidSuccess && (
        <div className="p-4 bg-green-50 rounded-xl border border-green-200 animate-slide-down">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700 font-medium">{bidSuccess}</span>
          </div>
        </div>
      )}

      {/* Recent Bids */}
      {bidHistory.length > 0 && (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Activity size={20} />
            Recent Bidding Activity
          </h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {bidHistory.slice(0, 10).map((bid, index) => (
              <div 
                key={bid.id} 
                className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                  index === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {index === 0 && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900">
                      {bid.user?.username || 'Anonymous'}
                      {index === 0 && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Leading
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(bid.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(bid.amount)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Bid Confirmation Modal */}
    <Modal
      isOpen={showConfirmModal}
      onClose={() => setShowConfirmModal(false)}
      title="Confirm Your Bid"
      size="md"
    >
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gavel className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Place Bid on {auction.title}
          </h3>
          <p className="text-gray-600">
            Are you sure you want to place this bid? This action cannot be undone.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Current Price</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(currentPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Your Bid</p>
              <p className="text-lg font-semibold text-blue-600">
                {formatCurrency(parseFloat(bidAmount) || 0)}
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Bid Increase</p>
              <p className="text-sm font-medium text-green-600">
                +{formatCurrency((parseFloat(bidAmount) || 0) - currentPrice)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmBid}
            disabled={isPlacingBid}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {isPlacingBid ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Placing...
              </>
            ) : (
              <>
                <Gavel className="w-4 h-4" />
                Confirm Bid
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
    </>
  );
};

export default BidSection;
