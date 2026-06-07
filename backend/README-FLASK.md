# Wishlist Maker - Python Flask Backend

A modern Python Flask backend for the Wishlist Maker application, providing user authentication, wishlist management, web scraping, and streamer features.

## Quick Start

### Prerequisites
- Python 3.8+
- PostgreSQL 12+

### Installation

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Configure environment variables:**
   - Copy `.env` and update database credentials if needed
   - Change `JWT_SECRET` to a strong random value in production

3. **Initialize database:**
```bash
python -c "from config.database import init_db; init_db()"
```

4. **Run the server:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Project Structure

```
backend/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── .env                   # Environment variables
├── config/
│   ├── config.py         # Configuration settings
│   └── database.py       # Database initialization and queries
├── middleware/
│   ├── authenticate.py   # JWT authentication decorator
│   └── error_handler.py  # Error handling middleware
├── models/
│   ├── User.py          # User model and queries
│   ├── Wishlist.py      # Wishlist model and queries
│   ├── Item.py          # Item model and queries
│   └── Streamer.py      # Streamer model and queries
├── routes/
│   ├── auth.py          # Authentication endpoints
│   ├── user.py          # User profile endpoints
│   ├── wishlist.py      # Wishlist endpoints
│   ├── item.py          # Item endpoints
│   ├── scraper.py       # Web scraping endpoints
│   └── streamer.py      # Streamer feature endpoints
└── utils/
    ├── helpers.py       # Utility functions (JWT, password, formatting)
    └── scraper.py       # Web scraping utilities
```

## API Routes

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user

### Users (`/api/users`)
- `GET /profile` - Get current user (requires auth)
- `GET /:username` - Get public user profile
- `PUT /profile` - Update profile (requires auth)

### Wishlists (`/api/wishlists`)
- `POST /` - Create wishlist (requires auth)
- `GET /mine` - Get user's wishlists (requires auth)
- `GET /public` - Get public wishlists
- `GET /:id` - Get wishlist with items
- `PUT /:id` - Update wishlist (requires auth, ownership)
- `DELETE /:id` - Delete wishlist (requires auth, ownership)

### Items (`/api/items`)
- `POST /` - Add item to wishlist (requires auth)
- `GET /:id` - Get single item
- `PUT /:id` - Update item (requires auth, ownership)
- `PATCH /:id/toggle` - Toggle completion status (requires auth)
- `DELETE /:id` - Delete item (requires auth, ownership)

### Scraper (`/api/scraper`)
- `POST /scrape-url` - Scrape single URL (requires auth)
- `POST /scrape-multiple` - Scrape multiple URLs (requires auth)

### Streamers (`/api/streamers`)
- `POST /profile` - Create streamer profile (requires auth)
- `GET /profile/user/:userId` - Get streamer profile
- `PUT /profile` - Update streamer profile (requires auth)
- `POST /donation-link` - Add donation link (requires auth)
- `GET /donation-links` - Get donation links (requires auth)

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Database Schema

The application automatically creates the following tables:
- `users` - User accounts
- `wishlists` - User wishlists
- `items` - Wishlist items
- `streamer_profiles` - Streamer information
- `streamer_donations` - Donation links for streamers

## Web Scraping

The scraper automatically extracts:
- Title
- Price
- Image URL
- Description
- Source URL

It handles both absolute and relative URLs and respects common HTML meta tags (OG, product-specific).

## Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., duplicate email/username)
- `500` - Internal Server Error

## Development Tips

- **Hot reload:** The app runs in debug mode during development
- **Database:** Use raw SQL queries for flexibility
- **Async scraping:** Consider using `aiohttp` for concurrent scraping in production
- **Logging:** Check console output for debug information

## Differences from Node.js Backend

- Using Flask instead of Express
- PostgreSQL via psycopg2 instead of pg/sequelize
- JWT tokens generated with PyJWT
- Password hashing with bcrypt
- Web scraping with BeautifulSoup4 and requests
- No controllers (logic in routes directly)

## Deployment

For production:
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Use Gunicorn or similar WSGI server:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```
4. Set up proper PostgreSQL backups
5. Enable HTTPS and CORS properly
6. Consider adding rate limiting
