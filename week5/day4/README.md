# E-Commerce App with Reviews & Real-time Notifications

This project integrates a React frontend with an Express.js backend and a NestJS reviews service, featuring real-time notifications via Socket.IO.

## Architecture

- **Frontend**: React + Vite (Port 5173)
- **Express Backend**: Product management, auth, orders (Port 5000)
- **NestJS Reviews Service**: Reviews, replies, notifications (Port 3001)
- **Database**: MongoDB (shared between services)
- **Real-time**: Socket.IO for notifications

## Features

### Reviews & Replies
- ✅ Add reviews to products
- ✅ Reply to reviews
- ✅ Like reviews
- ✅ View reviews per product

### Real-time Notifications
- 🔔 **Broadcast**: New reviews notify all users
- 🔔 **Direct**: Replies notify review owners
- 🔔 **Likes**: Review likes notify authors
- 🔔 **UI**: Bell icon with unread count

## Quick Start

### Option 1: Use the Batch Script (Windows)
```bash
# Run from the day3 directory
./start-all.bat
```

### Option 2: Manual Start
```bash
# Terminal 1: Express Backend
cd backend
npm run dev

# Terminal 2: NestJS Reviews Service
cd reviews-service
npm run start:dev

# Terminal 3: React Frontend
cd frontend
npm run dev
```

## API Endpoints

### NestJS Reviews Service (Port 3001)
- `POST /reviews` - Create review
- `POST /reviews/:id/reply` - Reply to review
- `POST /reviews/:id/like` - Like review
- `GET /reviews/product/:productId` - Get product reviews

### Socket.IO Events
- `newReview` - Broadcast to all users
- `reviewReply` - Direct to review owner
- `reviewLike` - Direct to review author

## Environment Variables

### Reviews Service (.env)
```
PORT=3001
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
```

### Express Backend (.env)
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret_here
```

## Usage

1. **Login/Register** in the React app
2. **Browse Products** and click on any product
3. **Add Reviews** using the review form
4. **Reply to Reviews** by clicking the reply button
5. **Like Reviews** using the heart icon
6. **Real-time Notifications** appear in the bell icon

## Components Added

### Frontend
- `components/products/Reviews.jsx` - Reviews display and management
- `components/layout/Notifications.jsx` - Notification bell and dropdown
- `hooks/useReviews.js` - Reviews API hooks
- `hooks/useSocket.js` - Socket.IO connection
- `hooks/useNotifications.js` - Real-time notification handling
- `store/notificationStore.js` - Zustand store for notifications
- `api/reviews.js` - Reviews API service

### Backend (NestJS)
- Reviews module with controller, service, and schema
- Notifications gateway for Socket.IO
- JWT authentication guard
- MongoDB integration

## Notes

- The system uses the same MongoDB database for both services
- JWT tokens are shared between Express and NestJS services
- Socket.IO handles real-time communication
- All notifications appear instantly without page refresh
- The UI design remains unchanged from the original frontend