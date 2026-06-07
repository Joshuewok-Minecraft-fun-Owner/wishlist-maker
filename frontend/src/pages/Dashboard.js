import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, token } = useAuthStore();
  const [wishlists, setWishlists] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && token) {
      fetchWishlists();
    }
  }, [user, token]);

  const fetchWishlists = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wishlists/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setWishlists(data);
    } catch (error) {
      toast.error('Failed to fetch wishlists');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/wishlists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, is_public: isPublic }),
      });
      const data = await response.json();
      setWishlists([data, ...wishlists]);
      setName('');
      setDescription('');
      setIsPublic(false);
      setShowForm(false);
      toast.success('Wishlist created!');
    } catch (error) {
      toast.error('Failed to create wishlist');
    }
  };

  const handleDeleteWishlist = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await fetch(`http://localhost:5000/api/wishlists/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlists(wishlists.filter(w => w.id !== id));
      toast.success('Wishlist deleted');
    } catch (error) {
      toast.error('Failed to delete wishlist');
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please login first</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Wishlists</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
        >
          <FiPlus /> New Wishlist
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleCreateWishlist} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                rows="3"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="public" className="text-sm font-medium text-gray-700">
                Make public
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : wishlists.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No wishlists yet. Create one!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlists.map(wishlist => (
            <div key={wishlist.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{wishlist.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{wishlist.description || 'No description'}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{wishlist.itemCount || 0} items</span>
                <div className="flex gap-2">
                  <a
                    href={`/wishlist/${wishlist.id}`}
                    className="text-purple-600 hover:text-purple-700"
                  >
                    <FiEdit2 />
                  </a>
                  <button
                    onClick={() => handleDeleteWishlist(wishlist.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
