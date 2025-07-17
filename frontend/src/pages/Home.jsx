import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [auctions, setAuctions] = useState([]);

  useEffect(() => {
    axios.get("/auctions").then((res) => {
      setAuctions(res.data);
    });
  }, []);

  return (
    <div className="grid gap-4 max-w-4xl mx-auto mt-6">
      <h1 className="text-2xl font-bold mb-4">All Auctions</h1>
      {auctions.map((a) => (
        <Link
          key={a.id}
          to={`/auction/${a.id}`}
          className="border p-4 rounded shadow"
        >
          <h2 className="text-lg font-semibold">{a.title}</h2>
          <p>Ends at: {new Date(a.endTime).toLocaleString()}</p>
        </Link>
      ))}
    </div>
  );
}
