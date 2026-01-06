import { useGetOrdersQuery, usePlaceOrderMutation } from '@/api/ordersApi';
import { useAuthStore } from '@/store/useAuthStore';

export const useOrders = () => {
    const { isAuthenticated, user } = useAuthStore();
    const { data: orders, isLoading, error } = useGetOrdersQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [placeOrderApi, { isLoading: isPlacing }] = usePlaceOrderMutation();

    const handleCheckout = async (checkoutData?: any) => {
        if (!isAuthenticated) return;
        
        // Check if user is admin or super admin
        if (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') {
            throw new Error('Administrators cannot place orders');
        }
        
        return placeOrderApi(checkoutData).unwrap();
    };

    return {
        orders: orders || [],
        isLoading,
        error,
        handleCheckout,
        isPlacing,
    };
};
