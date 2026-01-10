/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get admin dashboard analytics
    getAdminDashboard: build.query<{ data: any }, void>({
      query: () => ({
        url: "/dashboard/admin",
      }),
      providesTags: ["Dashboard"],
    }),

    // Get user statistics
    getUserStats: build.query<{ data: any }, void>({
      query: () => ({
        url: "/dashboard/users",
      }),
      providesTags: ["Dashboard", "Users"],
    }),

    // Get dashboard metadata (legacy - 60 days stats)
    getDashboardMetadata: build.query<{ data: any }, void>({
      query: () => ({
        url: "/dashboard/metadata",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetUserStatsQuery,
  useGetDashboardMetadataQuery,
} = dashboardApi;
