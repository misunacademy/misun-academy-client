/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface InstructorProfileResponse {
  _id: string;
  userId: string;
  bio: string;
  expertise: string[];
  socialLinks?: {
    linkedin?: string;
    portfolio?: string;
    github?: string;
  };
  verified: boolean;
  rating?: number;
  totalBatchesTaught: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const instructorApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Get instructor profile
    getInstructorProfile: build.query<{ data: InstructorProfileResponse }, void>({
      query: () => ({
        url: "/instructor/profile",
      }),
      providesTags: ["Instructors"],
    }),

    // Update instructor profile
    updateInstructorProfile: build.mutation<any, Partial<InstructorProfileResponse>>({
      query: (data) => ({
        url: "/instructor/profile",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Instructors"],
    }),

    // Get instructor dashboard
    getInstructorDashboard: build.query<{ data: any }, void>({
      query: () => ({
        url: "/instructor/dashboard",
      }),
      providesTags: ["Instructors"],
    }),

    // Get assigned batches
    getAssignedBatches: build.query<{ data: any[] }, { status?: string }>({
      query: (params) => ({
        url: "/instructor/batches",
        params,
      }),
      providesTags: ["Batches", "Instructors"],
    }),

    // Get batch students
    getBatchStudents: build.query<{ data: any[] }, string>({
      query: (batchId) => ({
        url: `/instructor/batches/${batchId}/students`,
      }),
      providesTags: ["Students", "Instructors"],
    }),

    // Get pending submissions
    getPendingSubmissions: build.query<{ data: any[] }, void>({
      query: () => ({
        url: "/instructor/submissions/pending",
      }),
      providesTags: ["Instructors"],
    }),

    // Get batch statistics
    getBatchStatistics: build.query<{ data: any }, string>({
      query: (batchId) => ({
        url: `/instructor/batches/${batchId}/statistics`,
      }),
      providesTags: ["Batches", "Instructors"],
    }),
  }),
});

export const {
  useGetInstructorProfileQuery,
  useUpdateInstructorProfileMutation,
  useGetInstructorDashboardQuery,
  useGetAssignedBatchesQuery,
  useGetBatchStudentsQuery,
  useGetPendingSubmissionsQuery,
  useGetBatchStatisticsQuery,
} = instructorApi;
