"use client";

import { useState, useEffect, useMemo } from "react";
import {
  PlayCircle,
  ChevronLeft,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import AuthGuard from "@/components/shared/AuthGuard";
import NotificationBell from "@/components/shared/NotificationBell";
import {
  useGetCourseByIdQuery,
  useGetCourseProgressQuery,
  useCompleteLessonMutation,
} from "@/redux/api/courseApi";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";

import { toast } from "sonner";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
import DarkCard from "./_components/DarkCard";
import OutlineBtn from "./_components/OutlineBtn";
import CourseProgressBanner from "./_components/CourseProgressBanner";
import ModuleSidebar from "./_components/ModuleSidebar";
import { LoadingState, CourseNotFound } from "./_components/CoursePageStates";
import CourseLessonNav from "./_components/CourseLessonNav";
import CourseCompletionCard from "./_components/CourseCompletionCard";
import CourseContentComingSoon from "./_components/CourseContentComingSoon";
import CourseTabsSection from "./_components/CourseTabsSection";

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

export default function CourseDetails() {
  const params = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
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
  const hasCompletedCourse = false;
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());


  const batchIdFromUrl = searchParams.get("batchId") ?? undefined;
  const { data: enrollments } = useGetEnrollmentsQuery(undefined, { skip: !!batchIdFromUrl });
  const fallbackBatchId = batchIdFromUrl
    ? undefined
    : (enrollments?.data?.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (e: any) => e.batchId?.courseId?._id === courseId
      )?.batchId?._id as string | undefined);
  const batchId = batchIdFromUrl ?? fallbackBatchId;

  const { data: course, isLoading: courseLoading } = useGetCourseByIdQuery({ id: courseId, batchId });
  const { data: progressData, isLoading: progressLoading, refetch: refetchProgress } = useGetCourseProgressQuery(
    { courseId, batchId },
    { skip: !courseId }
  );
  const progress: CourseProgress | undefined = progressData?.data as CourseProgress | undefined;
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

  const { data: batchData } = useGetBatchByIdQuery(batchId || "", { skip: !batchId });
  const isBatchCompleted = batchData?.data?.status === "completed";

  if (courseLoading || progressLoading) {
    return <AuthGuard><LoadingState /></AuthGuard>;
  }

  if (!course) {
    return <AuthGuard><CourseNotFound /></AuthGuard>;
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
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to complete lesson.");
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



  const totalLessons = curriculum?.reduce((t, m) => t + (m.lessons?.length || 0), 0) || 0;
  const completedLessonsCount = progress?.completedLessons?.length || 0;
  const totalModules = curriculum?.length || 0;
  const calculatedPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const allResources = curriculum?.flatMap((module) =>
    module.lessons?.flatMap((lesson) =>
      (lesson.resources || []).map(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (resource: any) => ({ 
        ...resource, 
        lessonTitle: lesson.title, 
        moduleTitle: module.title,
        lessonId: lesson.lessonId 
      })) || []
    ) || []
  ) || [];

  const instructorName = typeof course?.instructor === "string" ? course?.instructor : "Instructor";

  return (
    <AuthGuard>
      <div
        className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0f18] via-surface to-surface-darker"
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
          <NotificationBell />
        </div>

        <CourseProgressBanner
          totalModules={totalModules}
          totalLessons={totalLessons}
          completedLessonsCount={completedLessonsCount}
          calculatedPercentage={calculatedPercentage}
        />

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
                  The instructor hasn&apos;t uploaded any modules for this course yet. Check back later for exciting new content!
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
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden">
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

            {showCookingMessage && !isBatchCompleted && !hasCompletedCourse && (
              <CourseContentComingSoon />
            )}

            {isBatchCompleted && hasCompletedCourse && showCongratulations && (
              <CourseCompletionCard
                courseTitle={course.title}
                calculatedPercentage={calculatedPercentage}
                onDismiss={() => setShowCongratulations(false)}
              />
            )}

            {curriculum.length > 0 && !showCookingMessage && (
              <CourseLessonNav
                onPrev={handlePrevLesson}
                onNext={handleNextLesson}
                canGoPrev={currentModuleIndex !== 0 || currentLessonIndex !== 0}
                canGoNext={!!course.curriculum && !!currentModule && !(
                  currentModuleIndex === course.curriculum.length - 1 &&
                  currentLessonIndex === currentModule.lessons.length - 1 &&
                  isLessonCompleted(currentModule.moduleId, currentLesson?.lessonId || "")
                )}
                lessonLabel={`Lesson ${currentLessonIndex + 1} / ${currentModule?.lessons.length}`}
              />
            )}

            <CourseTabsSection
              course={course}
              totalLessons={totalLessons}
              instructorName={instructorName}
              calculatedPercentage={calculatedPercentage}
              allResources={allResources}
              currentLesson={currentLesson}
            />
          </div>

          <ModuleSidebar
            curriculum={curriculum}
            currentModuleIndex={currentModuleIndex}
            currentLessonIndex={currentLessonIndex}
            expandedModules={expandedModules}
            toggleModule={(moduleId) =>
              setExpandedModules((prev) => {
                const s = new Set(prev);
                if (s.has(moduleId)) s.delete(moduleId);
                else s.add(moduleId);
                return s;
              })
            }
            isLessonCompleted={isLessonCompleted}
            isLessonUnlocked={isLessonUnlocked}
            onSelectLesson={(moduleIdx, lessonIdx) => {
              setCurrentModuleIndex(moduleIdx);
              setCurrentLessonIndex(lessonIdx);
              setShowCookingMessage(false);
            }}
          />

        </div>
      </div>
    </div>
    </AuthGuard>
  );
}