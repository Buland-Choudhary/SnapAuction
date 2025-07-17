import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function AuctionDetail() {
  const { id } = useParams();
  const [auction, setAuction] = useState(null);

  useEffect(() => {
    axios.get(`/auctions/${id}`).then((res) => {
      setAuction(res.data);
    });
  }, [id]);

  if (!auction) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-6">
      <h1 className="text-3xl font-bold">{auction.title}</h1>
      <p className="text-gray-700">{auction.description}</p>

      <div className="text-sm text-gray-500">
        Created by <strong>{auction.seller.name}</strong> • 
        Ends on <strong>{new Date(auction.endTime).toLocaleString()}</strong>
      </div>

      <div className="border p-4 rounded bg-gray-100">
        <p><strong>Base Price:</strong> ${auction.basePrice}</p>
        <p><strong>Current Price:</strong> ${auction.currentPrice}</p>
        <p><strong>Min Increment:</strong> ${auction.minIncrement}</p>
        {auction.maxIncrement && (
          <p><strong>Max Increment:</strong> ${auction.maxIncrement}</p>
        )}
        <p><strong>Status:</strong> {auction.isClosed ? "Closed" : "Live"}</p>
        {auction.winner && (
          <p><strong>Winner:</strong> {auction.winner.name}</p>
        )}
      </div>

      {/* Images */}
      {auction.images?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mt-6">Images</h2>
          <div className="flex flex-wrap gap-4 mt-2">
            {auction.images.map((img) => (
              <img
                key={img.id}
                src={img.url}
                alt="Auction item"
                className="w-48 h-48 object-cover border rounded"
              />
            ))}
          </div>
        </div>
      )}

      {/* Bid History */}
      <div>
        <h2 className="text-xl font-semibold mt-6">Bid History</h2>
        {auction.bids.length > 0 ? (
          <ul className="mt-2 space-y-1">
            {auction.bids.map((bid) => (
              <li key={bid.id} className="text-sm">
                <span className="font-medium">{bid.user.name}</span> bid $
                {bid.amount} at{" "}
                {new Date(bid.createdAt).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bids yet.</p>
        )}
      </div>

      {/* Followers */}
      <div>
        <h2 className="text-xl font-semibold mt-6">Followers</h2>
        <p>{auction.follows.length} user(s) following this auction</p>
      </div>
    </div>
  );
}
