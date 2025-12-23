import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/authStore';

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface ActivatePlanData {
  planId: string;
  period: 'month' | 'year';
  cardDetails: CardDetails;
}

export const useSubscription = () => {
  const { isAuthenticated } = useAuthStore();
  
  const subscriptionQuery = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await api.get('/subscriptions/check');
      return response.data.data; // Extract nested data
    },
    enabled: isAuthenticated,
    retry: false, // Don't retry on 404
  });

  const freeTrialMutation = useMutation({
    mutationFn: async (cardDetails?: CardDetails) => {
      const response = await api.post('/subscriptions/free-trial', { cardDetails });
      return response.data;
    },
  });

  const activatePlanMutation = useMutation({
    mutationFn: async (data: ActivatePlanData) => {
      const response = await api.post('/subscriptions/plan', data);
      return response.data;
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async () => {
      const response = await api.patch('/subscriptions/cancel');
      return response.data;
    },
  });

  return {
    subscription: subscriptionQuery.data,
    isSubscriptionLoading: subscriptionQuery.isLoading,
    activateFreeTrial: freeTrialMutation.mutate,
    activatePlan: activatePlanMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    isActivatingTrial: freeTrialMutation.isPending,
    isActivatingPlan: activatePlanMutation.isPending,
    isCancelling: cancelSubscriptionMutation.isPending,
  };
};