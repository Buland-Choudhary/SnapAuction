import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AuctionDetail from "./pages/AuctionDetail";
import Navbar from "./components/navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateAuction from "./pages/CreateAuction";
import VisitNotifier from "./components/VisitNotifier";


const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <VisitNotifier /> {/* ← Notification happens here */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-auction"
            element={<ProtectedRoute><CreateAuction /></ProtectedRoute>}
          />
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800">
              <div className="text-center text-white">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl">Page Not Found</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;
