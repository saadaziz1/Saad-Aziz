import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi, CreatePaymentRequest } from '@/services/payments';
import { toast } from 'sonner';

export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: paymentsApi.getAll,
  });
};

export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: paymentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create payment';
      toast.error(message);
      throw error;
    },
  });
};