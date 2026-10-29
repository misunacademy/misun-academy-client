"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react"
import { useReducedMotion } from "framer-motion"
import { Clock, Layers } from "lucide-react"
import {
  formatHours,
  getCourseStats,
  type Course,
  type CurriculumSection,
} from "@/data/courseCurriculum"
import { TYPE_STYLES, type CourseConfig } from "./curriculumData"
import { CourseHub } from "./CourseHub"

interface CoursePanelProps {
  course: Course
  config: CourseConfig
  isActive: boolean
  /** true at the lg breakpoint and above (hub-and-spoke), false below (stacked) */
  isDesktop: boolean
  panelId: string
  tabId: string
}

/* ── Line geometry ──────────────────────────────────────────────────────────
   The lines are measured from the real DOM (so they follow the text wherever
   it wraps) and then rendered declaratively as SVG paths. */

interface LinePath {
  d: string
  alpha: number
}

interface Geometry {
  width: number
  height: number
  paths: LinePath[]
  /** index in `paths` where the per-row branches begin */
  rowStart: number
}

const round = (n: number) => Math.round(n * 10) / 10

/** Soft tint of the course colour, driven by the --c CSS variable. */
const mix = (percent: number) => `color-mix(in srgb, var(--c) ${percent}%, transparent)`

