import { api } from '../store/api';

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string }, any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),
        signup: builder.mutation<{ token: string }, any>({
            query: (data) => ({
                url: '/auth/signup',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
