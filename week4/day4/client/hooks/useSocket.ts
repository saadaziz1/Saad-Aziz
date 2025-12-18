import { useEffect, useState, useCallback, useRef } from 'react';
import { socket } from '../socket/socket';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [allCoins, setAllCoins] = useState<CoinData[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const handlersSetup = useRef(false);
  const pricesRef = useRef<Record<string, string>>({});

  const handlePriceUpdate = useCallback((data: { id: string; price: number }) => {
    // Not used with real data polling
  }, []);

  useEffect(() => {
    if (handlersSetup.current) return;
    
    const handleConnect = () => {
      setConnected(true);
      socket.emit('requestCoins');
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleCoinsUpdate = (coins: CoinData[]) => {
      setAllCoins([...coins]); // Force new array reference
      setLastUpdate(Date.now()); // Force re-render
      console.log(`Received ${coins.length} coins from server`);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('coinsUpdate', handleCoinsUpdate);
    // socket.on('priceUpdate', handlePriceUpdate); // Not needed with real polling

    if (socket.connected) {
      setConnected(true);
      socket.emit('requestCoins');
    } else {
      socket.connect();
    }

    handlersSetup.current = true;

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('coinsUpdate', handleCoinsUpdate);
      socket.off('priceUpdate', handlePriceUpdate);
      handlersSetup.current = false;
    };
  }, [handlePriceUpdate]);

  return { connected, allCoins, prices };
};