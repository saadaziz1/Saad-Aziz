import { useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useAuthStore } from '../lib/authStore';
import { LoginData, RegisterData, AuthResponse } from '../types';

export const useAuth = () => {
  const { login: setAuth, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData): Promise<AuthResponse> => {
      const response = await api.post('/auth/login', data);
      return response.data.data; // Extract nested data
    },
    onSuccess: (data) => {
      setAuth(data.user, data.token);
    },
    throwOnError: false,
  });

  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post('/auth/register', data);
      return response.data;
    },
    throwOnError: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      logout();
    },
  });

  return {
    login: (data: LoginData, options?: any) => 
      loginMutation.mutate(data, options),
    register: (data: RegisterData, options?: any) => 
      registerMutation.mutate(data, options),
    logout: logoutMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
};