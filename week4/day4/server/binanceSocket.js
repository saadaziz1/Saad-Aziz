const WebSocket = require('ws');
const https = require('https');

// Fetch and store 24hr ticker data
let tickerData = {};

// Shared function to fetch raw data from Binance
async function fetchRawBinanceData() {
  return new Promise((resolve) => {
    https.get('https://api.binance.com/api/v3/ticker/24hr', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.code || !Array.isArray(parsed)) {
            console.log('Binance API error or rate limit');
            resolve(null);
          } else {
            resolve(parsed);
          }
        } catch (err) {
          console.error('Error parsing Binance data:', err);
          resolve(null);
        }
      });
    }).on('error', (err) => {
      console.error('Binance API request error:', err);
      resolve(null);
    });
  });
}

function process24hrTickers(rawData) {
  if (!rawData) return generateFallbackTickerData();
  
  const processed = {};
  rawData.forEach(ticker => {
    processed[ticker.symbol] = {
      priceChangePercent: parseFloat(ticker.priceChangePercent || 0),
      volume: parseFloat(ticker.volume || 0)
    };
  });
  return processed;
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

function processMarketStats(rawData) {
  if (!rawData) return marketStats;
  
  try {
    const totalVolume = rawData.reduce((sum, ticker) => 
      sum + parseFloat(ticker.quoteVolume || 0), 0
    );
    const btcTicker = rawData.find(t => t.symbol === 'BTCUSDT');
    const btcVolume = btcTicker ? parseFloat(btcTicker.quoteVolume || 0) : 0;
    const btcDominance = totalVolume > 0 ? (btcVolume / totalVolume) * 100 : 42.3;
    
    return {
      totalMarketCap: (totalVolume / 1000000000).toFixed(1) + 'B',
      totalVolume: (totalVolume / 1000000000).toFixed(1) + 'B',
      btcDominance: btcDominance.toFixed(1) + '%',
      activeCoins: rawData.length,
      marketCapChange: (Math.random() * 4 - 2),
      volumeChange: (Math.random() * 4 - 2),
      dominanceChange: (Math.random() * 2 - 1)
    };
  } catch (err) {
    console.error('Error processing market stats:', err);
    return marketStats;
  }
}

function processTopCoins(rawData, limit = 50) {
  if (!rawData) throw new Error('No data available for top coins');
  
  return rawData
    .filter(ticker => ticker.symbol && ticker.symbol.endsWith('USDT'))
    .sort((a, b) => parseFloat(b.quoteVolume || 0) - parseFloat(a.quoteVolume || 0))
    .slice(0, limit)
    .map(ticker => ticker.symbol.toLowerCase());
}

module.exports = async (io, limit = 50) => {
  try {
    // Initial fetch
    const rawData = await fetchRawBinanceData();
    
    // Process data
    const stats = processMarketStats(rawData);
    const tickers = process24hrTickers(rawData);
    
    io.emit('marketStats', stats);
    io.emit('tickerData', tickers);
    
    // Store globally
    global.marketStats = stats;
    global.tickerData = tickers;
    
    // Update every 5 minutes
    setInterval(async () => {
      const updatedRawData = await fetchRawBinanceData();
      const updatedStats = processMarketStats(updatedRawData);
      const updatedTickers = process24hrTickers(updatedRawData);
      
      io.emit('marketStats', updatedStats);
      io.emit('tickerData', updatedTickers);
      
      global.marketStats = updatedStats;
      global.tickerData = updatedTickers;
    }, 300000); // 5 minutes
    
    let coins;
    try {
      coins = processTopCoins(rawData, limit);
      console.log(`Fetched ${coins.length} top coins:`, coins.slice(0, 10));
    } catch (apiError) {
      console.error('Processing top coins failed, using fallback:', apiError.message);
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
    console.error('Failed to initialize Binance socket:', error);
    return null;
  }
};
