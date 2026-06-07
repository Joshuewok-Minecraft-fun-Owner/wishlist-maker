# Wishlist Maker - Copilot Instructions

This document contains guidelines for developing and extending the Wishlist Maker application.

## Project Overview

Wishlist Maker is a full-stack web application that allows users to:
- Create and manage personal wishlists
- Automatically fetch item details from URLs (web scraping)
- Share wishlists publicly
- Track item completion status
- Access special features for streamers (channel links, donation integrations)

## Technology Stack

**Backend:**
- Runtime: Node.js
- Framework: Express.js
- Database: PostgreSQL
- Authentication: JWT
- Web Scraping: axios + cheerio

**Frontend:**
- Framework: React 18
- Styling: Tailwind CSS
- State Management: Zustand
- Routing: React Router v6
- UI Notifications: react-hot-toast
- Icons: react-icons

## Project Structure

```
wishlist-maker/
├── backend/                    # Express server
│   ├── src/
│   │   ├── config/            # Database and app config
│   │   ├── controllers/       # Business logic (not currently used, logic in routes)
│   │   ├── middleware/        # Auth, error handling
│   │   ├── models/            # Database query functions
│   │   ├── routes/            # API endpoints
│   │   ├── utils/             # Helpers (scraper, auth tokens)
│   │   ├── migrations/        # Database schema
│   │   └── index.js           # Server entry point
│   ├── .env                   # Environment variables
│   └── package.json
│
└── frontend/                   # React application
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Page-level components
    │   ├── services/          # API client
    │   ├── store/             # Zustand auth store
    │   ├── hooks/             # Custom React hooks
    │   ├── App.js             # Router and layout
    │   └── index.js           # React entry point
    ├── public/
    ├── .env                   # Environment variables
    └── package.json
```

## Database Schema

### users
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique
- `username` (VARCHAR) - Unique
- `password` (VARCHAR) - Hashed with bcryptjs
- `bio` (TEXT)
- `avatar_url` (VARCHAR)
- `created_at` (TIMESTAMP)

### wishlists
- `id` (UUID)
- `user_id` (UUID) - Foreign key
- `name` (VARCHAR)
- `description` (TEXT)
- `is_public` (BOOLEAN)
- `follower_only` (BOOLEAN) - For streamer feature
- `created_at` (TIMESTAMP)

