const https = require('https');

// Test CoinGecko API
const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const coins = JSON.parse(data);
      console.log('CoinGecko API Response:');
      console.log(`Status: ${res.statusCode}`);
      console.log(`Coins fetched: ${coins.length}`);
      coins.forEach(coin => {
        console.log(`${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price} (${coin.price_change_percentage_24h?.toFixed(2)}%)`);
      });
    } catch (err) {
      console.error('Error:', err);
    }
  });
}).on('error', (err) => {
  console.error('Request error:', err);
});