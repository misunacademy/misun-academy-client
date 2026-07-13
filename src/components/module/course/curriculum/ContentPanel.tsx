"use client"

import { Layers, Trophy, Clock, Zap } from "lucide-react"
import type { Course, CourseConfig, CourseModule, CourseProject } from "./curriculumData"
import { TYPE_STYLES } from "./curriculumData"

interface ContentPanelProps {
  course: Course
  config: CourseConfig
  modules: CourseModule[]
  projects: CourseProject[]
}

export function ContentPanel({ course, config, modules, projects }: ContentPanelProps) {
  return (
    <div
      className="flex-1 min-w-0 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#07100c] via-surface"
      style={
        {
          "--tw-gradient-to": `${config.bg}55`,
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

      <div className="relative z-10 p-6 sm:p-8">
        <PanelHeader course={course} config={config} modules={modules} projects={projects} />

        {modules.length > 0 && (
          <ModulesSection modules={modules} config={config} />
        )}

        {projects.length > 0 && (
          <ProjectsSection projects={projects} config={config} />
        )}
      </div>
    </div>
  )
}

function PanelHeader({ course, config, modules, projects }: ContentPanelProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
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
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{ color: config.color }}
          >
            {course.level ?? "Curriculum"}
          </span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white">{course.title}</h3>
        <p className="text-sm text-white/45 mt-0.5">{course.description}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {[
          { label: `${modules.length}`, sub: "Modules", icon: Layers },
          { label: `${projects.length}`, sub: "Projects", icon: Zap },
        ].map(({ label, sub, icon: Icon }) => (
          <div
            key={sub}
            className="flex flex-col items-center px-4 py-2.5 rounded-xl border"
            style={{ background: `${config.bg}`, borderColor: config.border }}
          >
            <Icon size={12} style={{ color: config.color }} className="mb-0.5" />
            <span className="text-lg font-black" style={{ color: config.color }}>
              {label}
            </span>
            <span className="text-[9px] text-white/30 tracking-wider uppercase">{sub}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ModulesSection({ modules, config }: { modules: CourseModule[]; config: CourseConfig }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-5">
        <Layers size={12} style={{ color: config.color }} />
        <span
          className="text-[10px] tracking-widest uppercase font-semibold"
          style={{ color: config.color }}
        >
          Tool-Based Modules
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: `linear-gradient(90deg, ${config.color}33, transparent)` }}
        />
      </div>

      <div className="relative pl-8">
        <div
          className="absolute left-[11px] top-0 bottom-0 w-px"
          style={{ background: `linear-gradient(180deg, ${config.color}55 0%, ${config.color}15 100%)` }}
        />

        <div className="flex flex-col gap-2">
          {modules.map((mod, mi) => {
            const typeStyle = TYPE_STYLES[mod.type] ?? TYPE_STYLES.practical
            return (
              <div key={mod.id} className="relative flex items-start gap-4 group">
                <div
                  className="absolute -left-8 top-[10px] w-[22px] h-[22px] rounded-full flex items-center justify-center shrink-0 z-10 transition-transform duration-200 group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg,${config.bg},${config.bgMid})`,
                    border: `1.5px solid ${config.color}`,
                    boxShadow: `0 0 8px ${config.glow}`,
                  }}
                >
                  <span style={{ fontSize: 8, fontWeight: 700, color: config.color }}>
                    {String(mi + 1).padStart(2, "0")}
                  </span>
                </div>

                <div
                  className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2.5 px-4 rounded-xl border transition-all duration-200 group-hover:scale-[1.01]"
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    borderColor: "rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = `${config.color}44`
                    el.style.boxShadow = `0 2px 16px ${config.glow}`
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = "rgba(255,255,255,0.07)"
                    el.style.boxShadow = "none"
                  }}
                >
                  <span className="text-sm text-white/80 leading-snug flex-1 pr-2">{mod.title}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[9px] px-2 py-0.5 rounded-full font-semibold tracking-wide uppercase"
                      style={{ color: typeStyle.color, background: typeStyle.bg }}
                    >
                      {typeStyle.label}
                    </span>
                    <span className="text-[10px] text-white/30 whitespace-nowrap flex items-center gap-1">
                      <Clock size={9} /> {mod.duration}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ProjectsSection({ projects, config }: { projects: CourseProject[]; config: CourseConfig }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <Trophy size={12} style={{ color: config.color }} />
        <span
          className="text-[10px] tracking-widest uppercase font-semibold"
          style={{ color: config.color }}
        >
          Project-Based Classes
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: `linear-gradient(90deg, ${config.color}33, transparent)` }}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2">
        {projects.map((proj, pi) => (
          <div
            key={pi}
            className="relative overflow-hidden flex items-start gap-3 p-3.5 rounded-xl border group transition-all duration-200"
            style={{
              background: `linear-gradient(135deg,${config.bg}88, rgba(0,0,0,0.3))`,
              borderColor: config.border,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.borderColor = config.borderHover
              el.style.boxShadow = `0 4px 20px ${config.glow}`
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.borderColor = config.border
              el.style.boxShadow = "none"
            }}
          >
            <div
              className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ background: `linear-gradient(90deg, transparent, ${config.color}66, transparent)` }}
            />
            <div
              className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5"
              style={{ background: config.tagBg, border: `1px solid ${config.border}` }}
            >
              <Trophy size={12} style={{ color: config.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white/75 leading-snug">{proj.title}</p>
              <span className="text-[9px] mt-1 flex items-center gap-1" style={{ color: config.color }}>
                <Clock size={8} /> {proj.duration}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
