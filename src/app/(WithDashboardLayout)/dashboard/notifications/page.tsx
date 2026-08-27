"use client";

import { useState } from "react";
import { Bell, ExternalLink, Trash2, Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation, useDeleteNotificationMutation, useDeleteAllNotificationsMutation } from "@/redux/api/notificationApi";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useSocketContext } from "@/providers/SocketProvider";

const typeIcons: Record<string, string> = {
  enrollment: "text-blue-500",
  recording_published: "text-purple-500",
  lesson_published: "text-green-500",
  payment_pending: "text-amber-500",
  payment_success: "text-emerald-500",
  payment_failed: "text-red-500",
  access_granted: "text-emerald-500",
  quiz_published: "text-orange-500",
  quiz_result: "text-yellow-500",
  certificate_requested: "text-blue-500",
  certificate_approved: "text-emerald-500",
  certificate_issued: "text-green-500",
  certificate_rejected: "text-red-500",
  course_published: "text-blue-500",
  instructor_assigned: "text-indigo-500",
  batch_status_changed: "text-cyan-500",
  batch_updated: "text-teal-500",
  user_registered: "text-green-500",
  email_verified: "text-emerald-500",
  user_status_changed: "text-red-500",
  course_completed: "text-emerald-500",
  module_completed: "text-blue-500",
  new_announcement: "text-rose-500",
};

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { data, isLoading, isFetching } = useGetNotificationsQuery({
    page,
    limit: 20,
    read: filter === 'unread' ? false : undefined,
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
  const { unreadCount } = useSocketContext();

  const notifications = data?.data || [];
  const meta = data?.meta;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
    } catch {}
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications().unwrap();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border overflow-hidden">
            <button
              onClick={() => { setFilter('all'); setPage(1); }}
              className={`px-3 py-1.5 text-sm transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              All
            </button>
            <button
              onClick={() => { setFilter('unread'); setPage(1); }}
              className={`px-3 py-1.5 text-sm transition-colors ${filter === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              Unread
            </button>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDeleteAll}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Bell className="h-16 w-16 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </h3>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {filter === 'unread' ? 'You\'ve read everything!' : 'Notifications will appear here when something happens.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                !notification.read ? 'bg-muted/40 border-primary/20' : 'bg-background'
              }`}
            >
              <div className={`mt-1 shrink-0 ${typeIcons[notification.type] || 'text-muted-foreground'}`}>
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground/60 mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleMarkAsRead(notification._id)}
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(notification._id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {notification.link && (
                <Link
                  href={notification.link}
                  className="shrink-0 mt-1"
                  onClick={() => handleMarkAsRead(notification._id)}
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {(meta.page - 1) * meta.limit + 1}-{Math.min(meta.page * meta.limit, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => {
              let pageNum: number;
              if (meta.totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= meta.totalPages - 2) {
                pageNum = meta.totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "default" : "outline"}
                  size="sm"
                  className="min-w-[2rem]"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
