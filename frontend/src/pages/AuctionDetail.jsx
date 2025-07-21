// src/components/AuctionDetail.jsx
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import AuctionImageGallery from "../components/AuctionImageGallery";
import AuctionInfo from "../components/AuctionInfo";
import BidSection from "../components/BidSection";
import CountdownTimer from "../components/CountdownTimer";
import { Gavel, AlertCircle } from "lucide-react";

const fetchAuction = async (id) => {
  try {
    const { data } = await axios.get(`/auctions/${id}`);
    return {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      bids: data.bids.map((b) => ({
        ...b,
        createdAt: new Date(b.createdAt),
      })),
    };
  } catch (err) {
    console.error(`[AuctionDetail] Failed to fetch auction ${id}:`, err);
    throw err;
  }
};

const toggleFollowAPI = async ({ auctionId, isFollowing }) => {
  try {
    if (isFollowing) {
      await axios.delete(`/auctions/${auctionId}/unfollow`);
      return false;
    } else {
      await axios.post(`/auctions/${auctionId}/follow`);
      return true;
    }
  } catch (err) {
    console.error(`[AuctionDetail] Follow/unfollow error:`, err);
    throw err;
  }
};

export default function AuctionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const followMutation = useMutation({
    mutationFn: toggleFollowAPI,
    onError: (err) => {
      setBidError("Failed to follow/unfollow auction.");
      console.error('[AuctionDetail] Follow/unfollow mutation error:', err);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
    },
  });

  const { data: auction, isLoading, error } = useQuery({
    queryKey: ["auction", id],
    queryFn: () => fetchAuction(id),
    staleTime: 30_000,
    enabled: !!id,
  });

  useEffect(() => {
    if (!(socket && auction)) return;

    socket.emit("join_auction", id);

    const onBid = (payload) => {
      if (payload.auctionId !== id) return;
      queryClient.invalidateQueries({ queryKey: ["auction", id] });
      setBidSuccess("Bid placed!");
      setBidError("");
      setBidAmount(String(payload.newCurrentPrice + auction.minIncrement));
    };

    socket.on("bid_placed", onBid);

    return () => {
      socket.emit("leave_auction", id);
      socket.off("bid_placed", onBid);
    };
  }, [socket, auction, id, queryClient]);

  useEffect(() => {
    if (auction) {
      const current = auction.currentPrice ?? auction.basePrice;
      setBidAmount(String(current + auction.minIncrement));
    }
  }, [auction]);

  const handlePlaceBid = (e) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");
    setIsPlacingBid(true);

    if (!socket || !user) {
      setBidError("Cannot place bid right now.");
      setIsPlacingBid(false);
      return;
    }

    socket.emit(
      "place_bid",
      { auctionId: id, amount: bidAmount, tokenUserId: user.id },
      (res) => {
        setIsPlacingBid(false);
        if (res.error) {
          setBidError(res.error);
          console.error('[AuctionDetail] Bid error:', res.error);
        }
      }
    );
  };

  const handleFollowToggle = () => {
    if (!auction || !user) return;
    const isFollowing = auction.follows.some((f) => f.userId === user.id);
    followMutation.mutate({ auctionId: id, isFollowing });
  };

  const canUserBid = () => {
    if (!user || !auction) return false;
    const now = new Date();
    if (
      auction.isClosed ||
      now < auction.startTime ||
      now > auction.endTime ||
      auction.sellerId === user.id ||
      auction.bids[0]?.userId === user.id
    ) {
      return false;
    }
    return true;
  };

  const getBidRestrictionMessage = () => {
    if (!user) return "Please log in to place bids";
    if (!auction) return "";
    const now = new Date();
    if (now < auction.startTime) return "The auction has not started yet.";
    if (auction.isClosed || now > auction.endTime) return "The auction has already ended.";
    if (auction.sellerId === user.id) return "You cannot bid on your own auction";
    if (auction.bids[0]?.userId === user.id) return "You have the current highest bid.";
    return "";
  };

  const getStatus = () => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    if (auction.isClosed || now > end) return "Ended";
    if (now < start) return "Upcoming";
    return "Live";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading auction details…</div>
          <p className="text-gray-500 mt-2">Please wait while we fetch the latest information</p>
        </div>
      </div>
    );
  }

  if (error || !auction) {
    console.error('[AuctionDetail] Failed to load auction:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Auction Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't load this auction. It may have been removed or the link is incorrect.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isFollowing = user && auction.follows.some((f) => f.userId === user.id);
  const status = getStatus();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Gavel className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Auction Details</h1>
          </div>
          <p className="text-blue-100">
            {status === "Live" ? "Bidding is currently active" : 
             status === "Upcoming" ? "Auction starts soon" : 
             "Auction has ended"}
          </p>
        </div>
      </div>

      {/* Main Content - Split Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Left Column - Image Gallery */}
          <div className="space-y-6">
            <AuctionImageGallery auction={auction} />
            
            {/* Countdown Timer - Desktop */}
            <div className="hidden lg:block">
              <CountdownTimer auction={auction} status={status} />
            </div>
          </div>

          {/* Right Column - Auction Info & Bidding */}
          <div className="space-y-6">
            {/* Auction Information */}
            <AuctionInfo
              auction={auction}
              user={user}
              isFollowing={isFollowing}
              followLoading={followMutation.isLoading}
              onFollowToggle={handleFollowToggle}
            />

            {/* Countdown Timer - Mobile */}
            <div className="lg:hidden">
              <CountdownTimer auction={auction} status={status} />
            </div>

            {/* Bid Section */}
            <BidSection
              auction={auction}
              canBid={canUserBid()}
              bidAmount={bidAmount}
              setBidAmount={setBidAmount}
              bidError={bidError}
              bidSuccess={bidSuccess}
              isPlacingBid={isPlacingBid}
              onPlaceBid={handlePlaceBid}
              restrictionMessage={getBidRestrictionMessage()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
