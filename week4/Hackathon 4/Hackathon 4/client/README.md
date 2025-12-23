# OTT Platform Frontend

## Features
- User authentication and registration
- Video browsing and streaming
- Subscription management with free trial
- Admin panel for content and user management
- Responsive design
- Role-based access control

## Pages
- **Home** - Landing page with hero section
- **Login/Signup** - Authentication pages
- **Browse** - Video catalog with search and filtering
- **VideoPlayer** - Video streaming page
- **Subscription** - Plan selection and payment
- **Profile** - User profile and subscription status
- **AdminDashboard** - Admin overview with statistics
- **ManageUsers** - User management for admins
- **ManageVideos** - Video content management for admins

## Components
- **Navbar** - Navigation with authentication state
- **Footer** - Site footer with links
- **VideoCard** - Video display card
- **PlanCard** - Subscription plan card
- **LoadingSpinner** - Loading indicator
- **Modal** - Reusable modal component

## Setup
1. Install dependencies: `npm install`
2. Set environment variables in `.env`
3. Start development server: `npm start`

## Environment Variables
- REACT_APP_API_URL=http://localhost:5000/api

## Tech Stack
- React 18
- React Router DOM
- Axios for API calls
- Context API for state management
- CSS for styling