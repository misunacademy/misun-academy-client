"use client"

import type { Course, CourseConfig } from "./curriculumData"

interface CourseSelectorProps {
  courses: Course[]
  active: number
  onSelect: (index: number) => void
  configs: readonly CourseConfig[]
}

export function CourseSelector({ courses, active, onSelect, configs }: CourseSelectorProps) {
  return (
    <div className="w-full lg:w-[260px] shrink-0 flex flex-row lg:flex-col gap-3">
      {courses.map((c, i) => {
        const cf = configs[i]
        const isActive = active === i
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className="relative overflow-hidden text-left rounded-2xl p-4 w-full transition-all duration-300 cursor-pointer"
            style={{
              background: isActive
                ? `linear-gradient(135deg, ${cf.bg} 0%, ${cf.bgMid} 100%)`
                : "#0a0f0d",
              border: `1.5px solid ${isActive ? cf.borderHover : "rgba(255,255,255,0.07)"}`,
              boxShadow: isActive ? `0 0 28px ${cf.glow}, inset 0 1px 0 ${cf.glowStrong}` : "none",
            }}
          >
            {isActive && (
              <div
                className="absolute inset-x-0 top-0 h-px"
                style={{ background: `linear-gradient(90deg, transparent, ${cf.color}, transparent)` }}
              />
            )}
            <div className="flex items-center gap-3">
              <div
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(145deg, ${cf.bg}, ${cf.bgMid})`,
                  border: `1.5px solid ${cf.border}`,
                  boxShadow: isActive ? `0 0 14px ${cf.glow}` : "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "Georgia,'Times New Roman',serif",
                    fontSize: cf.abbr === "✦" ? 18 : 15,
                    fontStyle: "italic",
                    fontWeight: 700,
                    color: cf.color,
                    textShadow: isActive ? `0 0 12px ${cf.color}` : "none",
                  }}
                >
                  {cf.abbr}
                </span>
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-bold truncate"
                  style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                >
                  {c.title}
                </p>
                <p
                  className="text-[10px] mt-0.5 truncate"
                  style={{ color: isActive ? cf.color : "rgba(255,255,255,0.30)" }}
                >
                  {c.modules.length + (c.projects?.length ?? 0)} items
                </p>
              </div>
            </div>
            {isActive && (
              <div
                className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full"
                style={{ background: `linear-gradient(180deg, transparent, ${cf.color}, transparent)` }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
