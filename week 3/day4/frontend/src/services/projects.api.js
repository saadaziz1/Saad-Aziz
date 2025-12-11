import axiosInstance from './config/axios';

export const projectsAPI = {
  getAll: () => axiosInstance.get('/api/projects'),
  getById: (id) => axiosInstance.get(`/api/projects/${id}`),
  create: (data) => axiosInstance.post('/api/projects', data),
  update: (id, data) => axiosInstance.put(`/api/projects/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/projects/${id}`),
  getStats: () => axiosInstance.get('/api/stats'),
};
