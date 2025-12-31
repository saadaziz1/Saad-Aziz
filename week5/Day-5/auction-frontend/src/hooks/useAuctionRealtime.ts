import { useEffect, useState } from 'react';
import { useSocketContext } from '@/providers/SocketProvider';
import { Car } from '@/types/api';

interface AuctionRealtime {
  currentPrice: number;
  totalBids: number;
  timeRemaining: string;
  isEnded: boolean;
  endTime: string;
}

export const useAuctionRealtime = (car: Car | null | undefined) => {
  const { currentBids, timeUpdates, isConnected } = useSocketContext();
  const [realtimeData, setRealtimeData] = useState<AuctionRealtime | null>(null);

  useEffect(() => {
    if (!car) return;

    const auctionId = car._id;
    const currentPrice = currentBids[auctionId]?.amount || car.currentPrice || car.startingPrice || 0;
    const totalBids = currentBids[auctionId]?.count || car.bids?.length || 0;
    const timeRemaining = timeUpdates[auctionId] || formatTimeRemaining(car.endTime);
    const isEnded = car.isCompleted || new Date(car.endTime) < new Date();

    setRealtimeData({
      currentPrice,
      totalBids,
      timeRemaining,
      isEnded,
      endTime: car.endTime,
    });
  }, [car, currentBids, timeUpdates]);

  return realtimeData;
};

const formatTimeRemaining = (endTime: string | Date): string => {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Auction Ended';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
