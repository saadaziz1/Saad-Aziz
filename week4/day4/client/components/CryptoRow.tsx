'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

interface CryptoRowProps {
  coin: CoinData;
}

const CryptoRow: React.FC<CryptoRowProps> = ({ coin }) => {
  const router = useRouter();
  
  const currentPrice = coin.current_price.toString();
  const change24h = coin.price_change_percentage_24h || 0;

  // Generate dummy 24h chart data based on current price and 24h change
  const chartData = useMemo(() => {
    const basePrice = coin.current_price;
    if (basePrice <= 0) return [];
    
    const startPrice = basePrice / (1 + change24h / 100);
    return Array.from({ length: 24 }, (_, i) => {
      const progress = i / 23;
      const variation = (Math.random() - 0.5) * 0.02;
      const price = startPrice + (basePrice - startPrice) * progress + startPrice * variation;
      return { value: price };
    });
  }, [coin.current_price, change24h]);



  const formattedPrice = coin.current_price.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  });
  
  // Generate simple chart data based on 24h change
  const miniChartData = useMemo(() => {
    const points = 20;
    const basePrice = coin.current_price;
    const startPrice = basePrice / (1 + change24h / 100);
    
    return Array.from({ length: points }, (_, i) => {
      const progress = i / (points - 1);
      const price = startPrice + (basePrice - startPrice) * progress;
      const variation = (Math.random() - 0.5) * 0.01;
      return price * (1 + variation);
    });
  }, [coin.current_price, change24h]);

  return (
    <TableRow className="hover:bg-muted/50 cursor-pointer" onClick={() => router.push(`/coin/${coin.id}`)}>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <img src={coin.image} alt={coin.name} className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <span className="font-medium">{coin.name}</span>
            <span className="text-sm text-muted-foreground uppercase">{coin.symbol}</span>
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
        <div className="w-16 h-8">
          <svg width="64" height="32" className="overflow-visible">
            <polyline
              fill="none"
              stroke={change24h >= 0 ? '#10B981' : '#EF4444'}
              strokeWidth="1.5"
              points={miniChartData.map((price, i) => {
                const x = (i / (miniChartData.length - 1)) * 60;
                const minPrice = Math.min(...miniChartData);
                const maxPrice = Math.max(...miniChartData);
                const y = 28 - ((price - minPrice) / (maxPrice - minPrice)) * 24;
                return `${x},${y}`;
              }).join(' ')}
            />
          </svg>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CryptoRow;