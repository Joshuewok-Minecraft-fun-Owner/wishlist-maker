const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Wishlist = {
  async create(userId, name, description = '', isPublic = false) {
    const id = uuidv4();
    const createdAt = new Date();

    const result = await pool.query(
      'INSERT INTO wishlists (id, user_id, name, description, is_public, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, userId, name, description, isPublic, createdAt]
    );

    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query('SELECT * FROM wishlists WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await pool.query('SELECT * FROM wishlists WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    return result.rows;
  },

  async update(id, name, description, isPublic) {
    const result = await pool.query(
      'UPDATE wishlists SET name = $1, description = $2, is_public = $3 WHERE id = $4 RETURNING *',
      [name, description, isPublic, id]
    );
    return result.rows[0];
  },

  async delete(id) {
    await pool.query('DELETE FROM wishlists WHERE id = $1', [id]);
  },

  async getPublic(limit = 20, offset = 0) {
    const result = await pool.query(
      'SELECT w.*, u.username FROM wishlists w JOIN users u ON w.user_id = u.id WHERE w.is_public = true ORDER BY w.created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },
};

module.exports = Wishlist;
