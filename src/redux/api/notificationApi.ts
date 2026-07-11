import { baseApi } from "./baseApi";

export interface Notification {
  _id: string;
  userId: string;
  type: 'enrollment' | 'recording_published' | 'lesson_published' | 'payment_pending' | 'access_granted';
  title: string;
  message: string;
  link?: string;
  relatedTo?: { model: string; id: string };
  read: boolean;
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

const notificationApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getNotifications: build.query<PaginatedResponse<Notification>, { page?: number; limit?: number; read?: boolean } | void>({
      query: (params) => ({
        url: "/notifications",
        params: params || undefined,
      }),
      providesTags: ["Notifications"],
    }),

    getUnreadCount: build.query<{ data: { count: number } }, void>({
      query: () => ({
        url: "/notifications/unread-count",
      }),
      providesTags: ["Notifications"],
    }),

    markAsRead: build.mutation<Notification, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),

    markAllAsRead: build.mutation<void, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
