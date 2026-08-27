import { Layers, Trophy, Clock } from "lucide-react"
import type { CourseConfig } from "./curriculumData"

interface StatsCardProps {
  config: CourseConfig
  modules: number
  projects: number
  totalHours: number
}

export function StatsCard({ config, modules, projects, totalHours }: StatsCardProps) {
  const items = [
    { icon: Layers, label: "Modules", val: String(modules) },
    { icon: Trophy, label: "Projects", val: String(projects) },
    { icon: Clock, label: "Hours", val: `${totalHours}+` },
  ]

  return (
    <div
      className="hidden lg:block mt-3 ml-10 rounded-2xl px-4 py-3.5 border relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${config.bg}, ${config.bgMid})`,
        borderColor: config.border,
        boxShadow: `0 0 20px ${config.glow}`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${config.color}88, transparent)` }}
      />
      <p
        className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase mb-2.5 font-semibold font-monaExpanded"
        style={{ color: config.color }}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <rect
            x="2.3"
            y="2.3"
            width="5.4"
            height="5.4"
            rx="1.2"
            transform="rotate(45 5 5)"
            fill={config.color}
            opacity="0.9"
          />
        </svg>
        Module Stats
      </p>
      {items.map(({ icon: Icon, label, val }) => (
        <div key={label} className="flex items-baseline gap-2 py-1.5">
          <Icon size={11} style={{ color: config.color }} className="self-center shrink-0" />
          <span className="text-[11px] text-white/45 shrink-0">{label}</span>
          <span aria-hidden="true" className="flex-1 border-b border-dotted border-white/15 -translate-y-[3px]" />
          <span
            className="text-[12px] font-bold font-monaExpanded"
            style={{ color: config.color, textShadow: `0 0 12px ${config.glowStrong}` }}
          >
            {val}
          </span>
        </div>
      ))}
    </div>
  )
}
