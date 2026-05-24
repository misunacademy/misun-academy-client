"use client";

import { useState, useMemo } from "react";
import { AlertCircle, BookOpen, Clock, Loader2, PlayCircle, Radio, Video } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
import { toast } from "sonner";
import { Recording, useGetStudentRecordingsQuery, useIncrementRecordingViewMutation } from "@/redux/api/recordingApi";
import { useGetStudentDashboardDataQuery } from "@/redux/api/dashboardApi";

export function LiveRecordingsTab() {
  const [playingRecording, setPlayingRecording] = useState<Recording | null>(null);
  const [selectedCourseKey, setSelectedCourseKey] = useState<string>("");
  const { data: recordings = [], isLoading, isError } = useGetStudentRecordingsQuery();
  const { data: dashboardData, isLoading: isDashboardLoading } = useGetStudentDashboardDataQuery(undefined);
  const [incrementView] = useIncrementRecordingViewMutation();

  const standardCourseIds = useMemo(() => {
    const enrolledCourses = (dashboardData?.data?.enrolledCourses || []) as Array<{
      accessType?: "standard" | "special";
      courseId?: string;
    }>;
    return new Set(
      enrolledCourses
        .filter((course) => course.accessType !== "special")
        .map((course) => course.courseId)
        .filter(Boolean)
    );
  }, [dashboardData]);

  const filteredRecordings = useMemo(() => {
    if (standardCourseIds.size === 0) {
      return [];
    }

    return recordings.filter((rec) => {
      const courseId = typeof rec.courseId === "object" ? rec.courseId?._id : rec.courseId;
      return Boolean(courseId) && standardCourseIds.has(courseId as string);
    });
  }, [recordings, standardCourseIds]);

  const courseGroups = useMemo(() => {
    const grouped: Record<string, { key: string; title: string; recordings: Recording[] }> = {};

    filteredRecordings.forEach((rec) => {
      const courseObj = typeof rec.courseId === "object" ? rec.courseId : null;
      const key = courseObj?._id || (typeof rec.courseId === "string" ? rec.courseId : "live-class");
      const title = courseObj?.title || "Live Class";

      if (!grouped[key]) {
        grouped[key] = { key, title, recordings: [] };
      }
      grouped[key].recordings.push(rec);
    });

    return Object.values(grouped)
      .map((group) => ({
        ...group,
        recordings: [...group.recordings].sort(
          (a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime()
        ),
      }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [filteredRecordings]);

  const resolvedCourseKey =
    courseGroups.some((group) => group.key === selectedCourseKey)
      ? selectedCourseKey
      : (courseGroups[0]?.key || "");

  const activeCourseGroup = courseGroups.find((group) => group.key === resolvedCourseKey) || null;

  const handlePlayRecording = async (recording: Recording) => {
    setPlayingRecording(recording);
    try {
      await incrementView(recording._id).unwrap();
    } catch {
      toast.error("Could not update view count.");
    }
  };

  if (isLoading || isDashboardLoading) {
    return (
      <div className="relative rounded-2xl border border-primary/20 bg-[#060f0a] overflow-hidden py-14 px-6 flex flex-col items-center justify-center gap-3 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-white/45">Loading live class recordings...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 text-red-100">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load class recordings. Please try again in a moment.
        </AlertDescription>
      </Alert>
    );
  }

  if (filteredRecordings.length === 0) {
    return (
      <div className="relative rounded-2xl border border-primary/20 bg-[#060f0a] overflow-hidden flex flex-col items-center justify-center py-20 gap-5 text-center px-6">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-2xl bg-primary/15 animate-ping opacity-20" />
          <div className="relative p-5 rounded-2xl bg-primary/10 border border-primary/25">
            <Video className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-2">No Recordings Yet</h3>
          <p className="text-white/50 text-sm max-w-sm leading-relaxed">
            Live class recordings will appear here once they are uploaded after each session.
          </p>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-white/30 bg-white/5 border border-primary/10 rounded-xl px-4 py-2.5">
          <Clock className="w-3.5 h-3.5 shrink-0 text-primary/60" />
          <span>Recordings are usually available within 24 hours of class</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        <div className="overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 min-w-max">
            {courseGroups.map((group) => {
              const active = group.key === resolvedCourseKey;
              return (
                <button
                  key={group.key}
                  onClick={() => setSelectedCourseKey(group.key)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                    active
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-primary/20 bg-[#060f0a] text-white/60 hover:border-primary/35 hover:text-white"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{group.title}</span>
                  <span className="rounded-full border border-primary/30 px-1.5 py-0.5 text-[11px] font-bold text-primary/90">
                    {group.recordings.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {activeCourseGroup ? (
          <div className="flex flex-col gap-4">
            {activeCourseGroup.recordings.map((rec) => (
              <div
                key={rec._id}
                className="group relative rounded-2xl border border-primary/20 bg-[#060f0a] p-5 flex flex-col sm:flex-row sm:items-center gap-4
                hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-14 h-14 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Radio className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-white line-clamp-1">{rec.title}</h4>
                  <p className="text-sm text-white/40 line-clamp-1">{activeCourseGroup.title}</p>
                  <p className="text-xs text-white/30 mt-1">
                    {new Date(rec.sessionDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    {rec.duration ? ` • ${rec.duration} min` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handlePlayRecording(rec)}
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold
                  border border-primary/20 text-white/60 hover:border-primary/40 hover:text-primary hover:bg-primary/5
                  transition-all duration-300"
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch
                </button>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <Dialog
        open={!!playingRecording}
        onOpenChange={(open) => {
          if (!open) setPlayingRecording(null);
        }}
      >
        <DialogContent className="max-w-4xl w-full bg-[#060f0a] border border-primary/25 text-white">
          <DialogHeader>
            <DialogTitle>{playingRecording?.title}</DialogTitle>
          </DialogHeader>
          {playingRecording ? (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden">
              <YoutubePrivatePlayer
                url={playingRecording.videoUrl ?? ""}
                className="absolute inset-0 w-full h-full"
              />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
