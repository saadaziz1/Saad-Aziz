import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:4000";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Conversations", "Conversation", "Summary"],
  endpoints: (builder) => ({
    askQuestion: builder.mutation<
      any,
      {
        question: string;
        conversationId?: string;
      }
    >({
      query: ({ question, conversationId }) => ({
        url: "/chat/ask",
        method: "POST",
        body: { question, conversationId },
      }),
      invalidatesTags: (result, error, { conversationId }) =>
        conversationId
          ? [{ type: "Conversation", id: conversationId }]
          : [{ type: "Conversations" }],
    }),

    listConversations: builder.query<any[], number | void>({
      query: () => `/chat/conversations`,
      providesTags: ["Conversations"],
    }),

    getConversation: builder.query<any, string>({
      query: (conversationId) => `/chat/history/${conversationId}`,
      providesTags: (result, error, conversationId) => [
        { type: "Conversation", id: conversationId },
      ],
    }),
  }),
});

export const {
  useAskQuestionMutation,
  useListConversationsQuery,
  useGetConversationQuery,
} = chatApi;
