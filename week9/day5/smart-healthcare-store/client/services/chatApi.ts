import { api } from '../store/api';

export interface ChatProduct {
    _id: string;
    name: string;
    price: number;
    description?: string;
    brand?: string;
    category?: string;
    image?: string;
}

export interface ChatResponse {
    reply: string;
    products?: ChatProduct[];
    handedOff?: boolean;
    history?: any[];
}

export const chatApi = api.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation<ChatResponse, string>({
            query: (message) => ({
                url: '/chat',
                method: 'POST',
                body: { message },
            }),
        }),

        getRecommendations: builder.mutation<ChatResponse, string>({
            query: (message) => ({
                url: '/chat/recommend',
                method: 'POST',
                body: { message },
            }),
        }),
    }),
});

export const { useSendMessageMutation, useGetRecommendationsMutation } = chatApi;
