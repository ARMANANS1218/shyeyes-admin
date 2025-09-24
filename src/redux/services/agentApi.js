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
      // Add keep unused data for 5 minutes, refetch stale data after 1 minute
      keepUnusedDataFor: 300, // 5 minutes
      refetchOnMountOrArgChange: 60, // Refetch if data is older than 1 minute
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

    // Create agent by admin
    createAgent: builder.mutation({
      query: (agentData) => ({
        url: "auth/create-agent",
        method: "POST",
        body: agentData,
      }),
      invalidatesTags: ["Agents"],
    }),

    // Get agent dashboard statistics
    getAgentDashboardStats: builder.query({
      query: () => ({
        url: "agent/dashboard-stats",
        method: "GET",
      }),
    }),

    // Get agent's assigned users
    getAgentUsers: builder.query({
      query: ({ page = 1, limit = 10, status, search } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (status && status !== 'All') {
          params.append('status', status);
        }
        if (search) {
          params.append('search', search);
        }

        return {
          url: `agent/users?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    // Get agent chat sessions
    getAgentChatSessions: builder.query({
      query: ({ page = 1, limit = 10, status } = {}) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        
        if (status && status !== 'All') {
          params.append('status', status);
        }

        return {
          url: `agent/chat-sessions?${params.toString()}`,
          method: "GET",
        };
      },
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
  useGetAgentDashboardStatsQuery,
  useGetAgentUsersQuery,
  useGetAgentChatSessionsQuery,
} = agentApi;