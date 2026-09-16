"use client"

import { Layers, Trophy, Clock, Zap } from "lucide-react"
import type { Course, CourseConfig, CourseModule, CourseProject } from "./curriculumData"
import { TYPE_STYLES } from "./curriculumData"
import { IsometricStack } from "./IsometricStack"
import { StaggerContainer } from "@/components/ui/StaggerContainer"

interface ContentPanelProps {
  course: Course
  config: CourseConfig
  modules: CourseModule[]
  projects: CourseProject[]
  configs: readonly CourseConfig[]
  activeCourse: number
}

export function ContentPanel({
  course,
  config,
  modules,
  projects,
  configs,
  activeCourse,
}: ContentPanelProps) {
  return (
    <div
      className="flex-1 min-w-0 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#07100c] via-surface"
      style={
        {
          "--tw-gradient-to": `${config.bg}55`,
          "--cb": config.borderHover,
          "--cg": config.glow,
          border: `1.5px solid ${config.border}`,
          boxShadow: `0 0 40px ${config.glow}, inset 0 1px 0 ${config.glowStrong}`,
        } as React.CSSProperties
      }
    >
      <div
        className="absolute -right-4 -top-4 select-none pointer-events-none"
        style={{
          fontSize: 200,
          fontWeight: 900,
          lineHeight: 1,
          color: config.color,
          opacity: 0.035,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
        }}
      >
        {config.num}
      </div>

      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${config.color}88, transparent)` }}
      />

      {[
        "left-2.5 top-2.5 border-l border-t",
        "right-2.5 top-2.5 border-r border-t",
        "left-2.5 bottom-2.5 border-l border-b",
        "right-2.5 bottom-2.5 border-r border-b",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={`absolute w-3.5 h-3.5 ${pos} pointer-events-none z-10`}
          style={{ borderColor: `${config.color}59` }}
        />
      ))}

      <div className="relative z-10 p-6 sm:p-8">
        <PanelHeader
          course={course}
          config={config}
          modules={modules}
          projects={projects}
          configs={configs}
          activeCourse={activeCourse}
        />

        {modules.length > 0 && <ModulesSection modules={modules} config={config} />}

        {projects.length > 0 && <ProjectsSection projects={projects} config={config} />}
      </div>
    </div>
  )
}

function SectionLabel({
  icon: Icon,
  label,
  config,
}: {
  icon: typeof Layers
  label: string
  config: CourseConfig
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon size={12} style={{ color: config.color }} />
      <span
        className="text-[10px] tracking-[0.2em] uppercase font-semibold font-monaExpanded"
        style={{ color: config.color }}
      >
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${config.color}33, transparent)` }}
      />
      <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
        <rect
          x="2.6"
          y="2.6"
          width="4.8"
          height="4.8"
          rx="1"
          transform="rotate(45 5 5)"
          fill="none"
          stroke={config.color}
          strokeWidth="1.2"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}

