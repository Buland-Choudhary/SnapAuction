import React, { useEffect, useState } from "react";

export default function AuctionLiveSection({
  auction,
  user,
  canBid,
  bidAmount,
  setBidAmount,
  bidError,
  bidSuccess,
  isPlacingBid,
  onPlaceBid,
  restrictionMessage,
}) {
  const minBidAmount = (auction.currentPrice || auction.basePrice) + auction.minIncrement;

  const [timeLeft, setTimeLeft] = useState("");

  // Countdown Timer Effect
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const end = new Date(auction.endTime);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateTimer(); // run immediately
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime]);

  return (
    <div className="space-y-8">
      {/* Live Bid Section */}
      <div className="grid md:grid-cols-2 gap-6 items-start border rounded-xl p-6 bg-blue-50">
        {/* Bid Form */}
        {canBid ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Place a Bid</h3>
            <form onSubmit={onPlaceBid} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Bid Amount (min: ${minBidAmount})
                </label>
                <input
                  type="number"
                  step="1"
                  min={minBidAmount}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              {bidError && <p className="text-sm text-red-600">{bidError}</p>}
              {bidSuccess && <p className="text-sm text-green-600">{bidSuccess}</p>}
              <button
                type="submit"
                disabled={isPlacingBid}
                className={`w-full font-semibold py-2 rounded-xl transition-all ${
                  isPlacingBid
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-700 hover:bg-blue-800 text-white"
                }`}
              >
                {isPlacingBid ? "Placing Bid..." : "Place Bid"}
              </button>
            </form>
          </div>
        ) : (
          <div className="border rounded-xl p-4 bg-yellow-50 col-span-1">
            <h3 className="font-semibold text-lg mb-2">Cannot Bid</h3>
            <p className="text-sm text-gray-700 mb-3">{restrictionMessage}</p>
          </div>
        )}

        {/* Timer (only show if auction is live) */}
        {new Date() >= new Date(auction.startTime) && new Date() < new Date(auction.endTime) && (
        <div className="h-full flex items-center justify-center">
            <div className="w-full h-full flex flex-col items-center justify-center bg-white border border-blue-200 rounded-xl p-6 shadow-md">
                <h4 className="text-sm text-gray-500 mb-1">Time Remaining</h4>
                <p className="text-2xl font-bold text-blue-800 tracking-wide">{timeLeft}</p>
            </div>
        </div>
        )}

      </div>

      {/* Bid History */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Bid History ({auction.bids.length})
        </h2>
        {auction.bids.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {auction.bids.map((bid, idx) => {
              const isHighest = idx === 0;
              const isUser = user?.id === bid.userId;

              return (
                <div className={`flex justify-between items-center rounded px-4 py-2 gap-4 ${
                    isHighest
                      ? "bg-green-100 border-2 border-green-300"
                      : "bg-gray-100"
                  }`}>
                {/* Left: User + Tags */}
                    <div className="flex items-center gap-2 w-1/3 truncate">
                        <span className="font-medium truncate">{bid.user.name}</span>
                        {isHighest && (
                            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">Highest</span>
                        )}
                        {isUser && (
                            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">You</span>
                        )}
                    </div>

                    {/* Center: Fixed-width amount */}
                    <div className="w-1/3 text-center text-blue-700 font-bold">${bid.amount}</div>

                    {/* Right: Timestamp */}
                    <div className="w-1/3 text-right text-sm text-gray-500">
                        {bid.createdAt.toLocaleString()}
                    </div>
                </div>

              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No bids yet. Be the first!</p>
        )}
      </div>
    </div>
  );
}
