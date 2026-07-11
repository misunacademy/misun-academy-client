"use client";

import { Bell, BookOpen, UserPlus, Video, DollarSign, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocketContext } from "@/providers/SocketProvider";
import { useMarkAsReadMutation } from "@/redux/api/notificationApi";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const typeIcons: Record<string, React.ReactNode> = {
  enrollment: <UserPlus className="h-4 w-4 text-blue-500" />,
  recording_published: <Video className="h-4 w-4 text-purple-500" />,
  lesson_published: <BookOpen className="h-4 w-4 text-green-500" />,
  payment_pending: <DollarSign className="h-4 w-4 text-amber-500" />,
  access_granted: <Check className="h-4 w-4 text-emerald-500" />,
};

export default function NotificationBell() {
  const { unreadCount, recentNotifications, markAllRead, markSingleRead } = useSocketContext();
  const [markAsRead] = useMarkAsReadMutation();

  const notifications = recentNotifications;

  const handleMarkAsRead = async (id: string) => {
    markSingleRead(id);
    try {
      await markAsRead(id).unwrap();
    } catch {
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-background/80 backdrop-blur-sm shadow-sm">
          <Bell className={`h-4 w-4 ${unreadCount > 0 ? 'animate-ring' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-red-500 rounded-full text-[10px] font-medium flex items-center justify-center text-white ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto text-xs px-2 py-1"
              onClick={markAllRead}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center py-8 text-center">
            <Bell className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">No notifications yet</p>
          </div>
        ) : (
          <div className="py-1">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors ${
                  !notification.read ? "bg-muted/30" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {typeIcons[notification.type] || <Bell className="h-4 w-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-tight">{notification.title}</p>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="shrink-0 mt-0.5"
                        title="Mark as read"
                      >
                        <span className="h-2 w-2 rounded-full bg-blue-500 block" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                  </p>
                </div>
                {notification.link && (
                  <Link
                    href={notification.link}
                    className="shrink-0 mt-1"
                    onClick={() => handleMarkAsRead(notification._id)}
                  >
                    <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
