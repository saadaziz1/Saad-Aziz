"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { formatPrice } from '@/lib/auctionUtils';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface SocketContextType {
  joinAuction: (auctionId: string) => void;
  leaveAuction: (auctionId: string) => void;
  currentBids: Record<string, { amount: number; count: number; bidderId?: string }>;
  timeUpdates: Record<string, string>;
  isConnected: boolean;
  initializeBidData: (auctionId: string, amount: number, count: number) => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { socket, joinAuction, leaveAuction, onNewBid, off, isConnected } = useSocket();
  const [currentBids, setCurrentBids] = useState<Record<string, { amount: number; count: number; bidderId?: string }>>({});
  const [timeUpdates, setTimeUpdates] = useState<Record<string, string>>({});

  const queryClient = useQueryClient();

  useEffect(() => {
    if (isConnected && socket) {
      console.log('🔗 SocketProvider: Connected to server');
      
      onNewBid((data) => {
        setCurrentBids(prev => ({
          ...prev,
          [data.auctionId]: {
            amount: data.amount,
            count: data.totalBids !== undefined 
              ? data.totalBids 
              : (prev[data.auctionId]?.count || 0) + 1,
            bidderId: data.bidderId
          }
        }));
        
        toast.success(`New bid placed: ${formatPrice(data.amount)}`);
      });

      // Listen for time updates
      socket.on('timeUpdate', (data) => {
        setTimeUpdates(prev => ({
          ...prev,
          [data.auctionId]: data.timeRemaining
        }));
      });

      // Listen for generic notifications
      socket.on('notification', (data: any) => {
        console.log('🔔 SocketProvider: Received notification:', data);
        toast.info(data.message, {
           description: data.title
        });
        // Refresh notifications list if user is logged in
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
        queryClient.invalidateQueries({ queryKey: ['cars'] }); 
      });
    }

    return () => {
      if (socket) {
        console.log('🧹 SocketProvider: Cleaning up socket listeners');
        off('newBid');
        socket.off('timeUpdate');
        socket.off('notification');
      }
    };
  }, [isConnected, socket, queryClient]);

  const initializeBidData = useCallback((auctionId: string, amount: number, count: number) => {
    console.log(`🎆 SocketProvider: Initializing bid data for ${auctionId}:`, { amount, count });
    setCurrentBids(prev => {
      // Only initialize if we don't have data or if the new data is more recent
      const existing = prev[auctionId];
      if (!existing || count >= existing.count) {
        return {
          ...prev,
          [auctionId]: { amount, count }
        };
      }
      return prev;
    });
  }, []);

  return (
    <SocketContext.Provider value={{
      joinAuction,
      leaveAuction,
      currentBids,
      timeUpdates,
      isConnected,
      initializeBidData
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocketContext must be used within SocketProvider');
  }
  return context;
}