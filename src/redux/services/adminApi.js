import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shyeyes-b.onrender.com/api/auth",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Admins"], // ✅ declare tags here
  endpoints: (builder) => ({
    getAllAdmins: builder.query({
      query: () => ({
        url: "/active-admins",
        method: "GET",
      }),
      providesTags: ["Admins"],
    }),
    createAdmin: builder.mutation({
      query: (adminData) => ({
        url: "/create-admin",
        method: "POST",
        body: adminData,
      }),
      invalidatesTags: ["Admins"],
    }),
  }),
});

export const { useGetAllAdminsQuery, useCreateAdminMutation } = adminApi;
