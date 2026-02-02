import { api } from '../store/api';

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    brand: string;
    image: string;
    tags: string[];
    inStock: boolean;
}

export interface ProductsResponse {
    products: Product[];
    explanation: string | null;
}

export const productsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<ProductsResponse, { q?: string; ai?: boolean }>({
            query: ({ q, ai }) => ({
                url: '/products',
                params: { q, ai: ai ? 'true' : undefined },
            }),
            providesTags: ['Products'],
        }),

        getProduct: builder.query<Product, string>({
            query: (id) => `/products/${id}`,
        }),
    }),
});

export const { useGetProductsQuery, useGetProductQuery } = productsApi;
