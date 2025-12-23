# OTT Platform - Setup Guide

## Completed Features ✅

### Backend
- ✅ User authentication (signup, login, logout)
- ✅ Role-based access control (user, admin, superadmin)
- ✅ Video upload with file handling (multer)
- ✅ Subscription management (free trial + paid plans)
- ✅ Card details encryption and storage
- ✅ Premium content access control
- ✅ User management (block/unblock)
- ✅ RESTful API design

### Frontend
- ✅ User authentication pages
- ✅ Browse videos with search and filter
- ✅ Video player with streaming
- ✅ Subscription plans page
- ✅ Premium content overlay
- ✅ Admin panel for video management
- ✅ Admin panel for user management
- ✅ Responsive design

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install

# Create .env file with:
MONGODB_URI=mongodb://localhost:27017/ott-platform
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
ENCRYPTION_KEY=your_32_character_encryption_key

# Seed admin user
npm run seed

# Seed default plans
npm run seed-plans

# Start server
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install

# Start client
npm start
```

### 3. Default Credentials

**Super Admin:**
- Email: admin@streamvibe.com
- Password: admin123

## How to Use

### User Flow:
1. Sign up for new account
2. Browse available content
3. Activate 7-day free trial OR subscribe to a plan
4. Watch premium content with active subscription

### Admin Flow:
1. Login with admin credentials
2. Upload videos with thumbnails
3. Manage users (block/unblock)
4. View dashboard statistics

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Videos
- GET /api/videos (with search & filter)
- GET /api/videos/:id
- POST /api/videos (admin only - multipart/form-data)
- PUT /api/videos/:id (admin only)
- DELETE /api/videos/:id (admin only)

### Subscription
- POST /api/user/free-trial
- POST /api/user/subscribe
- GET /api/user/subscription

### Admin
- GET /api/admin/users
- PUT /api/admin/users/:id/block
- PUT /api/admin/users/:id/unblock
- GET /api/admin/dashboard

## Features Implemented

✅ Video file upload and storage
✅ Subscription logic with expiry
✅ Free trial activation (7 days)
✅ Card details encryption
✅ Premium content access control
✅ Video streaming functionality
✅ Search and filter videos
✅ Admin video management
✅ Admin user management
✅ Role-based authentication

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **File Upload**: Multer
- **Authentication**: JWT
- **Encryption**: Crypto

## Notes

- Video files are stored in `server/uploads/videos/`
- Thumbnail images are stored in `server/uploads/thumbnails/`
- Card details are encrypted before storage
- Subscription automatically expires after plan duration
- Premium content requires active subscription
