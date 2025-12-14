import { useQuery } from '@tanstack/react-query';
import { productsAPI } from '@/api/products';

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsAPI.list(params).then(res => res.data),
  });
};

export const useProduct = (id) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsAPI.get(id).then(res => res.data),
    enabled: !!id,
  });
};


