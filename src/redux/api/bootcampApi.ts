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
  liveFee?: number;
  recordedPrice: number;
  lessonsCount: number;
  durationMinutes: number;
  status: string;
}

export interface BootcampVideoResource {
  title: string;
  url: string;
}

export interface BootcampVideo {
  _id: string;
  title: string;
  description?: string;
  videoSource: "youtube" | "googledrive";
  videoId: string;
  videoUrl?: string;
  duration?: number;
  orderIndex: number;
  isPublished: boolean;
  resources?: BootcampVideoResource[];
}

export interface BootcampPurchase {
  _id: string;
  user?: { _id: string; name?: string; email?: string };
  bootcamp?: { _id: string; title: string; season: string; slug: string } & Partial<BootcampRecordedCard>;
  amount: number;
  method: "manual" | "SSLCommerz";
  transactionId: string;
  status: "pending" | "paid" | "rejected";
  adminNote?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface BootcampPurchaseBuyer {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  studentId?: string;
  image?: string;
}

export interface BootcampPurchaseAdminItem {
  _id: string;
  user?: BootcampPurchaseBuyer;
  bootcamp?: {
    _id: string;
    title: string;
    season: string;
    slug: string;
    thumbnail?: string;
  };
  amount: number;
  method: "manual" | "SSLCommerz";
  transactionId: string;
  status: "pending" | "paid" | "rejected";
  adminNote?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BootcampPurchaseStats {
  total: number;
  paid: number;
  pending: number;
  rejected: number;
  revenue: number;
  today: number;
}

export interface BootcampPurchaseQueryParams {
  bootcampId?: string;
  status?: "pending" | "paid" | "rejected";
  search?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface BootcampCatalogItem {
  _id: string;
  title: string;
  season: string;
  slug: string;
  tagline?: string;
  description?: string;
  status: "draft" | "upcoming" | "live" | "completed" | "archived";
  startDate?: string;
  endDate?: string;
  time?: string;
  platform?: string;
  liveFee: number;
  recordedPrice: number;
  recordedStatus: "draft" | "published";
  thumbnail?: string;
  posterImage?: string;
  perks: { title: string; description: string }[];
  schedule: { day: string; dose?: string; title: string; description: string }[];
  faq: { question: string; answer: string }[];
  paymentMethods: { label: string; number: string; type?: string }[];
  painPoints: { title: string; description: string }[];
  outcomes: { title: string; description: string }[];
  audience: string[];
  mentor?: { name: string; title?: string; bio?: string; image?: string };
  testimonials: { name: string; role?: string; quote: string; rating?: number }[];
  guaranteeNote?: string;
  registrationOpen: boolean;
  recordedCourseId?: string | { _id: string; title: string; slug: string };
  recordedBatchId?: string;
  videos?: BootcampVideo[];
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

const compactQueryParams = (params?: Record<string, unknown>) => {
  if (!params) return undefined;
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );
  return Object.keys(cleaned).length > 0 ? cleaned : undefined;
};

const bootcampApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    // ─── Public landing page ───
    getCurrentBootcamp: build.query<{ data: BootcampCatalogItem | null }, void>({
      query: () => ({ url: "/bootcamp/current" }),
      providesTags: ["Bootcamp"],
    }),

    getPastBootcamps: build.query<{ data: BootcampRecordedCard[] }, void>({
      query: () => ({ url: "/bootcamp/past" }),
      providesTags: ["Bootcamp"],
    }),

    getBootcampBySlug: build.query<{ data: BootcampCatalogItem & { hasPurchased?: boolean } }, string>({
      query: (slug) => ({ url: `/bootcamp/slug/${slug}` }),
      providesTags: (_r, _e, slug) => [{ type: "Bootcamp", id: slug }],
    }),

    getMyBootcampVideos: build.query<{ data: { videos: BootcampVideo[] } }, string>({
      query: (slug) => ({ url: `/bootcamp/slug/${slug}/videos` }),
      providesTags: (_r, _e, slug) => [{ type: "Bootcamp", id: `${slug}-videos` }],
    }),

    // ─── Public registration (live bootcamp) ───
    registerForBootcamp: build.mutation<{ data: BootcampRegistration }, RegisterBootcampPayload>({
      query: (body) => ({ url: "/bootcamp/register", method: "POST", body }),
      invalidatesTags: ["Bootcamp"],
    }),

    // ─── Admin: registrations ───
    getBootcampRegistrations: build.query<
      { data: BootcampRegistration[]; meta: BootcampRegistrationMeta },
      { status?: string; search?: string; page?: number; limit?: number }
    >({
      query: (params) => {
        const cleaned = params
          ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null))
          : undefined;
        return {
          url: "/bootcamp/registrations",
          params: cleaned && Object.keys(cleaned).length > 0 ? cleaned : undefined,
        };
      },
      providesTags: ["Bootcamp"],
    }),

    getBootcampStats: build.query<{ data: BootcampStats }, void>({
      query: () => ({ url: "/bootcamp/registrations/stats" }),
      providesTags: ["Bootcamp"],
    }),

