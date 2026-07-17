"use client";

import { PlayCircle, ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";
import AuthGuard from "@/components/shared/AuthGuard";
import NotificationBell from "@/components/shared/NotificationBell";
import { YoutubePrivatePlayer } from "@/components/shared/youtube-private-player";
import { useCourseNavigation } from "@/hooks/useCourseNavigation";
import DarkCard from "./_components/DarkCard";
import OutlineBtn from "./_components/OutlineBtn";
import CourseProgressBanner from "./_components/CourseProgressBanner";
import ModuleSidebar from "./_components/ModuleSidebar";
import { LoadingState, CourseNotFound } from "./_components/CoursePageStates";
import CourseLessonNav from "./_components/CourseLessonNav";
import CourseCompletionCard from "./_components/CourseCompletionCard";
import CourseContentComingSoon from "./_components/CourseContentComingSoon";
import CourseTabsSection from "./_components/CourseTabsSection";

export default function CourseDetails() {
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
    handleNextLesson,
    handlePrevLesson,
    toggleModule,
    selectLesson,
    setShowCongratulations,
  } = useCourseNavigation();

  if (isLoading) {
    return <AuthGuard><LoadingState /></AuthGuard>;
  }

  if (!course) {
    return <AuthGuard><CourseNotFound /></AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#0a0f18] via-surface to-surface-darker">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
        />
        <div className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/8 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-[10%] -left-20 w-[250px] h-[250px] bg-primary/5 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute top-[20%] -right-16 w-[200px] h-[220px] bg-primary/4 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
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

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5">
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
                          {currentModule?.title} &bull; Lesson {currentLessonIndex + 1} of {currentModule?.lessons.length}
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
                    currentModuleIndex === (course.curriculum as Record<string, unknown>[]).length - 1 &&
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
              toggleModule={toggleModule}
              isLessonCompleted={isLessonCompleted}
              isLessonUnlocked={isLessonUnlocked}
              onSelectLesson={selectLesson}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
