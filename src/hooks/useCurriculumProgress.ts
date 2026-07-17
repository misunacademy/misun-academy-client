import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import { useGetCourseProgressQuery, useCompleteLessonMutation } from "@/redux/api/courseEnrollmentApi";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";

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

export type Lesson = {
  lessonId: string;
  title: string;
  media?: { url?: string };
  duration?: number;
  resources?: Array<{ type?: string; title?: string; url?: string; textContent?: string }>;
};

export type ModuleType = {
  moduleId: string;
  title: string;
  lessons: Lesson[];
};

export function useCurriculumProgress() {
  const params = useParams<{ courseId: string }>();
  const searchParams = useSearchParams();
  const courseId = params.courseId;

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

  const { data: batchData } = useGetBatchByIdQuery(batchId || "", { skip: !batchId });
  const isBatchCompleted = batchData?.data?.status === "completed";

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

  const handleCompleteLesson = async (moduleId: string, lessonId: string) => {
    try {
      await completeLesson({ courseId, moduleId, lessonId }).unwrap();
      toast.success("Lesson marked as complete!");
      refetchProgress();
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to complete lesson.");
    }
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
      }))
    )
  ) || [];

  const instructorName = typeof course?.instructor === "string" ? course?.instructor : "Instructor";
  const isLoading = courseLoading || progressLoading;

  return {
    course,
    courseId,
    batchId,
    isLoading,
    curriculum,
    progress,
    isBatchCompleted,
    isLessonCompleted,
    isLessonUnlocked,
    handleCompleteLesson,
    refetchProgress,
    totalLessons,
    completedLessonsCount,
    totalModules,
    calculatedPercentage,
    allResources,
    instructorName,
  };
}
