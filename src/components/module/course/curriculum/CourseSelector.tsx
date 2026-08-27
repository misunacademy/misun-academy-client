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
    <div className="relative w-full lg:w-[260px] shrink-0">
      <div
        aria-hidden="true"
        className="hidden lg:block absolute left-[19px] top-8 bottom-8 w-px overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
        }}
      >
        <div
          className="absolute inset-x-0 h-10"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(255,255,255,0.55), transparent)",
            animation: "rail-flow 3s linear infinite",
          }}
        />
      </div>
      <div className="flex flex-col min-[480px]:flex-row lg:flex-col gap-3">
        {courses.map((c, i) => {
          const cf = configs[i]
          const isActive = active === i
          return (
            <div key={i} className="relative min-w-0 flex-1 lg:flex-none flex items-center">
              <div
                aria-hidden="true"
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center"
              >
                {isActive && (
                  <span
                    className="absolute w-5 h-5 rotate-45 rounded-[3px] border animate-ping"
                    style={{ borderColor: `${cf.color}55` }}
                  />
                )}
                <span
                  className="block w-2.5 h-2.5 rotate-45 rounded-[2px] transition-all duration-300"
                  style={{
                    background: isActive ? cf.color : "#0a0f0d",
                    border: `1.5px solid ${isActive ? cf.color : "rgba(255,255,255,0.25)"}`,
                    boxShadow: isActive ? `0 0 12px ${cf.glowStrong}` : "none",
                  }}
                />
              </div>
              <button
                onClick={() => onSelect(i)}
                aria-pressed={isActive}
                className="group relative overflow-hidden text-left rounded-2xl p-3.5 w-full lg:ml-10 transition-all duration-300 cursor-pointer"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${cf.bg} 0%, ${cf.bgMid} 100%) padding-box, linear-gradient(135deg, ${cf.color}80, transparent 45%, ${cf.color}cc) border-box`
                    : "rgba(255,255,255,0.03)",
                  border: `1.5px solid ${isActive ? "transparent" : "rgba(255,255,255,0.07)"}`,
                  backdropFilter: isActive ? undefined : "blur(6px)",
                  boxShadow: isActive
                    ? `0 0 28px ${cf.glow}, inset 0 1px 0 ${cf.glowStrong}`
                    : "none",
                }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] group-hover:translate-x-[380%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                />
              
                {isActive && (
                  <div
                    className="absolute inset-x-0 top-0 h-px"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${cf.color}, transparent)`,
                    }}
                  />
                )}
                <span
                  className="absolute right-3 top-2 text-[11px] font-bold italic select-none font-monaExpanded"
                  style={{
                    color: isActive ? cf.color : "rgba(255,255,255,0.18)",
                  }}
                >
                  {cf.num}
                </span>
                <div className="flex items-center gap-2.5">
                  <div
                    className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: `linear-gradient(145deg, ${cf.bg}, ${cf.bgMid})`,
                      border: `1.5px solid ${cf.border}`,
                      boxShadow: isActive ? `0 0 14px ${cf.glow}` : "none",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Georgia,'Times New Roman',serif",
                        fontSize: cf.abbr === "✦" ? 16 : 13,
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
                      className="text-[13px] font-bold truncate pr-4"
                      style={{ color: isActive ? "#fff" : "rgba(255,255,255,0.55)" }}
                    >
                      {c.title}
                    </p>
                    <p
                      className="text-[10px] mt-0.5 flex items-center gap-1.5"
                      style={{ color: isActive ? cf.color : "rgba(255,255,255,0.30)" }}
                    >
                      {c.modules.length + (c.projects?.length ?? 0)} items
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
