const https = require('https');

// Add proper headers to avoid rate limiting
const requestOptions = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json'
  }
};

// Fetch top coins from CoinGecko API
async function fetchTopCoins(limit = 20) {
  return new Promise((resolve, reject) => {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=1&sparkline=false`;
    
    https.get(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const coins = JSON.parse(data);
          if (!Array.isArray(coins)) {
            reject(new Error('Invalid response from CoinGecko'));
            return;
          }
          resolve(coins);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

let pollInterval = null;
let priceUpdateInterval = null;

module.exports = async (io, limit = 20) => {
  try {
    // Clear existing intervals
    if (pollInterval) clearInterval(pollInterval);
    if (priceUpdateInterval) clearInterval(priceUpdateInterval);

    const fetchAndEmit = async () => {
      try {
        const coins = await fetchTopCoins(limit);
        
        // Log price changes if we have previous data
        if (global.currentCoins && global.currentCoins.length > 0) {
          const btc = coins.find(c => c.id === 'bitcoin');
          const prevBtc = global.currentCoins.find(c => c.id === 'bitcoin');
          if (btc && prevBtc && btc.current_price !== prevBtc.current_price) {
            console.log(`BTC price changed: ${prevBtc.current_price} -> ${btc.current_price}`);
          }
        }
        
        global.currentCoins = coins;
        const coinsWithTimestamp = coins.map(coin => ({
          ...coin,
          _timestamp: Date.now()
        }));
        io.emit('coinsUpdate', coinsWithTimestamp);
        console.log(`Updated ${coins.length} coins at ${new Date().toLocaleTimeString()}`);
      } catch (error) {
        console.error('Failed to fetch coins:', error);
      }
    };

    // Simulate subtle price updates between real data fetches
    const simulateUpdates = () => {
      if (!global.currentCoins || global.currentCoins.length === 0) {
        console.log('No coins to update');
        return;
      }
      
      console.log(`Updating ${global.currentCoins.length} coins, connected clients: ${io.engine.clientsCount}`);
      
      global.currentCoins.forEach(coin => {
        // Small price change (-0.3% to +0.3%)
        const priceChange = (Math.random() - 0.5) * 0.6;
        const oldPrice = coin.current_price;
        coin.current_price = Math.max(0.000001, coin.current_price * (1 + priceChange / 100));
        
        // Small 24h change variation (-0.05% to +0.05%)
        const change24hVar = (Math.random() - 0.5) * 0.1;
        coin.price_change_percentage_24h = (coin.price_change_percentage_24h || 0) + change24hVar;
        
        if (coin.id === 'bitcoin') {
          console.log(`BTC: ${oldPrice.toFixed(2)} -> ${coin.current_price.toFixed(2)} (${coin.price_change_percentage_24h.toFixed(2)}%)`);
        }
      });
      
      // Add timestamp to force re-render
      const coinsWithTimestamp = global.currentCoins.map(coin => ({
        ...coin,
        _timestamp: Date.now()
      }));
      
      io.emit('coinsUpdate', coinsWithTimestamp);
    };

    // Initial fetch
    await fetchAndEmit();
    
    // Poll CoinGecko every 30 seconds for real data
    pollInterval = setInterval(fetchAndEmit, 30000);
    
    // Subtle updates every 3 seconds
    priceUpdateInterval = setInterval(simulateUpdates, 1000);
    
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
