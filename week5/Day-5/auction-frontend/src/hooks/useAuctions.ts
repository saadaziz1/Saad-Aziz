import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auctionsApi, CreateAuctionRequest } from '@/services/auctions';
import { useAuctionStore } from '@/stores/auctionStore';

export const useAuctions = () => {
  const setAuctions = useAuctionStore((state) => state.setAuctions);

  const query = useQuery({
    queryKey: ['auctions'],
    queryFn: auctionsApi.getAll,
  });

  useEffect(() => {
    if (query.data) {
      setAuctions(query.data);
    }
  }, [query.data, setAuctions]);

  return query;
};

export const useAuction = (id: string) => {
  const setSelectedAuction = useAuctionStore((state) => state.setSelectedAuction);

  const query = useQuery({
    queryKey: ['auction', id],
    queryFn: () => auctionsApi.getById(id),
    enabled: !!id,
  });

  useEffect(() => {
    if (query.data) {
      setSelectedAuction(query.data);
    }
  }, [query.data, setSelectedAuction]);

  return query;
};

export const useCreateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: auctionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create auction';
      throw new Error(message);
    },
  });
};