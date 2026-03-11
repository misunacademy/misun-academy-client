/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  CheckCircle,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Calendar,
  Users,
  BookOpen,
  X,
  Lock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  useGetCourseByIdQuery,
  useGetCourseProgressQuery,
  useCompleteLessonMutation,
} from "@/redux/features/course/courseApi";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { toast } from "sonner";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";

interface CourseProgress {
  percentage: number;
  completedLessons: Array<{
    moduleId: string;
    lessonId: string;
    completedAt: string;
  }>;
  currentLesson?: {
    moduleId: string;
    lessonId: string;
  };
}

// ── Shared dark card wrapper ─────────────────────────────────────────────────
function DarkCard({
  children,
  className = "",
  glowOnHover = false,
}: {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
}) {
  return (
    <div
      className={`relative rounded-2xl border border-white/[0.04] bg-white/[0.015] backdrop-blur-md overflow-hidden ring-1 ring-white/[0.02]
        ${glowOnHover ? "transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_24px_hsl(156_70%_42%/0.1)]" : "shadow-xl shadow-black/20"}
        ${className}`}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/20 rounded-tl-2xl z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/20 rounded-tr-2xl z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/10 rounded-bl-2xl z-10 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/10 rounded-br-2xl z-10 pointer-events-none" />
      {children}
    </div>
  );
}

