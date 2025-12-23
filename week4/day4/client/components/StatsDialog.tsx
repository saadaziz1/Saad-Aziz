'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StatsDialogProps {
  coins: string[];
  prices: Record<string, string>;
}

export default function StatsDialog({ coins, prices }: StatsDialogProps) {
  const [open, setOpen] = useState(false);

  // Calculate 24hr stats
  const stats = {
    totalCoins: coins.length,
    avgPrice: coins.reduce((sum, coin) => sum + parseFloat(prices[coin] || '0'), 0) / coins.length,
    highestPrice: Math.max(...coins.map(coin => parseFloat(prices[coin] || '0'))),
    lowestPrice: Math.min(...coins.map(coin => parseFloat(prices[coin] || '0'))),
    totalVolume: Math.random() * 10000000000, // Mock volume
    marketTrend: Math.random() > 0.5 ? 'up' : 'down'
  };

  // Generate chart data for top 10 coins by price
  const chartData = coins
    .slice(0, 10)
    .map(coin => ({
      symbol: coin.replace('USDT', ''),
      price: parseFloat(prices[coin] || '0'),
      change: (Math.random() - 0.5) * 10
    }))
    .sort((a, b) => b.price - a.price);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          24h Stats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            24 Hour Market Statistics
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Coins</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCoins}</div>
                <p className="text-xs text-muted-foreground">Active trading pairs</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Price</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.avgPrice.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Across all pairs</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Highest Price</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">${stats.highestPrice.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">24h peak</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lowest Price</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-400">${stats.lowestPrice.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">24h low</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top 10 Coins by Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="symbol" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number | undefined) => [`$${(value || 0).toFixed(2)}`, 'Price']}
                    />
                    <Bar dataKey="price" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Volume (24h):</span>
                  <span className="font-mono">${(stats.totalVolume / 1000000000).toFixed(2)}B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Trend:</span>
                  <span className={`flex items-center gap-1 ${stats.marketTrend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {stats.marketTrend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    {stats.marketTrend === 'up' ? 'Bullish' : 'Bearish'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price Range:</span>
                  <span className="font-mono">${stats.lowestPrice.toFixed(2)} - ${stats.highestPrice.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Export Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Set Price Alerts
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  View Historical Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}