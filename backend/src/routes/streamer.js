const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const Streamer = require('../models/Streamer');

router.post('/profile', authenticate, async (req, res) => {
  const { streamer_name, channel_url, platform } = req.body;

  try {
    const profile = await Streamer.createProfile(req.userId, streamer_name, channel_url, platform);
    res.status(201).json(profile);
  } catch (error) {
    console.error('Error creating streamer profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

router.get('/profile/user/:userId', async (req, res) => {
  try {
    const profile = await Streamer.findByUserId(req.params.userId);
    if (!profile) {
      return res.status(404).json({ error: 'Streamer profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching streamer profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/profile', authenticate, async (req, res) => {
  const { streamer_name, channel_url, platform } = req.body;

  try {
    const profile = await Streamer.update(req.userId, streamer_name, channel_url, platform);
    res.json(profile);
  } catch (error) {
    console.error('Error updating streamer profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.post('/donation-link', authenticate, async (req, res) => {
  const { donation_url, platform } = req.body;

  if (!donation_url) {
    return res.status(400).json({ error: 'Donation URL is required' });
  }

  try {
    const link = await Streamer.createDonationLink(req.userId, donation_url, platform || 'generic');
    res.status(201).json(link);
  } catch (error) {
    console.error('Error creating donation link:', error);
    res.status(500).json({ error: 'Failed to create donation link' });
  }
});

router.get('/donation-links', authenticate, async (req, res) => {
  try {
    const links = await Streamer.getDonationLinks(req.userId);
    res.json(links);
  } catch (error) {
    console.error('Error fetching donation links:', error);
    res.status(500).json({ error: 'Failed to fetch donation links' });
  }
});

module.exports = router;
