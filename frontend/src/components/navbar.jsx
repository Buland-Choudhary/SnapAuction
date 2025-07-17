import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();

  if (loading) return null; // Optional: show loading spinner instead

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex gap-4 items-center">
        <Link to="/" className="text-xl font-bold">
          SnapAuction
        </Link>
        {user && (
          <>
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span className="mr-2">{user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-2 hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
