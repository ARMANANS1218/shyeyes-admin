import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shyeyes-b.onrender.com/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // 🔹 LOGIN API
    login: builder.mutation({
      query: (credentials) => ({
        url: "/admin/login/admin",   // ✅ Fixed endpoint
        method: "POST",
        body: credentials,
      }),
    }),

    // 🔹 FORGOT PASSWORD API
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/admin/forgot-password",  // ✅ Fixed endpoint
        method: "POST",
        body: { email },
      }),
    }),

    // 🔹 OTP VERIFY API
    verifyOtp: builder.mutation({
      query: ({ otp, email }) => ({
        url: "/admin/otp/verify",  // ✅ New endpoint
        method: "POST",
        body: { otp, email },
      }),
    }),

    // 🔹 RESET PASSWORD API
    resetPassword: builder.mutation({
      query: ({ newPassword }) => ({
        url: "/reset-password",  // ✅ Fixed endpoint
        method: "POST",
        body: { password: newPassword },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
} = authApi;
