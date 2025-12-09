import axiosInstance from '../config/axios';

export const projectsAPI = {
  getAll: () => axiosInstance.get('/projects', { params: { _t: Date.now() } }),
  getById: (id) => axiosInstance.get(`/projects/${id}`, { params: { _t: Date.now() } }),
  create: (data) => axiosInstance.post('/projects', data),
  update: (id, data) => axiosInstance.put(`/projects/${id}`, data),
  delete: (id) => axiosInstance.delete(`/projects/${id}`),
  getStats: () => axiosInstance.get('/projects/stats', { params: { _t: Date.now() } }),
};
