import { baseApi } from './baseApi';

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCart: builder.query({
            query: () => '/cart',
            transformResponse: (response: any) => ({
                ...response,
                items: (response.items || []).map((item: any) => ({
                    id: item.productId?._id || item.productId,
                    productId: item.productId?._id || item.productId,
                    title: item.productId?.name || 'Product',
                    srcUrl: item.productId?.images?.[0] || '',
                    price: item.productId?.price || 0,
                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize,
                    payWithPoints: item.payWithPoints || false,
                    discount: {
                        percentage: item.productId?.discountPercentage || 0,
                        amount: 0
                    },
                    quantity: item.quantity,
                    purchaseType: item.productId?.purchaseType,
                    pointsPrice: item.productId?.pointsPrice,
                    isPointsOnly: item.productId?.purchaseType === 'POINTS_ONLY',
                    isHybrid: item.productId?.purchaseType === 'HYBRID'
                })),
                totalQuantities: (response.items || []).reduce((acc: number, item: any) => acc + item.quantity, 0)
            }),
            providesTags: ['Cart'],
        }),
        addToCart: builder.mutation({
            query: (item) => ({
                url: '/cart/add',
                method: 'POST',
                body: item,
            }),
            invalidatesTags: ['Cart'],
        }),
        updateCart: builder.mutation({
            query: (item) => ({
                url: '/cart/update',
                method: 'PATCH',
                body: item,
            }),
            invalidatesTags: ['Cart'],
        }),
        removeFromCart: builder.mutation({
            query: ({ productId, color, size }: { productId: string; color?: string; size?: string }) => ({
                url: `/cart/remove/${productId}`,
                method: 'DELETE',
                params: { color, size },
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const { useGetCartQuery, useAddToCartMutation, useUpdateCartMutation, useRemoveFromCartMutation } = cartApi;
