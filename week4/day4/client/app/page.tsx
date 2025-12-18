'use client';

import CryptoTable from '../components/CryptoTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Activity, DollarSign } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useSocket } from '../hooks/useSocket';

export default function DashboardPage() {
  const { allCoins } = useSocket();
  
  const totalMarketCap = allCoins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
  const totalVolume = allCoins.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
  const avgChange = allCoins.length > 0 ? allCoins.reduce((sum, coin) => sum + (coin.price_change_percentage_24h || 0), 0) / allCoins.length : 0;
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Crypto Dashboard
          </h1>
          <p className="text-muted-foreground">Real-time cryptocurrency prices powered by CoinGecko API</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalMarketCap / 1e12).toFixed(1)}T</div>
              <p className="text-xs text-muted-foreground">{avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}% avg change</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(totalVolume / 1e9).toFixed(1)}B</div>
              <p className="text-xs text-muted-foreground">Trading volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Coins</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCoins.length}</div>
              <p className="text-xs text-muted-foreground">Live tracking</p>
            </CardContent>
          </Card>
        </div>
        
        <CryptoTable />
      </div>
    </div>
    </ProtectedRoute>
  );
}
