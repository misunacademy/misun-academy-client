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
  overrideExisting: true,
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

    // Admin: Get all enrollments (supports search, pagination, sorting)
getAllEnrollments: build.query<{ data: EnrollmentResponse[]; meta?: { total: number; page: number; limit?: number; totalPages: number } }, { status?: string; page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string; hasEnrollmentId?: boolean | string }>({
      query: (params) => {
        let cleaned = params
          ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null))
          : undefined;
        if (cleaned && Object.keys(cleaned).length === 0) cleaned = undefined;
        return {
          url: "/enrollments",
          params: cleaned,
        };
      },
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

    // Manual enrollment (e.g., bank/phone transfer)
    enrollStudentManual: build.mutation<any, { batchId: string; paymentData: any }>({
      query: (data) => ({
        url: "/enrollments/manual",
        method: "POST",
        body: data,
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
  useEnrollStudentManualMutation,
} = enrollmentApi;
