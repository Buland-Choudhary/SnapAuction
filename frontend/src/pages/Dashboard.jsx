import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    axios.get("/users/dashboard").then((res) => {
      setDashboard(res.data);
    });
  }, []);

  if (!dashboard)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white">
        <div className="text-xl font-semibold">Loading dashboard...</div>
      </div>
    );

  const { created, follows, bids, wins } = dashboard;

  const Section = ({ title, children }) => (
    <section className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg md:text-xl font-semibold text-blue-800 mb-3">{title}</h2>
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

        {/* Created Auctions */}
        <Section title="My Created Auctions">
          <AuctionList
            items={created}
            renderItem={(a) => (
              <li key={a.id} className="text-gray-800">
                <strong>{a.title}</strong> — ends{" "}
                <span className="text-sm text-gray-600">
                  {new Date(a.endTime).toLocaleString()}
                </span>
              </li>
            )}
          />
        </Section>

        {/* Followed Auctions */}
        <Section title="Auctions I Follow">
          <AuctionList
            items={follows}
            renderItem={(a) => (
              <li key={a.id} className="text-gray-800">
                <strong>{a.title}</strong> — ends{" "}
                <span className="text-sm text-gray-600">
                  {new Date(a.endTime).toLocaleString()}
                </span>
              </li>
            )}
          />
        </Section>

        {/* My Bids */}
        <Section title="My Bids">
          <AuctionList
            items={bids}
            renderItem={(b) => (
              <li key={b.id} className="text-gray-800">
                Bid of <strong>${b.amount}</strong> on{" "}
                <em>{b.auction.title}</em> — ends{" "}
                <span className="text-sm text-gray-600">
                  {new Date(b.auction.endTime).toLocaleString()}
                </span>
              </li>
            )}
          />
        </Section>

        {/* Won Auctions */}
        <Section title="Auctions I've Won">
          <AuctionList
            items={wins}
            renderItem={(a) => (
              <li key={a.id} className="text-gray-800">
                <strong>{a.title}</strong> — won at{" "}
                <span className="text-green-700 font-semibold">${a.currentPrice}</span>
              </li>
            )}
          />
        </Section>
      </div>
    </div>
  );
}
