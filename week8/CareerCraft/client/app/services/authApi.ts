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

interface VerifyOtpDto {
  email: string;
  otp: string;
}

interface ResendOtpDto {
  email: string;
}

interface AuthResponse {
  access_token: string;
}

interface RegisterResponse {
  message: string;
}

interface VerifyOtpResponse {
  message: string;
}

interface ResendOtpResponse {
  message: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_SERVER}auth`}),
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
        } catch {}
      },
    }),

    register: builder.mutation<RegisterResponse, RegisterDto>({
      query: (body) => ({
        url: 'register',
        method: 'POST',
        body,
      }),
    }),

    verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpDto>({
      query: (body) => ({
        url: 'verify-otp',
        method: 'POST',
        body,
      }),
    }),

    resendOtp: builder.mutation<ResendOtpResponse, ResendOtpDto>({
      query: (body) => ({
        url: 'resend-otp',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} = authApi;


