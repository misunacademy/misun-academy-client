"use client";

import { useMemo } from "react";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import type { EnrollmentResponse } from "@/redux/api/enrollmentApi";

export function useQuizEnrollment(
  courseId: string,
  batchId?: string | undefined,
  enrollmentId?: string
): string {
  const { data: enrollments } = useGetEnrollmentsQuery(undefined);

  const resolvedEnrollment = useMemo<EnrollmentResponse | undefined>(() => {
    if (!enrollments?.data) return undefined;
    const list = enrollments.data;
    const matches = (e: EnrollmentResponse) => {
      const courseRef = e.batchId?.courseId;
      const cId =
        typeof courseRef === "object" && courseRef !== null
          ? courseRef._id
          : courseRef;
      const slug =
        typeof courseRef === "object" && courseRef !== null
          ? courseRef.slug
          : undefined;
      return (cId === courseId || slug === courseId) && e.status === "active";
    };
    return list.find(matches) || undefined;
  }, [enrollments, courseId]);

  const enrollmentIdFromBatch = resolvedEnrollment?._id || enrollmentId || "";

  return enrollmentIdFromBatch;
}