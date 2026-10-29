"use client"

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import {
  courseCurriculum,
  findCourseIndexById,
  getCourseStats,
} from "@/data/courseCurriculum"
import { CourseSelector } from "./CourseSelector"
import type { CourseConfig } from "./curriculumData"
import { CoursePanel } from "./CoursePanel"

const courses = courseCurriculum.courses
const ID_PREFIX = "curriculum"

/** true from the lg breakpoint (1024px) up. Server and first paint assume false. */
function useIsDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(min-width: 1024px)")
      query.addEventListener("change", onChange)
      return () => query.removeEventListener("change", onChange)
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false
  )
}

interface CourseCurriculumContentProps {
  courseConfigs: readonly CourseConfig[]
}

export function CourseCurriculumContent({ courseConfigs }: CourseCurriculumContentProps) {
  const [active, setActive] = useState(0)
  const isDesktop = useIsDesktop()

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("course")
    if (!id) return

    let cancelled = false
    queueMicrotask(() => {
      if (!cancelled) setActive(findCourseIndexById(id))
    })

    return () => {
      cancelled = true
    }
  }, [])

  if (process.env.NODE_ENV !== "production" && courseConfigs.length !== courses.length) {
    console.warn(
      `CourseCurriculumContent: ${courseConfigs.length} course configs for ${courses.length} courses. They are matched by position.`
    )
  }


  const handleSelect = useCallback((index: number) => {
    setActive(index)
    const url = new URL(window.location.href)
    url.searchParams.set("course", courses[index].id)
    window.history.replaceState(null, "", url)
  }, [])

  const activeCourse = courses[active]
  const stats = getCourseStats(activeCourse)
  const summary = `${activeCourse.title}: ${stats.sectionCounts
    .map((count, i) => `${count} ${activeCourse.sections[i].label}`)
    .join(", ")}, ${stats.totalHours} hours in total`

  return (
    <div className="flex flex-col gap-6">
      <CourseSelector
        courses={courses}
        configs={courseConfigs}
        active={active}
        onSelect={handleSelect}
        idPrefix={ID_PREFIX}
      />

      {/* Announces the new course to screen readers when the tab changes */}
      <p className="sr-only" aria-live="polite">
        {summary}
      </p>

      {/* Keep inactive panels mounted without letting them determine the
          container height. The active panel remains in normal flow. */}
      <div className="relative">
        {courses.map((course, i) => {
          const config = courseConfigs[i]
          if (!config) return null
          return (
            <CoursePanel
              key={course.id}
              course={course}
              config={config}
              isActive={i === active}
              isDesktop={isDesktop}
              panelId={`${ID_PREFIX}-panel-${i}`}
              tabId={`${ID_PREFIX}-tab-${i}`}
            />
          )
        })}
      </div>
    </div>
  )
}