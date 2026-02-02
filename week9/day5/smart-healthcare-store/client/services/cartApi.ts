import { api } from '../store/api';

export interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
}

export interface Cart {
    _id: string;
    sessionId: string;
    items: CartItem[];
    total: number;
}

export const cartApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query<Cart, void>({
            query: () => '/cart',
            providesTags: ['Cart'],
        }),

        addToCart: builder.mutation<Cart, { productId: string; quantity?: number }>({
            query: (body) => ({
                url: '/cart/add',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Cart'],
        }),

        updateQuantity: builder.mutation<Cart, { productId: string; quantity: number }>({
            query: (body) => ({
                url: '/cart/update',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Cart'],
        }),

        removeFromCart: builder.mutation<Cart, string>({
            query: (productId) => ({
                url: `/cart/remove/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),

        clearCart: builder.mutation<Cart, void>({
            query: () => ({
                url: '/cart/clear',
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddToCartMutation,
    useUpdateQuantityMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} = cartApi;
