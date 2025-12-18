const https = require('https');

// Fetch OHLC data from CoinGecko API
async function fetchOHLCData(coinId, days = 1) {
  return new Promise((resolve, reject) => {
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=${days}`;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          console.log('OHLC response status:', res.statusCode);
          if (res.statusCode !== 200) {
            console.log('OHLC error response:', data.substring(0, 200));
            reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 100)}`));
            return;
          }
          const ohlcData = JSON.parse(data);
          if (!Array.isArray(ohlcData)) {
            console.log('Invalid OHLC data:', data.substring(0, 200));
            reject(new Error('Invalid OHLC response'));
            return;
          }
          resolve(ohlcData);
        } catch (err) {
          console.error('OHLC parse error:', err.message);
          console.log('OHLC raw response:', data.substring(0, 200));
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

// Fetch top coins from CoinGecko API
async function fetchTopCoins(limit = 20) {
  return new Promise((resolve, reject) => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json'
      }
    };
    
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          console.log('CoinGecko response status:', res.statusCode);
          if (res.statusCode !== 200) {
            console.log('Response body:', data.substring(0, 200));
            reject(new Error(`HTTP ${res.statusCode}: ${data.substring(0, 100)}`));
            return;
          }
          const coins = JSON.parse(data);
          if (!Array.isArray(coins)) {
            reject(new Error('Invalid response from CoinGecko'));
            return;
          }
          resolve(coins);
        } catch (err) {
          console.error('Parse error:', err.message);
          console.log('Raw response:', data.substring(0, 200));
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

let pollInterval = null;
let priceUpdateInterval = null;

// Export both functions
module.exports = async (io, limit = 20) => {
  try {
    // Clear existing intervals
    if (pollInterval) clearInterval(pollInterval);
    if (priceUpdateInterval) clearInterval(priceUpdateInterval);

    const fetchAndEmit = async () => {
      try {
        const coins = await fetchTopCoins(limit);
        global.currentCoins = coins;
        io.emit('coinsUpdate', coins);
        console.log(`Updated ${coins.length} coins`);
      } catch (error) {
        console.error('Failed to fetch coins:', error.message);
      }
    };

    // Simulate very subtle price updates
    const simulateUpdates = () => {
      if (!global.currentCoins || global.currentCoins.length === 0) return;
      
      global.currentCoins.forEach(coin => {
        // Tiny price change (-0.05% to +0.05%)
        const priceChange = (Math.random() - 0.5) * 0.1;
        coin.current_price = Math.max(0.000001, coin.current_price * (1 + priceChange / 100));
        
        // Tiny 24h change variation (-0.01% to +0.01%)
        const change24hVar = (Math.random() - 0.5) * 0.02;
        coin.price_change_percentage_24h = (coin.price_change_percentage_24h || 0) + change24hVar;
      });
      
      io.emit('coinsUpdate', global.currentCoins);
    };

    // Initial fetch
    await fetchAndEmit();
    
    // Poll CoinGecko every 2 minutes to avoid rate limits
    pollInterval = setInterval(fetchAndEmit, 120000);
    
    // Simulate tiny updates every 5 seconds
    priceUpdateInterval = setInterval(simulateUpdates, 5000);
    
    return { 
      close: () => {
        clearInterval(pollInterval);
        clearInterval(priceUpdateInterval);
      }
    };
    
  } catch (error) {
    console.error('Failed to start CoinGecko polling:', error);
    return null;
  }
};

// Export fetchOHLCData for use in frontend
module.exports.fetchOHLCData = fetchOHLCData;