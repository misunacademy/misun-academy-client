"use client"

import type { CourseConfig } from "./curriculumData"

interface IsometricStackProps {
  configs: readonly CourseConfig[]
  active: number
}

const SLAB_POSITIONS = [
  { cx: 150, cy: 212 },
  { cx: 150, cy: 138 },
  { cx: 150, cy: 64 },
]

const DEPTH = 16
const HALF_W = 106
const HALF_H = 53
const INACTIVE_FILL = { top: "#1d2823", left: "#141d18", right: "#0f1713" }

function shade(hex: string, f: number) {
  const n = hex.replace("#", "")
  const [r, g, b] = [0, 2, 4].map((i) =>
    Math.min(255, Math.round(parseInt(n.slice(i, i + 2), 16) * f))
  )
  return `rgb(${r},${g},${b})`
}

export function IsometricStack({ configs, active }: IsometricStackProps) {
  const drawOrder = configs
    .map((_, i) => i)
    .filter((i) => i !== active)
    .concat(active)

  return (
    <svg
      viewBox="0 0 300 288"
      aria-hidden="true"
      className="w-full h-auto select-none pointer-events-none"
    >
      <defs>
        {configs.map((cfg, i) => (
          <linearGradient key={`g${i}`} id={`iso-top-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={shade(cfg.color, 1.35)} />
            <stop offset="100%" stopColor={shade(cfg.color, 0.72)} />
          </linearGradient>
        ))}
        {configs.map((cfg, i) => (
          <filter key={`f${i}`} id={`iso-glow-${i}`} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor={cfg.color} floodOpacity="0.55" />
          </filter>
        ))}
        <radialGradient id="iso-ground" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      <ellipse cx="150" cy="264" rx="118" ry="16" fill="url(#iso-ground)" />

      {drawOrder.map((i) => {
        const cfg = configs[i]
        const pos = SLAB_POSITIONS[i] ?? SLAB_POSITIONS[0]
        const isActive = i === active
        return (
          <g
            key={cfg.stackLabel}
            style={{
              transform: isActive ? "translateY(-12px)" : "translateY(0px)",
              opacity: isActive ? 1 : 0.5,
              transition: "transform 0.4s ease, opacity 0.4s ease",
            }}
          >
            <g
              transform={`translate(${pos.cx},${pos.cy})`}
              filter={isActive ? `url(#iso-glow-${i})` : undefined}
            >
              <g style={isActive ? { animation: "iso-float 4.5s ease-in-out infinite alternate" } : undefined}>
              <path
                d={`M-${HALF_W} 0 L0 ${HALF_H} L0 ${HALF_H + DEPTH} L-${HALF_W} ${DEPTH} Z`}
                fill={isActive ? shade(cfg.color, 0.5) : INACTIVE_FILL.left}
              />
              <path
                d={`M0 ${HALF_H} L${HALF_W} 0 L${HALF_W} ${DEPTH} L0 ${HALF_H + DEPTH} Z`}
                fill={isActive ? shade(cfg.color, 0.34) : INACTIVE_FILL.right}
              />
              <g transform="scale(1,0.5) rotate(45)">
                <rect
                  x="-75"
                  y="-75"
                  width="150"
                  height="150"
                  rx="22"
                  fill={isActive ? `url(#iso-top-${i})` : INACTIVE_FILL.top}
                />
                {isActive && (
                  <rect
                    x="-58"
                    y="-58"
                    width="116"
                    height="116"
                    rx="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="2"
                  />
                )}
                <text
                  x={-62}
                  y={60}
                  fontSize={16}
                  fontWeight={700}
                  letterSpacing={1.5}
                  fill={isActive ? "#ffffff" : "rgba(255,255,255,0.35)"}
                  style={{ fontFamily: "Mona Sans, sans-serif" }}
                >
                  {cfg.stackLabel.toUpperCase()}
                </text>
                {isActive && (
                  <text
                    x={0}
                    y={14}
                    textAnchor="middle"
                    fontSize={40}
                    fontWeight={700}
                    fontStyle="italic"
                    fill="rgba(255,255,255,0.92)"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {cfg.abbr}
                  </text>
                )}
              </g>
              </g>
            </g>
          </g>
        )
      })}
    </svg>
  )
}
