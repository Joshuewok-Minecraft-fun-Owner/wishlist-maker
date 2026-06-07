const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const Streamer = {
  async createProfile(userId, streamerName, channelUrl = null, platform = null) {
    const id = uuidv4();
    const createdAt = new Date();

    const result = await pool.query(
      'INSERT INTO streamer_profiles (id, user_id, streamer_name, channel_url, platform, created_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id, userId, streamerName, channelUrl, platform, createdAt]
    );

    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await pool.query('SELECT * FROM streamer_profiles WHERE user_id = $1', [userId]);
    return result.rows[0];
  },

  async update(userId, streamerName, channelUrl, platform) {
    const result = await pool.query(
      'UPDATE streamer_profiles SET streamer_name = $1, channel_url = $2, platform = $3 WHERE user_id = $4 RETURNING *',
      [streamerName, channelUrl, platform, userId]
    );
    return result.rows[0];
  },

  async createDonationLink(userId, donationUrl, platform = 'generic') {
    const id = uuidv4();
    const createdAt = new Date();

    const result = await pool.query(
      'INSERT INTO streamer_donations (id, user_id, donation_url, platform, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, userId, donationUrl, platform, createdAt]
    );

    return result.rows[0];
  },

  async getDonationLinks(userId) {
    const result = await pool.query('SELECT * FROM streamer_donations WHERE user_id = $1', [userId]);
    return result.rows;
  },

  async toggleFollowerOnlyWishlist(wishlistId, followerOnly) {
    const result = await pool.query(
      'UPDATE wishlists SET follower_only = $1 WHERE id = $2 RETURNING *',
      [followerOnly, wishlistId]
    );
    return result.rows[0];
  },
};

module.exports = Streamer;
