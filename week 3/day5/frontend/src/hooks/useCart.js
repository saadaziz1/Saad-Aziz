import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartAPI } from '@/api/cart';
import useAuthStore from '@/store/authStore';

export const useCart = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => cartAPI.getCart().then(res => res.data),
    enabled: isAuthenticated(),
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => cartAPI.addToCart(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }) => 
      cartAPI.updateItem(itemId, { quantity }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId) => cartAPI.removeItem(itemId).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};




