import { baseApi } from './baseApi';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateProfile: builder.mutation({
            query: (userData) => ({
                url: '/users/me',
                method: 'PATCH',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        getUserOrders: builder.query({
            query: () => '/orders',
            providesTags: ['Orders'],
        }),
        getUsers: builder.query({
            query: () => '/admin/users',
            providesTags: ['Users'],
        }),
        getUser: builder.query({
            query: (id: string) => `/admin/users/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        toggleUserStatus: builder.mutation({
            query: (id: string) => ({
                url: `/admin/users/${id}/active-status`,
                method: 'PATCH',
            }),
            invalidatesTags: ['Users'],
        }),
        changeUserRole: builder.mutation({
            query: ({ id, role }: { id: string; role: string }) => ({
                url: `/admin/users/${id}/role`,
                method: 'PATCH',
                body: { role },
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {
    useUpdateProfileMutation,
    useGetUserOrdersQuery,
    useGetUsersQuery,
    useGetUserQuery,
    useToggleUserStatusMutation,
    useChangeUserRoleMutation
} = userApi;