import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function WishlistDetail() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [wishlist, setWishlist] = useState(null);
  const [items, setItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemUrl, setItemUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [id]);

  const fetchWishlist = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlists/${id}`);
      const data = await response.json();
      setWishlist(data);
      setItems(data.items || []);
    } catch (error) {
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to add items');
      return;
    }

    try {
      let itemData = {
        wishlist_id: id,
        name: itemName,
        description: '',
        price: null,
        image_url: null,
        source_url: itemUrl || null,
      };

      // If URL provided, scrape it
      if (itemUrl) {
        try {
          const scrapeResponse = await fetch('http://localhost:5000/api/scraper/scrape-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ url: itemUrl }),
          });
          const scrapeData = await scrapeResponse.json();
          itemData = {
            ...itemData,
            name: scrapeData.title || itemName,
            description: scrapeData.description || '',
            price: scrapeData.price,
            image_url: scrapeData.imageUrl,
          };
        } catch (scrapeError) {
          console.error('Scraping failed, using manual data');
        }
      }

      const response = await fetch('http://localhost:5000/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(itemData),
      });

      const newItem = await response.json();
      setItems([newItem, ...items]);
      setItemName('');
      setItemUrl('');
      setShowAddForm(false);
      toast.success('Item added!');
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleToggleItem = async (itemId, completed) => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:5000/api/items/${itemId}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const updated = await response.json();
      setItems(items.map(item => (item.id === itemId ? updated : item)));
    } catch (error) {
      toast.error('Failed to update item');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await fetch(`http://localhost:5000/api/items/${itemId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(items.filter(item => item.id !== itemId));
      toast.success('Item deleted');
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading...</div>;
  }

  if (!wishlist) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Wishlist not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{wishlist.name}</h1>
        <p className="text-gray-600 mb-4">{wishlist.description}</p>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-gray-500">{items.length} items</span>
          {token && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
            >
              <FiPlus /> Add Item
            </button>
          )}
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL (optional)</label>
              <input
                type="url"
                value={itemUrl}
                onChange={(e) => setItemUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <p className="text-xs text-gray-500 mt-1">Paste a product link and we'll fetch details automatically</p>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Add Item
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className={`rounded-lg shadow overflow-hidden ${item.completed ? 'bg-gray-100' : 'bg-white'}`}>
            {item.image_url && (
              <img src={item.image_url} alt={item.name} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h3 className={`font-bold text-lg mb-2 ${item.completed ? 'line-through text-gray-500' : ''}`}>
                {item.name}
              </h3>
              {item.description && (
                <p className="text-gray-600 text-sm mb-2">{item.description.substring(0, 100)}...</p>
              )}
              {item.price && (
                <p className="text-lg font-semibold text-purple-600 mb-4">${item.price}</p>
              )}
              {item.source_url && (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm underline mb-4 block">
                  View Product
                </a>
              )}
              {token && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleItem(item.id, !item.completed)}
                    className={`flex-1 py-2 rounded-lg transition flex items-center justify-center gap-2 ${
                      item.completed
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    <FiCheck /> {item.completed ? 'Undo' : 'Done'}
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No items yet. {token ? 'Add one to get started!' : 'Login to add items.'}
        </div>
      )}
    </div>
  );
}
