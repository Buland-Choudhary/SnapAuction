import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PlusCircle, LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="bg-[#172554] text-white px-6 py-4 flex justify-between items-center">
      {/* Left Section: Logo + Nav Links */}
      <div className="flex items-center gap-6">
        <Link to="/" className="text-2xl font-bold">
          SnapAuction
        </Link>

        {user && (
          <div className="flex gap-4 items-center text-sm font-medium">
            <Link to="/" className="hover:underline">Home</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link
              to="/create-auction"
              className="flex items-center gap-1 bg-green-600 px-3 py-1.5 rounded hover:bg-green-700"
            >
              <PlusCircle size={16} />
              Create Auction
            </Link>
          </div>
        )}
      </div>

      {/* Right Section: Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm">{user.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-1 bg-red-600 px-3 py-1.5 rounded hover:bg-red-700"
            >
              <LogOut size={16} />
              Logout
            </button>
          </>
        ) : (
          <div className="flex gap-3 text-sm">
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
