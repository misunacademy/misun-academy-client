/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "./baseApi";

export interface PaymentInitiateRequest {
  enrollmentId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface PaymentResponse {
  _id: string;
  enrollmentId?: string; // Optional - assigned after enrollment confirmation
  transactionId: string; // Unique transaction ID across all payment methods
  userId: string;
  batchId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'review' | 'cancel';
  method: string; // Changed from paymentMethod to method to match backend
  gatewayResponse?: any;
  verifiedAt?: string; // Date as string from API
  verifiedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  batch?: {
    _id: string;
    title: string;
    batchNumber: string;
  };
  course?: {
    _id: string;
    title: string;
    slug: string;
  };
  // Optional student info populated by some endpoints
  student?: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

const paymentApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // Get my payments
    getMyPayments: build.query<{ data: PaymentResponse[] }, void>({
      query: () => ({
        url: "/payments/me",
      }),
      providesTags: ["Payments"],
    }),

    // Admin: Get all payments (supports search, pagination, filtering)
    getAllPayments: build.query<{ data: PaymentResponse[]; meta?: { total: number; page: number; limit: number; totalPages: number } }, { status?: string; page?: number; limit?: number; search?: string; sortBy?: string; sortOrder?: string }>({
      query: (params) => {
        let cleaned = params
          ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined && v !== null))
          : undefined;
        if (cleaned && Object.keys(cleaned).length === 0) cleaned = undefined;
        return {
          url: "payments/history",
          params: cleaned,
        };
      },
      providesTags: ["Payments"],
    }),

    // Update payment status (admin)
    updatePaymentStatus: build.mutation<any, { transactionId: string; status: string }>({
      query: ({ transactionId, status }) => ({
        url: `/payments/${transactionId}/status`,
        method: "PUT",
        body: { status },
      }),
      // Invalidate enrollments as well so student lists refresh when a payment causes enrollment activation
      invalidatesTags: ["Payments", "CourseEnrollments"],
    }),

    // Verify manual payment submission (admin)
    verifyManualPayment: build.mutation<any, { transactionId: string; approved: boolean }>({
      query: ({ transactionId, approved }) => ({
        url: `/payments/${transactionId}/verify`,
        method: "POST",
        body: { approved },
      }),
      // When an admin verifies a manual payment, it may create/activate an enrollment — invalidate enrollments
      invalidatesTags: ["Payments", "CourseEnrollments"],
    }),
  }),
});

export const {
  useGetMyPaymentsQuery,
  useGetAllPaymentsQuery,
  useUpdatePaymentStatusMutation,
  useVerifyManualPaymentMutation,
} = paymentApi;
