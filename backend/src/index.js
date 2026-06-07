require('express-async-errors');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const wishlistRoutes = require('./routes/wishlist');
const itemRoutes = require('./routes/item');
const scraperRoutes = require('./routes/scraper');
const streamerRoutes = require('./routes/streamer');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/scraper', scraperRoutes);
app.use('/api/streamers', streamerRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = config.app.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${config.app.env}`);
});

module.exports = app;
