const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Item = require('../models/Item');
const Wishlist = require('../models/Wishlist');

router.post('/', authenticate, async (req, res) => {
  const { wishlist_id, name, description, price, image_url, source_url } = req.body;

  if (!wishlist_id || !name) {
    return res.status(400).json({ error: 'Wishlist ID and name are required' });
  }

  try {
    // Verify ownership
    const wishlist = await Wishlist.findById(wishlist_id);
    if (!wishlist || wishlist.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const item = await Item.create(wishlist_id, name, description, price, image_url, source_url);
    res.status(201).json(item);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

router.put('/:id', authenticate, async (req, res) => {
  const { name, description, price, image_url, source_url } = req.body;

  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const wishlist = await Wishlist.findById(item.wishlist_id);
    if (wishlist.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await Item.update(req.params.id, name, description, price, image_url, source_url);
    res.json(updated);
  } catch (error) {
    console.error('Error updating item:', error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

router.patch('/:id/toggle', authenticate, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const wishlist = await Wishlist.findById(item.wishlist_id);
    if (wishlist.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updated = await Item.toggleCompleted(req.params.id, !item.completed);
    res.json(updated);
  } catch (error) {
    console.error('Error toggling item:', error);
    res.status(500).json({ error: 'Failed to toggle item' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const wishlist = await Wishlist.findById(item.wishlist_id);
    if (wishlist.user_id !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Item.delete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (error) {
    console.error('Error deleting item:', error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
