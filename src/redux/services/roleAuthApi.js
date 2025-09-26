import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const roleAuthApi = createApi({
  reducerPath: "roleAuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/auth/", // ✅ backend base URL
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Profile", "Auth"],
  endpoints: (builder) => ({
    // ================== Forget Password Flow ==================
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "forgot-password",
        method: "POST",
        body: data, // { email }
      }),
    }),
    verifyPassOtp: builder.mutation({
      query: (data) => ({
        url: "verify-pass-otp",
        method: "POST",
        body: data, // { email, otp }
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "reset-password",
        method: "POST",
        body: data, // { email, newPassword, confirmPassword }
      }),
    }),

    // ================== Profile Management (role-based) ==================
    editProfile: builder.mutation({
      query: ({ role, formData }) => ({
        url: `/${role}/profile/edit`, // superadmin/admin/agents
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
    changeProfileImage: builder.mutation({
      query: ({ role, formData }) => ({
        url: `/${role}/profile/change-image`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useForgotPasswordMutation,
  useVerifyPassOtpMutation,
  useResetPasswordMutation,
  useEditProfileMutation,
  useChangeProfileImageMutation,
} = roleAuthApi;
