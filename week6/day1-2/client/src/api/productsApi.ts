import { baseApi } from './baseApi';
import { Product } from '@/types/product.types';

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<{ products: Product[], total: number, page: number, pages: number }, any>({
            query: (params) => ({
                url: '/products',
                params,
            }),
            transformResponse: (response: any) => ({
                products: response.products.map((p: any) => ({
                    id: p._id,
                    title: p.name,
                    srcUrl: p.images?.[0] || '',
                    gallery: p.images || [],
                    price: p.price,
                    discount: {
                        percentage: p.discountPercentage || 0,
                        amount: 0
                    },
                    rating: p.rating || 0,
                    category: p.category,
                    stock: p.stock,
                    description: p.description,
                    sales: p.sales || 0,
                    totalStock: p.totalStock || (p.stock + 50),
                    purchaseType: p.purchaseType,
                    isPointsOnly: p.purchaseType === 'POINTS_ONLY',
                    isHybrid: p.purchaseType === 'HYBRID',
                    pointsPrice: p.pointsPrice || 0,
                    sku: p.sku || '',
                    brand: p.brand || '',
                    tags: p.tags || [],
                    isOnSale: p.isOnSale || false,
                    discountPercentage: p.discountPercentage || 0,
                })),
                total: response.total,
                page: response.page,
                pages: response.pages,
            }),
            providesTags: ['Products'],
        }),
        getProduct: builder.query<Product, string>({
            query: (id) => `/products/${id}`,
            transformResponse: (p: any) => ({
                id: p._id,
                title: p.name,
                name: p.name,
                srcUrl: p.images?.[0] || '',
                gallery: p.images || [],
                price: p.price,
                pointsPrice: p.pointsPrice || 0,
                stock: p.stock || 0,
                totalStock: p.totalStock || (p.stock + 50),
                category: p.category,
                description: p.description,
                sizes: p.sizes || [],
                colors: p.colors || [],
                purchaseType: p.purchaseType,
                isPointsOnly: p.purchaseType === 'POINTS_ONLY',
                isHybrid: p.purchaseType === 'HYBRID',
                discount: {
                    percentage: p.discountPercentage || 0,
                    amount: 0
                },
                discountPercentage: p.discountPercentage || 0,
                rating: p.rating || 0,
                sku: p.sku || '',
                brand: p.brand || '',
                tags: p.tags || [],
                sales: p.sales || 0,
                dressStyle: p.dressStyle,
                isOnSale: p.isOnSale || false,
            }),
            providesTags: (result, error, id: any) => [{ type: 'Products', id }],
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
        updateSaleStatus: builder.mutation({
            query: ({ id, isOnSale, discountPercentage }) => ({
                url: `/products/${id}/sale-status`,
                method: 'PATCH',
                body: { isOnSale, discountPercentage },
            }),
            async onQueryStarted({ id, isOnSale, discountPercentage }, { dispatch, queryFulfilled, getState }) {
                const patches: any[] = [];

                // Optimistically update the detail view cache
                try {
                    const patchDetail = dispatch(
                        productsApi.util.updateQueryData('getProduct', id, (draft) => {
                            draft.isOnSale = isOnSale;
                            draft.discountPercentage = discountPercentage;
                        })
                    );
                    patches.push(patchDetail);
                } catch (e) {
                    // Detail cache might not exist, that's okay
                }

                // Update ALL cached getProducts queries
                const state: any = getState();
                const queries = state.api.queries;

                // Find all getProducts queries in the cache
                Object.keys(queries).forEach((key) => {
                    if (key.startsWith('getProducts(')) {
                        try {
                            // Extract the query args from the cache key
                            const queryArgs = queries[key]?.originalArgs;

                            const patch = dispatch(
                                productsApi.util.updateQueryData('getProducts', queryArgs, (draft: any) => {
                                    const product = draft.products?.find((p: any) => p.id === id);
                                    if (product) {
                                        product.isOnSale = isOnSale;
                                        product.discountPercentage = discountPercentage;
                                    }
                                })
                            );
                            patches.push(patch);
                        } catch (e) {
                            // Skip if update fails for this particular query
                        }
                    }
                });

                try {
                    await queryFulfilled;
                } catch {
                    // Undo all patches on error
                    patches.forEach(patch => patch.undo());
                }
            },
        }),
    }),
    overrideExisting: true,
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useUpdateSaleStatusMutation
} = productsApi;
