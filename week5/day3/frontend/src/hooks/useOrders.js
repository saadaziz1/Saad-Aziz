import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersAPI } from '@/api/orders';
import useAuthStore from '@/store/authStore';

export const useOrders = (params = {}) => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersAPI.getUserOrders(params).then(res => res.data),
    enabled: isAuthenticated(),
  });
};

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data) => ordersAPI.placeOrder(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};




