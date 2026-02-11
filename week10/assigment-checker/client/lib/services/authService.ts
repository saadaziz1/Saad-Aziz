import { api } from '../../utils/api';

export const authService = {
    login: async (data: any) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },
    signup: async (data: any) => {
        const response = await api.post('/auth/signup', data);
        return response.data;
    },
};