function useLineGeometry(
  isDesktop: boolean,
  refs: {
    diagramRef: RefObject<HTMLDivElement | null>
    hubRef: RefObject<SVGSVGElement | null>
    leftRef: RefObject<HTMLDivElement | null>
    listRef: RefObject<HTMLUListElement | null>
  }
) {
  const { diagramRef, hubRef, leftRef, listRef } = refs
  const [geometry, setGeometry] = useState<Geometry | null>(null)

  const measure = useCallback(() => {
    const diagram = diagramRef.current
    const hub = hubRef.current
    const left = leftRef.current
    if (!diagram || !hub || !left) return

    // Read phase: take every measurement first, write afterwards.
    const P = diagram.getBoundingClientRect()
    if (P.width === 0 || P.height === 0) return
    const H = hub.getBoundingClientRect()
    const L = left.getBoundingClientRect()
    const list = listRef.current
    const rows = list ? Array.from(list.children, (el) => el.getBoundingClientRect()) : []

    const paths: LinePath[] = []
    let rowStart = 0

    if (isDesktop) {
      const hx = H.right - P.left - 6
      const hy = H.top + H.height * 0.48 - P.top
      paths.push({
        d: `M ${round(L.right - P.left)} ${round(hy)} L ${round(H.left - P.left + 6)} ${round(hy)}`,
        alpha: 0.7,
      })
      rowStart = paths.length
      for (const r of rows) {
        const x2 = r.left - P.left
        const y2 = r.top + r.height / 2 - P.top
        const m = (x2 - hx) / 2
        paths.push({
          d: `M ${round(hx)} ${round(hy)} C ${round(hx + m)} ${round(hy)}, ${round(x2 - m)} ${round(y2)}, ${round(x2)} ${round(y2)}`,
          alpha: 0.55,
        })
      }
    } else {
      const cx = H.left + H.width / 2 - P.left
      paths.push({
        d: `M ${round(cx)} ${round(H.bottom - P.top - 6)} L ${round(cx)} ${round(L.top - P.top)}`,
        alpha: 0.7,
      })
      if (rows.length > 0) {
        const first = rows[0]
        const last = rows[rows.length - 1]
        const y0 = first.top + first.height / 2 - P.top - 16
        const y1 = last.top + last.height / 2 - P.top
        paths.push({ d: `M 10 ${round(y0)} L 10 ${round(y1)}`, alpha: 0.5 })
        rowStart = paths.length
        for (const r of rows) {
          const x2 = r.left - P.left
          const y2 = r.top + r.height / 2 - P.top
          paths.push({
            d: `M 10 ${round(y2 - 14)} C 10 ${round(y2)}, 14 ${round(y2)}, ${round(x2)} ${round(y2)}`,
            alpha: 0.6,
          })
        }
      }
    }

    const next: Geometry = { width: round(P.width), height: round(P.height), paths, rowStart }
    setGeometry((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
  }, [isDesktop, diagramRef, hubRef, leftRef, listRef])

  useEffect(() => {
    measure()
    const observer = new ResizeObserver(measure)
    if (diagramRef.current) observer.observe(diagramRef.current)
    if (listRef.current) observer.observe(listRef.current)

    // Bangla/web fonts change line wrapping once loaded, so measure again.
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) measure()
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [measure, diagramRef, listRef])

  return geometry
}

/* ── Panel ──────────────────────────────────────────────────────────────── */

export function CoursePanel({
  course,
  config,
  isActive,
  isDesktop,
  panelId,
  tabId,
}: CoursePanelProps) {
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const diagramRef = useRef<HTMLDivElement>(null)
  const hubRef = useRef<SVGSVGElement>(null)
  const leftRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const geometry = useLineGeometry(isDesktop, { diagramRef, hubRef, leftRef, listRef })
  const [drawn, setDrawn] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)

  const { totalItems, totalHours } = getCourseStats(course)
  const [leftSection, rightSection] = course.sections

  // Inactive panels stay in the DOM (good for SEO) but must not be focusable or
  // readable. `inert` is set as a property so it works on every React version.
  useEffect(() => {
    const el = rootRef.current as (HTMLDivElement & { inert: boolean }) | null
    if (el) el.inert = !isActive
  }, [isActive])

  // Draw the lines in when the panel becomes active (and once measured).
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (!geometry || !isActive) {
        setDrawn(false)
        return
      }
      setDrawn(true)
    })
    return () => cancelAnimationFrame(frame)
  }, [geometry, isActive, reduceMotion])

  const instant = Boolean(reduceMotion) || !isActive

  return (
    <div
      ref={rootRef}
      id={panelId}
      role="tabpanel"
      aria-labelledby={tabId}
      aria-hidden={!isActive}
      className={`${isActive ? "relative" : "absolute inset-x-0 top-0"} col-start-1 row-start-1 self-start overflow-hidden rounded-2xl bg-gradient-to-br from-[#07100c] via-surface p-6 sm:p-8 ${
        isActive ? "visible opacity-100" : "invisible opacity-0"
      }`}
      style={
        {
          "--c": config.color,
          "--tw-gradient-to": `color-mix(in srgb, ${config.bg} 33%, transparent)`,
          border: `1.5px solid ${config.border}`,
          boxShadow: `0 0 40px ${config.glow}`,
          transition: reduceMotion
            ? "none"
            : `opacity 300ms ease, visibility 0s linear ${isActive ? 0 : 300}ms`,
        } as CSSProperties
      }
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${mix(55)}, transparent)` }}
      />

      {/* ── Header ── */}
      <header className="mb-8">
        <div className="mb-1.5 flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-5 w-5 items-center justify-center rounded border"
            style={{
              background: `linear-gradient(135deg, ${config.bg}, ${config.bgMid})`,
              borderColor: config.border,
              color: config.color,
              fontFamily: "Georgia, serif",
              fontSize: 10,
              fontStyle: "italic",
              fontWeight: 700,
            }}
          >
            {config.abbr}
          </span>
          <span
            className="font-monaExpanded text-xs font-semibold uppercase tracking-[0.16em]"
            style={{ color: "var(--c)" }}
          >
            {course.level}
          </span>
        </div>
        <h3 className="text-2xl font-bold text-white sm:text-3xl">{course.title}</h3>
        <p className="mt-1 text-sm text-white/80">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <StatChip icon={<Layers size={14} aria-hidden="true" />} value={totalItems} label="classes" />
          <StatChip icon={<Clock size={14} aria-hidden="true" />} value={`${totalHours}h`} label="total" />
        </div>
      </header>

      {/* ── Diagram: hub in the middle, left section, right section with branches ── */}
      <div
        ref={diagramRef}
        className="relative grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(140px,3fr)_minmax(0,5fr)] lg:items-center lg:gap-0"
      >
        {geometry && (
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            style={{ color: config.color }}
          >
            {geometry.paths.map((path, i) => {
              const rowIndex = i - geometry.rowStart
              const highlighted = hovered !== null && rowIndex === hovered
              const dimmed = hovered !== null && rowIndex >= 0 && rowIndex !== hovered
              return (
                <path
                  key={i}
                  d={path.d}
                  pathLength={1}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={highlighted ? 2.25 : 1.5}
                  strokeDasharray={1}
                  strokeDashoffset={drawn ? 0 : 1}
                  style={{
                    opacity: dimmed ? 0.2 : highlighted ? 1 : path.alpha,
                    transition: instant
                      ? "none"
                      : `stroke-dashoffset 700ms ease-out ${Math.min(i * 50, 600)}ms, opacity 150ms linear, stroke-width 150ms linear`,
                  }}
                />
              )
            })}
          </svg>
        )}

        {/* Hub (decorative) */}
        <div
          aria-hidden="true"
          className="flex flex-col items-center gap-1 lg:col-start-2 lg:row-start-1"
        >
          <CourseHub ref={hubRef} config={config} />
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            {config.stackLabel}
          </span>
        </div>

        {/* Left section */}
        <div
          ref={leftRef}
          className="rounded-xl border border-white/10 bg-black/30 p-3.5 lg:col-start-1 lg:row-start-1"
        >
          <SectionHeading id={`${panelId}-left`} label={leftSection.label} />
          <ul aria-labelledby={`${panelId}-left`} className="flex flex-col">
            {leftSection.items.map((item) => {
              const typeStyle = item.type ? TYPE_STYLES[item.type] : undefined
              return (
                <li key={item.id} className="flex items-start gap-2 py-1 text-xs leading-snug">
                  <span
                    aria-hidden="true"
                    className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: typeStyle?.color ?? config.color }}
                  />
                  <span className="min-w-0 flex-1 text-white/90">
                    {typeStyle && <span className="sr-only">{typeStyle.label}: </span>}
                    {item.title}
                  </span>
                  <span className="shrink-0 text-white/70">{formatHours(item.hours)}</span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Right section (branches) */}
        {rightSection.items.length > 0 && (
          <RightSection
            section={rightSection}
            headingId={`${panelId}-right`}
            listRef={listRef}
            isDesktop={isDesktop}
            onHover={setHovered}
          />
        )}
      </div>
    </div>
  )
}

/* ── Small pieces ───────────────────────────────────────────────────────── */

function SectionHeading({ id, label }: { id: string; label: string }) {
  return (
    <h4
      id={id}
      className="mb-2.5 font-monaExpanded text-xs font-semibold uppercase tracking-[0.16em]"
      style={{ color: "var(--c)" }}
    >
      {label}
    </h4>
  )
}

function StatChip({
  icon,
  value,
  label,
}: {
  icon: ReactNode
  value: number | string
  label: string
}) {
  return (
    <span
      className="inline-flex items-center gap-2 rounded-xl border px-3 py-1.5"
      style={{ background: mix(10), borderColor: mix(35), color: "var(--c)" }}
    >
      {icon}
      <span className="text-base font-black leading-none">{value}</span>
      <span className="text-xs uppercase tracking-wider text-white/70">{label}</span>
    </span>
  )
}

function RightSection({
  section,
  headingId,
  listRef,
  isDesktop,
  onHover,
}: {
  section: CurriculumSection
  headingId: string
  listRef: RefObject<HTMLUListElement | null>
  isDesktop: boolean
  onHover: (index: number | null) => void
}) {
  return (
    <div className="lg:col-start-3 lg:row-start-1">
      <SectionHeading id={headingId} label={section.label} />
      <ul
        ref={listRef}
        aria-labelledby={headingId}
        className="ml-7 flex flex-col gap-1.5 lg:ml-0"
      >
        {section.items.map((item, i) => (
          <li
            key={item.id}
            onPointerEnter={isDesktop ? () => onHover(i) : undefined}
            onPointerLeave={isDesktop ? () => onHover(null) : undefined}
            className="rounded-[10px] border px-2.5 py-1.5 text-xs leading-snug"
            style={{ background: mix(9), borderColor: mix(38) }}
          >
            <span className="block text-white/90">{item.title}</span>
            <span className="mt-0.5 flex items-center gap-1 text-white/70">
              <Clock size={10} aria-hidden="true" />
              {formatHours(item.hours)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}