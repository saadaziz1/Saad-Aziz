import { useGetMeQuery } from '@/api/authApi';
import { useUpdateProfileMutation } from '@/api/userApi';
import { useGetOrdersQuery } from '@/api/ordersApi';
import { useAuthStore } from '@/store/useAuthStore';
import { UpdateProfileData } from '@/types/user.types';

export const useProfile = () => {
    const { isAuthenticated, user } = useAuthStore();
    
    const { data: profile, isLoading: isLoadingProfile, error: profileError, refetch: refetchProfile } = useGetMeQuery(undefined, {
        skip: !isAuthenticated,
    });

    const { data: orders, isLoading: isLoadingOrders, error: ordersError } = useGetOrdersQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [updateProfileApi, { isLoading: isUpdating }] = useUpdateProfileMutation();

    const updateProfile = async (userData: UpdateProfileData) => {
        if (!isAuthenticated) return;
        return updateProfileApi(userData).unwrap();
    };

    return {
        profile: profile || user,
        orders: orders || [],
        isLoadingProfile,
        isLoadingOrders,
        profileError,
        ordersError,
        updateProfile,
        isUpdating,
        refetchProfile,
    };
};