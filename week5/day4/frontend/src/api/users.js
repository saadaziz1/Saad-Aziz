import api from './axios';

export const usersAPI = {
  list: (params) => api.get('/users', { params }),
  block: (id) => api.put(`/users/${id}/block`),
  unblock: (id) => api.put(`/users/${id}/unblock`),
  mentionSearch: (query) => api.get('/users/mention-search', { params: { q: query } }),
};

