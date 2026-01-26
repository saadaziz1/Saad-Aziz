import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001' }),
    endpoints: (builder) => ({
        uploadPdf: builder.mutation<{ id: string; filename: string }, FormData>({
            query: (formData) => ({
                url: 'documents/upload',
                method: 'POST',
                body: formData,
            }),
        }),
        chat: builder.mutation<{ answer: string; history: any[]; agentPath: string[] }, { pdfId: string; query: string }>({
            query: (payload) => ({
                url: 'ai/query',
                method: 'POST',
                body: payload,
            }),
        }),
    }),
});

export const { useUploadPdfMutation, useChatMutation } = api;
