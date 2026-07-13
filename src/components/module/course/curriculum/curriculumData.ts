import type { LucideIcon } from "lucide-react"

export interface CourseModule {
  id: number
  title: string
  type: string
  duration: string
}

export interface CourseProject {
  title: string
  duration: string
}

export interface Course {
  title: string
  description: string
  totalModules?: number
  level?: string
  modules: CourseModule[]
  projects?: CourseProject[]
}

export interface CourseConfig {
  abbr: string
  color: string
  glow: string
  glowStrong: string
  bg: string
  bgMid: string
  border: string
  borderHover: string
  tagBg: string
  num: string
}

export const COURSE_CONFIG: readonly CourseConfig[] = [
  {
    abbr: "Ps",
    color: "#31a8ff",
    glow: "rgba(49,168,255,0.22)",
    glowStrong: "rgba(49,168,255,0.45)",
    bg: "#001d26",
    bgMid: "#002a3a",
    border: "rgba(49,168,255,0.30)",
    borderHover: "rgba(49,168,255,0.65)",
    tagBg: "rgba(49,168,255,0.12)",
    num: "01",
  },
  {
    abbr: "Ai",
    color: "#ff9a00",
    glow: "rgba(255,154,0,0.20)",
    glowStrong: "rgba(255,154,0,0.45)",
    bg: "#1a0e00",
    bgMid: "#2a1600",
    border: "rgba(255,154,0,0.28)",
    borderHover: "rgba(255,154,0,0.60)",
    tagBg: "rgba(255,154,0,0.10)",
    num: "02",
  },
  {
    abbr: "✦",
    color: "#20b486",
    glow: "rgba(32,180,134,0.20)",
    glowStrong: "rgba(32,180,134,0.45)",
    bg: "#041510",
    bgMid: "#082318",
    border: "rgba(32,180,134,0.28)",
    borderHover: "rgba(32,180,134,0.60)",
    tagBg: "rgba(32,180,134,0.10)",
    num: "03",
  },
] as const

export const TYPE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  theory: { label: "Theory", color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  practical: { label: "Practical", color: "#34d399", bg: "rgba(52,211,153,0.10)" },
  strategy: { label: "Strategy", color: "#fbbf24", bg: "rgba(251,191,36,0.10)" },
}

export interface StatItem {
  icon: LucideIcon
  label: string
  value: string
}
