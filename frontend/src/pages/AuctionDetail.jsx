import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

const fetchAuction = async (id) => {
  const response = await axios.get(`/auctions/${id}`);
  return {
    ...response.data,
    startTime: new Date(response.data.startTime).toLocaleString(),
    endTime: new Date(response.data.endTime).toLocaleString(),
    bids: response.data.bids.map((b) => ({
      ...b,
      createdAt: new Date(b.createdAt).toLocaleString(),
    })),
  };
};

const placeBidAPI = async ({ auctionId, amount }) => {
  const response = await axios.post("/bids", {
    auctionId,
    amount: parseFloat(amount),
  });
  return response.data;
};

const toggleFollowAPI = async ({ auctionId, isFollowing }) => {
  if (isFollowing) {
    await axios.delete(`/auctions/${auctionId}/unfollow`);
    return false;
  } else {
    await axios.post(`/auctions/${auctionId}/follow`);
    return true;
  }
};

export default function AuctionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");

  // Fetch auction with caching
  const {
    data: auction,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["auction", id],
    queryFn: () => fetchAuction(id),
    staleTime: 30 * 1000, // 30 seconds for auction details (more frequent for live bidding)
    enabled: !!id,
  });

  // Place bid mutation
  const placeBidMutation = useMutation({
    mutationFn: placeBidAPI,
    onSuccess: (data) => {
      setBidSuccess("Bid placed successfully!");
      setBidError("");
      
      // Invalidate and refetch auction data to show new bid
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      
      // Update bid amount to new minimum
      const newMinBid = data.newCurrentPrice + auction.minIncrement;
      setBidAmount(newMinBid.toString());
    },
    onError: (error) => {
      setBidError(error.response?.data?.message || "Failed to place bid");
      setBidSuccess("");
    },
  });

  // Follow/unfollow mutation
  const followMutation = useMutation({
    mutationFn: toggleFollowAPI,
    onSuccess: () => {
      // Optimistically update the cache
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      // Also invalidate dashboard to update followed auctions
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      console.error("Failed to toggle follow:", error);
    },
  });

  // Set initial bid amount when auction loads
  useState(() => {
    if (auction) {
      const suggestedBid = auction.currentPrice + auction.minIncrement;
      setBidAmount(suggestedBid.toString());
    }
  }, [auction]);

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");

    placeBidMutation.mutate({
      auctionId: id,
      amount: bidAmount,
    });
  };

  const handleFollowToggle = () => {
    if (!auction || !user) return;
    
    const isFollowing = auction.follows.some(f => f.userId === user.id);
    followMutation.mutate({
      auctionId: id,
      isFollowing,
    });
  };

  const isAuctionLive = () => {
    if (!auction) return false;
    const now = new Date();
    return !auction.isClosed && 
           new Date(auction.startTime) <= now && 
           new Date(auction.endTime) >= now;
  };

  const canUserBid = () => {
    if (!user || !isAuctionLive()) return false;
    
    // Check if user is the seller
    if (auction.sellerId === user.id) return false;
    
    // Check if user's bid is the latest/highest bid
    if (auction.bids.length > 0 && auction.bids[0].userId === user.id) return false;
    
    return true;
  };

    const getBidRestrictionMessage = () => {
    if (!user) 
      return "Please log in to place bids";

    // we know auction is loaded here
    const now   = new Date();
    const start = new Date(auction.startTime);
    const end   = new Date(auction.endTime);

    if (now < start) 
      return "The auction has not started yet.";
    if (auction.isClosed || now > end) 
      return "The auction has already ended.";

    if (auction.sellerId === user.id) 
      return "You cannot bid on your own auction.";

    if (
      auction.bids.length > 0 && 
      auction.bids[0].userId === user.id
    ) {
      return "You have the current highest bid. Wait for another user to bid.";
    }

    // if we reach here, user *can* bid
    return "";
  };


  const getAuctionStatus = () => {
    if (!auction) return "";
    
    const now = new Date();
    const startTime = new Date(auction.startTime);
    const endTime = new Date(auction.endTime);

    if (auction.isClosed) return "Closed";
    if (now < startTime) return "Upcoming";
    if (now > endTime) return "Ended";
    return "Live";
  };

  // Loading state
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
      <p className="text-lg font-medium">Loading auction...</p>
    </div>
  );

  // Error state
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
      <div className="text-center">
        <p className="text-lg font-medium text-red-400">Failed to load auction</p>
        <button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ["auction", id] })}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (!auction) return null;

  const status = getAuctionStatus();
  const minBidAmount = auction.currentPrice + auction.minIncrement;
  const restrictionMessage = getBidRestrictionMessage();
  const isFollowing = user && auction.follows.some(f => f.userId === user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white text-gray-900 rounded-2xl shadow-2xl p-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <h1 className="text-3xl font-bold">{auction.title}</h1>
          <span className={`px-4 py-1 rounded-xl text-sm font-semibold shadow-sm
            ${status === 'Live' && 'bg-green-100 text-green-800'}
            ${status === 'Upcoming' && 'bg-blue-100 text-blue-800'}
            ${status === 'Ended' && 'bg-red-100 text-red-800'}
            ${status === 'Closed' && 'bg-gray-200 text-gray-800'}`}>
            {status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700">{auction.description}</p>

        <div className="text-sm text-gray-500">
          Created by <span className="font-medium">{auction.seller.name}</span> •
          Starts: <strong>{new Date(auction.startTime).toLocaleString()}</strong> •
          Ends: <strong>{new Date(auction.endTime).toLocaleString()}</strong>
        </div>

        {/* Auction Details + Actions */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Details */}
          <div className="border rounded-xl p-4 bg-gray-50 space-y-2">
            <h3 className="font-semibold text-lg mb-2">Auction Details</h3>
            <p><strong>Base Price:</strong> ${auction.basePrice}</p>
            <p><strong>Current Price:</strong> ${auction.currentPrice}</p>
            <p><strong>Min Increment:</strong> ${auction.minIncrement}</p>
            {auction.maxIncrement && <p><strong>Max Increment:</strong> ${auction.maxIncrement}</p>}
            {auction.winner && <p><strong>Winner:</strong> {auction.winner.name}</p>}
          </div>

          {/* Bid Form */}
          {canUserBid() && (
            <div className="border rounded-xl p-4 bg-blue-50 space-y-3">
              <h3 className="font-semibold text-lg">Place a Bid</h3>
              <form onSubmit={handlePlaceBid} className="space-y-3">
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
                  disabled={placeBidMutation.isPending}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-xl transition-all disabled:opacity-50"
                >
                  {placeBidMutation.isPending ? "Placing Bid..." : "Place Bid"}
                </button>
              </form>
            </div>
          )}

          {/* Bid Restriction Message */}
          {!canUserBid() && user && (
            <div className="border rounded-xl p-4 bg-yellow-50">
              <h3 className="font-semibold text-lg mb-2">Cannot Bid</h3>
              <p className="text-sm text-gray-700 mb-3">{restrictionMessage}</p>
              {auction.bids.length > 0 && auction.bids[0].userId === user.id && (
                <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
                  💡 Tip: You currently have the highest bid of ${auction.bids[0].amount}
                </div>
              )}
            </div>
          )}

          {/* Follow/Unfollow */}
          {user && auction.sellerId !== user.id && (
            <div className="border rounded-xl p-4 bg-yellow-50">
              <button
                onClick={handleFollowToggle}
                disabled={followMutation.isPending}
                className={`w-full text-white py-2 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                  isFollowing 
                    ? 'bg-gray-600 hover:bg-gray-700' 
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {followMutation.isPending 
                  ? (isFollowing ? 'Unfollowing...' : 'Following...') 
                  : (isFollowing ? 'Unfollow Auction' : 'Follow Auction')
                }
              </button>
            </div>
          )}

          {/* Non-authenticated Users */}
          {!user && isAuctionLive() && (
            <div className="border rounded-xl p-4 bg-yellow-50 text-center">
              <p className="text-sm text-gray-700 mb-3">Please log in to place bids or follow this auction.</p>
              <a
                href="/login"
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-xl"
              >
                Log In
              </a>
            </div>
          )}
        </div>

        {/* Images */}
        {auction.images?.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {auction.images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt="Auction Item"
                  className="w-full h-48 object-cover rounded-xl border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Bid History */}
        <div>
          <h2 className="text-xl font-semibold mb-3">
            Bid History ({auction.bids.length})
          </h2>
          {auction.bids.length > 0 ? (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {auction.bids.map((bid, index) => (
                <div key={bid.id} className={`flex justify-between items-center rounded px-4 py-2 ${
                  index === 0 ? 'bg-green-100 border-2 border-green-300' : 'bg-gray-100'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{bid.user.name}</span>
                    {index === 0 && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                        Highest
                      </span>
                    )}
                    {user && bid.userId === user.id && (
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-blue-700 font-bold">${bid.amount}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(bid.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No bids yet. Be the first!</p>
          )}
        </div>

        {/* Followers */}
        <div>
          <h2 className="text-xl font-semibold">Followers</h2>
          <p className="text-gray-600">{auction.follows.length} user(s) following this auction</p>
        </div>
      </div>
    </div>
  );
}