import { useState } from "react";
import { login, logout } from "../services/auth.service";
import { toast } from "react-toastify";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const { user } = await login(email, password);
      toast.success("Login successful!");
      onLogin(user); // Pass user data to parent component
    } catch (error) {
      // Error is already handled by interceptor
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    logout();
    onLogin(null);
    toast.info("Logged out successfully");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-sm mx-auto mt-20">
      <h2 className="text-lg font-bold mb-2">Uttam Masala Billing System</h2>
      <h3 className="text-md mb-4 text-gray-600">Login</h3>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border mb-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border mb-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-500 text-white rounded-lg disabled:bg-blue-300 hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}
