"use client"

import { useRef, type KeyboardEvent } from "react"
import { getCourseStats, type Course } from "@/data/courseCurriculum"
import type { CourseConfig } from "./curriculumData"

interface CourseSelectorProps {
  courses: Course[]
  configs: readonly CourseConfig[]
  active: number
  onSelect: (index: number) => void
  /** Prefix for tab/panel ids. The panels must use `${idPrefix}-panel-${i}`. */
  idPrefix: string
}

export function CourseSelector({
  courses,
  configs,
  active,
  onSelect,
  idPrefix,
}: CourseSelectorProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const count = courses.length

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next = active
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        next = (active + 1) % count
        break
      case "ArrowLeft":
      case "ArrowUp":
        next = (active - 1 + count) % count
        break
      case "Home":
        next = 0
        break
      case "End":
        next = count - 1
        break
      default:
        return
    }
    event.preventDefault()
    onSelect(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label="কোর্স বেছে নিন"
      onKeyDown={handleKeyDown}
      className="grid gap-3 sm:grid-cols-3"
    >
      {courses.map((course, i) => {
        const config = configs[i]
        if (!config) return null
        const isActive = active === i
        const { totalItems, totalHours } = getCourseStats(course)

        return (
          <button
            key={course.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            id={`${idPrefix}-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`${idPrefix}-panel-${i}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onSelect(i)}
            className="group flex min-h-[64px] cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-[border-color,background-color,box-shadow] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 motion-reduce:transition-none"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${config.bg}, ${config.bgMid})`
                : "rgba(255,255,255,0.03)",
              borderColor: isActive ? config.color : "rgba(255,255,255,0.1)",
              boxShadow: isActive ? `0 0 24px ${config.glow}` : "none",
            }}
          >
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
              style={{
                background: `linear-gradient(145deg, ${config.bg}, ${config.bgMid})`,
                borderColor: config.border,
                color: config.color,
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: config.abbr === "✦" ? 18 : 15,
                fontStyle: "italic",
                fontWeight: 700,
              }}
            >
              {config.abbr}
            </span>
            <span className="min-w-0">
              <span
                className="block text-sm font-bold leading-snug"
                style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.85)" }}
              >
                {course.title}
              </span>
              <span
                className="mt-0.5 block text-xs"
                style={{ color: isActive ? config.color : "rgba(255,255,255,0.7)" }}
              >
                {totalItems} classes · {totalHours}h
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}