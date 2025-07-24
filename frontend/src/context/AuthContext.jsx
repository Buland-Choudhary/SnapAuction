import { createContext, useContext, useEffect, useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

  const login = async (email, password) => {
    setAuthError("");
    try {
      const res = await axios.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      console.log(`[AUTH] User logged in: ${res.data.user.email}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("[AUTH] Login error:", err);
      setAuthError(err.response?.data?.message || "Login failed");
      throw err;
    }
  };

  const signup = async (name, email, password) => {
    setAuthError("");
    try {
      const res = await axios.post("/auth/signup", { name, email, password });
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      console.log(`[AUTH] User signed up: ${res.data.user.email}`);
      navigate("/");
    } catch (err) {
      console.error("[AUTH] Signup error:", err);
      setAuthError(err.response?.data?.message || "Signup failed");
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    console.log("[AUTH] User logged out");
    navigate("/login");
  };

  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      setUser(null);
      if (err.response) {
        console.warn("[AUTH] fetchUser error:", err.response.data.message);
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchUser().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
