import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios";
import React from "react";

const fetchDashboard = async () => {
  const response = await axios.get("/users/dashboard");
  const data = response.data;
  return {
    ...data,
    created: data.created.map((a) => ({
      ...a,
      endTime: new Date(a.endTime).toLocaleString(),
    })),
    follows: data.follows.map((a) => ({
      ...a,
      endTime: new Date(a.endTime).toLocaleString(),
    })),
    bids: data.bids.map((b) => ({
      ...b,
      auction: {
        ...b.auction,
        endTime: new Date(b.auction.endTime).toLocaleString(),
      },
      // b.isHighest is already present
    })),
    wins: data.wins.map((a) => ({
      ...a,
      // format other fields if needed…
    })),
  };
};

export default function Dashboard() {
  const { data: dashboard, isLoading, error } = useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboard,
    staleTime: 60 * 1000,
  });

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="text-xl font-semibold text-red-400">
          Failed to load dashboard
        </div>
      </div>
    );

  const { created, follows, bids, wins } = dashboard;

  const Section = ({ title, children }) => (
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-3">
        {title}
      </h2>
      {children}
    </section>
  );

  const AuctionList = ({ items, renderItem }) =>
    items.length ? (
      <ul className="space-y-2">{items.map(renderItem)}</ul>
    ) : (
      <p className="text-gray-500">No entries found.</p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 px-4 py-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white">My Dashboard</h1>

        {/* My Created Auctions */}
        <Section title="My Created Auctions">
          <AuctionList
            items={created}
            renderItem={(a) => (
              <li key={a.id} className="text-gray-800">
                <strong>{a.title}</strong> — ends{" "}
                <span className="text-sm text-gray-600">{a.endTime}</span>
              </li>
            )}
          />
        </Section>

        {/* Auctions I Follow */}
        <Section title="Auctions I Follow">
          <AuctionList
            items={follows}
            renderItem={(a) => (
              <li key={a.id} className="text-gray-800">
                <strong>{a.title}</strong> — ends{" "}
                <span className="text-sm text-gray-600">{a.endTime}</span>
              </li>
            )}
          />
        </Section>

        {/* My Bids */}
        <Section title="My Bids">
          <AuctionList
            items={bids}
            renderItem={(b) => (
              <li
                key={b.id}
                className={`flex justify-between items-center p-2 rounded ${
                  b.isHighest
                    ? "bg-green-50 border border-green-200"
                    : "bg-gray-50"
                }`}
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-800">
                      Bid of <strong>${b.amount}</strong> on{" "}
                      <em>{b.auction.title}</em>
                    </span>
                    {b.isHighest && (
                      <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                        Highest
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Ends: {b.auction.endTime}
                  </div>
                </div>
                {!b.isHighest && (
                  <div className="text-sm text-red-500">
                    Outbid (current: ${b.auction.currentPrice})
                  </div>
                )}
              </li>
            )}
          />
        </Section>

        {/* Auctions I've Won */}
        <Section title="Auctions I've Won">
          <AuctionList
            items={wins}
            renderItem={(a) => (
              <li key={a.id} className="text-gray-800">
                <strong>{a.title}</strong> — won at{" "}
                <span className="text-green-700 font-semibold">
                  ${a.currentPrice}
                </span>
              </li>
            )}
          />
        </Section>
      </div>
    </div>
  );
}
