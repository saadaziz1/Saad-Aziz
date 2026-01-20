import { baseApi } from './api';

export const rawMaterialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getRawMaterials: builder.query({
            query: () => '/raw-materials',
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }: any) => ({ type: 'RawMaterials' as const, id: _id })), 'RawMaterials']
                    : ['RawMaterials'],
        }),
        getRawMaterial: builder.query({
            query: (id) => `/raw-materials/${id}`,
            providesTags: (result, error, id) => [{ type: 'RawMaterials', id }],
        }),
        createRawMaterial: builder.mutation({
            query: (data) => ({
                url: '/raw-materials',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['RawMaterials'],
        }),
        updateRawMaterial: builder.mutation({
            query: ({ id, data }) => ({
                url: `/raw-materials/${id}`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ['RawMaterials', { type: 'RawMaterials', id }],
        }),
        deleteRawMaterial: builder.mutation({
            query: (id) => ({
                url: `/raw-materials/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['RawMaterials'],
        }),
    }),
});

export const {
    useGetRawMaterialsQuery,
    useGetRawMaterialQuery,
    useCreateRawMaterialMutation,
    useUpdateRawMaterialMutation,
    useDeleteRawMaterialMutation
} = rawMaterialApi;
