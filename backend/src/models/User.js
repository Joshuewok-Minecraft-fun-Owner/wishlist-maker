const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = {
  async create(email, username, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    const createdAt = new Date();

    const result = await pool.query(
      'INSERT INTO users (id, email, username, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, created_at',
      [userId, email, username, hashedPassword, createdAt]
    );

    return result.rows[0];
  },

  async findByEmail(email) {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  async findById(id) {
    const result = await pool.query('SELECT id, email, username, bio, avatar_url, created_at FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  async findByUsername(username) {
    const result = await pool.query('SELECT id, email, username, bio, avatar_url, created_at FROM users WHERE username = $1', [username]);
    return result.rows[0];
  },

  async update(id, data) {
    const { bio, avatar_url } = data;
    const result = await pool.query(
      'UPDATE users SET bio = $1, avatar_url = $2 WHERE id = $3 RETURNING id, email, username, bio, avatar_url',
      [bio, avatar_url, id]
    );
    return result.rows[0];
  },

  async verifyPassword(password, hash) {
    return bcrypt.compare(password, hash);
  },
};

module.exports = User;
