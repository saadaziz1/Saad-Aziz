import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '@/services/wishlist';
import { toast } from 'sonner';

export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistApi.getUserWishlist(),
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.addToWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      toast.error(message);
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: wishlistApi.removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      toast.error(message);
    },
  });
};