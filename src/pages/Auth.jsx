import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../firebaseconfig";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      onLogin(userCredential.user); // Pass user data to parent component
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    onLogin(null);
  };

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg max-w-sm mx-auto">
      <h2 className="text-lg font-bold mb-2">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 border mb-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 border mb-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full p-2 bg-blue-500 text-white rounded-lg"
      >
        Login
      </button>
      <button
        onClick={handleLogout}
        className="mt-2 w-full p-2 bg-red-500 text-white rounded-lg"
      >
        Logout
      </button>
    </div>
  );
}
