import { apiSlice } from "../../api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<any, void>({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: (productId) => ({
                url: '/cart',
                method: 'POST',
                body: { productId },
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCartItem: builder.mutation({
            query: ({ productId, qty }) => ({
                url: '/cart',
                method: 'PATCH',
                body: { productId, qty },
            }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: (productId) => ({
                url: `/cart/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateCartItemMutation,
    useRemoveFromCartMutation,
} = cartApi;
