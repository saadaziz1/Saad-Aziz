import { useEffect, useState, useCallback, useRef } from 'react';
import { socket } from '../socket/socket';

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [allCoins, setAllCoins] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const handlersSetup = useRef(false);
  const pricesRef = useRef<Record<string, string>>({});

  const handlePriceUpdate = useCallback((data: { symbol: string; price: string }) => {
    if (pricesRef.current[data.symbol] === data.price) return;
    
    pricesRef.current = { ...pricesRef.current, [data.symbol]: data.price };
    setPrices(pricesRef.current);
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

    const handleCoinsUpdate = (coins: string[]) => {
      setAllCoins(coins);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('coinsUpdate', handleCoinsUpdate);
    socket.on('priceUpdate', handlePriceUpdate);

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