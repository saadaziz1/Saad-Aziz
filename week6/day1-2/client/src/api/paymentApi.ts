import { baseApi } from './baseApi';

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createPaymentIntent: builder.mutation<{ clientSecret: string; id: string }, { amount: number; currency?: string; metadata?: any }>({
            query: (body) => ({
                url: '/payments/create-payment-intent',
                method: 'POST',
                body,
            }),
        }),
    }),
});

export const { useCreatePaymentIntentMutation } = paymentApi;
