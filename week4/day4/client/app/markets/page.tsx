'use client';

import CryptoTable from '../../components/CryptoTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Globe, Bitcoin } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

export default function MarketsPage() {
  const { allCoins } = useSocket();
  
  const totalMarketCap = allCoins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const totalVolume = allCoins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
  const btcCoin = allCoins.find(coin => coin.id === 'bitcoin');
  const btcDominance = btcCoin && totalMarketCap > 0 ? (btcCoin.market_cap / totalMarketCap) * 100 : 0;
  const avgChange = allCoins.length > 0 ? allCoins.reduce((sum, coin) => sum + (coin.price_change_percentage_24h || 0), 0) / allCoins.length : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Crypto Markets
          </h1>
          <p className="text-muted-foreground">Real-time cryptocurrency market data and analytics</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalMarketCap / 1e12).toFixed(1)}T</div>
              <div className="flex items-center gap-1 mt-1">
                {avgChange >= 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                <Badge variant={avgChange >= 0 ? "default" : "destructive"} className="text-xs">
                  {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalVolume / 1e9).toFixed(1)}B</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-blue-500" />
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
              <Bitcoin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{btcDominance.toFixed(1)}%</div>
              <div className="flex items-center gap-1 mt-1">
                {btcCoin?.price_change_percentage_24h >= 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
                <Badge variant={btcCoin?.price_change_percentage_24h >= 0 ? "default" : "destructive"} className="text-xs">
                  {btcCoin?.price_change_percentage_24h >= 0 ? '+' : ''}{btcCoin?.price_change_percentage_24h?.toFixed(1) || '0'}%
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Coins</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCoins.length}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3 text-blue-500" />
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <CryptoTable />
      </div>
    </div>
  );
}