"use client";
import React from "react";
import { FileText, PlayCircle, Clock } from "lucide-react";
import DarkCard from "./DarkCard";
import { LessonVideoPlayer } from "@/components/shared/lesson-video-player";

interface LessonDisplayProps {
  readonly currentLesson: {
    readonly title: string;
    readonly lessonId: string;
    readonly media?: {
      readonly url?: string;
      readonly type?: string;
      readonly videoId?: string;
      readonly duration?: number;
    };
  };
  readonly currentModule: {
    readonly title: string;
    readonly lessons: readonly { readonly lessonId: string }[];
  } | undefined;
  readonly currentLessonIndex: number;
}

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const LessonDisplay = React.memo(function LessonDisplay({
  currentLesson,
  currentModule,
  currentLessonIndex,
}: LessonDisplayProps) {
  const videoKey = React.useMemo(
    () => `${currentLesson.lessonId}-${currentLesson.media?.url || currentLesson.media?.videoId || "none"}`,
    [currentLesson.lessonId, currentLesson.media?.url, currentLesson.media?.videoId]
  );

  const hasVideo = React.useMemo(
    () => Boolean(currentLesson.media?.url || currentLesson.media?.videoId),
    [currentLesson.media?.url, currentLesson.media?.videoId]
  );

  const lessonNumber = currentLessonIndex + 1;
  const totalLessons = currentModule?.lessons.length ?? 0;
  const lessonDuration = currentLesson.media?.duration;

  return (
    <DarkCard className="overflow-hidden">
      <div className="p-5 border-b border-white/[0.04]">
        <div className="flex items-start gap-3">
          <div className="shrink-0 p-1.5 rounded-lg bg-primary/15 border border-primary/25 mt-0.5" aria-hidden="true">
            <PlayCircle className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white leading-snug truncate">{currentLesson.title}</h3>
            <p className="text-xs text-white/40 mt-1 flex items-center gap-2 flex-wrap">
              <span>{currentModule?.title}</span>
              <span aria-hidden="true">&bull;</span>
              <span>Lesson {lessonNumber} of {totalLessons}</span>
              {lessonDuration && (
                <>
                  <span aria-hidden="true">&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {formatDuration(lessonDuration)}
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4" role="region" aria-label="Lesson content">
        {hasVideo ? (
          <LessonVideoPlayer
            key={videoKey}
            url={currentLesson.media?.url}
            type={currentLesson.media?.type}
            videoId={currentLesson.media?.videoId}
            title={currentLesson.title}
            className="rounded-xl"
          />
        ) : (
          <div
            className="aspect-video rounded-xl border border-white/[0.04] bg-white/[0.02] flex flex-col items-center justify-center gap-3 text-center"
            role="status"
            aria-live="polite"
          >
            <FileText className="h-12 w-12 text-white/20" aria-hidden="true" />
            <p className="text-white/30 text-sm">Content not available</p>
            <p className="text-white/20 text-xs">This lesson has no playable video yet.</p>
          </div>
        )}
      </div>
    </DarkCard>
  );
});