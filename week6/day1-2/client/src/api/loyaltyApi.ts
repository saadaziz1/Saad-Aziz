import { baseApi } from './baseApi';

export const loyaltyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getLoyaltyHistory: builder.query<any[], void>({
            query: () => '/loyalty/history',
            providesTags: ['User'],
        }),
        getLoyaltyBalance: builder.query<{ balance: number }, void>({
            query: () => '/loyalty/balance',
            providesTags: ['User'],
        }),
    }),
});

export const { useGetLoyaltyHistoryQuery, useGetLoyaltyBalanceQuery } = loyaltyApi;
