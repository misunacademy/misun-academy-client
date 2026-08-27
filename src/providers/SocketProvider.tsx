"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo, Suspense } from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";
import {
  useMarkAllAsReadMutation,
  useGetUnreadCountQuery,
  useGetNotificationsQuery,
} from "@/redux/api/notificationApi";

export interface NotificationEvent {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

interface SocketContextValue {
  isConnected: boolean;
  unreadCount: number;
  recentNotifications: NotificationEvent[];
  setUnreadCount: (count: number) => void;
  addNotification: (notification: NotificationEvent) => void;
  clearRecent: () => void;
  markAllRead: () => void;
  markSingleRead: (id: string) => void;
}

const defaultContextValue: SocketContextValue = {
  isConnected: false,
  unreadCount: 0,
  recentNotifications: [],
  setUnreadCount: () => {},
  addNotification: () => {},
  clearRecent: () => {},
  markAllRead: () => {},
  markSingleRead: () => {},
};

const SocketContext = createContext<SocketContextValue>(defaultContextValue);

export const useSocketContext = () => useContext(SocketContext);

/**
 * cacheComponents requires a Suspense boundary above any client component that
 * reads the current time during prerender (RTK Query session hooks do). The
 * controller subtree is deferred; the fallback keeps the static shell fully
 * rendered with default (disconnected) socket values.
 */
export default function SocketProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <SocketContext.Provider value={defaultContextValue}>
          {children}
        </SocketContext.Provider>
      }
    >
      <SocketController>{children}</SocketController>
    </Suspense>
  );
}

function SocketController({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationEvent[]>([]);
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const { data: unreadData } = useGetUnreadCountQuery(undefined, {
    skip: !isAuthenticated,
    pollingInterval: 30000,
  });

  const { data: recentData } = useGetNotificationsQuery({ limit: 10 }, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (unreadData?.data?.count !== undefined) {
      setUnreadCount(unreadData.data.count);
    }
  }, [unreadData]);

  useEffect(() => {
    if (recentData?.data) {
      setRecentNotifications(recentData.data);
    }
  }, [recentData]);

  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

  const getBaseUrl = useCallback(() => {
    if (!baseApiUrl) return undefined;
    try {
      const url = new URL(baseApiUrl);
      return `${url.protocol}//${url.host}`;
    } catch {
      return baseApiUrl.replace('/api/v1/auth', '').replace('/api/v1', '');
    }
  }, [baseApiUrl]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      return;
    }

    const baseUrl = getBaseUrl();
    if (!baseUrl) return;

    let cancelled = false;

    (async () => {
      const { io: createSocket } = await import("socket.io-client");
      if (cancelled) return;

      const socket = createSocket(baseUrl, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('notification', (data: NotificationEvent) => {
        setRecentNotifications((prev) => [data, ...prev].slice(0, 10));
        setUnreadCount((prev) => prev + 1);
      });

      socketRef.current = socket;
    })();

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user, getBaseUrl]);

  const addNotification = useCallback((notification: NotificationEvent) => {
    setRecentNotifications((prev) => [notification, ...prev].slice(0, 10));
    setUnreadCount((prev) => prev + 1);
  }, []);

  const clearRecent = useCallback(() => {
    setRecentNotifications([]);
  }, []);

  const markAllRead = useCallback(() => {
    markAllAsRead();
    setUnreadCount(0);
  }, [markAllAsRead]);

  const markSingleRead = useCallback((id: string) => {
    setRecentNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const contextValue = useMemo(() => ({
    isConnected,
    unreadCount,
    recentNotifications,
    setUnreadCount,
    addNotification,
    clearRecent,
    markAllRead,
    markSingleRead,
  }), [isConnected, unreadCount, recentNotifications, setUnreadCount, addNotification, clearRecent, markAllRead, markSingleRead]);

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
}
