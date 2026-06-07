const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
const WebScraper = require('../utils/scraper');

router.post('/scrape-url', authenticate, async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const data = await WebScraper.scrapeUrl(url);
    res.json(data);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape URL' });
  }
});

router.post('/scrape-multiple', authenticate, async (req, res) => {
  const { urls } = req.body;

  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'URLs array is required' });
  }

  try {
    const data = await WebScraper.scrapeMultiple(urls);
    res.json(data);
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape URLs' });
  }
});

module.exports = router;
