const WebSocket = require('ws');
const https = require('https');

// Fetch top coins by volume from Binance API
async function fetchTopCoins(limit = 50) {
  return new Promise((resolve, reject) => {
    https.get('https://api.binance.com/api/v3/ticker/24hr', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const tickers = JSON.parse(data)
            .filter(ticker => ticker.symbol.endsWith('USDT'))
            .sort((a, b) => parseFloat(b.quoteVolume) - parseFloat(a.quoteVolume))
            .slice(0, limit)
            .map(ticker => ticker.symbol.toLowerCase());
          resolve(tickers);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

module.exports = async (io, limit = 50) => {
  try {
    const coins = await fetchTopCoins(limit);
    console.log(`Fetched ${coins.length} top coins:`, coins.slice(0, 10));
    
    // Store coins globally for new connections
    global.currentCoins = coins.map(c => c.toUpperCase());
    
    // Create combined stream URL
    const streams = coins.map(coin => `${coin}@trade`).join('/');
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    
    const ws = new WebSocket(wsUrl);
    
    ws.on('open', () => {
      console.log(`Connected to Binance combined stream for ${coins.length} coins`);
      io.emit('coinsUpdate', global.currentCoins);
    });
    
    ws.on('message', (data) => {
      const message = JSON.parse(data);
      if (message.data) {
        io.emit('priceUpdate', {
          symbol: message.data.s,
          price: message.data.p,
        });
      }
    });
    
    ws.on('error', (err) => console.error('Combined WS error:', err));
    ws.on('close', () => {
      console.log('Combined WS closed, reconnecting in 5s...');
      setTimeout(() => module.exports(io, limit), 5000);
    });
    
    return ws;
    
  } catch (error) {
    console.error('Failed to fetch coins:', error);
    return null;
  }
};
