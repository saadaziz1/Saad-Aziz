'use client';

import CryptoTable from '../../components/CryptoTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, BarChart3, Globe, Bitcoin } from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';

export default function MarketsPage() {
  const { marketStats } = useSocket();

  const StatCard = ({ title, icon, value, change, changeLabel }: {
    title: string;
    icon: React.ReactNode;
    value: string | number;
    change?: number;
    changeLabel?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {typeof value === 'string' && !value.startsWith('$') ? `$${value}` : value}
        </div>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <Badge 
              variant={change >= 0 ? "default" : "destructive"} 
              className="text-xs"
            >
              {changeLabel || `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );

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
          <StatCard
            title="Total Market Cap"
            icon={<Globe className="h-4 w-4 text-muted-foreground" />}
            value={marketStats?.totalMarketCap || '2.1T'}
            change={marketStats?.marketCapChange}
          />
          
          <StatCard
            title="24h Volume"
            icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            value={marketStats?.totalVolume || '89.2B'}
            change={marketStats?.volumeChange}
          />
          
          <StatCard
            title="BTC Dominance"
            icon={<Bitcoin className="h-4 w-4 text-muted-foreground" />}
            value={marketStats?.btcDominance || '42.3%'}
            change={marketStats?.dominanceChange}
          />
          
          <StatCard
            title="Active Coins"
            icon={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
            value={marketStats?.activeCoins || 2847}
            changeLabel="Live"
          />
        </div>

        <CryptoTable />
      </div>
    </div>
  );
}