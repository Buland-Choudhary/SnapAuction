import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { useState } from "react";

const fetchAuctions = async () => {
  const response = await axios.get("/auctions");
  return response.data.map((a) => ({
    ...a,
    startTime: new Date(a.startTime).toLocaleString(),
    endTime:   new Date(a.endTime).toLocaleString(),
  }));
};

export default function Home() {
  const [filter, setFilter] = useState("All");  // ← default to "All"
  const {
    data: auctions = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["auctions"],
    queryFn: fetchAuctions,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const getStatus = (auction) => {
    const now   = new Date();
    const start = new Date(auction.startTime);
    const end   = new Date(auction.endTime);

    if (now < start)             return "Upcoming";
    if (now >= start && now <= end) return "Live";
    return "Ended";
  };

  // apply the filter
  const filtered = auctions.filter((a) => {
    if (filter === "All") return true;
    return getStatus(a) === filter;
  });

  const statusColor = {
    Upcoming: "bg-yellow-500",
    Live:     "bg-green-600",
    Ended:    "bg-gray-500",
  };

  let content;
  if (loading) {
    content = <div className="text-center text-gray-300">Loading auctions…</div>;
  } else if (error) {
    content = <div className="text-center text-red-400">Failed to load auctions.</div>;
  } else if (filtered.length === 0) {
    content = <div className="text-center text-gray-300">No auctions to display.</div>;
  } else {
    content = (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((a) => {
          const status     = getStatus(a);
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

  const filters = ["All", "Upcoming", "Live", "Ended"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 py-10 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading + Filters */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Browse Auctions</h1>
          <div className="flex space-x-2">
            {filters.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`
                  px-4 py-1 rounded-full text-sm font-medium
                  ${filter === s 
                    ? "bg-white text-gray-900"      // active
                    : "bg-white bg-opacity-20 text-white hover:bg-opacity-30"} // inactive
                `}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {content}
      </div>
    </div>
  );
}
