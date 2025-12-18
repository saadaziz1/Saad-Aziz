'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, CandlestickChart as CandlestickIcon } from 'lucide-react';
import TradingChart from '../../../components/TradingChart';
import { useSocket } from '../../../hooks/useSocket';

import Loader from '../../../components/Loader';
import ProtectedRoute from '../../../components/ProtectedRoute';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
  total_volume: number;
}

export default function CoinDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const coinId = params.symbol as string;
  const [chartType, setChartType] = useState<'candle' | 'volume'>('candle');
  const [timeframe, setTimeframe] = useState<'1m' | '1h' | '4h' | '1d'>('1h');

  const { allCoins } = useSocket();
  const currentCoin = allCoins.find((coin: CoinData) => coin.id === coinId);
  const [ohlcData, setOhlcData] = useState<any[]>([]);
  const [loadingChart, setLoadingChart] = useState(true);
  
  const currentPrice = currentCoin?.current_price || 0;
  const change24h = currentCoin?.price_change_percentage_24h || 0;
  const volume24h = currentCoin?.total_volume || 0;
  const marketCap = currentCoin?.market_cap || 0;

  // Disable OHLC API calls to avoid rate limiting
  useEffect(() => {
    setLoadingChart(false);
    setOhlcData([]);
  }, [coinId, timeframe]);
  
  // Convert OHLC data to chart format with fallback
  const chartData = useMemo(() => {
    if (ohlcData && ohlcData.length > 0) {
      return ohlcData.map((candle: any) => ({
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4]
      }));
    }
    
    // Fallback: generate chart data from current price
    if (!currentCoin || currentPrice === 0) return [];
    
    const points = 50;
    const basePrice = currentPrice;
    const startPrice = basePrice / (1 + change24h / 100);
    
    return Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1);
      const progressPrice = startPrice + (basePrice - startPrice) * progress;
      const variation = (Math.random() - 0.5) * 0.02;
      const close = progressPrice * (1 + variation);
      
      // Create realistic OHLC values
      const volatility = Math.random() * 0.015 + 0.005; // 0.5% to 2% volatility
      const open = close * (1 + (Math.random() - 0.5) * volatility);
      const high = Math.max(open, close) * (1 + Math.random() * volatility);
      const low = Math.min(open, close) * (1 - Math.random() * volatility);
      const volume = Math.random() * 1000000 + 500000;
      
      return {
        timestamp: Date.now() - (points - 1 - i) * 60000,
        open: Math.max(0.000001, open),
        high: Math.max(0.000001, high),
        low: Math.max(0.000001, low),
        close: Math.max(0.000001, close),
        volume: volume
      };
    });
  }, [ohlcData, currentCoin, currentPrice, change24h]);

  if (!currentCoin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 flex items-center justify-center">
        <Loader size="lg" text="Loading coin details..." />
      </div>
    );
  }

  const formattedPrice = currentPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8
  });

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <img src={currentCoin.image} alt={currentCoin.name} className="w-12 h-12 rounded-full" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{currentCoin.name}</h1>
              <p className="text-muted-foreground uppercase">{currentCoin.symbol}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formattedPrice}</div>
              <div className={`flex items-center gap-1 text-sm ${change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {change24h >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(volume24h / 1000000).toFixed(2)}M</div>
              <p className="text-xs text-muted-foreground">Trading volume</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(marketCap / 1000000000).toFixed(2)}B</div>
              <p className="text-xs text-muted-foreground">Market capitalization</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">24h Change</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={change24h >= 0 ? "default" : "destructive"} className="text-lg font-mono">
                {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <CardTitle>Price Chart</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-mono">${formattedPrice}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Button
                    variant={timeframe === '1m' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeframe('1m')}
                  >
                    1M
                  </Button>
                  <Button
                    variant={timeframe === '1h' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeframe('1h')}
                  >
                    1H
                  </Button>
                  <Button
                    variant={timeframe === '4h' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeframe('4h')}
                  >
                    4H
                  </Button>
                  <Button
                    variant={timeframe === '1d' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeframe('1d')}
                  >
                    1D
                  </Button>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant={chartType === 'candle' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('candle')}
                  >
                    <CandlestickIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === 'volume' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('volume')}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingChart ? (
              <div className="h-80 flex items-center justify-center">
                <div className="text-muted-foreground">Loading chart data...</div>
              </div>
            ) : (
              <TradingChart 
                type={chartType === 'candle' ? 'candlestick' : 'histogram'}
                data={chartData}
                currentPrice={currentPrice}
                interval={timeframe}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}