function PanelHeader({
  course,
  config,
  modules,
  projects,
  configs,
  activeCourse,
}: ContentPanelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:gap-6 sm:items-center mb-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-5 h-5 rounded flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg,${config.bg},${config.bgMid})`,
              border: `1px solid ${config.border}`,
            }}
          >
            <span
              style={{
                fontFamily: "Georgia,serif",
                fontSize: 9,
                fontStyle: "italic",
                fontWeight: 700,
                color: config.color,
              }}
            >
              {config.abbr}
            </span>
          </div>
          <span
            className="text-[10px] tracking-[0.2em] uppercase font-semibold font-monaExpanded"
            style={{ color: config.color }}
          >
            {course.level ?? "Curriculum"}
          </span>
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ background: config.color }}
            />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: config.color }} />
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
          {course.title}
        </h3>
        <p className="text-sm text-white/45 mt-0.5">{course.description}</p>
        <div className="flex gap-2 mt-4">
          {[
            { label: `${modules.length}`, sub: "Modules", icon: Layers },
            { label: `${projects.length}`, sub: "Projects", icon: Zap },
          ].map(({ label, sub, icon: Icon }) => (
            <div
              key={sub}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border"
              style={{ background: `${config.bg}`, borderColor: config.border }}
            >
              <Icon size={14} style={{ color: config.color }} />
              <span className="text-base font-black leading-none" style={{ color: config.color }}>
                {label}
              </span>
              <span className="text-[9px] text-white/30 tracking-wider uppercase">{sub}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="order-first sm:order-none mx-auto sm:mx-0 w-[180px] sm:w-[210px] xl:w-[250px]">
        <IsometricStack configs={configs} active={activeCourse} />
      </div>
    </div>
  )
}

function ModulesSection({ modules, config }: { modules: CourseModule[]; config: CourseConfig }) {
  return (
    <div className="mb-8">
      <SectionLabel icon={Layers} label="Tool-Based Modules" config={config} />

      <StaggerContainer
        className="grid sm:grid-cols-2 gap-2.5"
        staggerChildren={0.05}
        viewportAmount={0.1}
      >
        {modules.map((mod, mi) => {
          const typeStyle = TYPE_STYLES[mod.type] ?? TYPE_STYLES.practical
          return (
            <div
              key={mod.id}
              className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-black/30 backdrop-blur-sm p-3.5 transition-all duration-200 hover:[border-color:var(--cb)] hover:[box-shadow:0_4px_20px_var(--cg)] hover:-translate-y-0.5"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[160%] group-hover:translate-x-[380%] transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/[0.07] to-transparent skew-x-12"
              />
              <span
                aria-hidden="true"
                className="absolute -right-1 -top-4 select-none pointer-events-none text-[64px] leading-none font-black italic"
                style={{
                  fontFamily: "Georgia, serif",
                  color: "transparent",
                  WebkitTextStroke: `1px ${config.color}30`,
                }}
              >
                {String(mi + 1).padStart(2, "0")}
              </span>
              <span
                className="absolute left-0 top-3 bottom-3 w-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: config.color, boxShadow: `0 0 8px ${config.glowStrong}` }}
              />
              <div className="relative z-10 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase"
                    style={{ color: typeStyle.color, background: typeStyle.bg }}
                  >
                    {typeStyle.label}
                  </span>
                  <span className="text-[10px] text-white/30 flex items-center gap-1">
                    <Clock size={9} /> {mod.duration}
                  </span>
                </div>
                <p className="text-[13px] text-white/80 leading-snug pr-10">{mod.title}</p>
              </div>
            </div>
          )
        })}
      </StaggerContainer>
    </div>
  )
}

function ProjectsSection({ projects, config }: { projects: CourseProject[]; config: CourseConfig }) {
  return (
    <div>
      <SectionLabel icon={Trophy} label="Project-Based Classes" config={config} />

      <div className="grid sm:grid-cols-2 gap-2.5">
        {projects.map((proj, pi) => (
          <div
            key={pi}
            className="group relative overflow-hidden rounded-xl border p-3.5 transition-all duration-200 hover:[border-color:var(--cb)] hover:[box-shadow:0_4px_20px_var(--cg)] hover:-translate-y-0.5"
            style={{
              background: `linear-gradient(135deg,${config.bg}88, rgba(0,0,0,0.3))`,
              borderColor: config.border,
            }}
          >
            <span
              aria-hidden="true"
              className="absolute left-2 top-2 w-3 h-3 border-l border-t opacity-40 group-hover:opacity-100 transition-opacity duration-300"
              style={{ borderColor: config.color }}
            />
            <span
              aria-hidden="true"
              className="absolute right-2 bottom-2 w-3 h-3 border-r border-b opacity-40 group-hover:opacity-100 transition-opacity duration-300"
              style={{ borderColor: config.color }}
            />
            <div className="flex items-start justify-between gap-3">
              <p className="text-[12px] text-white/75 leading-snug flex-1">{proj.title}</p>
              <span
                aria-hidden="true"
                className="shrink-0 text-[11px] font-black italic leading-none mt-0.5"
                style={{ fontFamily: "Georgia, serif", color: `${config.color}99` }}
              >
                P{String(pi + 1).padStart(2, "0")}
              </span>
            </div>
            <span
              className="text-[9px] mt-1.5 flex items-center gap-1"
              style={{ color: config.color }}
            >
              <Clock size={8} /> {proj.duration}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
