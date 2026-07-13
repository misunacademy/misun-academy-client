"use client"

import { useGetCourseBySlugQuery } from "@/redux/api/courseApi"
import { useGetCurrentEnrollmentBatchQuery, type BatchResponse } from "@/redux/api/batchApi"
import { BannerBackground, BannerContent } from "./banner"

interface BannerSectionProps {
  courseSlug?: string
}

export default function BannerSection({ courseSlug }: BannerSectionProps = {}) {
  const { data: courseBySlug, isLoading: courseBySlugLoading } = useGetCourseBySlugQuery(
    courseSlug!, { skip: !courseSlug }
  )

  const slugCourseId = (courseBySlug?.data as { _id?: string })?._id

  const { data: currentBatchRes, isLoading: slugBatchLoading } = useGetCurrentEnrollmentBatchQuery(
    { courseId: slugCourseId! },
    { skip: !slugCourseId }
  )

  const resolvedBatch: Partial<BatchResponse> | undefined = courseSlug
    ? (currentBatchRes?.data ?? undefined)
    : undefined

  const isLoading = courseSlug ? (courseBySlugLoading || (!!slugCourseId && slugBatchLoading)) : false

  if (isLoading) return null

  const batchNumber = Number(resolvedBatch?.title?.split(" ")[1] || 0)

  const formatDate = (dateStr: Date | string | undefined | null) =>
    dateStr
      ? new Date(dateStr).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" })
      : "N/A"

  const enrollmentPeriod = {
    startDate: formatDate(resolvedBatch?.enrollmentStartDate),
    endDate: formatDate(resolvedBatch?.enrollmentEndDate),
    classStart: formatDate(resolvedBatch?.startDate),
  }

  const price = resolvedBatch?.price

  return (
    <section className="relative bg-surface overflow-hidden font-bangla">
      <BannerBackground />

      <BannerContent
        batchNumber={batchNumber}
        price={price ?? 0}
        enrollmentPeriod={enrollmentPeriod}
        courseSlug={courseSlug}
      />
    </section>
  )
}
