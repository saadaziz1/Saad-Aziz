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
          console.log('Binance API response status:', res.statusCode);
          const parsed = JSON.parse(data);
          
          // Check if response is an array
          if (!Array.isArray(parsed)) {
            console.error('Binance API returned non-array:', parsed);
            reject(new Error('Invalid response format from Binance API'));
            return;
          }
          
          const tickers = parsed
            .filter(ticker => ticker.symbol && ticker.symbol.endsWith('USDT'))
            .sort((a, b) => parseFloat(b.quoteVolume || 0) - parseFloat(a.quoteVolume || 0))
            .slice(0, limit)
            .map(ticker => ticker.symbol.toLowerCase());
          resolve(tickers);
        } catch (err) {
          console.error('Error parsing Binance response:', err);
          console.error('Raw response:', data.substring(0, 500));
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

module.exports = async (io, limit = 50) => {
  try {
    let coins;
    try {
      coins = await fetchTopCoins(limit);
      console.log(`Fetched ${coins.length} top coins:`, coins.slice(0, 10));
    } catch (apiError) {
      console.error('Binance API failed, using fallback coins:', apiError.message);
      // Fallback to popular coins
      coins = ['btcusdt', 'ethusdt', 'bnbusdt', 'adausdt', 'xrpusdt', 'solusdt', 'dotusdt', 'dogeusdt', 'avaxusdt', 'maticusdt'];
    }
    
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
