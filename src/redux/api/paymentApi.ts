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
}

const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Initiate payment
    initiatePayment: build.mutation<{ data: { paymentUrl: string } }, PaymentInitiateRequest>({
      query: (data) => ({
        url: "/payments/initiate",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Payments"],
    }),

    // Get my payments
    getMyPayments: build.query<{ data: PaymentResponse[] }, void>({
      query: () => ({
        url: "/payments/me",
      }),
      providesTags: ["Payments"],
    }),

    // Get payment by transaction ID
    getPaymentByTransactionId: build.query<{ data: PaymentResponse }, string>({
      query: (transactionId) => ({
        url: `/payments/transaction/${transactionId}`,
      }),
      providesTags: ["Payments"],
    }),

    // Admin: Get all payments
    getAllPayments: build.query<{ data: PaymentResponse[] }, { status?: string; page?: number; limit?: number }>({
      query: (params) => ({
        url: "/payments",
        params,
      }),
      providesTags: ["Payments"],
    }),

    // Verify payment status
    verifyPayment: build.query<{ data: PaymentResponse }, string>({
      query: (transactionId) => ({
        url: `/payments/verify/${transactionId}`,
      }),
      providesTags: ["Payments"],
    }),
  }),
});

export const {
  useInitiatePaymentMutation,
  useGetMyPaymentsQuery,
  useGetPaymentByTransactionIdQuery,
  useGetAllPaymentsQuery,
  useVerifyPaymentQuery,
} = paymentApi;
