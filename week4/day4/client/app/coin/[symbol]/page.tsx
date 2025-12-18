'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, TrendingUp, TrendingDown, BarChart3, CandlestickChart as CandlestickIcon } from 'lucide-react';
import TradingChart from '../../../components/TradingChart';
import { useSocket } from '../../../hooks/useSocket';
import { useGetInitialPriceQuery, useGetKlinesQuery, useGet24hrTickerQuery } from '../../../store/cryptoApi';
import Loader from '../../../components/Loader';
import ProtectedRoute from '../../../components/ProtectedRoute';

export default function CoinDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const symbol = params.symbol as string;
  const [chartType, setChartType] = useState<'candle' | 'volume'>('candle');
  const [timeframe, setTimeframe] = useState<'1m' | '1h' | '4h' | '1d'>('1h');

  
  const { prices } = useSocket();
  const { data, isLoading } = useGetInitialPriceQuery(symbol);
  const { data: tickerData, isLoading: tickerLoading } = useGet24hrTickerQuery(symbol);
  
  const intervalMap = { '1m': '1m', '1h': '1h', '4h': '4h', '1d': '1d' } as const;
  const limitMap = { '1m': 100, '1h': 100, '4h': 100, '1d': 100 } as const;
  
  const { data: klinesData, isLoading: klinesLoading } = useGetKlinesQuery({
    symbol,
    interval: intervalMap[timeframe],
    limit: limitMap[timeframe]
  }, {
    pollingInterval: timeframe === '1m' ? 5000 : 0
  });
  
  const currentPrice = prices[symbol] || data?.price || '0';
  const change24h = tickerData ? parseFloat(tickerData.priceChangePercent) : 0;
  const volume24h = tickerData ? parseFloat(tickerData.volume) * parseFloat(currentPrice) : 0;
  const marketCap = tickerData ? parseFloat(currentPrice) * parseFloat(tickerData.count) * 1000 : 0;

  const chartData = useMemo(() => {
    if (!klinesData) return [];
    
    return klinesData.map((kline: any) => ({
      timestamp: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }));
  }, [klinesData]);

  if (isLoading || klinesLoading || tickerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 flex items-center justify-center">
        <Loader size="lg" text="Loading coin details..." />
      </div>
    );
  }

  const formattedPrice = parseFloat(currentPrice).toLocaleString('en-US', {
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
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {symbol.slice(0, 2)}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{symbol.replace('USDT', '/USDT')}</h1>
              <p className="text-muted-foreground">Cryptocurrency</p>
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
            <TradingChart 
              type={chartType === 'candle' ? 'candlestick' : 'histogram'}
              data={chartData}
              currentPrice={currentPrice}
              interval={intervalMap[timeframe]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}