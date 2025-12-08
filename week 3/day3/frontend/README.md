# Task Management Application

A modern task management application built with React, Vite, and Tailwind CSS. This application allows users to register, login, and manage their tasks with a clean and intuitive interface.

## Features

- User authentication (Login/Signup)
- Protected routes for authenticated users
- Task management dashboard
- Create, read, update, and delete tasks
- Responsive design with Tailwind CSS
- Form validation with React Hook Form
- Modern UI with Lucide React icons

## Tech Stack

- **React 19.2** - UI library
- **Vite 7.2** - Build tool and dev server
- **React Router DOM 7.10** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **React Hook Form** - Form validation and management
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
VITE_API_URL=your_api_url_here
```

### Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

### Lint

Run ESLint to check code quality:
```bash
npm run lint
```

## Project Structure

```
src/
├── api/           # API configuration and endpoints
├── assets/        # Static assets (images, icons)
├── components/    # Reusable React components
│   ├── forms/     # Form components
│   └── tasks/     # Task-related components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── utils/         # Utility functions
├── App.jsx        # Main application component
└── main.jsx       # Application entry point
```

## Available Routes

- `/` - Home/Login page
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Protected dashboard (requires authentication)

## License

This project is private and not licensed for public use.
