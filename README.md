# Wishlist Maker 🎁

A full-featured wishlist application with user authentication, web scraping, social sharing, and special features for streamers.

## Features

- ✅ User registration and authentication with JWT
- ✅ Create multiple wishlists
- ✅ Add items with automatic URL scraping (fetches title, price, image)
- ✅ Track completed items
- ✅ Share wishlists publicly
- ✅ Special streamer features:
  - Streamer profiles with channel links
  - Donation links integration
  - Follower-only wishlists
- ✅ Responsive web interface (React + Tailwind CSS)
- ✅ RESTful API (Node.js + Express)
- ✅ PostgreSQL database

## Tech Stack

**Backend:**
- Node.js + Express
- PostgreSQL
- JWT Authentication
- Web scraping (axios + cheerio)

**Frontend:**
- React 18
- Tailwind CSS
- Zustand (state management)
- React Router

## Getting Started

### Prerequisites

- Node.js 16+ 
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd wishlist-maker
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

   Create `.env` file (or copy from `.env.example`):
   ```
   PORT=5000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=wishlist_db
   JWT_SECRET=your-secret-key-here
   CORS_ORIGIN=http://localhost:3000
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `.env` file:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Set up database:**
   ```bash
   cd backend
   npm run migrate
   ```

2. **Start backend:**
   ```bash
   npm run dev
   ```

3. **In another terminal, start frontend:**
   ```bash
   cd frontend
   npm start
   ```

4. Open http://localhost:3000 in your browser

## API Documentation

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Wishlists

- `POST /api/wishlists` - Create wishlist (requires auth)
- `GET /api/wishlists/mine` - Get user's wishlists (requires auth)
- `GET /api/wishlists/public` - Get public wishlists
- `GET /api/wishlists/:id` - Get wishlist details
- `PUT /api/wishlists/:id` - Update wishlist (requires auth)
- `DELETE /api/wishlists/:id` - Delete wishlist (requires auth)

### Items

- `POST /api/items` - Add item to wishlist (requires auth)
- `GET /api/items/:id` - Get item details
- `PUT /api/items/:id` - Update item (requires auth)
- `PATCH /api/items/:id/toggle` - Mark item as completed/incomplete (requires auth)
- `DELETE /api/items/:id` - Delete item (requires auth)

### Web Scraping

- `POST /api/scraper/scrape-url` - Scrape URL for item details (requires auth)
- `POST /api/scraper/scrape-multiple` - Scrape multiple URLs (requires auth)

### Streamer Features

- `POST /api/streamers/profile` - Create streamer profile (requires auth)
- `GET /api/streamers/profile/user/:userId` - Get streamer profile
- `PUT /api/streamers/profile` - Update streamer profile (requires auth)
- `POST /api/streamers/donation-link` - Add donation link (requires auth)
- `GET /api/streamers/donation-links` - Get donation links (requires auth)

## File Structure

```
wishlist-maker/
├── backend/
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   ├── migrations/     # Database migrations
│   │   └── index.js        # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   ├── services/       # API services
    │   ├── store/          # Zustand stores
    │   ├── hooks/          # Custom hooks
    │   ├── App.js          # Main app component
    │   └── index.js        # React entry point
    ├── public/
    ├── tailwind.config.js
    └── package.json
```

## Future Enhancements

- [ ] Social features (follow users, comments)
- [ ] Item recommendations
- [ ] Email notifications
- [ ] Dark mode
- [ ] Mobile app
- [ ] Integration with Twitch/YouTube APIs
- [ ] Analytics dashboard for streamers
- [ ] Group wishlists
- [ ] Wishlist templates

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Support

For support, email support@wishlistmaker.com or open an issue on GitHub.
