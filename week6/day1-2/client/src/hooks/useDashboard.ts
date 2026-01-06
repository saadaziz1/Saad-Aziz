import { useGetOrdersQuery } from '@/api/ordersApi';
import { useGetMeQuery } from '@/api/authApi';
import { useGetProductsQuery } from '@/api/productsApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { ProductCategory, ProductType } from '@/types/product.types';

export const useDashboard = () => {
    const { isAuthenticated } = useAuthStore();
    const { selectedPeriod } = useDashboardStore();

    const { data: profile, isLoading: isLoadingProfile } = useGetMeQuery(undefined, {
        skip: !isAuthenticated,
    });

    const { data: orders = [], isLoading: isLoadingOrders } = useGetOrdersQuery(undefined, {
        skip: !isAuthenticated,
    });

    const { data: allProducts, isLoading: isLoadingProducts } = useGetProductsQuery(undefined, {
        skip: !isAuthenticated,
    });

    // Calculate dashboard stats
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(orders.map((order: any) => order.userId)).size;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const activeOrders = orders.filter((order: any) =>
        ['PENDING', 'PAID', 'SHIPPED'].includes(order.status)
    ).length;

    const completedOrders = orders.filter((order: any) =>
        order.status === 'DELIVERED'
    ).length;

    const returnOrders = orders.filter((order: any) =>
        order.status === 'CANCELLED'
    ).length;

    // Derive categories and types from real products + enums
    const productsArray = Array.isArray(allProducts) ? allProducts : (allProducts?.products || []);

    const categoriesWithCounts = Object.values(ProductCategory).map(cat => ({
        name: cat,
        count: productsArray.filter((p: any) => p.category === cat).length
    }));

    const typesWithCounts = Object.values(ProductType).map(type => ({
        name: type,
        count: productsArray.filter((p: any) => p.type === type).length
    }));

    // Recent orders (last 5)
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);


    return {
        profile,
        orders,
        allProducts,
        isLoadingOrders,
        isLoadingProducts,
        isLoadingProfile,
        stats: {
            totalRevenue,
            totalOrders,
            totalCustomers,
            avgOrderValue,
            activeOrders,
            completedOrders,
            returnOrders,
        },
        recentOrders,
        categories: categoriesWithCounts,
        types: typesWithCounts,
    };
};