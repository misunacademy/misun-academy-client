import { useCallback } from "react";
import { useCurriculumProgress } from "./useCurriculumProgress";
import { useLessonNav } from "./useLessonNav";

export function useCourseNavigation() {
  const progress = useCurriculumProgress();
  const nav = useLessonNav(progress.curriculum, progress.progress?.currentLesson);

  const hasCompletedCourse = false;

  const onNextLesson = useCallback(async () => {
    const m = nav.currentModule;
    const l = nav.currentLessonItem;
    if (!m || !l) return;
    if (!progress.isLessonCompleted(m.moduleId, l.lessonId)) {
      await progress.handleCompleteLesson(m.moduleId, l.lessonId);
    }
    const isLastLesson = nav.currentModuleIndex === progress.curriculum.length - 1 &&
      nav.currentLessonIndex === m.lessons.length - 1;
    if (isLastLesson) { nav.setShowCookingMessage(true); return; }
    if (nav.currentLessonIndex < m.lessons.length - 1) {
      nav.setCurrentLessonIndex(nav.currentLessonIndex + 1);
    } else if (nav.currentModuleIndex < progress.curriculum.length - 1) {
      nav.setCurrentModuleIndex(nav.currentModuleIndex + 1);
      nav.setCurrentLessonIndex(0);
    }
  }, [nav, progress]);

  return {
    course: progress.course,
    courseId: progress.courseId,
    batchId: progress.batchId,
    isLoading: progress.isLoading,
    curriculum: progress.curriculum,
    currentModule: nav.currentModule,
    currentLesson: nav.currentLessonItem,
    isBatchCompleted: progress.isBatchCompleted,
    hasCompletedCourse,
    totalLessons: progress.totalLessons,
    totalModules: progress.totalModules,
    completedLessonsCount: progress.completedLessonsCount,
    calculatedPercentage: progress.calculatedPercentage,
    allResources: progress.allResources,
    instructorName: progress.instructorName,
    showCookingMessage: nav.showCookingMessage,
    showCongratulations: nav.showCongratulations,
    expandedModules: nav.expandedModules,
    currentModuleIndex: nav.currentModuleIndex,
    currentLessonIndex: nav.currentLessonIndex,
    isLessonCompleted: progress.isLessonCompleted,
    isLessonUnlocked: progress.isLessonUnlocked,
    handleNextLesson: onNextLesson,
    handlePrevLesson: nav.handlePrevLesson,
    toggleModule: nav.toggleModule,
    selectLesson: nav.selectLesson,
    setShowCongratulations: nav.setShowCongratulations,
    setShowCookingMessage: nav.setShowCookingMessage,
  };
}