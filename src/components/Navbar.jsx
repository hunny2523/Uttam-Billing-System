import { useState } from "react";
import { Link } from "react-router-dom";
import { isAdmin } from "../services/auth.service";
import CloseIcon from "../icons/CloseIcon";

export default function Navbar({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userIsAdmin = isAdmin();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg">
      {/* Desktop & Mobile Header */}
      <div className="flex justify-between items-center px-4 py-3">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">🛒 Uttam Masala</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            to="/"
            className="hover:bg-green-500 px-3 py-2 rounded transition"
          >
            Billing
          </Link>

          {/* Admin-only links */}
          {userIsAdmin && (
            <>
              <Link
                to="/search"
                className="hover:bg-green-500 px-3 py-2 rounded transition"
              >
                Search Bills
              </Link>
              <Link
                to="/admin"
                className="hover:bg-green-500 px-3 py-2 rounded transition"
              >
                Dashboard
              </Link>
              <Link
                to="/items"
                className="hover:bg-green-500 px-3 py-2 rounded transition"
              >
                Items
              </Link>
            </>
          )}
        </div>

        {/* Desktop User Info & Logout */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-sm bg-green-500 px-3 py-1 rounded-full">
            {user?.email} ({user?.role})
          </span>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded transition font-semibold"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          {isMenuOpen ? (
            <div className="w-6 h-6 flex items-center justify-center">
              <CloseIcon />
            </div>
          ) : (
            <>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
              <div className="w-6 h-0.5 bg-white"></div>
            </>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-green-600 border-t border-green-500">
          <div className="flex flex-col gap-2 px-4 py-3">
            {/* Navigation Links */}
            <Link
              to="/"
              onClick={closeMenu}
              className="w-full text-left px-4 py-3 hover:bg-green-500 rounded transition"
            >
              📄 Billing
            </Link>

            {/* Admin-only links */}
            {userIsAdmin && (
              <>
                <Link
                  to="/search"
                  onClick={closeMenu}
                  className="w-full text-left px-4 py-3 hover:bg-green-500 rounded transition"
                >
                  🔍 Search Bills
                </Link>
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="w-full text-left px-4 py-3 hover:bg-green-500 rounded transition"
                >
                  📊 Dashboard
                </Link>
                <Link
                  to="/items"
                  onClick={closeMenu}
                  className="w-full text-left px-4 py-3 hover:bg-green-500 rounded transition"
                >
                  📦 Items
                </Link>
              </>
            )}

            {/* Divider */}
            <div className="border-t border-green-500 my-2"></div>

            {/* User Info */}
            <div className="px-4 py-2">
              <p className="text-xs text-green-100 mb-2">Logged in as:</p>
              <p className="text-sm font-semibold truncate">{user?.email}</p>
              <p className="text-xs text-green-200 mt-1">Role: {user?.role}</p>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                closeMenu();
                onLogout();
              }}
              className="w-full text-left px-4 py-3 bg-red-500 hover:bg-red-600 rounded transition font-semibold mt-2"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
