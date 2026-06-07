const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../config/config');

const WebScraper = {
  async scrapeUrl(url) {
    try {
      const response = await axios.get(url, {
        timeout: config.scraping.timeout,
        headers: {
          'User-Agent': config.scraping.userAgent,
        },
      });

      const $ = cheerio.load(response.data);
      
      const title = $('meta[property="og:title"]').attr('content') || 
                    $('title').text() || 
                    url;
      
      const description = $('meta[property="og:description"]').attr('content') || 
                         $('meta[name="description"]').attr('content') || 
                         '';
      
      const imageUrl = $('meta[property="og:image"]').attr('content') || 
                       $('img').first().attr('src') || 
                       null;

      // Try to extract price
      let price = null;
      const priceText = $('meta[property="product:price:amount"]').attr('content');
      if (priceText) {
        price = parseFloat(priceText);
      }

      return {
        title: title.substring(0, 255),
        description: description.substring(0, 1000),
        imageUrl,
        price,
        sourceUrl: url,
      };
    } catch (error) {
      console.error('Scraping error:', error.message);
      return {
        title: new URL(url).hostname,
        description: '',
        imageUrl: null,
        price: null,
        sourceUrl: url,
        error: error.message,
      };
    }
  },

  async scrapeMultiple(urls) {
    const results = await Promise.all(urls.map(url => this.scrapeUrl(url)));
    return results;
  },
};

module.exports = WebScraper;
