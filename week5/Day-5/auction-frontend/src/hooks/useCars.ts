import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { carsApi, CreateCarRequest } from '@/services/cars';
import { useAuctionStore } from '@/stores/auctionStore';
import { toast } from 'sonner';
import { Car } from '@/types/api';

interface SearchFilters {
  make?: string;
  model?: string;
  year?: string;
  minPrice?: string;
  maxPrice?: string;
}

export const useCars = (filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['cars', filters],
    queryFn: () => carsApi.getAll(filters),
  });
};

export const useCar = (id: string) => {
  return useQuery({
    queryKey: ['car', id],
    queryFn: () => carsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: carsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cars'] });
      toast.success('Car listed successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create car';
      toast.error(message);
      throw error;
    },
  });
};