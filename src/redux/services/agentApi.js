import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const agentApi = createApi({
  reducerPath: "agentApi",
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
  tagTypes: ["Agents"],
  endpoints: (builder) => ({
    // Get all agents with pagination, search, status and department filtering
    getAllAgents: builder.query({
      query: ({ page = 1, limit = 10, status, department, search } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (status && status !== 'All') {
          params.append('status', status);
        }
        if (department && department !== 'All') {
          params.append('department', department);
        }
        if (search) {
          params.append('search', search);
        }

        return {
          url: `agents?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Agents"],
    }),

    // Get single agent by ID
    getAgentById: builder.query({
      query: (agentId) => ({
        url: `agents/${agentId}`,
        method: "GET",
      }),
      providesTags: (result, error, agentId) => [{ type: "Agents", id: agentId }],
    }),

    // Update agent
    updateAgent: builder.mutation({
      query: ({ agentId, agentData }) => ({
        url: `agents/${agentId}`,
        method: "PUT",
        body: agentData,
      }),
      invalidatesTags: (result, error, { agentId }) => [
        { type: "Agents", id: agentId },
        "Agents",
      ],
    }),

    // Ban agent
    banAgent: builder.mutation({
      query: ({ agentId, reason = "Policy violation - banned by admin" }) => ({
        url: `agents/${agentId}/ban`,
        method: "PATCH",
        body: {
          reason
        }
      }),
      invalidatesTags: (result, error, { agentId }) => [
        { type: "Agents", id: agentId },
        "Agents",
      ],
    }),

    // Unban agent
    unbanAgent: builder.mutation({
      query: (agentId) => ({
        url: `agents/${agentId}/unban`,
        method: "PATCH"
      }),
      invalidatesTags: (result, error, agentId) => [
        { type: "Agents", id: agentId },
        "Agents",
      ],
    }),

    // Delete agent
    deleteAgent: builder.mutation({
      query: (agentId) => ({
        url: `agents/${agentId}`,
        method: "DELETE",
        body: {
          confirmDelete: true
        }
      }),
      invalidatesTags: (result, error, agentId) => [
        { type: "Agents", id: agentId },
        "Agents",
      ],
    }),

    // Create agent
    createAgent: builder.mutation({
      query: (agentData) => ({
        url: "auth/create-agent",
        method: "POST",
        body: agentData,
      }),
      invalidatesTags: ["Agents"],
    }),
  }),
});

export const {
  useGetAllAgentsQuery,
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
  useBanAgentMutation,
  useUnbanAgentMutation,
  useDeleteAgentMutation,
  useCreateAgentMutation,
} = agentApi;