import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const apiSlice = createApi({
    reducerPath: 'api',
    tagTypes: ['User', 'Newsletter'],
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
        prepareHeaders: (headers) => {
            const token = Cookies.get('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        // Auth
        login: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['User'],
        }),
        signup: builder.mutation<any, any>({
            query: (userData) => ({
                url: '/auth/signup',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),
        getProfile: builder.query<any, void>({
            query: () => '/auth/profile',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation<any, any>({
            query: (userData) => ({
                url: '/auth/profile',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        // Newsletter
        subscribeToNewsletter: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({
                url: '/newsletter/subscribe',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Newsletter'],
        }),
    }),
});

export const {
    useLoginMutation,
    useSignupMutation,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useSubscribeToNewsletterMutation,
} = apiSlice;
