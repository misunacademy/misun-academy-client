/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface BatchResponse {
  _id: string;
  title: string;
  batchNumber: number;
  courseId: any; // Can be string or populated course object
  startDate: Date;
  endDate: Date;
  enrollmentStartDate: Date;
  enrollmentEndDate: Date;
  maxCapacity: number;
  currentEnrollment: number;
  status: 'draft' | 'upcoming' | 'running' | 'completed';
  price: number;
  currency?: string;
  accessDurationAfterEnd?: number;
  instructors: Array<{
    instructorId: string;
    role: 'lead' | 'assistant' | 'guest';
  }>;
  schedule?: string;
  tags?: string[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const batchApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // Get all batches (public - filtered)
    getAllBatches: build.query<{ data: BatchResponse[] }, { courseId?: string; status?: string; isPublished?: boolean }>({
      query: (params) => {
        let cleaned = params
          ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null))
          : undefined;
        if (cleaned && Object.keys(cleaned).length === 0) cleaned = undefined;
        return {
          url: "/batches",
          params: cleaned,
        };
      },
      providesTags: ["Batches"],
    }),

    // Get upcoming batches
    getUpcomingBatches: build.query<{ data: BatchResponse[] }, { courseId?: string }>({
      query: (params) => ({
        url: "/batches/upcoming",
        params,
      }),
      providesTags: ["Batches"],
    }),

    // Get current enrollment batch
    getCurrentEnrollmentBatch: build.query<{ data: BatchResponse | null }, { courseId?: string }>({
      query: (params) => ({
        url: "/batches/current-enrollment",
        params,
      }),
      providesTags: ["Batches"],
    }),

    // Get batch by ID
    getBatchById: build.query<{ data: BatchResponse }, string>({
      query: (id) => ({
        url: `/batches/${id}`,
      }),
      providesTags: ["Batches"],
    }),

    // Admin: Create batch
    createBatch: build.mutation<any, Partial<BatchResponse>>({
      query: (data) => ({
        url: "/batches",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Batches"],
    }),

    // Admin: Update batch
    updateBatch: build.mutation<any, { id: string; data: Partial<BatchResponse> }>({
      query: ({ id, data }) => ({
        url: `/batches/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Batches"],
    }),

    // Admin: Delete batch
    deleteBatch: build.mutation<any, string>({
      query: (id) => ({
        url: `/batches/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Batches"],
    }),

    // Admin: Update batch status
    updateBatchStatus: build.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/batches/${id}/transition`,
        method: "POST",
        body: { status },
      }),
      invalidatesTags: ["Batches"],
    }),
  }),
});

export const {
  useGetAllBatchesQuery,
  useGetUpcomingBatchesQuery,
  useGetCurrentEnrollmentBatchQuery,
  useGetBatchByIdQuery,
  useCreateBatchMutation,
  useUpdateBatchMutation,
  useDeleteBatchMutation,
  useUpdateBatchStatusMutation,
} = batchApi;
