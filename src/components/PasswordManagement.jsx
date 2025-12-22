import { useState, useEffect } from "react";
import {
  changePassword,
  getAllUsers,
  adminResetPassword,
} from "../services/user.service";
import { toast } from "react-toastify";
import { isAdmin } from "../services/auth.service";

export default function PasswordManagement() {
  const [activeTab, setActiveTab] = useState("own");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const userIsAdmin = isAdmin();

  // Own password change
  const [ownCurrentPassword, setOwnCurrentPassword] = useState("");
  const [ownNewPassword, setOwnNewPassword] = useState("");
  const [ownConfirmPassword, setOwnConfirmPassword] = useState("");

  // Admin reset password
  const [selectedUserId, setSelectedUserId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [confirmUserPassword, setConfirmUserPassword] = useState("");

  // Fetch users for admin
  useEffect(() => {
    if (userIsAdmin && activeTab === "admin") {
      fetchUsers();
    }
  }, [activeTab, userIsAdmin]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleChangeOwnPassword = async (e) => {
    e.preventDefault();

    if (!ownCurrentPassword || !ownNewPassword || !ownConfirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (ownNewPassword !== ownConfirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (ownNewPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      await changePassword(ownCurrentPassword, ownNewPassword);
      toast.success("Password changed successfully!");
      setOwnCurrentPassword("");
      setOwnNewPassword("");
      setOwnConfirmPassword("");
    } catch (error) {
      // Error already handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const handleAdminResetPassword = async (e) => {
    e.preventDefault();

    if (
      !selectedUserId ||
      !adminPassword ||
      !newUserPassword ||
      !confirmUserPassword
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newUserPassword !== confirmUserPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newUserPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);
    try {
      const result = await adminResetPassword(
        selectedUserId,
        newUserPassword,
        adminPassword
      );
      toast.success(result.message);
      setSelectedUserId("");
      setAdminPassword("");
      setNewUserPassword("");
      setConfirmUserPassword("");
    } catch (error) {
      // Error already handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Password Management</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab("own")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "own"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-600 hover:text-green-600"
          }`}
        >
          Change My Password
        </button>
        {userIsAdmin && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "admin"
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-600 hover:text-green-600"
            }`}
          >
            Reset User Password (Admin)
          </button>
        )}
      </div>

      {/* Change Own Password */}
      {activeTab === "own" && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Change Your Password</h3>
          <form onSubmit={handleChangeOwnPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={ownCurrentPassword}
                onChange={(e) => setOwnCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={ownNewPassword}
                onChange={(e) => setOwnNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters long
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={ownConfirmPassword}
                onChange={(e) => setOwnConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      )}

      {/* Admin Reset Password */}
      {activeTab === "admin" && userIsAdmin && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Reset User Password</h3>
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ You need to enter your own password to confirm this action.
            </p>
          </div>
          <form onSubmit={handleAdminResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select User
              </label>
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              >
                <option value="">-- Select User --</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Admin Password (for verification)
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password for User
              </label>
              <input
                type="password"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
                minLength={8}
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 8 characters long
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmUserPassword}
                onChange={(e) => setConfirmUserPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              {loading ? "Resetting..." : "Reset User Password"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
