# Tea Commerce API

A comprehensive e-commerce backend API built with Node.js, Express, and MongoDB.

## Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Product Management**: CRUD operations with variants and inventory tracking
- **Shopping Cart**: Add, update, remove items with server-side calculations
- **Order Management**: Atomic order placement with stock decrement
- **User Management**: Admin controls for blocking/unblocking users
- **Analytics Dashboard**: Sales and inventory analytics for admins

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, bcryptjs
- **Documentation**: Swagger

## Project Structure

```
src/
├── config/          # Database and external service configs
├── models/          # Mongoose schemas
├── repositories/    # Database access layer
├── services/        # Business logic layer
├── controllers/     # HTTP request handlers
├── routes/          # API route definitions
├── middlewares/     # Custom middleware functions
├── validations/     # Request validation schemas
├── utils/           # Helper functions
├── seeds/           # Database seeding scripts
├── app.js           # Express app setup
└── server.js        # Server entry point
```

## Setup Instructions

1. **Clone and Install**
   ```bash
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Database Setup**
   ```bash
   # Seed super admin user
   npm run seed:admin
   
   # Seed sample products
   npm run seed:products
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/items/:itemId` - Update cart item
- `DELETE /api/cart/items/:itemId` - Remove cart item

### Orders
- `POST /api/orders` - Place order
- `GET /api/orders` - Get user orders
- `PUT /api/orders/:id/status` - Update order status (Admin)

### User Management (Superadmin)
- `GET /api/users` - List all users
- `PUT /api/users/:id/block` - Block user
- `PUT /api/users/:id/unblock` - Unblock user

### Analytics (Admin)
- `GET /api/dashboard/analytics` - Get dashboard analytics

### Role Management (Superadmin)
- `PUT /api/admin/users/:id/promote-admin` - Promote user to admin
- `PUT /api/admin/users/:id/promote-superadmin` - Promote user to superadmin
- `PUT /api/admin/users/:id/demote` - Demote user to regular user

## User Roles

- **user**: Regular customers
- **admin**: Can manage products and orders
- **superadmin**: Full access including user management

## Role Promotion

Users can be promoted/demoted by superadmins:

1. **To Admin**: `PUT /api/admin/users/{userId}/promote-admin`
2. **To Superadmin**: `PUT /api/admin/users/{userId}/promote-superadmin`
3. **To User**: `PUT /api/admin/users/{userId}/demote`

**Rules:**
- Only superadmins can promote/demote users
- Superadmins cannot demote themselves
- Cannot modify existing superadmin roles when promoting to admin

## Default Admin Credentials

- Email: `admin@teacommerce.com`
- Password: `admin123`

## API Documentation

Visit `/api-docs` when the server is running to view the Swagger documentation.

## Health Check

- `GET /health` - Server and database status

## Testing

Use the provided Postman collection or test manually:

1. Register/login to get JWT token
2. Add products (as admin)
3. Add items to cart
4. Place orders
5. Test admin functions

## Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Role-based access control
- Input validation with Zod
- CORS and Helmet security headers
- MongoDB injection protection

## Database Schema

### User
- Authentication and profile data
- Role-based permissions
- Block/unblock functionality

### Product
- Product information with variants
- Inventory tracking per variant
- Category and tag-based organization

### Cart
- User-specific shopping cart
- Server-side price calculations
- Automatic item consolidation

### Order
- Complete order history
- Atomic stock decrement
- Payment and shipping tracking