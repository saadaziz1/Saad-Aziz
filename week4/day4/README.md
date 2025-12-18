# Crypto Dashboard

A real-time cryptocurrency dashboard built with Next.js, Redux Toolkit, Socket.IO, and CoinGecko API.

## Features

- Real-time price updates for top cryptocurrencies
- Live connection status indicator
- Price change indicators with arrows
- Responsive design with Tailwind CSS
- Redux Toolkit for state management
- Socket.IO for real-time communication

## Project Structure

```
├── client/          # Next.js frontend
│   ├── app/         # App router pages
│   ├── components/  # React components
│   ├── store/       # Redux store and API
│   └── socket/      # Socket.IO client
└── server/          # Express.js backend
    ├── index.js     # Server entry point
    └── binanceSocket.js # Binance WebSocket handler
```

## Setup Instructions

### 1. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 2. Run the Application

**Start the server (Terminal 1):**
```bash
cd server
npm start
```
Server will run on http://localhost:5000

**Start the client (Terminal 2):**
```bash
cd client
npm run dev
```
Client will run on http://localhost:3000

### 3. Access the Dashboard

Open your browser and navigate to http://localhost:3000

## How It Works

1. **Backend**: Express server polls CoinGecko API every 30 seconds for top cryptocurrencies
2. **Real-time Updates**: Price updates are broadcasted to all connected clients via Socket.IO
3. **Frontend**: Next.js app displays coin data with market cap, 24h changes, and coin images
4. **Live Data**: Socket.IO ensures all clients receive updated cryptocurrency data

## Technologies Used

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit, RTK Query
- **Real-time**: Socket.IO
- **Backend**: Express.js, HTTPS polling
- **API**: CoinGecko REST API

## Available Scripts

**Server:**
- `npm start` - Start the server
- `npm run dev` - Start in development mode

**Client:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server