import { api } from '@/utils/api';

export interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'student' | 'teacher' | 'moderator';
    isBlocked: boolean;
    rollNumber?: string;
    createdAt: string;
}

export const userService = {
    getUsers: async (): Promise<User[]> => {
        const response = await api.get('/users');
        return response.data;
    },

    toggleBlock: async (id: string): Promise<User> => {
        const response = await api.patch(`/users/${id}/toggle-block`);
        return response.data;
    },

    changeRole: async (id: string, role: string): Promise<User> => {
        const response = await api.patch(`/users/${id}/change-role`, { role });
        return response.data;
    }
};
