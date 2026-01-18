import { apiSlice } from "../../api/apiSlice";

export const productsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<any[], void>({
            query: () => '/products',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Product' as const, id })),
                        { type: 'Product', id: 'LIST' },
                    ]
                    : [{ type: 'Product', id: 'LIST' }],
        }),
        getProductById: builder.query<any, string>({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
    }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi;
