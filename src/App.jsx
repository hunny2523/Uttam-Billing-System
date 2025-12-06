import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Billing from "./components/Billing";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/AdminDashboard";
import "./App.css";
import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "./services/auth.service";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import SearchPage from "./components/SearchPage";
import { toast } from "react-toastify";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
    setAuthLoading(false);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.info("Logged out successfully");
  };

  if (authLoading) {
    return <h1 className="text-center mt-10 text-lg">Loading...</h1>; // Show loading state
  }

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {/* Navigation Bar */}
        <Navbar user={user} onLogout={handleLogout} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Billing />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}
