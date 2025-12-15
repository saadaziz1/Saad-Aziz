# Todo App - React + TypeScript + Express + MongoDB

A full-stack Todo application with React TypeScript frontend and Express TypeScript backend connected to MongoDB.

## Features

### Frontend (React + TypeScript)
- ✅ Add new tasks with validation
- ✅ Mark tasks as completed/incomplete
- ✅ Delete tasks
- ✅ Display task statistics (total, completed, pending)
- ✅ TypeScript interfaces for type safety
- ✅ Tailwind CSS for styling

### Backend (Express + TypeScript)
- ✅ GET /api/tasks - Get all tasks
- ✅ POST /api/tasks - Create new task
- ✅ PUT /api/tasks/:id - Update task completion status
- ✅ DELETE /api/tasks/:id - Delete task
- ✅ MongoDB integration with Mongoose
- ✅ Input validation and error handling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally on port 27017)

### Backend Setup
1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start MongoDB service on your system

4. Start the backend server:
   ```bash
   npm run dev
   ```
   Server will run on http://localhost:5000

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:5173

## API Endpoints

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Task title"
  }
  ```
- `PUT /api/tasks/:id` - Update task completion status
  ```json
  {
    "completed": true
  }
  ```
- `DELETE /api/tasks/:id` - Delete a task

## Technology Stack

### Frontend
- React 19
- TypeScript
- Tailwind CSS
- Axios
- Vite

### Backend
- Express.js
- TypeScript
- MongoDB
- Mongoose
- CORS

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── config/
│   │   │   ├── middlewares/
│   │   │   ├── models/
│   │   │   └── task/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── types/
    │   └── App.tsx
    └── package.json
```