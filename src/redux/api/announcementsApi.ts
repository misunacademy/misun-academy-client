import { baseApi } from "./baseApi";

export type AnnouncementType = "info" | "success" | "warning" | "critical";
export type AnnouncementAudience = "all" | "learner" | "instructor" | "employee" | "admin";
export type AnnouncementStatus = "draft" | "published" | "scheduled" | "expired";
export interface AnnouncementCreator {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Announcement {
  _id: string;
  title: string;
  message: string;
  type: AnnouncementType;
  audience: AnnouncementAudience;
  status: AnnouncementStatus;
  link?: string;
  isDismissible: boolean;
  notifyByEmail?: boolean;
  publishAt?: string | null;
  expireAt?: string | null;
  createdBy?: AnnouncementCreator | string;
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementStats {
  total: number;
  draft: number;
  published: number;
  scheduled: number;
  expired: number;
  byAudience: Partial<Record<AnnouncementAudience, number>>;
  byType: Partial<Record<AnnouncementType, number>>;
}

export interface AnnouncementMeta {
  types: AnnouncementType[];
  audiences: AnnouncementAudience[];
  statuses: AnnouncementStatus[];
}

export interface AnnouncementListParams {
  page?: number;
  limit?: number;
  status?: AnnouncementStatus;
  audience?: AnnouncementAudience;
  search?: string;
}

export interface CreateAnnouncementPayload {
  title: string;
  message: string;
  type?: AnnouncementType;
  audience?: AnnouncementAudience;
  status?: AnnouncementStatus;
  link?: string;
  isDismissible?: boolean;
  notifyByEmail?: boolean;
  publishAt?: string;
  expireAt?: string;
}

export type UpdateAnnouncementPayload = Partial<CreateAnnouncementPayload>

export const announcementsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getAnnouncementMeta: build.query<{ success: boolean; message: string; data: AnnouncementMeta }, void>({
      query: () => ({ url: "/announcements/meta" }),
    }),
    getAnnouncementStats: build.query<{ success: boolean; message: string; data: AnnouncementStats }, void>({
      query: () => ({ url: "/announcements/stats" }),
      providesTags: ["Announcements"],
    }),
    getAnnouncements: build.query<
      { success: boolean; message: string; data: Announcement[]; meta: { total: number; page: number; limit: number; totalPages: number } },
      AnnouncementListParams | void
    >({
      query: (params) => ({ url: "/announcements", params: params ?? {} }),
      providesTags: ["Announcements"],
    }),
    getAnnouncement: build.query<{ success: boolean; message: string; data: Announcement }, string>({
      query: (id) => ({ url: `/announcements/${id}` }),
      providesTags: (_r, _e, id) => [{ type: "Announcements", id }],
    }),
    createAnnouncement: build.mutation<{ success: boolean; message: string; data: Announcement }, CreateAnnouncementPayload>({
      query: (body) => ({ url: "/announcements", method: "POST", body }),
      invalidatesTags: ["Announcements"],
    }),
    updateAnnouncement: build.mutation<
      { success: boolean; message: string; data: Announcement },
      { id: string; data: UpdateAnnouncementPayload }
    >({
      query: ({ id, data }) => ({ url: `/announcements/${id}`, method: "PUT", body: data }),
      invalidatesTags: (_r, _e, { id }) => ["Announcements", { type: "Announcements", id }],
    }),
    publishAnnouncement: build.mutation<{ success: boolean; message: string; data: Announcement }, string>({
      query: (id) => ({ url: `/announcements/${id}/publish`, method: "POST" }),
      invalidatesTags: (_r, _e, id) => ["Announcements", { type: "Announcements", id }, "Notifications"],
    }),
    deleteAnnouncement: build.mutation<{ success: boolean; message: string; data: null }, string>({
      query: (id) => ({ url: `/announcements/${id}`, method: "DELETE" }),
      invalidatesTags: ["Announcements"],
    }),
    getLiveAnnouncements: build.query<
      { success: boolean; message: string; data: Announcement[] },
      { audience?: string; limit?: number } | void
    >({
      query: (params) => ({ url: "/announcements/live", params: params ?? {} }),
    }),
  }),
});

export const {
  useGetAnnouncementMetaQuery,
  useGetAnnouncementStatsQuery,
  useGetAnnouncementsQuery,
  useGetAnnouncementQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  usePublishAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useGetLiveAnnouncementsQuery,
} = announcementsApi;
