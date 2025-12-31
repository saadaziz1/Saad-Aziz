import { api } from '@/lib/api';
import { Auction } from '@/types/api';

export interface CreateAuctionRequest {
  car: string;
  startTime: string;
  endTime: string;
  status?: 'upcoming' | 'live' | 'ended' | 'completed';
  currentPrice?: number;
  winningBid?: string;
}

export const auctionsApi = {
  getAll: async (): Promise<Auction[]> => {
    const response = await api.get<Auction[]>('/auctions');
    return response.data;
  },

  getById: async (id: string): Promise<Auction> => {
    const response = await api.get<Auction>(`/auctions/${id}`);
    return response.data;
  },

  create: async (data: CreateAuctionRequest): Promise<Auction> => {
    const response = await api.post<Auction>('/auctions', data);
    return response.data;
  },
};