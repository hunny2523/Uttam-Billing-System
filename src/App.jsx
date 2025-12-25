import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Auth from "./pages/Auth";
import Billing from "./components/Billing";
import Navbar from "./components/Navbar";
import AdminDashboard from "./components/AdminDashboard";
import SearchPage from "./components/SearchPage";
import ItemsManagement from "./components/ItemsManagement";
import PasswordManagement from "./components/PasswordManagement";
import Settings from "./components/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";
import {
  getCurrentUser,
  isAuthenticated,
  logout,
} from "./services/auth.service";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { toast } from "react-toastify";

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
    },
  },
});

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="bg-gray-100 min-h-screen">
          {/* Navigation Bar */}
          <Navbar user={user} onLogout={handleLogout} />

          {/* Routes with Role-Based Access Control */}
          <Routes>
            {/* Billing Page - Staff & Admin can access */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <Billing />
                </ProtectedRoute>
              }
            />

            {/* Search Page - Admin only */}
            <Route
              path="/search"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <SearchPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Dashboard - Admin only */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Items Management - Admin only */}
            <Route
              path="/items"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <ItemsManagement />
                </ProtectedRoute>
              }
            />

            {/* Password Management - Admin only */}
            <Route
              path="/password"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <PasswordManagement />
                </ProtectedRoute>
              }
            />

            {/* Settings - Admin & Staff can access */}
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}>
                  <Settings />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}
