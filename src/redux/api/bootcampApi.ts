import { baseApi } from "./baseApi";

export type BootcampRegistrationStatus = "pending" | "verified" | "rejected";

export interface BootcampRegistration {
  _id: string;
  name: string;
  whatsapp?: string;
  address: string;
  email: string;
  paymentLast4: string;
  status: BootcampRegistrationStatus;
  adminNote?: string;
  reviewedBy?: { _id: string; name?: string; email?: string };
  reviewedAt?: string;
  registrationIp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BootcampRegistrationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BootcampStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  today: number;
}

export interface RegisterBootcampPayload {
  name: string;
  whatsapp?: string;
  address: string;
  email: string;
  paymentLast4: string;
}

const bootcampApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    registerForBootcamp: build.mutation<{ data: BootcampRegistration }, RegisterBootcampPayload>({
      query: (data) => ({
        url: "/bootcamp/register",
        method: "POST",
        body: data,
      }),
    }),

    getBootcampRegistrations: build.query<
      { data: BootcampRegistration[]; meta?: BootcampRegistrationMeta },
      { status?: BootcampRegistrationStatus | "all"; search?: string; page?: number; limit?: number }
    >({
      query: ({ status, search, page, limit }) => ({
        url: "/bootcamp/registrations",
        params: {
          ...(status && status !== "all" ? { status } : {}),
          ...(search ? { search } : {}),
          page,
          limit,
        },
      }),
      providesTags: ["Bootcamp"],
    }),

    getBootcampStats: build.query<{ data: BootcampStats }, void>({
      query: () => ({
        url: "/bootcamp/registrations/stats",
      }),
      providesTags: ["Bootcamp"],
    }),

    updateBootcampRegistration: build.mutation<
      { data: BootcampRegistration },
      { id: string; data: { status?: BootcampRegistrationStatus; adminNote?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/bootcamp/registrations/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bootcamp"],
    }),

    deleteBootcampRegistration: build.mutation<{ data: BootcampRegistration }, string>({
      query: (id) => ({
        url: `/bootcamp/registrations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bootcamp"],
    }),
  }),
});

export const {
  useRegisterForBootcampMutation,
  useGetBootcampRegistrationsQuery,
  useLazyGetBootcampRegistrationsQuery,
  useGetBootcampStatsQuery,
  useUpdateBootcampRegistrationMutation,
  useDeleteBootcampRegistrationMutation,
} = bootcampApi;
