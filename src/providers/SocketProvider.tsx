"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { Socket } from "socket.io-client";
import { useAuth } from "@/hooks/useAuth";
import { useMarkAllAsReadMutation } from "@/redux/api/notificationApi";

interface NotificationEvent {
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

const SocketContext = createContext<SocketContextValue>({
  isConnected: false,
  unreadCount: 0,
  recentNotifications: [],
  setUnreadCount: () => {},
  addNotification: () => {},
  clearRecent: () => {},
  markAllRead: () => {},
  markSingleRead: () => {},
});

export const useSocketContext = () => useContext(SocketContext);

export default function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<NotificationEvent[]>([]);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [markAllAsRead] = useMarkAllAsReadMutation();

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

  const fetchUnreadCount = useCallback(async () => {
    if (!baseApiUrl) return;
    try {
      const res = await fetch(`${baseApiUrl}/notifications/unread-count`, {
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        setUnreadCount(json.data?.count ?? 0);
      }
    } catch {
    }
  }, [baseApiUrl]);

  const fetchRecentNotifications = useCallback(async () => {
    if (!baseApiUrl) return;
    try {
      const res = await fetch(`${baseApiUrl}/notifications?limit=10`, {
        credentials: 'include',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) setRecentNotifications(json.data);
      }
    } catch {
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
        fetchUnreadCount();
        fetchRecentNotifications();
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('notification', (data: NotificationEvent) => {
        setRecentNotifications((prev) => [data, ...prev].slice(0, 10));
        setUnreadCount((prev) => prev + 1);
      });

      socketRef.current = socket;

      if (pollingRef.current) clearInterval(pollingRef.current);
      pollingRef.current = setInterval(() => {
        fetchUnreadCount();
      }, 30000);
    })();

    return () => {
      cancelled = true;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isAuthenticated, user, getBaseUrl, fetchUnreadCount, fetchRecentNotifications]);

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
