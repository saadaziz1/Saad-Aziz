require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const startCoinGeckoApi = require('./coinGeckoApi');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/portfolio', require('./routes/portfolio'));

// OHLC data endpoint
app.get('/api/ohlc/:coinId', async (req, res) => {
  try {
    const { coinId } = req.params;
    const { days = 1 } = req.query;
    const { fetchOHLCData } = require('./coinGeckoApi');
    const ohlcData = await fetchOHLCData(coinId, days);
    res.json(ohlcData);
  } catch (error) {
    console.error('OHLC endpoint error:', error.message);
    // Return empty array on error so frontend can handle it
    res.json([]);
  }
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://saad-aziz.onrender.com', 'https://week4-day4-frontend.com'] 
      : '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

let currentWs = null;

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current coins list to newly connected client
  if (global.currentCoins && global.currentCoins.length > 0) {
    console.log('Sending coins to new client:', global.currentCoins.length);
    socket.emit('coinsUpdate', global.currentCoins);
  }
  
  socket.on('requestCoins', () => {
    console.log('Client requested coins');
    if (global.currentCoins && global.currentCoins.length > 0) {
      socket.emit('coinsUpdate', global.currentCoins);
    }
  });
  
  socket.on('updateCoins', async (limit) => {
    if (currentWs) {
      currentWs.close();
    }
    currentWs = await startCoinGeckoApi(io, limit);
  });
  
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Start with default 20 coins
startCoinGeckoApi(io, 20).then(ws => currentWs = ws);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
