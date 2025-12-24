import api from './axios';

export const dashboardAPI = {
  getAnalytics: () => api.get('/dashboard/analytics'),
};




