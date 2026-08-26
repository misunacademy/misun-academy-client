import { baseApi } from "./baseApi";

export type NotificationType =
  | 'enrollment'
  | 'recording_published'
  | 'lesson_published'
  | 'payment_pending'
  | 'payment_success'
  | 'payment_failed'
  | 'access_granted'
  | 'quiz_published'
  | 'quiz_result'
  | 'certificate_requested'
  | 'certificate_approved'
  | 'certificate_issued'
  | 'certificate_rejected'
  | 'course_published'
  | 'instructor_assigned'
  | 'batch_status_changed'
  | 'batch_updated'
  | 'batch_start_reminder'
  | 'user_registered'
  | 'email_verified'
  | 'user_status_changed'
  | 'course_completed'
  | 'module_completed'
  | 'new_announcement';

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  relatedTo?: { model: string; id: string };
  read: boolean;
  createdAt: string;
}

export interface PaginatedResponse<T> {
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

    deleteNotification: build.mutation<Notification, string>({
      query: (notificationId) => ({
        url: `/notifications/${notificationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notifications"],
    }),

    deleteAllNotifications: build.mutation<void, void>({
      query: () => ({
        url: "/notifications/delete-all",
        method: "DELETE",
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
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
} = notificationApi;
