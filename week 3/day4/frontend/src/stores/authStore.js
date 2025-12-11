import { create } from 'zustand';

const getStoredToken = () => {
  try {
    return localStorage.getItem('token');
  } catch {
    return null;
  }
};

const initialToken = getStoredToken();

export const useAuthStore = create((set, get) => ({
  token: initialToken,
  isAuthenticated: !!initialToken,
  
  login: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
  
  checkAuth: () => {
    const { token } = get();
    return !!token;
  },
}));
