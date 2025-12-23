# OTT Platform Backend

## Features
- User authentication (register, login)
- Role-based access control (User, Admin)
- Video streaming with premium content access
- Subscription management with free trial
- Secure card details storage
- Admin panel for user and content management

## API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- GET `/api/auth/profile` - Get user profile

### User Management
- POST `/api/user/free-trial` - Activate free trial
- POST `/api/user/subscribe` - Subscribe to plan
- GET `/api/user/subscription` - Get subscription status

### Videos
- GET `/api/videos` - Get all videos
- GET `/api/videos/:id` - Get video by ID
- GET `/api/videos/genres` - Get all genres
- POST `/api/videos` - Upload video (Admin only)
- PUT `/api/videos/:id` - Update video (Admin only)
- DELETE `/api/videos/:id` - Delete video (Admin only)

### Plans
- GET `/api/plans` - Get all plans
- GET `/api/plans/:id` - Get plan by ID

### Admin
- GET `/api/admin/users` - Get all users
- PUT `/api/admin/users/:userId/block` - Block user
- PUT `/api/admin/users/:userId/unblock` - Unblock user
- POST `/api/admin/plans` - Create plan
- GET `/api/admin/plans` - Get all plans
- GET `/api/admin/dashboard` - Get dashboard stats

## Setup
1. Install dependencies: `npm install`
2. Set environment variables in `.env`
3. Start server: `npm run dev`

## Environment Variables
- PORT=5000
- MONGODB_URI=mongodb://localhost:27017/ott_platform
- JWT_SECRET=your_jwt_secret_key_here
- ENCRYPTION_KEY=your_32_character_encryption_key
- NODE_ENV=development