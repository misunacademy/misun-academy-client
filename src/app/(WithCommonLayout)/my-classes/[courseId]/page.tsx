"use client";

import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { PlayCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

import { useCourseNavigation } from "@/hooks/useCourseNavigation";
import { useGetZamesStatsQuery } from "@/redux/api/gamificationApi";
import type { IZamesStats } from "@/types/quiz";
import { extractApiData } from "@/lib/api-helpers";
import DarkCard from "./_components/DarkCard";
import CourseProgressBanner from "./_components/CourseProgressBanner";
import ModuleSidebar from "./_components/ModuleSidebar";
import { LoadingState, CourseNotFound } from "./_components/CoursePageStates";
import CourseLessonNav from "./_components/CourseLessonNav";
import CourseContentComingSoon from "./_components/CourseContentComingSoon";
import CourseTabsSection from "./_components/CourseTabsSection";
import { QuizPlayer } from "./_components/QuizPlayer";
import { CourseCompletedView } from "./_components/CourseCompletedView";
import ModuleNotCookedView from "./_components/ModuleNotCookedView";
import LeaderboardDrawer from "@/components/quiz/LeaderboardDrawer";
import { CoursePageLayout } from "./_components/CoursePageLayout";
import { CoursePageHeader } from "./_components/CoursePageHeader";
import { LessonDisplay } from "./_components/LessonDisplay";


export default function CourseDetails() {
  const { user } = useAuth();
  const {
    course,
    isLoading,
    curriculum,
    currentModule,
    currentLesson,
    isBatchCompleted,
    hasCompletedCourse,
    totalLessons,
    totalModules,
    completedLessonsCount,
    calculatedPercentage,
    allResources,
    instructorName,
    showCookingMessage,
    showCongratulations,
    expandedModules,
    currentModuleIndex,
    currentLessonIndex,
    isLessonCompleted,
    isLessonUnlocked,
    isQuizCompleted,
    isQuizUnlocked,
    refetchProgress,
    handleNextLesson,
    handlePrevLesson,
    toggleModule,
    selectLesson,
    selectQuizModule,
    setShowCongratulations,
    setShowCookingMessage,
    courseId,
    batchId,
    quizIdFromUrl,
  } = useCourseNavigation();

  const [activeQuizId, setActiveQuizId] = useState<string | null>(quizIdFromUrl || null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const { data: zamesStatsRaw } = useGetZamesStatsQuery(
    { courseId, batchId: batchId || undefined },
    { skip: !batchId }
  );
  const zamesStats = extractApiData<IZamesStats>(zamesStatsRaw);
  const totalZames = useMemo(() => zamesStats?.totalZames ?? 0, [zamesStats]);

  const currentQuizIndex = useMemo(
    () => (activeQuizId ? (currentModule?.quizzes || []).findIndex((q) => q.quizId === activeQuizId) : -1),
    [activeQuizId, currentModule]
  );

  const handleSelectQuiz = useCallback(
    (moduleIdx: number, quizId: string) => {
      const quizzes = curriculum[moduleIdx]?.quizzes || [];
      const quizIdx = quizzes.findIndex((q) => q.quizId === quizId);
      if (quizIdx >= 0 && !isQuizUnlocked(moduleIdx, quizIdx)) {
        toast.error("This module is locked. Complete previous modules before attempting its lessons.");
        return;
      }
      selectQuizModule(moduleIdx);
      setActiveQuizId(quizId);
    },
    [curriculum, isQuizUnlocked, selectQuizModule]
  );

  const handleSelectLesson = useCallback(
    (moduleIdx: number, lessonIdx: number) => {
      if (!isLessonUnlocked(moduleIdx, lessonIdx)) {
        toast.error("This module is locked. Complete previous modules before attempting its lessons.");
        return;
      }
      setActiveQuizId(null);
      selectLesson(moduleIdx, lessonIdx);
    },
    [isLessonUnlocked, selectLesson]
  );

  const advanceToNext = useCallback(
    async (quizIdx: number, quizzes: Array<{ quizId: string }>) => {
      await refetchProgress();
      if (quizIdx >= 0 && quizIdx < quizzes.length - 1 && isQuizUnlocked(currentModuleIndex, quizIdx + 1)) {
        return quizzes[quizIdx + 1].quizId;
      }
      if (currentModuleIndex < curriculum.length - 1 && isLessonUnlocked(currentModuleIndex + 1, 0)) {
        selectLesson(currentModuleIndex + 1, 0);
        return "lesson";
      }
      setShowCookingMessage(true);
      return null;
    },
    [currentModuleIndex, curriculum, isQuizUnlocked, isLessonUnlocked, refetchProgress, selectLesson, setShowCookingMessage]
  );

  const handleQuizComplete = useCallback(async () => {
    const quizzes = currentModule?.quizzes || [];
    const next = await advanceToNext(currentQuizIndex, quizzes);
    if (next === "lesson") {
      setActiveQuizId(null);
    } else if (next && next !== "lesson") {
      setActiveQuizId(next);
    } else if (!next) {
      setActiveQuizId(null);
    }
  }, [currentModule, currentQuizIndex, advanceToNext]);

  const handleQuizBack = useCallback(() => {
    setActiveQuizId(null);
  }, []);

  const handleNextLessonWrapped = useCallback(() => {
    handleNextLesson((quizId: string) => setActiveQuizId(quizId));
  }, [handleNextLesson]);

  const handleNextDuringQuiz = useCallback(async () => {
    const quizzes = currentModule?.quizzes || [];
    const next = await advanceToNext(currentQuizIndex, quizzes);
    if (next === "lesson") {
      setActiveQuizId(null);
    } else if (next && next !== "lesson") {
      setActiveQuizId(next);
    } else if (!next) {
      setActiveQuizId(null);
    }
  }, [currentModule, currentQuizIndex, advanceToNext]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (!course) {
    return <CoursePageLayout><CourseNotFound /></CoursePageLayout>;
  }

  const showProgressBanner = !activeQuizId;
  const showMainContent = activeQuizId || curriculum.length === 0 || (currentLesson && !showCookingMessage);
  const showComingSoon = !activeQuizId && showCookingMessage && !isBatchCompleted && !hasCompletedCourse;
  const showNotCooked = !activeQuizId && showCookingMessage && !isBatchCompleted && hasCompletedCourse;
  const showCompletion = !activeQuizId && showCookingMessage && isBatchCompleted && hasCompletedCourse && showCongratulations;
  const showLessonNav = curriculum.length > 0 && !showCookingMessage;

  return (
    <CoursePageLayout>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0f18] via-surface to-surface-darker">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-[10%] -left-20 w-[250px] h-[250px] bg-primary/5 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute top-[20%] -right-16 w-[200px] h-[220px] bg-primary/4 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <CoursePageHeader
            courseTitle={course.title}
            instructorName={instructorName}
            totalZames={totalZames}
            batchId={batchId}
            onLeaderboardClick={() => setShowLeaderboard(true)}
          />

          {showProgressBanner && (
            <CourseProgressBanner
              totalModules={totalModules}
              totalLessons={totalLessons}
              completedLessonsCount={completedLessonsCount}
              calculatedPercentage={calculatedPercentage}
            />
          )}

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
              {showMainContent ? (
                <>
                  {showCompletion ? (
                    <CourseCompletedView
                      courseTitle={course.title}
                      calculatedPercentage={calculatedPercentage}
                      onDismiss={() => setShowCongratulations(false)}
                    />
                  ) : activeQuizId ? (
                    <QuizPlayer
                      key={activeQuizId}
                      quizId={activeQuizId}
                      courseId={courseId}
                      batchId={batchId || ""}
                      enrollmentId={batchId || ""}
                      onComplete={handleQuizComplete}
                      onBack={handleQuizBack}
                    />
                  ) : curriculum.length === 0 ? (
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
                  ) : currentLesson ? (
                    <LessonDisplay
                      currentLesson={currentLesson}
                      currentModule={currentModule}
                      currentLessonIndex={currentLessonIndex}
                    />
                  ) : null}
                </>
              ) : null}

              {showComingSoon && <CourseContentComingSoon />}

              {showNotCooked && <ModuleNotCookedView />}

              {showLessonNav && (
                <CourseLessonNav
                  onPrev={activeQuizId ? handleQuizBack : handlePrevLesson}
                  onNext={activeQuizId ? handleNextDuringQuiz : handleNextLessonWrapped}
                  canGoPrev={activeQuizId ? true : currentModuleIndex !== 0 || currentLessonIndex !== 0}
                  canGoNext={activeQuizId
                    ? currentQuizIndex < (currentModule?.quizzes?.length ?? 0) - 1 || currentModuleIndex < curriculum.length - 1
                    : !!currentModule && !!currentLesson && (
                        !isLessonCompleted(currentModule.moduleId, currentLesson.lessonId) ||
                        currentLessonIndex < currentModule.lessons.length - 1 ||
                        currentModuleIndex < curriculum.length - 1 ||
                        ((currentModule.quizzes?.length ?? 0) > 0)
                      )}
                  lessonLabel={activeQuizId
                    ? `Quiz ${currentQuizIndex + 1} / ${currentModule?.quizzes?.length}`
                    : `Lesson ${currentLessonIndex + 1} / ${currentModule?.lessons.length}`}
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
              courseId={courseId}
              activeQuizId={activeQuizId}
              currentModuleIndex={currentModuleIndex}
              currentLessonIndex={currentLessonIndex}
              expandedModules={expandedModules}
              toggleModule={toggleModule}
              isLessonCompleted={isLessonCompleted}
              isLessonUnlocked={isLessonUnlocked}
              isQuizCompleted={isQuizCompleted}
              isQuizUnlocked={isQuizUnlocked}
              onSelectLesson={handleSelectLesson}
              onSelectQuiz={handleSelectQuiz}
            />
          </div>
        </div>

        <LeaderboardDrawer
          isOpen={showLeaderboard}
          onClose={() => setShowLeaderboard(false)}
          batchId={batchId || ""}
          currentUserId={user?.id}
        />
      </div>
    </CoursePageLayout>
  );
}