import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    axios.get("/users/dashboard").then((res) => {
      setDashboard(res.data);
    });
  }, []);

  if (!dashboard) return <div>Loading...</div>;

  const { created, follows, bids, wins } = dashboard;

  return (
    <div className="max-w-3xl mx-auto mt-6 space-y-8">
      <h1 className="text-2xl font-bold">My Dashboard</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">My Created Auctions</h2>
        {created.length ? (
          <ul className="list-disc list-inside space-y-1">
            {created.map((a) => (
              <li key={a.id}>
                <strong>{a.title}</strong> — ends{" "}
                {new Date(a.endTime).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No auctions created yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Auctions I Follow</h2>
        {follows.length ? (
          <ul className="list-disc list-inside space-y-1">
            {follows.map((a) => (
              <li key={a.id}>
                <strong>{a.title}</strong> — ends{" "}
                {new Date(a.endTime).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>You're not following any auctions.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">My Bids</h2>
        {bids.length ? (
          <ul className="list-disc list-inside space-y-1">
            {bids.map((b) => (
              <li key={b.id}>
                Bid of ${b.amount} on{" "}
                <em>{b.auction.title}</em> — ends{" "}
                {new Date(b.auction.endTime).toLocaleString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bids placed yet.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Auctions I've Won</h2>
        {wins.length ? (
          <ul className="list-disc list-inside space-y-1">
            {wins.map((a) => (
              <li key={a.id}>
                <strong>{a.title}</strong> — won at ${a.currentPrice}
              </li>
            ))}
          </ul>
        ) : (
          <p>No wins yet.</p>
        )}
      </section>
    </div>
  );
}
