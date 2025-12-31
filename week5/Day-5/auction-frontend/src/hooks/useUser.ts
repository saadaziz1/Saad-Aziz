import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/services/user';

export const useUser = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['user', userId],
        queryFn: () => (userId ? userApi.getUserById(userId) : null),
        enabled: !!userId,
    });
};
