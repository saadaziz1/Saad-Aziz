import { baseApi } from './baseApi';

export const ordersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => '/orders',
            providesTags: ['Orders'],
        }),
        getOrder: builder.query({
            query: (id) => `/orders/${id}`,
            providesTags: (result, error, id) => [{ type: 'Orders', id }],
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/orders/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => ['Orders', { type: 'Orders', id }],
        }),
        bulkUpdateOrderStatus: builder.mutation({
            query: ({ orderIds, status }: { orderIds: string[]; status: string }) => ({
                url: `/orders/bulk-status`,
                method: 'PATCH',
                body: { orderIds, status },
            }),
            invalidatesTags: ['Orders'],
        }),
        placeOrder: builder.mutation({
            query: (checkoutData) => ({
                url: '/orders',
                method: 'POST',
                body: checkoutData,
            }),
            invalidatesTags: ['Orders', 'User', 'Cart'],
        }),
        getOrdersByUser: builder.query({
            query: (userId) => `/orders/user/${userId}`,
            providesTags: ['Orders'],
        }),
    }),
});

export const {
    useGetOrdersQuery,
    useGetOrderQuery,
    useUpdateOrderStatusMutation,
    useBulkUpdateOrderStatusMutation,
    usePlaceOrderMutation,
    useGetOrdersByUserQuery
} = ordersApi;
