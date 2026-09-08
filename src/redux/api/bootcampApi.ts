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

export interface BootcampRecordedCard {
  _id: string;
  title: string;
  season: string;
  slug: string;
  tagline?: string;
  thumbnail?: string;
  posterImage?: string;
  recordedPrice: number;
  lessonsCount: number;
  durationMinutes: number;
  status: string;
}

export interface BootcampCatalogItem {
  _id: string;
  title: string;
  season: string;
  slug: string;
  tagline?: string;
  description?: string;
  status: 'draft' | 'upcoming' | 'live' | 'completed' | 'archived';
  startDate?: string;
  endDate?: string;
  time?: string;
  platform?: string;
  liveFee: number;
  recordedPrice: number;
  recordedStatus: 'draft' | 'published';
  thumbnail?: string;
  posterImage?: string;
  perks: { title: string; description: string }[];
  schedule: { day: string; dose?: string; title: string; description: string }[];
  faq: { question: string; answer: string }[];
  paymentMethods: { label: string; number: string; type?: string }[];
  registrationOpen: boolean;
  recordedCourseId?: string | { _id: string; title: string; slug: string };
  recordedBatchId?: string;
  lessonsCount: number;
  durationMinutes: number;
  createdAt?: string;
  updatedAt?: string;
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

    getCurrentBootcamp: build.query<{ data: BootcampCatalogItem | null }, void>({
      query: () => ({
        url: "/bootcamp/current",
      }),
      providesTags: ["Bootcamp"],
    }),

    getPastBootcamps: build.query<{ data: BootcampRecordedCard[] }, void>({
      query: () => ({
        url: "/bootcamp/past",
      }),
      providesTags: ["Bootcamp"],
    }),

    getBootcampBySlug: build.query<{ data: BootcampCatalogItem }, string>({
      query: (slug) => ({
        url: `/bootcamp/slug/${slug}`,
      }),
      providesTags: ["Bootcamp"],
    }),

    getBootcampCatalogAdmin: build.query<
      { data: BootcampCatalogItem[]; meta?: BootcampRegistrationMeta },
      { status?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/bootcamp/catalog",
        params: params || undefined,
      }),
      providesTags: ["Bootcamp"],
    }),

    createBootcamp: build.mutation<{ data: BootcampCatalogItem }, Partial<BootcampCatalogItem>>({
      query: (data) => ({
        url: "/bootcamp/catalog",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Bootcamp"],
    }),

    updateBootcamp: build.mutation<{ data: BootcampCatalogItem }, { id: string; data: Partial<BootcampCatalogItem> }>({
      query: ({ id, data }) => ({
        url: `/bootcamp/catalog/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bootcamp"],
    }),

    setBootcampRecordedPrice: build.mutation<{ data: BootcampCatalogItem }, { id: string; recordedPrice: number }>({
      query: ({ id, recordedPrice }) => ({
        url: `/bootcamp/catalog/${id}/recorded-price`,
        method: "PATCH",
        body: { recordedPrice },
      }),
      invalidatesTags: ["Bootcamp"],
    }),

    publishBootcampRecording: build.mutation<{ data: BootcampCatalogItem }, { id: string; sourceBatchId?: string; recordedPrice?: number }>({
      query: ({ id, ...body }) => ({
        url: `/bootcamp/catalog/${id}/publish-recording`,
        method: "POST",
        body,
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
  useGetCurrentBootcampQuery,
  useGetPastBootcampsQuery,
  useGetBootcampBySlugQuery,
  useGetBootcampCatalogAdminQuery,
  useCreateBootcampMutation,
  useUpdateBootcampMutation,
  useSetBootcampRecordedPriceMutation,
  usePublishBootcampRecordingMutation,
} = bootcampApi;
