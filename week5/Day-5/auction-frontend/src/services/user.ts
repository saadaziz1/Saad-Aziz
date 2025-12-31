import { api } from '@/lib/api';
import { User } from '@/types/api';

export const userApi = {
    getUserById: async (id: string): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        console.log("response", response);
        return response.data;
    },
};
