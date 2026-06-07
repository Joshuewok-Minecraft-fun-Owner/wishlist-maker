import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold">
            🎁 Wishlist Maker
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:opacity-80 transition">
                  Dashboard
                </Link>
                <Link to={`/profile/${user.username}`} className="hover:opacity-80 transition">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:opacity-80 transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-purple-600 px-4 py-2 rounded font-semibold hover:bg-gray-100 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
