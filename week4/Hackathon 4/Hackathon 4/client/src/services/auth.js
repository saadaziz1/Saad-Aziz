import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

export const userService = {
  activateFreeTrial: async () => {
    const response = await api.post('/user/free-trial');
    return response.data;
  },

  subscribeToPlan: async (subscriptionData) => {
    const response = await api.post('/user/subscribe', subscriptionData);
    return response.data;
  },

  getSubscriptionStatus: async () => {
    const response = await api.get('/user/subscription');
    return response.data;
  }
};

export const videoService = {
  getAllVideos: async (params = {}) => {
    const response = await api.get('/videos', { params });
    return response.data;
  },

  getVideoById: async (id) => {
    const response = await api.get(`/videos/${id}`);
    return response.data;
  },

  getGenres: async () => {
    const response = await api.get('/videos/genres');
    return response.data;
  },

  uploadVideo: async (formData) => {
    const response = await api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  updateVideo: async (id, videoData) => {
    const response = await api.put(`/videos/${id}`, videoData);
    return response.data;
  },

  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/${id}`);
    return response.data;
  }
};

export const planService = {
  getAllPlans: async () => {
    const response = await api.get('/plans');
    return response.data;
  },

  getPlanById: async (id) => {
    const response = await api.get(`/plans/${id}`);
    return response.data;
  }
};

export const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/block`);
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await api.put(`/admin/users/${userId}/unblock`);
    return response.data;
  },

  createAdmin: async (adminData) => {
    const response = await api.post('/admin/create-admin', adminData);
    return response.data;
  },

  createPlan: async (planData) => {
    const response = await api.post('/admin/plans', planData);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  }
};