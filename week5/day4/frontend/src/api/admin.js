import api from './axios';

export const adminAPI = {
  promoteToAdmin: (id) => api.put(`/admin/users/${id}/promote-admin`),
  promoteToSuperadmin: (id) => api.put(`/admin/users/${id}/promote-superadmin`),
  demoteToUser: (id) => api.put(`/admin/users/${id}/demote`),
};

