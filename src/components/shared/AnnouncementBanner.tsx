"use client";

import { useEffect, useState } from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetLiveAnnouncementsQuery, type Announcement } from "@/redux/api/announcementsApi";

const DISMISSED_KEY = "ma:dismissedAnnouncementIds";

const typeConfig: Record<
  Announcement["type"],
  {
    icon: typeof Info;
    accent: string;
    bg: string;
    border: string;
    iconColor: string;
  }
> = {
  info: {
    icon: Info,
    accent: "bg-blue-500",
    bg: "bg-white",
    border: "border-blue-500/25",
    iconColor: "text-blue-600",
  },
  success: {
    icon: CheckCircle2,
    accent: "bg-emerald-500",
    bg: "bg-white",
    border: "border-emerald-500/25",
    iconColor: "text-emerald-600",
  },
  warning: {
    icon: AlertTriangle,
    accent: "bg-amber-500",
    bg: "bg-white",
    border: "border-amber-500/30",
    iconColor: "text-amber-600",
  },
  critical: {
    icon: AlertCircle,
    accent: "bg-red-500",
    bg: "bg-white",
    border: "border-red-500/25",
    iconColor: "text-red-600",
  },
};

const readDismissed = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(DISMISSED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
};

export default function AnnouncementBanner() {
  const { data } = useGetLiveAnnouncementsQuery();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setDismissed(readDismissed());
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const announcements = (data?.data ?? []).filter(
    (a) => hydrated && !(a.isDismissible && dismissed.includes(a._id))
  );

  if (announcements.length === 0) return null;

  const dismiss = (id: string) => {
    const next = [...dismissed, id];
    setDismissed(next);
    try {
      window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(next));
    } catch {
    }
  };

  return (
    <div className="w-full bg-[#ffd60a]" role="region" aria-label="Announcements">
      <div className="mx-auto flex w-full max-w-7xl items-start gap-3 px-4 py-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black text-[#ffd60a] shadow-md" aria-hidden>
          <Megaphone className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1 space-y-2">
        <AnimatePresence mode="popLayout">
          {announcements.map((a) => {
            const config = typeConfig[a.type] ?? typeConfig.info;
            const Icon = config.icon;
            return (
              <motion.div
                key={a._id}
                layout
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`relative flex items-start gap-3 overflow-hidden rounded-xl border px-4 py-3 text-sm shadow-md ${config.bg} ${config.border}`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-0 left-0 w-1 ${config.accent}`}
                />
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${config.iconColor}`} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-900">{a.title}</p>
                  <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-neutral-600">
                    {a.message}
                  </p>
                </div>
                {a.link && (
                  <a
                    href={a.link}
                    className="shrink-0 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-50"
                  >
                    View
                  </a>
                )}
                {a.isDismissible && (
                  <button
                    onClick={() => dismiss(a._id)}
                    aria-label={`Dismiss announcement: ${a.title}`}
                    className="shrink-0 rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
