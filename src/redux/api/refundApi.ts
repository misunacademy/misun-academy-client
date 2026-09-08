import { baseApi } from "./baseApi";

export type RefundStatus = "pending" | "approved" | "rejected" | "completed";
export type RefundChannel = "gateway" | "manual";

export interface RefundStudent {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Refund {
  _id: string;
  transactionId: string;
  amount: number;
  currency: string;
  method: string;
  channel: RefundChannel;
  status: RefundStatus;
  reason: string;
  decisionNote?: string;
  gatewayRef?: string;
  processedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  student?: RefundStudent;
  batch?: { _id: string; title: string; batchNumber?: string };
  course?: { _id: string; title: string; slug?: string };
  paymentStatus?: string;
}

export interface RefundListResponse {
  success: boolean;
  message: string;
  meta: { total: number; page: number; limit: number; totalPages: number };
  data: Refund[];
}

export interface RefundDetailResponse {
  success: boolean;
  message: string;
  data: Refund;
}

export interface CreateRefundPayload {
  transactionId: string;
  amount?: number;
  reason: string;
}

export const refundApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getRefunds: build.query<
      RefundListResponse,
      { status?: RefundStatus; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/refunds",
        params: params
          ? (Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null)) as Record<
              string,
              string
            >)
          : undefined,
      }),
      providesTags: ["Refunds"],
    }),

    getRefundById: build.query<RefundDetailResponse, string>({
      query: (id) => ({ url: `/refunds/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Refunds", id }],
    }),

    createRefund: build.mutation<RefundDetailResponse, CreateRefundPayload>({
      query: (body) => ({ url: "/refunds", method: "POST", body }),
      invalidatesTags: ["Refunds", "Payments"],
    }),

    approveRefund: build.mutation<RefundDetailResponse, { id: string; note?: string }>({
      query: ({ id, note }) => ({ url: `/refunds/${id}/approve`, method: "POST", body: { note } }),
      invalidatesTags: ["Refunds", "Payments", "CourseEnrollments"],
    }),

    rejectRefund: build.mutation<RefundDetailResponse, { id: string; note?: string }>({
      query: ({ id, note }) => ({ url: `/refunds/${id}/reject`, method: "POST", body: { note } }),
      invalidatesTags: ["Refunds"],
    }),

    completeRefund: build.mutation<RefundDetailResponse, string>({
      query: (id) => ({ url: `/refunds/${id}/complete`, method: "POST" }),
      invalidatesTags: ["Refunds", "Payments", "CourseEnrollments"],
    }),
  }),
});

export const {
  useGetRefundsQuery,
  useGetRefundByIdQuery,
  useCreateRefundMutation,
  useApproveRefundMutation,
  useRejectRefundMutation,
  useCompleteRefundMutation,
} = refundApi;