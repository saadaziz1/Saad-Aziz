import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL, // Backend URL from .env
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token || localStorage.getItem('token');
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Product', 'Cart', 'User'],
    endpoints: (builder) => ({}),
});
