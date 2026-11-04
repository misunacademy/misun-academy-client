"use client"

import { forwardRef } from "react"
import type { CourseConfig } from "./curriculumData"

interface CourseHubProps {
  config: CourseConfig
}

/**
 * Single isometric slab shown in the middle of the curriculum diagram.
 * Replaces the three-slab IsometricStack: it is static (no infinite float,
 * no SVG filter), so it costs nothing to paint on low-end phones.
 * Purely decorative, so it is hidden from assistive technology.
 *
 * The ref points at the <svg> so the diagram can measure where the slab is
 * and start its connector lines from the slab's side.
 */
export const CourseHub = forwardRef<SVGSVGElement, CourseHubProps>(function CourseHub(
  { config },
  ref
) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 84"
      aria-hidden="true"
      focusable="false"
      className="w-24 select-none lg:w-28"
      style={{ color: config.color }}
    >
      {/* left and right sides */}
      <polygon points="10,40 50,60 50,76 10,56" fill="currentColor" opacity="0.45" />
      <polygon points="50,60 90,40 90,56 50,76" fill="currentColor" opacity="0.3" />
      {/* top face */}
      <polygon points="50,20 90,40 50,60 10,40" fill="currentColor" />
      <polygon
        points="50,26 80,40 50,54 20,40"
        fill="none"
        stroke="rgba(255,255,255,0.28)"
        strokeWidth="1"
      />
      <text
        x="50"
        y="46"
        textAnchor="middle"
        fontSize="22"
        fontWeight="700"
        fontStyle="italic"
        fill="#fff"
        style={{ fontFamily: "Georgia, serif" }}
      >
        {config.abbr}
      </text>
    </svg>
  )
})