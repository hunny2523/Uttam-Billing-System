import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Billing from "./components/Billing";
import "./App.css";
import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "./services/auth.service";
import { Route, BrowserRouter as Router, Routes, Link } from "react-router-dom";
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
      <div className=" bg-gray-100 min-h-screen">
        {/* Navigation Bar */}
        <nav className="mb-2 bg-white p-4 shadow rounded flex gap-4 justify-between items-center">
          <div className="flex gap-4">
            <Link to="/" className="text-blue-600 hover:underline">
              Billing
            </Link>
            <Link to="/search" className="text-blue-600 hover:underline">
              Search Bills
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Billing />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </div>
    </Router>
  );
}
