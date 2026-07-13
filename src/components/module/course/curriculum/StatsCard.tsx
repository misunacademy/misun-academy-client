"use client"

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
    { icon: Layers, label: "Modules", val: modules },
    { icon: Trophy, label: "Projects", val: projects },
    { icon: Clock, label: "Hours", val: `${totalHours}+` },
  ]

  return (
    <div
      className="hidden lg:block mt-2 rounded-2xl p-4 border relative"
      style={{
        background: `linear-gradient(135deg, ${config.bg}, ${config.bgMid})`,
        borderColor: config.border,
        boxShadow: `0 0 20px ${config.glow}`,
      }}
    >
      <p
        className="text-[10px] tracking-widest uppercase mb-3 font-semibold"
        style={{ color: config.color }}
      >
        Module Stats
      </p>
      {items.map(({ icon: Icon, label, val }) => (
        <div
          key={label}
          className="flex items-center justify-between py-1.5 border-b last:border-b-0"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2">
            <Icon size={11} style={{ color: config.color }} />
            <span className="text-[11px] text-white/45">{label}</span>
          </div>
          <span className="text-[12px] font-bold" style={{ color: config.color }}>
            {val}
          </span>
        </div>
      ))}
    </div>
  )
}
