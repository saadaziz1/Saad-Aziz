import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '@/api/dashboard';

export const useDashboardAnalytics = () => {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: () => dashboardAPI.getAnalytics().then(res => res.data),
  });
};




