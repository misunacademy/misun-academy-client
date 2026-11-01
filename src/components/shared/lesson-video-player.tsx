'use client';

import { FileText } from 'lucide-react';
import { YoutubePrivatePlayer } from './youtube-private-player';
import {
  buildDrivePreviewUrl,
  buildYouTubeWatchUrl,
  extractDriveId,
  extractVideoId,
  resolveVideoSource,
} from '@/lib/youtube/utils';

interface LessonVideoPlayerProps {
  url?: string | null;
  type?: string | null;
  videoSource?: string | null;
  videoId?: string | null;
  title?: string;
  className?: string;
}

/**
 * Single entry point for lesson/recorded video playback.
 * - YouTube (any URL shape or bare id) -> privacy-hardened custom player
 * - Google Drive (preview URL or bare file id) -> Drive preview iframe
 * - Anything else -> explicit "content not available" card (never blank, never
 *   a raw YouTube "unavailable" with zero context).
 */
export function LessonVideoPlayer({ url, type, videoSource, videoId, title, className }: LessonVideoPlayerProps) {
  const source = resolveVideoSource({ url, type, videoSource, videoId });

  if (source === 'googledrive') {
    const driveId = extractDriveId(url) ?? extractDriveId(videoId) ?? undefined;
    if (!driveId) {
      return (
        <div className={`aspect-video rounded-xl border border-white/[0.04] bg-white/[0.02] flex flex-col items-center justify-center gap-3 p-6 text-center ${className || ''}`}>
          <FileText className="h-12 w-12 text-white/20" />
          <p className="text-white/30 text-sm">Content not available</p>
          <p className="text-white/20 text-xs">This lesson&apos;s Drive link is invalid. Please contact support.</p>
        </div>
      );
    }
    return (
      <div className={`relative aspect-video w-full rounded-xl overflow-hidden ${className || ''}`}>
        <iframe
          key={driveId}
          src={buildDrivePreviewUrl(driveId)}
          className="absolute inset-0 w-full h-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title || 'Lesson video'}
        />
      </div>
    );
  }

  // YouTube path — accept id from url, explicit videoId, or raw pasted values.
  const ytId = extractVideoId(url) ?? extractVideoId(videoId) ?? undefined;
  const playableUrl = url || (ytId ? buildYouTubeWatchUrl(ytId) : '') || videoId || '';

  if (!ytId) {
    return (
      <div className={`aspect-video rounded-xl border border-white/[0.04] bg-white/[0.02] flex flex-col items-center justify-center gap-3 p-6 text-center ${className || ''}`}>
        <FileText className="h-12 w-12 text-white/20" />
        <p className="text-white/30 text-sm">Content not available</p>
        <p className="text-white/20 text-xs">This lesson has no playable video yet.</p>
      </div>
    );
  }

  return (
    <div className={`relative aspect-video w-full rounded-xl overflow-hidden ${className || ''}`}>
      <YoutubePrivatePlayer
        key={ytId}
        url={playableUrl}
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
