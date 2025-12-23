require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const { Server } = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const startBinanceSocket = require('./binanceSocket');

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
  
  socket.on('requestMarketStats', () => {
    socket.emit('marketStats', global.marketStats || {
      totalMarketCap: '2.1T',
      totalVolume: '89.2B',
      btcDominance: '42.3%',
      activeCoins: 2847,
      marketCapChange: 2.4,
      volumeChange: -1.2,
      dominanceChange: 0.8
    });
  });
  
  socket.on('requestTickerData', () => {
    socket.emit('tickerData', global.tickerData || {});
  });
  
  socket.on('requestKlines', ({ symbol, interval, limit }) => {
    https.get(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const klines = JSON.parse(data);
          socket.emit('klinesData', { symbol, klines });
        } catch (err) {
          socket.emit('klinesData', { symbol, klines: [] });
        }
      });
    }).on('error', () => {
      socket.emit('klinesData', { symbol, klines: [] });
    });
  });
  
  socket.on('updateCoins', async (limit) => {
    if (currentWs) {
      currentWs.close();
    }
    currentWs = await startBinanceSocket(io, limit);
  });
  
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id));
});

// Start with default 20 coins
startBinanceSocket(io, 20).then(ws => currentWs = ws);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