### items
- `id` (UUID)
- `wishlist_id` (UUID) - Foreign key
- `name` (VARCHAR)
- `description` (TEXT)
- `price` (DECIMAL)
- `image_url` (VARCHAR)
- `source_url` (VARCHAR)
- `completed` (BOOLEAN)
- `completed_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)

### streamer_profiles
- `id` (UUID)
- `user_id` (UUID) - Unique foreign key
- `streamer_name` (VARCHAR)
- `channel_url` (VARCHAR)
- `platform` (VARCHAR) - e.g., twitch, youtube
- `created_at` (TIMESTAMP)

### streamer_donations
- `id` (UUID)
- `user_id` (UUID) - Foreign key
- `donation_url` (VARCHAR)
- `platform` (VARCHAR) - e.g., ko-fi, patreon
- `created_at` (TIMESTAMP)

## API Routes Reference

### Authentication (`/api/auth`)
- `POST /register` - Create new user account
- `POST /login` - User login (returns JWT token)

### Users (`/api/users`)
- `GET /profile` - Get current user profile (requires auth)
- `GET /:username` - Get public user profile
- `PUT /profile` - Update user profile (requires auth)

### Wishlists (`/api/wishlists`)
- `POST /` - Create wishlist (requires auth)
- `GET /mine` - Get user's wishlists (requires auth)
- `GET /public` - Get public wishlists (paginated)
- `GET /:id` - Get wishlist with items
- `PUT /:id` - Update wishlist (requires auth, ownership check)
- `DELETE /:id` - Delete wishlist (requires auth, ownership check)

### Items (`/api/items`)
- `POST /` - Add item to wishlist (requires auth)
- `GET /:id` - Get single item
- `PUT /:id` - Update item (requires auth, ownership check)
- `PATCH /:id/toggle` - Mark as completed/incomplete (requires auth)
- `DELETE /:id` - Delete item (requires auth, ownership check)

### Web Scraper (`/api/scraper`)
- `POST /scrape-url` - Scrape single URL (requires auth)
- `POST /scrape-multiple` - Scrape multiple URLs (requires auth)

### Streamers (`/api/streamers`)
- `POST /profile` - Create streamer profile (requires auth)
- `GET /profile/user/:userId` - Get streamer profile
- `PUT /profile` - Update streamer profile (requires auth)
- `POST /donation-link` - Add donation link (requires auth)
- `GET /donation-links` - Get user's donation links (requires auth)

## Development Guidelines

### Backend Development

1. **Adding new routes:**
   - Create file in `src/routes/` using existing pattern
   - Add to `src/index.js` with `app.use('/api/path', routeModule)`

2. **Adding new models:**
   - Create file in `src/models/` following existing pattern
   - Export object with CRUD functions that use `pool.query()`
   - Use UUID for IDs and timestamps for tracking

3. **Authentication:**
   - Use `authenticate` middleware from `src/middleware/authenticate.js`
   - Middleware sets `req.userId` and `req.user` from JWT
   - Always check ownership before allowing updates/deletes

4. **Error handling:**
   - Express-async-errors automatically catches promise rejections
   - Return appropriate HTTP status codes
   - Use `errorHandler` middleware for consistent error responses

### Frontend Development

1. **Adding new pages:**
   - Create component in `src/pages/`
   - Add route in `src/App.js`
   - Use `useAuthStore()` for auth state

2. **Making API calls:**
   - Use `apiClient` from `src/services/api.js`
   - Pass token from `useAuthStore` for authenticated requests
   - Handle errors and show toast notifications

3. **State management:**
   - Use Zustand store (`useAuthStore`) for auth
   - Use React hooks for local component state
   - Store token and user in localStorage for persistence

4. **Styling:**
   - Use Tailwind CSS utility classes
   - Follow existing color scheme (purple/pink gradient)
   - Ensure responsive design with `md:` and `lg:` breakpoints

## Running the Project

### Terminal 1 - Backend:
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm start
```

### Database setup:
```bash
cd backend
npm run migrate
```

## Common Tasks

### Adding a new wishlist feature:
1. Design the database schema changes
2. Create/update model in `backend/src/models/`
3. Create/update route in `backend/src/routes/`
4. Create/update frontend component in `frontend/src/pages/` or `frontend/src/components/`
5. Test auth checks and ownership verification

### Fixing a bug:
1. Reproduce the issue locally
2. Check browser console (frontend) or server logs (backend)
3. Add error handling where needed
4. Test the fix thoroughly

### Adding authentication to a route:
1. Import `authenticate` middleware
2. Add to route: `router.get('/path', authenticate, handler)`
3. Use `req.userId` in handler for user identification

## Testing Checklist

- [ ] User can register with unique email/username
- [ ] User can login with correct credentials
- [ ] User cannot access protected routes without token
- [ ] User can create multiple wishlists
- [ ] User can add items with URL scraping
- [ ] Item completion toggle works
- [ ] Users cannot modify other users' wishlists
- [ ] Public wishlists are visible to all
- [ ] Streamer features work correctly
- [ ] Web scraping fetches title, price, image
- [ ] Errors are handled gracefully

## Deployment Notes

- Change `JWT_SECRET` to a strong random value in production
- Set `NODE_ENV=production` for backend
- Update `CORS_ORIGIN` to match frontend domain
- Use environment variables from deployment platform
- Run database migrations on new deployments
- Consider adding HTTPS and rate limiting
- Back up PostgreSQL database regularly

## Future Enhancement Ideas

- Social features (follow users, like wishlists, comments)
- Wishlist templates
- Mobile app (React Native)
- Email notifications
- Dark mode
- Real-time collaboration
- Twitch/YouTube integration for streamers
- Analytics dashboard
- Item recommendations
- Wishlist comparison
