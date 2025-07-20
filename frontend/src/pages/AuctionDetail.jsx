// src/components/AuctionDetail.jsx
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import AuctionStaticInfo from "./AuctionStaticInfo";
import AuctionLiveSection from "./AuctionLiveSection";

const fetchAuction = async (id) => {
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
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const followMutation = useMutation({
    mutationFn: toggleFollowAPI,
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
  }, [socket, auction, id]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white flex items-center justify-center">
        <div className="text-xl font-semibold animate-pulse">Loading auction…</div>
      </div>
  );
}

  if (error || !auction) return <div className="text-red-500 p-10">Failed to load auction</div>;

  const isFollowing = user && auction.follows.some((f) => f.userId === user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white text-gray-900 rounded-2xl shadow-2xl p-8 space-y-8">
        <AuctionStaticInfo
          auction={auction}
          user={user}
          isFollowing={isFollowing}
          followLoading={followMutation.isLoading}
          onFollowToggle={handleFollowToggle}
        />
        <div className="border rounded-xl p-4 bg-blue-50 bg-opacity-70 backdrop-blur-sm shadow-lg space-y-3">
          <AuctionLiveSection
          auction={auction}
          user={user}
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
  );
}
