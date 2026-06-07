import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-pink-600">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-20 text-white">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">🎁 Wishlist Maker</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Create, share, and manage wishlists with ease
          </p>

          {!user ? (
            <div className="flex gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="bg-purple-800 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-900 transition"
              >
                Login
              </Link>
            </div>
          ) : (
            <Link
              to="/dashboard"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition inline-block"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 bg-white rounded-t-3xl">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-bold mb-2">Create Wishlists</h3>
            <p className="text-gray-600">Easily create multiple wishlists for different occasions</p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🔗</div>
            <h3 className="text-xl font-bold mb-2">Auto-Scrape</h3>
            <p className="text-gray-600">Add items by pasting URLs - we fetch the details automatically</p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🎤</div>
            <h3 className="text-xl font-bold mb-2">For Streamers</h3>
            <p className="text-gray-600">Special features for content creators and streamers</p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold mb-2">Share & Collaborate</h3>
            <p className="text-gray-600">Share wishlists with friends and family</p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="text-xl font-bold mb-2">Track Items</h3>
            <p className="text-gray-600">Mark items as purchased and track your progress</p>
          </div>

          <div className="text-center">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold mb-2">Discover</h3>
            <p className="text-gray-600">Browse public wishlists from other users</p>
          </div>
        </div>
      </div>
    </div>
  );
}
