import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logout } from '../libreduxslices/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined') {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        // Automatically logout on 401
        api.dispatch(logout());
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }
    return result;
};

export const baseApi = createApi({
    reducerPath: 'baseApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Dashboard', 'Auth', 'User', 'RawMaterials', 'Orders', 'Products', 'Category'],
    endpoints: () => ({}),
});
