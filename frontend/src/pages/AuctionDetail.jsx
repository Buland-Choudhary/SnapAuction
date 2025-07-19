import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function AuctionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [auction, setAuction] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchAuction();
  }, [id]);

  const fetchAuction = async () => {
    try {
      const res = await axios.get(`/auctions/${id}`);
      setAuction(res.data);
      
      // Check if user is following this auction
      if (user) {
        const userFollow = res.data.follows.find(f => f.userId === user.id);
        setIsFollowing(!!userFollow);
      }
      
      // Set suggested bid amount
      const suggestedBid = res.data.currentPrice + res.data.minIncrement;
      setBidAmount(suggestedBid.toString());
    } catch (err) {
      console.error("Failed to fetch auction:", err);
    }
  };

  const handlePlaceBid = async (e) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");
    setIsSubmitting(true);

    try {
      const response = await axios.post("/bids", {
        auctionId: id,
        amount: parseFloat(bidAmount),
      });

      setBidSuccess("Bid placed successfully!");
      
      // Refresh auction data to show new bid
      await fetchAuction();
      
      // Update bid amount to new minimum
      const newMinBid = response.data.newCurrentPrice + auction.minIncrement;
      setBidAmount(newMinBid.toString());

    } catch (err) {
      setBidError(err.response?.data?.message || "Failed to place bid");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`/auctions/${id}/unfollow`);
        setIsFollowing(false);
      } else {
        await axios.post(`/auctions/${id}/follow`);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  const isAuctionLive = () => {
    if (!auction) return false;
    const now = new Date();
    return !auction.isClosed && 
           new Date(auction.startTime) <= now && 
           new Date(auction.endTime) >= now;
  };

  const canUserBid = () => {
    return user && 
           isAuctionLive() && 
           auction.sellerId !== user.id;
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

  if (!auction) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
      <p className="text-lg font-medium">Loading auction...</p>
    </div>
  );

  const status = getAuctionStatus();
  const minBidAmount = auction.currentPrice + auction.minIncrement;

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
                    step="0.01"
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
                  disabled={isSubmitting}
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-xl transition-all"
                >
                  {isSubmitting ? "Placing Bid..." : "Place Bid"}
                </button>
              </form>
            </div>
          )}

          {/* Follow/Unfollow */}
          {user && auction.sellerId !== user.id && (
            <div className="border rounded-xl p-4 bg-yellow-50">
              <button
                onClick={handleFollowToggle}
                className={`w-full text-white py-2 rounded-xl font-semibold transition-all ${
                  isFollowing 
                    ? 'bg-gray-600 hover:bg-gray-700' 
                    : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {isFollowing ? 'Unfollow Auction' : 'Follow Auction'}
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
              {auction.bids.map((bid) => (
                <div key={bid.id} className="flex justify-between items-center bg-gray-100 rounded px-4 py-2">
                  <span className="font-medium">{bid.user.name}</span>
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