import { baseApi } from './baseApi';

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (userData) => ({
                url: '/auth/register',
                method: 'POST',
                body: userData,
            }),
        }),
        getMe: builder.query({
            query: (token?: string) => token ? {
                url: '/users/me',
                headers: { Authorization: `Bearer ${token}` }
            } : '/users/me',
            providesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
