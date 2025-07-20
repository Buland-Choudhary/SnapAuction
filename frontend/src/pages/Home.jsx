import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);        // ← track loading
  const [error, setError] = useState(null);            // ← optional: track errors

  useEffect(() => {
    setLoading(true);
    axios.get("/auctions")
      .then((res) => {
        setAuctions(
          res.data.map((a) => ({
            ...a,
            startTime: new Date(a.startTime).toLocaleString(),
            endTime: new Date(a.endTime).toLocaleString(),
          }))
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load auctions.");
      })
      .finally(() => {
        setLoading(false);                              // ← done loading
      });
  }, []);

  const getStatus = (auction) => {
    const now = new Date();
    const start = new Date(auction.startTime);
    const end = new Date(auction.endTime);

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Live";
    return "Ended";
  };

  const statusColor = {
    Upcoming: "bg-yellow-500",
    Live:     "bg-green-600",
    Ended:    "bg-gray-500",
  };

  let content;
  if (loading) {
    content = (
      <div className="text-center text-gray-300">
        Loading auctions…
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center text-red-400">
        {error}
      </div>
    );
  } else if (auctions.length === 0) {
    content = (
      <div className="text-center text-gray-300">
        No auctions fetched.
      </div>
    );
  } else {
    content = (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((a) => {
          const status = getStatus(a);
          const firstImage = a.images?.[0]?.url || `https://picsum.photos/400/300`;

          return (
            <Link
              key={a.id}
              to={`/auction/${a.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 text-gray-900"
            >
              <img
                src={firstImage}
                alt={a.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />

              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold truncate">{a.title}</h2>
                <span
                  className={`text-xs px-2 py-1 rounded-full text-white ${statusColor[status]}`}
                >
                  {status}
                </span>
              </div>

              <p className="text-sm text-gray-600">
                Ends: {new Date(a.endTime).toLocaleString()}
              </p>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Browse Auctions</h1>
        {content}
      </div>
    </div>
  );
}
