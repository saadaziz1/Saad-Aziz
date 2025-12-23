'use client';

import CryptoTable from '../components/CryptoTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import ProtectedRoute from '../components/ProtectedRoute';
import { useSocket } from '../hooks/useSocket';

export default function DashboardPage() {
  const { marketStats } = useSocket();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Crypto Dashboard
          </h1>
          <p className="text-muted-foreground">Real-time cryptocurrency prices powered by Binance WebSocket</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${marketStats?.totalMarketCap || '2.1T'}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {marketStats?.marketCapChange && marketStats.marketCapChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                {marketStats?.marketCapChange ? 
                  `${marketStats.marketCapChange >= 0 ? '+' : ''}${marketStats.marketCapChange.toFixed(1)}% from yesterday` : 
                  '+2.1% from yesterday'
                }
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${marketStats?.totalVolume || '89.2B'}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {marketStats?.volumeChange && marketStats.volumeChange >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                {marketStats?.volumeChange ? 
                  `${marketStats.volumeChange >= 0 ? '+' : ''}${marketStats.volumeChange.toFixed(1)}% from yesterday` : 
                  '+12.5% from yesterday'
                }
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Pairs</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{marketStats?.activeCoins || 1247}</div>
              <p className="text-xs text-muted-foreground">Live trading pairs</p>
            </CardContent>
          </Card>
        </div>
        
        <CryptoTable />
      </div>
    </div>
    </ProtectedRoute>
  );
}
