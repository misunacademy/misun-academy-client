"use client";

import { Play, ChevronUp, ChevronDown } from "lucide-react";
import { useGetSettingsQuery } from "@/redux/api/settingsApi";

const DEFAULT_VIDEO_URL = "https://www.youtube.com/embed/UC4LM-u9TqM";

export function toYouTubeEmbedUrl(rawUrl: string | undefined | null): string {
  const value = rawUrl?.trim();
  if (!value) return "";

  try {
    const url = new URL(value);

    if (url.hostname === "youtu.be") {
      const id = url.pathname.slice(1).split("/")[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }

    if (url.hostname.endsWith("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) {
        return `https://www.youtube.com/embed/${url.pathname.split("/")[2]}`;
      }
      if (url.pathname.startsWith("/shorts/")) {
        return `https://www.youtube.com/embed/${url.pathname.split("/")[2]}`;
      }
      const v = url.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch {
  }

  return value;
}

interface VideoTutorialSectionProps {
  show: boolean;
  onToggle: () => void;
}

export function VideoTutorialSection({ show, onToggle }: VideoTutorialSectionProps) {
  const { data } = useGetSettingsQuery();
  const videoUrl =
    toYouTubeEmbedUrl(data?.data?.maPaymentTutorialVideoUrl) ||
    toYouTubeEmbedUrl(data?.data?.epPaymentTutorialVideoUrl) ||
    DEFAULT_VIDEO_URL;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between hover:bg-primary/8 transition-colors"
        aria-expanded={show}
        aria-controls="tutorial-content"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center">
            <Play className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-white/85 text-sm">Payment Tutorial Video</h4>
            <p className="text-xs text-white/45">Learn how to complete your payment step by step</p>
          </div>
        </div>
        {show ? <ChevronUp className="w-5 h-5 text-primary/60" /> : <ChevronDown className="w-5 h-5 text-primary/60" />}
      </button>
      {show && (
        <div id="tutorial-content" className="px-4 pb-4 space-y-3 border-t border-primary/15">
          <div className="aspect-video bg-black rounded-lg overflow-hidden mt-3">
            <iframe
              className="w-full h-full"
              src={videoUrl}
              title="Payment Tutorial"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="bg-primary/8 border border-primary/15 rounded-lg p-3 text-sm">
            <p className="font-medium mb-2 text-white/70">📋 Quick Steps:</p>
            <ol className="list-decimal list-inside space-y-1 text-white/50 text-xs">
              <li>Select your preferred payment method below</li>
              <li>For SSLCommerz: You&lsquo;ll be redirected to secure payment gateway</li>
              <li>For Phone Pay: Follow manual payment instructions</li>
              <li>Complete payment and wait for confirmation</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
