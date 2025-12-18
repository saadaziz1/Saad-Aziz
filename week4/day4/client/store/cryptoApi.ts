import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cryptoApi = createApi({
  reducerPath: 'cryptoApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.binance.com/api/v3' }),
  endpoints: (builder) => ({
    getInitialPrice: builder.query<{ symbol: string; price: string }, string>({
      query: (symbol) => `/ticker/price?symbol=${symbol}`,
    }),
    getKlines: builder.query<any[], { symbol: string; interval: string; limit: number }>({
      query: ({ symbol, interval, limit }) => `/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`,
    }),
    get24hrTicker: builder.query<any, string>({
      query: (symbol) => `/ticker/24hr?symbol=${symbol}`,
    }),
  }),
});

export const { useGetInitialPriceQuery, useGetKlinesQuery, useGet24hrTickerQuery } = cryptoApi;
