import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, PlusCircle } from "lucide-react";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  return (
    <nav className="bg-blue-950 text-white shadow-lg py-3 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold text-white hover:text-blue-300 transition">
            SnapAuction
          </Link>

          {user && (
            <div className="flex gap-4 text-sm font-medium">
              <Link to="/" className="hover:text-blue-300 transition">Home</Link>
              <Link to="/dashboard" className="hover:text-blue-300 transition">Dashboard</Link>
              <Link
                to="/create-auction"
                className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded transition"
              >
                <PlusCircle size={16} />
                Create
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          {user ? (
            <>
              <span className="text-white bg-blue-800 px-3 py-1 rounded-full">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300 transition">
                Login
              </Link>
              <Link to="/signup" className="hover:text-blue-300 transition">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
