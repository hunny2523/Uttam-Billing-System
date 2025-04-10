import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Billing from "./components/Billing";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig.js";
import { Route, BrowserRouter as Router, Routes, Link } from "react-router-dom";
import SearchPage from "./components/SearchPage";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        <nav className="mb-2 bg-white p-4 shadow rounded flex gap-4">
          <Link to="/" className="text-blue-600 hover:underline">
            Billing
          </Link>
          <Link to="/search" className="text-blue-600 hover:underline">
            Search Bills
          </Link>
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
