/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

const dashboardApi = baseApi.injectEndpoints({
  overrideExisting: true,
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
    getDashboardMetadata: build.query<{ data: any }, { courseId?: string } | void>({
      query: (params) => ({
        url: "/dashboard/metadata",
        params: params || undefined,
      }),
      providesTags: ["Dashboard"],
    }),

    getInstructorDashboard: build.query<{ data: any }, void>({
      query: () => ({
        url: "/dashboard/instructor",
      }),
      providesTags: ["Dashboard"],
    }),
    // Keep only student-specific endpoints here
    getStudentDashboardData: build.query({
      query: () => ({
        url: "/dashboard/student",
      }),
      providesTags: ["Students"],
    }),
  }),
});

export const {
  useGetAdminDashboardQuery,
  useGetUserStatsQuery,
  useGetDashboardMetadataQuery,
  useGetInstructorDashboardQuery,
  useGetStudentDashboardDataQuery,
} = dashboardApi;
