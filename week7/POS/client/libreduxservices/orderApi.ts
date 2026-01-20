import { baseApi } from './api';

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => '/orders',
            providesTags: ['Orders'],
        }),
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: '/orders',
                method: 'POST',
                body: orderData,
            }),
            invalidatesTags: ['Orders', 'Products', 'RawMaterials', 'Dashboard'],
        }),
    }),
});

export const { useGetOrdersQuery, useCreateOrderMutation } = orderApi;
