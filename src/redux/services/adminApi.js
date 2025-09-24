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
    // SuperAdmin endpoint to get all admins
    getAllAdminsBySuperAdmin: builder.query({
      query: ({ page = 1, limit = 10, search = "", status = "" } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        });
        
        if (search.trim()) {
          params.append('search', search.trim());
        }
        
        if (status && status !== "All") {
          params.append('status', status);
        }
        
        return {
          url: `../superadmin/alladmins?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Admins"],
      // Add keep unused data for 5 minutes, refetch stale data after 1 minute  
      keepUnusedDataFor: 300, // 5 minutes
      refetchOnMountOrArgChange: 60, // Refetch if data is older than 1 minute
    }),
    // Get single admin details
    getAdminById: builder.query({
      query: (adminId) => ({
        url: `../superadmin/admins/${adminId}`,
        method: "GET",
      }),
      providesTags: (result, error, adminId) => [{ type: "Admins", id: adminId }],
    }),
    // Update admin
    updateAdmin: builder.mutation({
      query: ({ adminId, adminData }) => ({
        url: `../superadmin/admins/${adminId}`,
        method: "PUT",
        body: adminData,
      }),
      invalidatesTags: (result, error, { adminId }) => [
        { type: "Admins", id: adminId },
        "Admins",
      ],
    }),
    // Block admin (ban)
    banAdmin: builder.mutation({
      query: ({ adminId, reason = "Policy violation - banned by super admin" }) => ({
        url: `../superadmin/admins/${adminId}/ban`,
        method: "PATCH",
        body: {
          reason
        }
      }),
      invalidatesTags: (result, error, { adminId }) => [
        { type: "Admins", id: adminId },
        "Admins",
      ],
    }),
    // Unblock admin (unban)
    unbanAdmin: builder.mutation({
      query: (adminId) => ({
        url: `../superadmin/admins/${adminId}/unban`,
        method: "PATCH"
      }),
      invalidatesTags: (result, error, adminId) => [
        { type: "Admins", id: adminId },
        "Admins",
      ],
    }),
    // Delete admin
    deleteAdmin: builder.mutation({
      query: (adminId) => ({
        url: `../superadmin/admins/${adminId}`,
        method: "DELETE",
        body: {
          confirmDelete: true
        }
      }),
      invalidatesTags: (result, error, adminId) => [
        { type: "Admins", id: adminId },
        "Admins",
      ],
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

export const { 
  useGetAllAdminsQuery, 
  useGetAllAdminsBySuperAdminQuery,
  useGetAdminByIdQuery,
  useUpdateAdminMutation,
  useBanAdminMutation,
  useUnbanAdminMutation,
  useDeleteAdminMutation,
  useCreateAdminMutation 
} = adminApi;