    updateBootcampRegistration: build.mutation<
      { data: BootcampRegistration },
      { id: string; data: { status: "verified" | "rejected"; adminNote?: string } }
    >({
      query: ({ id, data }) => ({ url: `/bootcamp/registrations/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Bootcamp"],
    }),

    deleteBootcampRegistration: build.mutation<{ data: BootcampRegistration | null }, string>({
      query: (id) => ({ url: `/bootcamp/registrations/${id}`, method: "DELETE" }),
      invalidatesTags: ["Bootcamp"],
    }),

    // ─── Admin: catalog CRUD ───
    getBootcampCatalogAdmin: build.query<
      { data: BootcampCatalogItem[]; meta: BootcampRegistrationMeta },
      { status?: string; search?: string; page?: number; limit?: number } | void
    >({
      query: (params) => {
        const cleaned = params
          ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null))
          : undefined;
        return {
          url: "/bootcamp/catalog",
          params: cleaned && Object.keys(cleaned).length > 0 ? cleaned : undefined,
        };
      },
      providesTags: ["Bootcamp"],
    }),

    createBootcamp: build.mutation<{ data: BootcampCatalogItem }, Record<string, unknown>>({
      query: (body) => ({ url: "/bootcamp/catalog", method: "POST", body }),
      invalidatesTags: ["Bootcamp"],
    }),

    updateBootcamp: build.mutation<{ data: BootcampCatalogItem }, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({ url: `/bootcamp/catalog/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["Bootcamp"],
    }),

    publishBootcampRecording: build.mutation<
      { data: BootcampCatalogItem },
      { id: string; data?: { recordedPrice?: number } }
    >({
      query: ({ id, data }) => ({
        url: `/bootcamp/catalog/${id}/publish-recording`,
        method: "POST",
        body: data ?? {},
      }),
      invalidatesTags: ["Bootcamp"],
    }),

    setBootcampRecordedPrice: build.mutation<
      { data: BootcampCatalogItem },
      { id: string; data: { recordedPrice: number } }
    >({
      query: ({ id, data }) => ({
        url: `/bootcamp/catalog/${id}/recorded-price`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bootcamp"],
    }),

    // ─── Admin: bootcamp-owned videos ───
    addBootcampVideo: build.mutation<
      { data: BootcampCatalogItem },
      { id: string; data: Omit<BootcampVideo, "_id" | "orderIndex"> }
    >({
      query: ({ id, data }) => ({ url: `/bootcamp/catalog/${id}/videos`, method: "POST", body: data }),
      invalidatesTags: ["Bootcamp"],
    }),

    updateBootcampVideo: build.mutation<
      { data: BootcampCatalogItem },
      { id: string; videoId: string; data: Partial<BootcampVideo> }
    >({
      query: ({ id, videoId, data }) => ({
        url: `/bootcamp/catalog/${id}/videos/${videoId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Bootcamp"],
    }),

    deleteBootcampVideo: build.mutation<{ data: BootcampCatalogItem }, { id: string; videoId: string }>({
      query: ({ id, videoId }) => ({
        url: `/bootcamp/catalog/${id}/videos/${videoId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bootcamp"],
    }),

    listBootcampVideos: build.query<{ data: { videos: BootcampVideo[] } }, string>({
      query: (id) => ({ url: `/bootcamp/catalog/${id}/videos` }),
      providesTags: (_r, _e, id) => [{ type: "Bootcamp", id: `${id}-videos` }],
    }),

    // ─── Recording purchases (standalone) ───
    initiateBootcampSSLCommerz: build.mutation<
      { data: { paymentUrl: string; transactionId: string } },
      string
    >({
      query: (slug) => ({
        url: `/bootcamp/slug/${slug}/payment/initiate`,
        method: "POST",
      }),
    }),

    getMyBootcampPurchases: build.query<{ data: BootcampPurchase[] }, void>({
      query: () => ({ url: "/bootcamp/my-purchases" }),
      providesTags: ["Bootcamp"],
    }),

    // ─── Admin: who bought a recorded bootcamp ───
    getBootcampPurchases: build.query<
      { data: BootcampPurchaseAdminItem[]; meta: BootcampRegistrationMeta },
      BootcampPurchaseQueryParams | void
    >({
      query: (params) => ({
        url: "/bootcamp/purchases",
        params: compactQueryParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: ["Bootcamp"],
    }),

    getBootcampPurchaseStats: build.query<
      { data: BootcampPurchaseStats },
      { bootcampId?: string } | void
    >({
      query: (params) => ({
        url: "/bootcamp/purchases/stats",
        params: compactQueryParams(params as Record<string, unknown> | undefined),
      }),
      providesTags: ["Bootcamp"],
    }),
  }),
});

export const {
  useGetCurrentBootcampQuery,
  useGetPastBootcampsQuery,
  useGetBootcampBySlugQuery,
  useGetMyBootcampVideosQuery,
  useRegisterForBootcampMutation,
  useGetBootcampRegistrationsQuery,
  useLazyGetBootcampRegistrationsQuery,
  useGetBootcampStatsQuery,
  useUpdateBootcampRegistrationMutation,
  useDeleteBootcampRegistrationMutation,
  useGetBootcampCatalogAdminQuery,
  useCreateBootcampMutation,
  useUpdateBootcampMutation,
  usePublishBootcampRecordingMutation,
  useSetBootcampRecordedPriceMutation,
  useAddBootcampVideoMutation,
  useUpdateBootcampVideoMutation,
  useDeleteBootcampVideoMutation,
  useListBootcampVideosQuery,
  useInitiateBootcampSSLCommerzMutation,
  useGetMyBootcampPurchasesQuery,
  useGetBootcampPurchasesQuery,
  useLazyGetBootcampPurchasesQuery,
  useGetBootcampPurchaseStatsQuery,
} = bootcampApi;