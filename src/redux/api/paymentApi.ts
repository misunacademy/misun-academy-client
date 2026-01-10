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
  enrollmentId: string;
  userId: string;
  batchId: string;
  amount: number;
  transactionId: string;
  gatewayTransactionId?: string;
  status: 'pending' | 'success' | 'failed' | 'cancelled';
  paymentMethod?: string;
  gatewayResponse?: any;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
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
