import { useGetCourseBySlugQuery } from '@/redux/api/courseApi';
import { useGetCurrentEnrollmentBatchQuery, useGetUpcomingBatchesQuery } from '@/redux/api/batchApi';
import type { BatchResponse } from '@/redux/api/batchApi';
import { COURSE_SLUGS } from '@/constants/courses';

interface UseCurrentBatchResult {
  courseId: string | undefined;
  course: Record<string, unknown> | undefined;
  batch: BatchResponse | null;
  serverTimestamp?: number;
  upcomingBatches: BatchResponse[];
  isLoading: boolean;
  isError: boolean;
}

export function useCurrentBatch(courseSlug?: string): UseCurrentBatchResult {
  const slug = courseSlug ?? COURSE_SLUGS.GRAPHIC_DESIGN;

  const { data: courseData, isLoading: courseLoading, isError: courseError } = useGetCourseBySlugQuery(slug);
  const course = courseData?.data as Record<string, unknown> | undefined;
  const courseId = course?._id as string | undefined;

  const { data: currentRes, isLoading: currentLoading, isError: currentError } = useGetCurrentEnrollmentBatchQuery(
    { courseId },
    { skip: !courseId },
  );

  const { data: upcomingRes, isLoading: upcomingLoading } = useGetUpcomingBatchesQuery(
    { courseId },
    { skip: !courseId || !!currentRes?.data },
  );

  const batch = (currentRes?.data ?? (upcomingRes?.data as BatchResponse[])?.[0] ?? null) as BatchResponse | null;

  return {
    courseId,
    course,
    batch,
    serverTimestamp: currentRes?.serverTimestamp,
    upcomingBatches: (upcomingRes?.data ?? []) as BatchResponse[],
    isLoading: courseLoading || (!!courseId && (currentLoading || upcomingLoading)),
    isError: courseError || currentError,
  };
}