// ── Green primary button ─────────────────────────────────────────────────────
function PrimaryBtn({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
        bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white
        shadow-[0_0_14px_hsl(156_70%_42%/0.3)] hover:shadow-[0_0_22px_hsl(156_70%_42%/0.5)]
        transition-all duration-300 hover:-translate-y-px
        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none
        ${className}`}
    >
      {children}
    </button>
  );
}

function OutlineBtn({
  children,
  onClick,
  disabled,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm
        border border-white/[0.06] text-white/60 bg-white/[0.02]
        hover:border-primary/40 hover:text-primary hover:bg-primary/5
        transition-all duration-300
        disabled:opacity-30 disabled:cursor-not-allowed
        ${className}`}
    >
      {children}
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function CourseDetails() {
  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;

  type Lesson = {
    lessonId: string;
    title: string;
    media?: { url?: string };
    duration?: number;
    resources?: Array<{ type?: string; title?: string; url?: string; textContent?: string }>;
  };

  type ModuleType = {
    moduleId: string;
    title: string;
    lessons: Lesson[];
  };

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showCookingMessage, setShowCookingMessage] = useState(false);
  const [hasCompletedCourse, setHasCompletedCourse] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery(courseId);
  const { data: progressData, isLoading: progressLoading, refetch: refetchProgress } = useGetCourseProgressQuery(courseId);
  const progress: CourseProgress | undefined = progressData?.data;
  const { data: enrollments } = useGetEnrollmentsQuery();
  const [completeLesson] = useCompleteLessonMutation();

  const curriculum: ModuleType[] = useMemo(() => (course?.curriculum as ModuleType[]) || [], [course?.curriculum]);

  useEffect(() => {
    if (progress?.currentLesson && curriculum.length) {
      const moduleIndex = curriculum.findIndex((m) => m.moduleId === progress.currentLesson?.moduleId);
      const lessonIndex = curriculum[moduleIndex]?.lessons.findIndex((l) => l.lessonId === progress.currentLesson?.lessonId);
      if (moduleIndex >= 0) setCurrentModuleIndex(moduleIndex);
      if (lessonIndex >= 0) setCurrentLessonIndex(lessonIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress?.currentLesson?.moduleId, progress?.currentLesson?.lessonId, curriculum]);

  useEffect(() => {
    if (curriculum.length) setExpandedModules(new Set(curriculum.map((m) => m.moduleId)));
  }, [curriculum]);

  const enrollment = enrollments?.data?.find((e: any) => e.batchId?.courseId?._id === courseId);
  const batchId = enrollment?.batchId?._id;
  const { data: batchData } = useGetBatchByIdQuery(batchId || "", { skip: !batchId });
  const isBatchCompleted = batchData?.data?.status === "completed";

  // ── Loading/error states ──────────────────────────────────────────────────
  if (courseLoading || progressLoading) {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: "linear-gradient(180deg, #0a0f18 0%, #060f0a 100%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-white/40 text-sm">Loading your course…</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className="relative min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ background: "linear-gradient(180deg, #0a0f18 0%, #060f0a 100%)" }}
      >
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
          <AlertTriangle className="w-10 h-10 text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
          <p className="text-white/40 mb-6 max-w-sm">The course you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
        </div>
        <Link href="/my-classes">
          <OutlineBtn>
            <ChevronLeft className="h-4 w-4" />
            Back to My Classes
          </OutlineBtn>
        </Link>
      </div>
    );
  }

  const currentModule = curriculum?.[currentModuleIndex];
  const currentLesson = currentModule?.lessons[currentLessonIndex];

  const isLessonCompleted = (moduleId: string, lessonId: string) =>
    progress?.completedLessons?.some((c) => c.moduleId === moduleId && c.lessonId === lessonId) || false;

  const isLessonUnlocked = (moduleIdx: number, lessonIdx: number) => {
    for (let m = 0; m < moduleIdx; m++) {
      const mod = curriculum?.[m];
      if (!mod) continue;
      for (const les of mod.lessons) {
        if (!isLessonCompleted(mod.moduleId, les.lessonId)) return false;
      }
    }
    const mod = curriculum?.[moduleIdx];
    if (!mod) return false;
    for (let l = 0; l < lessonIdx; l++) {
      if (!isLessonCompleted(mod.moduleId, mod.lessons[l].lessonId)) return false;
    }
    return true;
  };

  const handleCompleteLesson = async () => {
    if (!currentLesson || !currentModule) return;
    try {
      await completeLesson({ courseId, moduleId: currentModule.moduleId, lessonId: currentLesson.lessonId }).unwrap();
      toast.success("Lesson marked as complete!");
      refetchProgress();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to complete lesson.");
    }
  };

  const handleNextLesson = async () => {
    if (!currentModule || !course.curriculum) return;
    if (!isLessonCompleted(currentModule.moduleId, currentLesson?.lessonId || "")) await handleCompleteLesson();
    const isLastLesson = currentModuleIndex === course.curriculum.length - 1 && currentLessonIndex === currentModule.lessons.length - 1;
    if (isLastLesson) { setShowCookingMessage(true); return; }
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else if (currentModuleIndex < course.curriculum.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      setCurrentLessonIndex(0);
    }
  };

  const handlePrevLesson = () => {
    if (!currentModule || !course.curriculum) return;
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = course.curriculum[currentModuleIndex - 1] as ModuleType;
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
  };

  const handleCompleteCourse = () => {
    setHasCompletedCourse(true);
    setShowCongratulations(true);
    toast.success("Course completed successfully! 🎉");
  };

  const totalLessons = curriculum?.reduce((t, m) => t + (m.lessons?.length || 0), 0) || 0;
  const completedLessonsCount = progress?.completedLessons?.length || 0;
  const totalModules = curriculum?.length || 0;
  const calculatedPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const allResources = curriculum?.flatMap((module) =>
    module.lessons?.flatMap((lesson) =>
      (lesson.resources || []).map((resource: any) => ({ ...resource, lessonTitle: lesson.title, moduleTitle: module.title })) || []
    ) || []
  ) || [];

  const instructorName = typeof course.instructor === "string" ? course.instructor : course.instructor?.name || "Instructor";

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: "linear-gradient(180deg, #0a0f18 0%, #060f0a 60%, #040c07 100%)" }}
    >
      {/* ── Dot-grid texture ── */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      {/* ── Ambient glows ── */}
      <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute top-[10%] -left-20 w-[250px] h-[250px] bg-primary/5 rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute top-[20%] -right-16 w-[200px] h-[220px] bg-primary/4 rounded-full blur-[60px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Top Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Link href="/my-classes">
            <OutlineBtn>
              <ChevronLeft className="h-4 w-4" />
              My Classes
            </OutlineBtn>
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-snug truncate">{course.title}</h1>
            <p className="text-sm text-white/40 mt-0.5">by {instructorName}</p>
          </div>
        </div>

        {/* ── Progress Banner ── */}
        <DarkCard className="p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-white/60">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span>{totalModules} modules • {totalLessons} lessons</span>
                </div>
                <span className="font-bold text-primary">{calculatedPercentage}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${calculatedPercentage}%`,
                    background: "linear-gradient(90deg, hsl(156 70% 42%), hsl(156 85% 65%))",
                    boxShadow: calculatedPercentage > 0 ? "0 0 8px hsl(156 70% 42% / 0.6)" : "none",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/35">
                <span>{completedLessonsCount} of {totalLessons} completed</span>
                <span>{totalLessons - completedLessonsCount} remaining</span>
              </div>
            </div>
            {/* Percentage badge */}
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-primary">{calculatedPercentage}</span>
              <span className="text-[10px] text-white/40 font-medium">%</span>
            </div>
          </div>
        </DarkCard>

        {/* ── Main layout: content + sidebar ── */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Left: Video + Controls + Tabs ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Video Player Area */}
            {curriculum.length === 0 ? (
              <DarkCard className="p-10 sm:p-14 text-center flex flex-col items-center justify-center min-h-[360px]">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_hsl(156_70%_42%/0.2)]">
                  <PlayCircle className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">Course Content Coming Soon</h2>
                <p className="text-white/40 max-w-md mx-auto leading-relaxed text-sm">
                  The instructor hasn't uploaded any modules for this course yet. Check back later for exciting new content!
                </p>
              </DarkCard>
            ) : currentLesson && !showCookingMessage ? (
              <DarkCard>
                <div className="p-5 border-b border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/15 border border-primary/25">
                      <PlayCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white leading-snug">{currentLesson.title}</h3>
                      <p className="text-xs text-white/40 mt-0.5">
                        {currentModule?.title} • Lesson {currentLessonIndex + 1} of {currentModule?.lessons.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  {currentLesson.media?.url ? (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/8">
                      <YoutubePrivatePlayer
                        url={currentLesson.media.url}
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video rounded-xl border border-white/[0.04] bg-white/[0.02] flex flex-col items-center justify-center gap-3">
                      <FileText className="h-12 w-12 text-white/20" />
                      <p className="text-white/30 text-sm">Content not available</p>
                    </div>
                  )}
                </div>
              </DarkCard>
            ) : null}

            {/* "Content Being Cooked" Message */}
            {showCookingMessage && !isBatchCompleted && !hasCompletedCourse && (
              <DarkCard className="p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                <div className="relative text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto">
                    <PlayCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Content Coming Soon</h2>
                  <p className="text-white/50 max-w-md mx-auto leading-relaxed">
                    The course content is being released gradually. New modules and lessons will be available soon.
                  </p>
                  <p className="text-sm text-white/30">Check back later or contact your instructor for more information.</p>
                </div>
              </DarkCard>
            )}

            {/* Course Completion Congratulations */}
            {isBatchCompleted && hasCompletedCourse && showCongratulations && (
              <DarkCard className="p-8">
                <button
                  className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all z-20"
                  onClick={() => setShowCongratulations(false)}
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
                <div className="relative text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/15 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_24px_hsl(156_70%_42%/0.3)]">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Congratulations! 🎉</h2>
                    <p className="text-white/50 mt-2">You&apos;ve successfully completed &ldquo;{course.title}&rdquo;</p>
                  </div>
                  <div className="text-sm text-white/30 space-y-1">
                    <p>Final progress: <span className="text-primary font-semibold">{calculatedPercentage}%</span></p>
                    <p>Completed on {new Date().toLocaleDateString()}</p>
                  </div>
                  <Link href="/dashboard/student/certificates">
                    <PrimaryBtn className="mx-auto">
                      <CheckCircle className="h-4 w-4" />
                      Get Your Certificate
                    </PrimaryBtn>
                  </Link>
                </div>
              </DarkCard>
            )}

            {/* Lesson Navigation */}
            {curriculum.length > 0 && !showCookingMessage && (
              <DarkCard className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <OutlineBtn
                    onClick={handlePrevLesson}
                    disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </OutlineBtn>

                  <span className="text-sm text-white/35 font-medium">
                    Lesson {currentLessonIndex + 1} / {currentModule?.lessons.length}
                  </span>

                  <PrimaryBtn
                    onClick={handleNextLesson}
                    disabled={
                      !course.curriculum || !currentModule ||
                      (currentModuleIndex === course.curriculum.length - 1 &&
                        currentLessonIndex === currentModule.lessons.length - 1 &&
                        isLessonCompleted(currentModule.moduleId, currentLesson?.lessonId || ""))
                    }
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </PrimaryBtn>
                </div>
              </DarkCard>
            )}

            {/* ── Tabs: Overview / Live / Resources ── */}
            <Tabs defaultValue="overview" className="w-full">
              {/* Tab bar */}
              <div className="relative">
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <TabsList className="h-auto p-0 bg-transparent rounded-none w-full justify-start gap-0">
                  {[
                    { value: "overview", icon: <BookOpen className="w-4 h-4" />, label: "Overview" },
                    { value: "live-classes", icon: <Calendar className="w-4 h-4" />, label: "Live Classes" },
                    { value: "resources", icon: <FileText className="w-4 h-4" />, label: "Resources" },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center gap-2 px-5 py-3 rounded-none border-b-2 border-transparent
                        text-sm font-semibold text-white/40
                        data-[state=active]:border-primary data-[state=active]:text-primary
                        data-[state=active]:bg-transparent data-[state=active]:shadow-none
                        hover:text-white/70 transition-all duration-200"
                    >
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Overview tab */}
              <TabsContent value="overview" className="mt-4 space-y-4">
                <DarkCard className="p-5">
                  <h3 className="font-bold text-white mb-3">About This Course</h3>
                  <p className="text-white/50 text-sm leading-relaxed mb-4">{course.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      {
                        icon: <Clock className="h-4 w-4 text-primary" />,
                        text: course.duration
                          ? typeof course.duration === "object"
                            ? `${(course.duration as any).weeks || 0} weeks, ${(course.duration as any).hours || 0} hours`
                            : String(course.duration)
                          : "TBD",
                      },
                      { icon: <BookOpen className="h-4 w-4 text-primary" />, text: `${totalLessons} Lessons` },
                      { icon: <Users className="h-4 w-4 text-primary" />, text: `By ${instructorName}` },
                      { icon: <CheckCircle className="h-4 w-4 text-primary" />, text: `${calculatedPercentage}% Complete` },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-white/50 bg-white/[0.02] rounded-xl px-3 py-2 border border-white/[0.04]">
                        {item.icon}
                        <span className="truncate">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </DarkCard>

                {/* Copyright notice */}
                <DarkCard className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                      <span className="text-amber-400 text-sm font-bold">©</span>
                    </div>
                    <div>
                      <p className="font-semibold text-amber-400 text-sm mb-1">Copyright Notice</p>
                      <p className="text-xs text-white/40 leading-relaxed">
                        This course content is protected by copyright. Unauthorized distribution, reproduction, or sharing of course materials is strictly prohibited and may result in legal action. All rights reserved.
                      </p>
                    </div>
                  </div>
                </DarkCard>
              </TabsContent>

              {/* Live Classes tab */}
              <TabsContent value="live-classes" className="mt-4">
                <DarkCard className="p-8 text-center">
                  <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
                    style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
                  <div className="relative space-y-4">
                    <div className="w-14 h-14 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto">
                      <Calendar className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-white">No Live Classes Scheduled</h3>
                    <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                      There are no live classes scheduled at the moment. Check back later or contact your instructor.
                    </p>
                  </div>
                </DarkCard>
              </TabsContent>

              {/* Resources tab */}
              <TabsContent value="resources" className="mt-4 space-y-3">
                {allResources.length === 0 ? (
                  <DarkCard className="p-8 text-center">
                    <div className="relative space-y-4">
                      <div className="w-14 h-14 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto">
                        <FileText className="h-7 w-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-white">No Resources Available</h3>
                      <p className="text-white/40 text-sm max-w-xs mx-auto leading-relaxed">
                        Resources will be made available as you progress through the course.
                      </p>
                    </div>
                  </DarkCard>
                ) : (
                  allResources.map((resource, index) => (
                    <DarkCard key={index} glowOnHover className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                          {resource.type === "link" ? (
                            <ExternalLink className="h-4 w-4 text-primary" />
                          ) : (
                            <FileText className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-white mb-0.5">{resource.title}</h4>
                          <p className="text-xs text-white/30 mb-2">
                            {resource.moduleTitle} → {resource.lessonTitle}
                          </p>
                          {resource.type === "link" && resource.url && (
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                              Open Link <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                          {resource.type === "text" && resource.textContent && (
                            <div className="mt-2 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                              <p className="text-xs text-white/40 whitespace-pre-wrap">{resource.textContent}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </DarkCard>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* ── Sidebar: Module list + Quick Actions ── */}
          <div className="sticky top-4 self-start space-y-5 h-fit">
            <DarkCard className="overflow-hidden">
              <div className="p-4 border-b border-white/[0.04] flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/15 border border-primary/25">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold text-white text-sm">Course Modules</h3>
                <span className="ml-auto text-xs text-white/30">{totalModules} modules</span>
              </div>
              <div className="max-h-[68vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <div className="p-3 space-y-1">
                  {curriculum.length === 0 ? (
                    <div className="text-center py-10 px-4 space-y-3">
                      <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.05] rounded-xl flex items-center justify-center mx-auto mb-2">
                        <BookOpen className="h-5 w-5 text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm leading-relaxed">
                        No modules available yet.
                      </p>
                    </div>
                  ) : (
                    curriculum.map((module, moduleIdx) => {
                      const moduleCompleted = module.lessons.filter((l) => isLessonCompleted(module.moduleId, l.lessonId)).length;
                    const isExpanded = expandedModules.has(module.moduleId);
                    const allDone = moduleCompleted === module.lessons.length;

                    return (
                      <div key={module.moduleId}>
                        {/* Module header */}
                        <button
                          className="w-full flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-200
                            hover:bg-white/[0.03] hover:border-white/[0.06]"
                          onClick={() =>
                            setExpandedModules((prev) => {
                              const s = new Set(prev);
                              s.has(module.moduleId) ? s.delete(module.moduleId) : s.add(module.moduleId);
                              return s;
                            })
                          }
                        >
                          <span className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold border
                            ${allDone
                              ? "bg-primary/20 text-primary border-primary/40"
                              : "bg-white/[0.04] text-white/50 border-white/[0.06]"}`}>
                            {allDone ? <CheckCircle className="w-3.5 h-3.5" /> : moduleIdx + 1}
                          </span>
                          <span className={`flex-1 text-xs font-semibold truncate ${allDone ? "text-primary" : "text-white/70"}`}>
                            {module.title}
                          </span>
                          <span className="shrink-0 text-[10px] text-white/30">{moduleCompleted}/{module.lessons.length}</span>
                          {isExpanded
                            ? <ChevronUp className="shrink-0 h-3.5 w-3.5 text-white/30" />
                            : <ChevronDown className="shrink-0 h-3.5 w-3.5 text-white/30" />}
                        </button>

                        {/* Lesson list */}
                        {isExpanded && (
                          <div className="ml-3 pl-3 border-l border-white/[0.05] space-y-1 mt-1 mb-2">
                            {module.lessons.map((lesson, lessonIdx) => {
                              const isCompleted = isLessonCompleted(module.moduleId, lesson.lessonId);
                              const isCurrent = moduleIdx === currentModuleIndex && lessonIdx === currentLessonIndex;
                              const isUnlocked = isLessonUnlocked(moduleIdx, lessonIdx) || isCurrent;

                              return (
                                <button
                                  key={lesson.lessonId}
                                  onClick={() => {
                                    setCurrentModuleIndex(moduleIdx);
                                    setCurrentLessonIndex(lessonIdx);
                                    setShowCookingMessage(false);
                                  }}
                                  disabled={!isUnlocked}
                                  className={`w-full text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200
                                    flex items-center gap-2.5
                                    ${isCurrent
                                      ? "bg-primary/12 border-primary/35 text-primary shadow-[0_0_10px_hsl(156_70%_42%/0.15)]"
                                      : isCompleted
                                      ? "bg-white/[0.02] border-white/[0.04] text-white/50 hover:bg-white/[0.04]"
                                      : isUnlocked
                                      ? "bg-transparent border-white/[0.04] text-white/45 hover:bg-white/[0.03] hover:border-white/[0.08] hover:text-white/70"
                                      : "bg-transparent border-transparent text-white/20 cursor-not-allowed opacity-50"
                                    }`}
                                >
                                  <span className="shrink-0">
                                    {isCompleted ? (
                                      <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                    ) : isCurrent ? (
                                      <PlayCircle className="h-3.5 w-3.5 text-primary" />
                                    ) : isUnlocked ? (
                                      <PlayCircle className="h-3.5 w-3.5 text-white/30" />
                                    ) : (
                                      <Lock className="h-3.5 w-3.5 text-white/20" />
                                    )}
                                  </span>
                                  <span className="flex-1 truncate leading-snug">{lesson.title}</span>
                                  {lesson.duration && (
                                    <span className="shrink-0 text-white/25 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {lesson.duration}m
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                    })
                  )}
                </div>
              </div>
            </DarkCard>

            {/* Complete Course card */}
            {isBatchCompleted && (
              <DarkCard className="p-5">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent pointer-events-none" />
                {(!isBatchCompleted || !hasCompletedCourse) ? (
                  <div className="relative space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm mb-1">🎉 Course Available for Completion!</p>
                        <p className="text-xs text-white/40 leading-relaxed">
                          If you have completed all lessons, mark the course as complete to earn your certificate.
                        </p>
                      </div>
                    </div>
                    <PrimaryBtn onClick={handleCompleteCourse} className="w-full justify-center">
                      <CheckCircle className="h-4 w-4" />
                      Complete Course & Get Certificate
                    </PrimaryBtn>
                  </div>
                ) : (
                  <div className="relative text-center space-y-2">
                    <div className="flex items-center justify-center gap-2 text-primary">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-bold">Course Completed!</span>
                    </div>
                    <p className="text-xs text-white/40">Congratulations on completing this course.</p>
                  </div>
                )}
              </DarkCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}