import { useEffect, useState, useCallback, useRef } from 'react';
import { socket } from '../socket/socket';

interface MarketStats {
  totalMarketCap: string;
  totalVolume: string;
  btcDominance: string;
  activeCoins: number;
  marketCapChange: number;
  volumeChange: number;
  dominanceChange: number;
}

interface TickerData {
  [symbol: string]: {
    priceChangePercent: number;
    volume: number;
  };
}

export const useSocket = () => {
  const [connected, setConnected] = useState(false);
  const [allCoins, setAllCoins] = useState<string[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [marketStats, setMarketStats] = useState<MarketStats | null>(null);
  const [tickerData, setTickerData] = useState<TickerData>({});
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
      socket.emit('requestMarketStats');
      socket.emit('requestTickerData');
    };

    const handleDisconnect = () => {
      setConnected(false);
    };

    const handleCoinsUpdate = (coins: string[]) => {
      setAllCoins(coins);
    };

    const handleMarketStats = (stats: MarketStats) => {
      setMarketStats(stats);
    };
    
    const handleTickerData = (data: TickerData) => {
      setTickerData(data);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('coinsUpdate', handleCoinsUpdate);
    socket.on('priceUpdate', handlePriceUpdate);
    socket.on('marketStats', handleMarketStats);
    socket.on('tickerData', handleTickerData);

    if (socket.connected) {
      setConnected(true);
      socket.emit('requestCoins');
      socket.emit('requestMarketStats');
      socket.emit('requestTickerData');
    } else {
      socket.connect();
    }

    handlersSetup.current = true;

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('coinsUpdate', handleCoinsUpdate);
      socket.off('priceUpdate', handlePriceUpdate);
      socket.off('marketStats', handleMarketStats);
      socket.off('tickerData', handleTickerData);
      handlersSetup.current = false;
    };
  }, [handlePriceUpdate]);

  return { connected, allCoins, prices, marketStats, tickerData };
};