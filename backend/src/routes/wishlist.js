const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Wishlist = require('../models/Wishlist');
const Item = require('../models/Item');

router.post('/', authenticate, async (req, res) => {
  const { name, description, is_public } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  try {
    const wishlist = await Wishlist.create(req.userId, name, description || '', is_public || false);
    res.status(201).json(wishlist);
  } catch (error) {
    console.error('Error creating wishlist:', error);
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
});

router.get('/mine', authenticate, async (req, res) => {
  try {
    const wishlists = await Wishlist.findByUserId(req.userId);
    const wishlistsWithCounts = await Promise.all(
      wishlists.map(async (w) => {
        const items = await Item.findByWishlistId(w.id);
        return { ...w, itemCount: items.length };
      })
    );
    res.json(wishlistsWithCounts);
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    res.status(500).json({ error: 'Failed to fetch wishlists' });
  }
});

router.get('/public', async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;

  try {
    const wishlists = await Wishlist.getPublic(limit, offset);
    res.json(wishlists);
  } catch (error) {
    console.error('Error fetching public wishlists:', error);
    res.status(500).json({ error: 'Failed to fetch wishlists' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    if (!wishlist.is_public && (!req.userId || wishlist.user_id !== req.userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const items = await Item.findByWishlistId(wishlist.id);
    res.json({ ...wishlist, items });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const { name, description, is_public } = req.body;

  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist || wishlist.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await Wishlist.update(req.params.id, name, description, is_public);
    res.json(updated);
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const wishlist = await Wishlist.findById(req.params.id);
    if (!wishlist || wishlist.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Wishlist.delete(req.params.id);
    res.json({ message: 'Wishlist deleted' });
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    res.status(500).json({ error: 'Failed to delete wishlist' });
  }
});

module.exports = router;
