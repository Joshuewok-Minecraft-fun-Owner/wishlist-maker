const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Item = {
  async create(wishlistId, name, description = '', price = null, imageUrl = null, sourceUrl = null) {
    const id = uuidv4();
    const createdAt = new Date();

    const result = await pool.query(
      'INSERT INTO items (id, wishlist_id, name, description, price, image_url, source_url, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [id, wishlistId, name, description, price, imageUrl, sourceUrl, createdAt]
    );

    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByWishlistId(wishlistId) {
    const result = await pool.query('SELECT * FROM items WHERE wishlist_id = $1 ORDER BY created_at DESC', [wishlistId]);
    return result.rows;
  },

  async update(id, name, description, price, imageUrl, sourceUrl) {
    const result = await pool.query(
      'UPDATE items SET name = $1, description = $2, price = $3, image_url = $4, source_url = $5 WHERE id = $6 RETURNING *',
      [name, description, price, imageUrl, sourceUrl, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM items WHERE id = $1', [id]);
  },

  async toggleCompleted(id, completed) {
    const result = await pool.query(
      'UPDATE items SET completed = $1, completed_at = $2 WHERE id = $3 RETURNING *',
      [completed, completed ? new Date() : null, id]
    );
    return result.rows[0];
  },
};

module.exports = Item;
