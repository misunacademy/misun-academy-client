import { useState, useEffect, useMemo, startTransition } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  useGetCourseByIdQuery,
  useGetCourseProgressQuery,
  useCompleteLessonMutation,
} from "@/redux/api/courseApi";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { toast } from "sonner";

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

export function useCourseNavigation() {
  const params = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
  const courseId = params.courseId;

  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showCookingMessage, setShowCookingMessage] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const batchIdFromUrl = searchParams.get("batchId") ?? undefined;
  const { data: enrollments } = useGetEnrollmentsQuery(undefined, { skip: !!batchIdFromUrl });
  const fallbackBatchId = batchIdFromUrl
    ? undefined
    : (enrollments?.data?.find(
        (e: { batchId?: { courseId?: { _id?: string } } }) => e.batchId?.courseId?._id === courseId
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
    if (!progress?.currentLesson || !curriculum.length) return;
    const moduleIndex = curriculum.findIndex((m) => m.moduleId === progress.currentLesson?.moduleId);
    const lessonIndex = curriculum[moduleIndex]?.lessons.findIndex((l) => l.lessonId === progress.currentLesson?.lessonId);
    startTransition(() => {
      if (moduleIndex >= 0) setCurrentModuleIndex(moduleIndex);
      if (lessonIndex >= 0) setCurrentLessonIndex(lessonIndex);
    });
  }, [progress?.currentLesson, curriculum]);

  useEffect(() => {
    if (!curriculum.length) return;
    startTransition(() => {
      setExpandedModules(new Set(curriculum.map((m) => m.moduleId)));
    });
  }, [curriculum]);

  const { data: batchData } = useGetBatchByIdQuery(batchId || "", { skip: !batchId });
  const isBatchCompleted = batchData?.data?.status === "completed";

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
    if (!currentModule || !course?.curriculum) return;
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
    if (!currentModule || !course?.curriculum) return;
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    } else if (currentModuleIndex > 0) {
      const prevModule = course.curriculum[currentModuleIndex - 1] as ModuleType;
      setCurrentModuleIndex(currentModuleIndex - 1);
      setCurrentLessonIndex(prevModule.lessons.length - 1);
    }
  };

  const toggleModule = (moduleId: string) =>
    setExpandedModules((prev) => {
      const s = new Set(prev);
      if (s.has(moduleId)) s.delete(moduleId);
      else s.add(moduleId);
      return s;
    });

  const selectLesson = (moduleIdx: number, lessonIdx: number) => {
    setCurrentModuleIndex(moduleIdx);
    setCurrentLessonIndex(lessonIdx);
    setShowCookingMessage(false);
  };

  const totalLessons = curriculum?.reduce((t, m) => t + (m.lessons?.length || 0), 0) || 0;
  const completedLessonsCount = progress?.completedLessons?.length || 0;
  const totalModules = curriculum?.length || 0;
  const calculatedPercentage = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;

  const allResources = curriculum?.flatMap((module_) =>
    module_.lessons?.flatMap((lesson) =>
      (lesson.resources || []).map((resource) => ({
        ...resource,
        lessonTitle: lesson.title,
        moduleTitle: module_.title,
        lessonId: lesson.lessonId,
      })) || []
    ) || []
  ) || [];

  const instructorName = typeof course?.instructor === "string" ? course?.instructor : "Instructor";
  const isLoading = courseLoading || progressLoading;
  const hasCompletedCourse = false;

  return {
    course,
    courseId,
    batchId,
    isLoading,
    curriculum,
    currentModule,
    currentModuleIndex,
    currentLesson,
    currentLessonIndex,
    progress,
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
    isLessonCompleted,
    isLessonUnlocked,
    handleCompleteLesson,
    handleNextLesson,
    handlePrevLesson,
    toggleModule,
    selectLesson,
    refetchProgress,
    setShowCookingMessage,
    setShowCongratulations,
  };
}
