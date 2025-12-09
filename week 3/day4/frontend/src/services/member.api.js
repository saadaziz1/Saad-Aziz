import axiosInstance from '../config/axios';

export const memberAPI = {
  getAll: () => axiosInstance.get('/members', { params: { _t: Date.now() } }),
  getById: (id) => axiosInstance.get(`/members/${id}`, { params: { _t: Date.now() } }),
  create: (data) => axiosInstance.post('/members', data),
  update: (id, data) => axiosInstance.put(`/members/${id}`, data),
  delete: (id) => axiosInstance.delete(`/members/${id}`),
};
