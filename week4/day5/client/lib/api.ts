import axios from 'axios';
import { useAuthStore } from './authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage directly since Zustand might not be hydrated yet
    let token = null;
    try {
      if (typeof window !== 'undefined') {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          token = parsed.state?.token;
        }
      }
    } catch (error) {
      console.error('Error getting token from storage:', error);
    }
    
    // Also try to get from Zustand store as fallback
    if (!token) {
      token = useAuthStore.getState().token;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for protected routes, not public ones
    const isPublicRoute = window.location.pathname === '/' || 
                         window.location.pathname.startsWith('/movies') ||
                         window.location.pathname.startsWith('/auth');
    
    if (error.response?.status === 401 && !isPublicRoute) {
      useAuthStore.getState().logout();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);