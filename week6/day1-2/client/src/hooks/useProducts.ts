import { useGetProductsQuery, useGetProductQuery } from '@/api/productsApi';

export const useProducts = (params?: any) => {
    const { data, isLoading, error } = useGetProductsQuery(params);

    return {
        products: data?.products || (Array.isArray(data) ? data : []),
        isLoading,
        error,
    };
};

export const useProductDetail = (id: string) => {
    const { data: product, isLoading, error } = useGetProductQuery(id, {
        skip: !id,
    });

    return {
        product,
        isLoading,
        error,
    };
};
