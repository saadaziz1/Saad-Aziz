'use client';
import React, { useCallback } from 'react';
import CryptoRow from './CryptoRow';
import { socket } from '../socket/socket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronLeft, ChevronRight, Wifi, WifiOff, Search } from 'lucide-react';

import { useSocket } from '../hooks/useSocket';
import { useSearch } from '../hooks/useSearch';
import { usePagination } from '../hooks/usePagination';
import TableSkeleton from './TableSkeleton';

export default function CryptoTable() {
  const { connected, allCoins, prices } = useSocket();
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(allCoins, (coin) => coin);
  const { 
    currentPage, 
    pageSize, 
    totalPages, 
    startIndex, 
    paginatedData, 
    goToPage, 
    changePageSize 
  } = usePagination(filteredItems, 10);

  const handleCoinLimitChange = useCallback((value: string) => {
    socket.emit('updateCoins', parseInt(value));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    goToPage(1);
  }, [setSearchTerm, goToPage]);

  const handlePageSizeChange = useCallback((value: string) => {
    changePageSize(parseInt(value));
  }, [changePageSize]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              Cryptocurrency Dashboard
              <Badge variant={connected ? "default" : "destructive"} className="flex items-center gap-1">
                {connected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {connected ? 'Live' : 'Offline'}
              </Badge>
            </CardTitle>
            <Badge variant="outline">{filteredItems.length} coins</Badge>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap">Show:</label>
              <select 
                defaultValue="20" 
                onChange={(e) => handleCoinLimitChange(e.target.value)}
                className="px-3 py-1 border border-border bg-background text-foreground rounded-md text-sm min-w-0 focus:ring-2 focus:ring-primary"
              >
                <option value="10">Top 10</option>
                <option value="20">Top 20</option>
                <option value="50">Top 50</option>
                <option value="100">Top 100</option>
              </select>
             
            </div>
            <div className="flex items-center gap-2 w-full sm:flex-1">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search coins..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full sm:max-w-sm"
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">Symbol</TableHead>
                <TableHead className="min-w-[120px]">Price (USD)</TableHead>
                <TableHead className="min-w-[100px] hidden sm:table-cell">24h Change</TableHead>
                <TableHead className="min-w-[100px] hidden md:table-cell">Chart</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allCoins.length === 0 && !searchTerm ? (
                <TableSkeleton rows={10} columns={4} />
              ) : paginatedData.length > 0 ? (
                paginatedData.map((coin) => (
                  <CryptoRow key={coin} symbol={coin} socketPrice={prices[coin] ?? null} />
                ))
              ) : (
                <TableRow>
                  <td colSpan={4} className="text-center py-8 text-muted-foreground">
                    {searchTerm ? 'No coins found matching your search.' : 'Loading coins...'}
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredItems.length)} of {filteredItems.length}
              </span>
              <div className="flex items-center gap-2">
                <select 
                  value={pageSize.toString()} 
                  onChange={(e) => handlePageSizeChange(e.target.value)}
                  className="px-2 py-1 border border-border bg-background text-foreground rounded text-sm focus:ring-2 focus:ring-primary"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-muted-foreground whitespace-nowrap">per page</span>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="hidden sm:flex"
              >
                First
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-2 whitespace-nowrap">
                {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="hidden sm:flex"
              >
                Last
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
