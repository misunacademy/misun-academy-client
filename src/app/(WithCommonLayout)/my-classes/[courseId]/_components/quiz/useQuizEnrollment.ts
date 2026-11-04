"use client";

import React from "react";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import type { EnrollmentResponse } from "@/redux/api/enrollmentApi";

type UseQuizEnrollmentReturn = {
  enrollment: EnrollmentResponse | undefined;
  enrollmentIdFromBatch: string;
};

export function useQuizEnrollment(
  courseId: string,
  providedEnrollmentId?: string
): UseQuizEnrollmentReturn {
  const { data: enrollments } = useGetEnrollmentsQuery(undefined);

  const enrollment = React.useMemo(() => {
    if (!enrollments?.data) return undefined;
    const list = enrollments.data;
    const matches = (e: EnrollmentResponse) => {
      const courseRef = e.batchId?.courseId;
      const cId = typeof courseRef === "object" && courseRef !== null ? courseRef._id : courseRef;
      const slug = typeof courseRef === "object" && courseRef !== null ? courseRef.slug : undefined;
      return (cId === courseId || slug === courseId) && e.status === "active";
    };
    return list.find(matches) || undefined;
  }, [enrollments, courseId]);

  const enrollmentIdFromBatch = enrollment?._id || providedEnrollmentId || "";

  return {
    enrollment,
    enrollmentIdFromBatch,
  };
}
