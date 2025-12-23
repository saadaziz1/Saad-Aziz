# Job Listings with Filtering

A modern job listing application with advanced filtering capabilities and dark mode support.

## Features

- **Job Listings**: Browse through available job positions
- **Advanced Filtering**: Filter jobs by role, level, languages, and tools
- **Job Details**: View detailed information for each job posting
- **Dark/Light Mode**: Toggle between themes with persistent preference
- **Responsive Design**: Optimized for desktop and mobile devices
- **Skeleton Loading**: Smooth loading states for better UX
- **Persistent Filters**: Filter preferences saved in localStorage
- **Static Generation**: Pre-built pages for optimal performance
- **Conditional UI**: Filter bar hidden on job detail pages

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with improved hydration
- **TypeScript 5.7** - Type-safe JavaScript
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Zustand 5** - Lightweight state management
- **ESLint 9** - Code linting and formatting

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd job-listings-with-filtering
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/                 # Next.js app router
│   ├── api/            # API routes
│   ├── jobs/           # Job detail pages
│   └── globals.css     # Global styles
├── components/         # Reusable components
├── store/             # Zustand state management
├── types/             # TypeScript type definitions
└── data.json          # Mock job data
```

## API Routes

- `GET /api/jobs` - Fetch all job listings

## State Management

The application uses Zustand for state management with two main stores:
- **Job Store**: Manages job data and filtering logic
- **Theme Store**: Handles dark/light mode preferences

## Filtering System

Users can filter jobs by:
- **Role**: Frontend, Backend, Fullstack
- **Level**: Junior, Midweight, Senior
- **Languages**: JavaScript, Python, HTML, CSS, etc.
- **Tools**: React, Vue, Sass, Django, etc.

Filters are persistent across browser sessions using localStorage.

## Theme System

- Toggle between light and dark modes
- Preference saved in localStorage
- Smooth transitions between themes
- No flash on page reload

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.