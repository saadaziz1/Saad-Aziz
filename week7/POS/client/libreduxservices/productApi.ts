import { baseApi } from './api';

export const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params) => ({
                url: '/products',
                params
            }),
            providesTags: ['Products'],
        }),
        getProduct: builder.query({
            query: (id) => `/products/${id}`,
            providesTags: (result, error, id) => [{ type: 'Products', id }],
        }),
        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products',
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/products/${id}`,
                method: 'PATCH',
                body: formData,
            }),
            invalidatesTags: (result, error, { id }) => ['Products', { type: 'Products', id }],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
        getProductsByRawMaterial: builder.query({
            query: (materialId) => `/products/by-material/${materialId}`,
            providesTags: ['Products'],
        }),
        deactivateProductsByRawMaterial: builder.mutation({
            query: (materialId) => ({
                url: `/products/deactivate-by-material/${materialId}`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Products'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useGetProductsByRawMaterialQuery,
    useLazyGetProductsByRawMaterialQuery,
    useDeactivateProductsByRawMaterialMutation
} = productApi;
