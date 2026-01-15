/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface EnrollmentInitiateRequest {
  batchId: string;
}

export interface EnrollmentResponse {
  _id: string;
  enrollmentId: string;
  userId: string;
  batchId: {
    _id: string;
    title: string;
    courseId: {
      _id: string;
      title: string;
      thumbnailImage?: string;
      category?: string;
      level?: string;
    };
  };
  status: 'pending' | 'payment-pending' | 'active' | 'completed' | 'suspended' | 'refunded' | 'payment-failed';
  enrolledAt?: Date;
  // Lifetime access - no expiry field
  paymentId?: string;
  certificateId?: string;
  certificateIssued: boolean;
  completedAt?: Date;
  progress?: {
    totalModules: number;
    completedModules: number;
    overallProgress: number;
  };
  completedLessons?: string[];
  watchedVideos?: string[];
  quizScore?: number;
  course?: {
    title: string;
    totalLessons?: number;
  };
  batch?: {
    title: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Initiate enrollment
    initiateEnrollment: build.mutation<any, EnrollmentInitiateRequest>({
      query: (data) => ({
        url: "/enrollments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["CourseEnrollments"],
    }),

    // Get my enrollments
    getEnrollments: build.query<{ data: EnrollmentResponse[] }, void>({
      query: () => ({
        url: "/enrollments/me",
      }),
      providesTags: ["CourseEnrollments"],
    }),

    // Get my enrollments (with filters)
    getMyEnrollments: build.query<{ data: EnrollmentResponse[] }, { status?: string }>({
      query: (params) => ({
        url: "/enrollments/me",
        params,
      }),
      providesTags: ["CourseEnrollments"],
    }),

    // Get enrollment details
    getEnrollmentDetails: build.query<{ data: EnrollmentResponse }, string>({
      query: (id) => ({
        url: `/enrollments/${id}`,
      }),
      providesTags: ["CourseEnrollments"],
    }),

    // Admin: Get all enrollments
    getAllEnrollments: build.query<{ data: EnrollmentResponse[] }, { status?: string; page?: number; limit?: number }>({
      query: (params) => ({
        url: "/enrollments",
        params,
      }),
      providesTags: ["CourseEnrollments"],
    }),

    // Admin: Update enrollment status
    // Server expects PUT, not PATCH
    updateEnrollmentStatus: build.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/enrollments/${id}/status`,
        method: "PUT",  // Fixed: was PATCH, server expects PUT
        body: { status },
      }),
      invalidatesTags: ["CourseEnrollments"],
    }),
  }),
});

export const {
  useInitiateEnrollmentMutation,
  useGetEnrollmentsQuery,
  useGetMyEnrollmentsQuery,
  useGetEnrollmentDetailsQuery,
  useGetAllEnrollmentsQuery,
  useUpdateEnrollmentStatusMutation,
} = enrollmentApi;
