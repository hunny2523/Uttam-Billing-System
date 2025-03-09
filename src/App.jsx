import { useEffect, useState } from "react";
import Auth from "./pages/Auth";
import Billing from "./components/Billing";
import "./App.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebaseconfig.js";

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

  return <div>{!user ? <Auth onLogin={setUser} /> : <Billing />}</div>;
}
