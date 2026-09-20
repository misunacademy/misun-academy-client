import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import { useGetCourseProgressQuery, useCompleteLessonMutation } from "@/redux/api/courseEnrollmentApi";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import {
  isLessonCompleted as checkLessonCompleted,
  isLessonUnlocked as checkLessonUnlocked,
  isQuizCompleted as checkQuizCompleted,
  isQuizUnlocked as checkQuizUnlocked,
} from "@/lib/curriculum-locks";

interface CourseProgress {
  percentage: number;
  completedLessons: Array<{
    moduleId: string;
    lessonId: string;
    completedAt: string;
  }>;
  completedQuizzes?: Array<{
    moduleId: string;
    quizId: string;
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
  media?: { url?: string; type?: string; videoId?: string };
  duration?: number;
  resources?: Array<{ type?: string; title?: string; url?: string; textContent?: string }>;
};

export type QuizItem = {
  quizId: string;
  title: string;
  timeLimit?: number;
  totalQuestions: number;
  totalMarks: number;
  passingPercentage: number;
  orderIndex: number;
};

export type ModuleType = {
  moduleId: string;
  title: string;
  lessons: Lesson[];
  quizzes?: QuizItem[];
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
        (e: { batchId?: { _id?: string; courseId?: { _id?: string; slug?: string } | string } }) => {
          const ref = e.batchId?.courseId;
          const cId = typeof ref === "object" && ref !== null ? ref._id : ref;
          const slug = typeof ref === "object" && ref !== null ? ref.slug : undefined;
          return cId === courseId || slug === courseId;
        }
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
    checkLessonCompleted(progress?.completedLessons, moduleId, lessonId);

  const isQuizCompleted = (moduleId: string, quizId: string) =>
    checkQuizCompleted(progress?.completedQuizzes, moduleId, quizId);

  const isLessonUnlocked = (moduleIdx: number, lessonIdx: number) =>
    checkLessonUnlocked(curriculum, progress?.completedLessons, progress?.completedQuizzes, moduleIdx, lessonIdx);

  const isQuizUnlocked = (moduleIdx: number, quizIdx: number) =>
    checkQuizUnlocked(curriculum, progress?.completedLessons, progress?.completedQuizzes, moduleIdx, quizIdx);

  const handleCompleteLesson = async (moduleId: string, lessonId: string): Promise<boolean> => {
    try {
      await completeLesson({ courseId, moduleId, lessonId }).unwrap();
      toast.success("Lesson marked as complete!");
      refetchProgress();
      return true;
    } catch (error: unknown) {
      toast.error((error as { data?: { message?: string } })?.data?.message || "Failed to complete lesson.");
      // Refresh so lock state in the UI matches the server instead of
      // leaving the user stranded on content the server considers locked.
      refetchProgress();
      return false;
    }
  };

  const totalLessons = curriculum?.reduce((t, m) => t + (m.lessons?.length || 0), 0) || 0;
  const totalQuizzes = curriculum?.reduce((t, m) => t + (m.quizzes?.length || 0), 0) || 0;
  const completedLessonsCount = progress?.completedLessons?.length || 0;
  const completedQuizzesCount = progress?.completedQuizzes?.length || 0;
  const totalModules = curriculum?.length || 0;
  const totalItems = totalLessons + totalQuizzes;
  const completedItems = completedLessonsCount + completedQuizzesCount;
  const calculatedPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

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
    isQuizCompleted,
    isQuizUnlocked,
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
