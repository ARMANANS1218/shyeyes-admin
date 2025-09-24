import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://shyeyes-b.onrender.com/api/admin",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Users"], // Add tagTypes for proper cache invalidation
  endpoints: (builder) => ({
    //     all users
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        method: "GET",
      }),
      providesTags: ["Users"],
      // Add keep unused data for 5 minutes, refetch stale data after 1 minute
      keepUnusedDataFor: 300, // 5 minutes
      refetchOnMountOrArgChange: 60, // Refetch if data is older than 1 minute
    }),
    updateUser: builder.mutation({
      query: ({ id, userData }) => ({
        url: `/update/${id}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
