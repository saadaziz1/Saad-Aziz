import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
}

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers) => {
            // Add session ID for cart
            let sessionId = localStorage.getItem('sessionId');
            if (!sessionId) {
                sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                localStorage.setItem('sessionId', sessionId);
            }
            headers.set('x-session-id', sessionId);

            // Add auth token if available
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ['Products', 'Cart', 'User'],
    endpoints: () => ({}),
});
