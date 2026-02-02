import { useGetProductsQuery, useGetProductQuery } from '../services/productsApi';

export const useProducts = (query?: string, aiSearch?: boolean) => {
    const { data, isLoading, isFetching, error, refetch } = useGetProductsQuery(
        { q: query, ai: aiSearch },
        { skip: false }
    );

    return {
        products: data?.products || [],
        explanation: data?.explanation,
        isLoading: isLoading || isFetching,
        error,
        refetch,
    };
};

export const useProduct = (id: string) => {
    const { data, isLoading, error } = useGetProductQuery(id, {
        skip: !id,
    });

    return {
        product: data,
        isLoading,
        error,
    };
};
