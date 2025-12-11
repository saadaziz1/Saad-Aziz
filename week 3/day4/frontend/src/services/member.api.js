import axiosInstance from './config/axios';

export const memberAPI = {
  getAll: () => axiosInstance.get('/api/members'),
  getById: (id) => axiosInstance.get(`/api/members/${id}`),
  create: (data) => axiosInstance.post('/api/members', data),
  update: (id, data) => axiosInstance.put(`/api/members/${id}`, data),
  delete: (id) => axiosInstance.delete(`/api/members/${id}`),
};
