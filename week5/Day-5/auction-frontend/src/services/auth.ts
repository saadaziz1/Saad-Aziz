import { api } from '@/lib/api';
import { AuthResponse, LoginRequest, RegisterRequest } from '@/types/api';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  checkUsername: async (username: string): Promise<{ available: boolean }> => {
    const response = await api.post<{ available: boolean }>('/auth/check-username', { username });
    return response.data;
  },
};