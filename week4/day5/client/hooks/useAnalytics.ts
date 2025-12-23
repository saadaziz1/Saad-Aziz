import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export const useAnalytics = () => {
  const analyticsQuery = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const response = await api.get('/analytics/dashboard');
      return response.data.data;
    },
  });

  return {
    analytics: analyticsQuery.data,
    isAnalyticsLoading: analyticsQuery.isLoading,
    analyticsError: analyticsQuery.error,
  };
};