'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useGetInitialPriceQuery, useGet24hrTickerQuery } from '../store/cryptoApi';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import CryptoRowSkeleton from './CryptoRowSkeleton';

interface CryptoRowProps {
  symbol: string;
  socketPrice: string | null;
}

const CryptoRow: React.FC<CryptoRowProps> = ({ symbol, socketPrice }) => {
  const router = useRouter();
  const { data, isLoading, isError } = useGetInitialPriceQuery(symbol);
  const { data: tickerData } = useGet24hrTickerQuery(symbol);

  const currentPrice = socketPrice || data?.price || '0';
  const change24h = tickerData ? parseFloat(tickerData.priceChangePercent) : 0;

  // Generate dummy 24h chart data based on current price and 24h change
  const chartData = useMemo(() => {
    const basePrice = parseFloat(currentPrice);
    if (basePrice <= 0) return [];
    
    const startPrice = basePrice / (1 + change24h / 100);
    return Array.from({ length: 24 }, (_, i) => {
      const progress = i / 23;
      const variation = (Math.random() - 0.5) * 0.02;
      const price = startPrice + (basePrice - startPrice) * progress + startPrice * variation;
      return { value: price };
    });
  }, [currentPrice, change24h]);

  if (isLoading) return <CryptoRowSkeleton />;

  if (isError)
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center text-destructive">
          Error
        </TableCell>
      </TableRow>
    );

  const formattedPrice = parseFloat(currentPrice).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });

  return (
    <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => router.push(`/coin/${symbol}`)}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {symbol.slice(0, 2)}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="font-medium">{symbol.replace('USDT', '/USDT')}</span>
            <div className="flex items-center gap-1 sm:hidden">
              <Badge variant={change24h >= 0 ? 'default' : 'destructive'} className="font-mono text-xs">
                {change24h >= 0 ? '+' : ''}
                {change24h.toFixed(2)}%
              </Badge>
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="font-mono">
        <div className="flex items-center gap-1">
          <span className="text-sm sm:text-base">
            ${formattedPrice}
          </span>
          {change24h > 0 && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />}
          {change24h < 0 && <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-400" />}
          {change24h === 0 && <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />}
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <Badge variant={change24h >= 0 ? 'default' : 'destructive'} className="font-mono">
          {change24h >= 0 ? '+' : ''}
          {change24h.toFixed(2)}%
        </Badge>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <div className="w-16 h-8 min-w-16 min-h-8">
          {chartData.length > 0 ? (
            <ResponsiveContainer width={64} height={32} minWidth={64} minHeight={32}>
              <LineChart data={chartData} width={64} height={32}>
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={change24h >= 0 ? '#10B981' : '#EF4444'} 
                  strokeWidth={1}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-16 h-8 flex items-center justify-center text-muted-foreground text-xs">-</div>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CryptoRow;