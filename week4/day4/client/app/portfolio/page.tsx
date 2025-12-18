'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, TrendingUp, TrendingDown, Wallet, DollarSign, Trash2 } from 'lucide-react';

import { useSearch } from '../../hooks/useSearch';
import { usePagination } from '../../hooks/usePagination';
import { useSocket } from '../../hooks/useSocket';
import Loader from '../../components/Loader';
import AddAssetDialog from '../../components/AddAssetDialog';
import api from '../../lib/axios';
import ProtectedRoute from '../../components/ProtectedRoute';

interface Holding {
  coinId: string;
  coinName: string;
  amount: number;
  avgPrice: number;
  currentPrice?: number;
  totalCost: number;
}

interface Transaction {
  coinId: string;
  coinName: string;
  amount: number;
  price: number;
}

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(true);
  const { allCoins } = useSocket();
  const prevPricesRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (token) {
        // Load from server
        try {
          const response = await api.get('/portfolio');
          setHoldings(response.data);
        } catch {
          // Fallback to localStorage
          const savedPortfolio = localStorage.getItem('cryptoPortfolio');
          if (savedPortfolio) {
            setHoldings(JSON.parse(savedPortfolio));
          }
        }
      } else {
        // Load from localStorage
        const savedPortfolio = localStorage.getItem('cryptoPortfolio');
        if (savedPortfolio) {
          setHoldings(JSON.parse(savedPortfolio));
        }
      }
      setLoading(false);
    };
    
    loadPortfolio();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && holdings.length > 0) {
      // Save to server
      api.post('/portfolio', { holdings }).catch(() => {
        // Fallback to localStorage
        localStorage.setItem('cryptoPortfolio', JSON.stringify(holdings));
      });
    } else if (holdings.length > 0) {
      // Save to localStorage
      localStorage.setItem('cryptoPortfolio', JSON.stringify(holdings));
    }
  }, [holdings]);

  useEffect(() => {
    const coinPrices = allCoins.reduce((acc, coin) => {
      acc[coin.id] = coin.current_price;
      return acc;
    }, {} as Record<string, number>);

    const hasRelevantChanges = holdings.some(holding => {
      const currentPrice = coinPrices[holding.coinId];
      const prevPrice = prevPricesRef.current[holding.coinId];
      return currentPrice && currentPrice !== prevPrice;
    });

    if (!hasRelevantChanges) return;

    prevPricesRef.current = coinPrices;
    
    setHoldings(prev => prev.map(holding => {
      const newPrice = coinPrices[holding.coinId];
      if (!newPrice) return holding;
      
      return { ...holding, currentPrice: newPrice };
    }));
  }, [allCoins, holdings.length]);

  const handleAddAsset = (transaction: Transaction) => {
    setHoldings(prev => {
      const existingIndex = prev.findIndex(h => h.coinId === transaction.coinId);
      
      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const newTotalAmount = existing.amount + transaction.amount;
        const newTotalCost = existing.totalCost + (transaction.amount * transaction.price);
        const newAvgPrice = newTotalCost / newTotalAmount;
        
        const updated = [...prev];
        updated[existingIndex] = {
          ...existing,
          amount: newTotalAmount,
          avgPrice: newAvgPrice,
          totalCost: newTotalCost
        };
        return updated;
      } else {
        const coin = allCoins.find(c => c.id === transaction.coinId);
        const newHolding: Holding = {
          coinId: transaction.coinId,
          coinName: transaction.coinName,
          amount: transaction.amount,
          avgPrice: transaction.price,
          totalCost: transaction.amount * transaction.price,
          currentPrice: coin?.current_price || transaction.price
        };
        return [...prev, newHolding];
      }
    });
  };

  const handleRemoveAsset = (coinId: string) => {
    setHoldings(prev => prev.filter(h => h.coinId !== coinId));
  };

  const { searchTerm, setSearchTerm, filteredItems } = useSearch(holdings || [], (holding) => holding.coinName);
  const { paginatedData } = usePagination(filteredItems || [], 10);

  const portfolioStats = useMemo(() => {
    const totalValue = holdings.reduce((sum, holding) => {
      const currentValue = holding.currentPrice ? holding.amount * holding.currentPrice : holding.amount * holding.avgPrice;
      return sum + currentValue;
    }, 0);
    
    const totalCost = holdings.reduce((sum, holding) => sum + holding.totalCost, 0);
    const totalPnL = totalValue - totalCost;
    const totalPnLPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;
    
    return { totalValue, totalCost, totalPnL, totalPnLPercent };
  }, [holdings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 flex items-center justify-center">
        <Loader size="lg" text="Loading portfolio..." />
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-4 pt-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Portfolio
          </h1>
          <p className="text-muted-foreground">Track and manage your cryptocurrency holdings</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">${portfolioStats.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <p className="text-xs text-muted-foreground">Current portfolio value</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
              {portfolioStats.totalPnL >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-400" /> : 
                <TrendingDown className="h-4 w-4 text-red-400" />
              }
            </CardHeader>
            <CardContent>
              <div className={`text-xl sm:text-2xl font-bold ${portfolioStats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioStats.totalPnL >= 0 ? '+' : ''}${portfolioStats.totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {portfolioStats.totalPnLPercent >= 0 ? '+' : ''}{portfolioStats.totalPnLPercent.toFixed(2)}% total return
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Holdings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">{holdings.length}</div>
              <p className="text-xs text-muted-foreground">Different assets</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle>Holdings</CardTitle>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search holdings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64"
                  />
                </div>
                <AddAssetDialog onAddAsset={handleAddAsset} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {holdings.length === 0 ? (
              <div className="text-center py-12">
                <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No holdings yet</h3>
                <p className="text-muted-foreground mb-4">Start building your portfolio by adding your first asset</p>
                <AddAssetDialog onAddAsset={handleAddAsset} />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Asset</TableHead>
                      <TableHead className="min-w-[100px]">Amount</TableHead>
                      <TableHead className="min-w-[100px] hidden sm:table-cell">Avg Price</TableHead>
                      <TableHead className="min-w-[100px] hidden md:table-cell">Current Price</TableHead>
                      <TableHead className="min-w-[100px]">Value</TableHead>
                      <TableHead className="min-w-[100px] hidden lg:table-cell">P&L</TableHead>
                      <TableHead className="w-[50px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(paginatedData || []).map((holding, index) => {
                      const currentValue = holding.currentPrice ? holding.amount * holding.currentPrice : holding.amount * holding.avgPrice;
                      const pnl = currentValue - holding.totalCost;
                      const pnlPercent = holding.totalCost > 0 ? (pnl / holding.totalCost) * 100 : 0;
                      
                      const coin = allCoins.find(c => c.id === holding.coinId);
                      
                      return (
                        <TableRow key={holding.coinId || `holding-${index}`} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {coin?.image ? (
                                <img 
                                  src={coin.image} 
                                  alt={holding.coinName} 
                                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full" 
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xs font-bold ${coin?.image ? 'hidden' : ''}`}>
                                {(holding.coinName || 'UN').slice(0, 2).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium">{holding.coinName || 'Unknown'}</span>
                                <div className="sm:hidden text-xs text-muted-foreground">
                                  Avg: ${(holding.avgPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono">{holding.amount}</TableCell>
                          <TableCell className="hidden sm:table-cell font-mono">
                            ${holding.avgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="hidden md:table-cell font-mono">
                            {holding.currentPrice ? 
                              `$${holding.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                              '-'
                            }
                          </TableCell>
                          <TableCell className="font-mono font-semibold">
                            ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            <div className="flex flex-col">
                              <span className={`font-mono font-semibold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {pnl >= 0 ? '+' : ''}${pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                              <Badge variant={pnl >= 0 ? "default" : "destructive"} className="text-xs">
                                {pnl >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveAsset(holding.coinId)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </ProtectedRoute>
  );
}