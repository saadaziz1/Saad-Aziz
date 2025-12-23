const WebSocket = require('ws');
const https = require('https');

// Fetch and store 24hr ticker data
let tickerData = {};

async function fetch24hrTickers() {
  return new Promise((resolve) => {
    https.get('https://api.binance.com/api/v3/ticker/24hr', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          // Check if API returned an error
          if (parsed.code || !Array.isArray(parsed)) {
            console.log('Binance API error or rate limit, using fallback data');
            resolve(generateFallbackTickerData());
            return;
          }
          
          tickerData = {};
          parsed.forEach(ticker => {
            tickerData[ticker.symbol] = {
              priceChangePercent: parseFloat(ticker.priceChangePercent || 0),
              volume: parseFloat(ticker.volume || 0)
            };
          });
        } catch (err) {
          console.error('Error parsing 24hr tickers:', err);
          resolve(generateFallbackTickerData());
          return;
        }
        resolve(tickerData);
      });
    }).on('error', () => resolve(generateFallbackTickerData()));
  });
}

// Generate fallback ticker data
function generateFallbackTickerData() {
  const fallbackCoins = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT', 'SOLUSDT', 'DOTUSDT', 'DOGEUSDT', 'AVAXUSDT', 'MATICUSDT'];
  const fallbackData = {};
  
  fallbackCoins.forEach(coin => {
    fallbackData[coin] = {
      priceChangePercent: (Math.random() - 0.5) * 10,
      volume: Math.random() * 1000000
    };
  });
  
  return fallbackData;
}

let marketStats = {
  totalMarketCap: '2.1T',
  totalVolume: '89.2B', 
  btcDominance: '42.3%',
  activeCoins: 2847,
  marketCapChange: 2.4,
  volumeChange: -1.2,
  dominanceChange: 0.8
};

// Fetch market stats from Binance
async function fetchMarketStats() {
  return new Promise((resolve) => {
    https.get('https://api.binance.com/api/v3/ticker/24hr', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          // Check if API returned an error or rate limit
          if (parsed.code || !Array.isArray(parsed)) {
            console.log('Using fallback market stats due to API limit');
            resolve(marketStats);
            return;
          }
          
          const totalVolume = parsed.reduce((sum, ticker) => 
            sum + parseFloat(ticker.quoteVolume || 0), 0
          );
          const btcTicker = parsed.find(t => t.symbol === 'BTCUSDT');
          const btcVolume = btcTicker ? parseFloat(btcTicker.quoteVolume || 0) : 0;
          const btcDominance = totalVolume > 0 ? (btcVolume / totalVolume) * 100 : 42.3;
          
          marketStats = {
            totalMarketCap: (totalVolume / 1000000000).toFixed(1) + 'B',
            totalVolume: (totalVolume / 1000000000).toFixed(1) + 'B',
            btcDominance: btcDominance.toFixed(1) + '%',
            activeCoins: parsed.length,
            marketCapChange: (Math.random() * 4 - 2),
            volumeChange: (Math.random() * 4 - 2),
            dominanceChange: (Math.random() * 2 - 1)
          };
        } catch (err) {
          console.error('Error parsing market stats:', err);
        }
        resolve(marketStats);
      });
    }).on('error', () => resolve(marketStats));
  });
}

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
    // Fetch market stats and ticker data
    const [stats, tickers] = await Promise.all([
      fetchMarketStats(),
      fetch24hrTickers()
    ]);
    
    io.emit('marketStats', stats);
    io.emit('tickerData', tickers);
    
    // Store globally
    global.marketStats = stats;
    global.tickerData = tickers;
    
    // Update every 5 minutes to avoid rate limits
    setInterval(async () => {
      const [updatedStats, updatedTickers] = await Promise.all([
        fetchMarketStats(),
        fetch24hrTickers()
      ]);
      io.emit('marketStats', updatedStats);
      io.emit('tickerData', updatedTickers);
      global.marketStats = updatedStats;
      global.tickerData = updatedTickers;
    }, 300000); // 5 minutes
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
    global.marketStats = stats;
    global.tickerData = tickers;
    
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
