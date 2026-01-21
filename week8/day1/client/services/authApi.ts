import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface LoginDto {
  email: string;
  password: string;
}

interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
}

interface RegisterResponse {
  message: string;
}

// Helper to set cookie
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof window === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_SERVER}/auth` }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginDto>({
      query: (body) => ({
        url: 'login',
        method: 'POST',
        body,
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem('token', data.access_token);
          setCookie('token', data.access_token, 7); // Set cookie for middleware
        } catch { }
      },
    }),

    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (body) => ({
        url: 'register',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApi;

