import { useId, type CSSProperties, type HTMLAttributes } from "react";

interface AIPoweredBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  className?: string;
}

/** 4-point sparkle, drawn from the centre outward. */
const STAR_PATH =
  "M10.5 2.5c.7 4.2 2.3 5.8 6.5 6.5-4.2.7-5.8 2.3-6.5 6.5-.7-4.2-2.3-5.8-6.5-6.5 4.2-.7 5.8-2.3 6.5-6.5Z";

/** Smaller companion sparkle. */
const SUB_STAR_PATH =
  "M18.4 14.2c.3 1.7 1 2.4 2.7 2.7-1.7.3-2.4 1-2.7 2.7-.3-1.7-1-2.4-2.7-2.7 1.7-.3 2.4-1 2.7-2.7Z";

interface PathTracerProps {
  d: string;
  gradientId: string;
  duration: string;
  delay: string;
  strokeWidth: number;
  orbRadius: number;
}

/**
 * A comet that follows an SVG path: a dashed trail plus a glowing head
 * driven by CSS offset-path, so both share the same route and timing.
 */
function PathTracer({
  d,
  gradientId,
  duration,
  delay,
  strokeWidth,
  orbRadius,
}: PathTracerProps) {
  const timing = {
    "--trace-dur": duration,
    "--trace-delay": delay,
  } as CSSProperties;

  return (
    <>
      <path
        d={d}
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
        className="ai-badge-spark-trace"
        style={timing}
      />
      <circle
        cx="0"
        cy="0"
        r={orbRadius}
        className="ai-badge-spark-orb"
        style={{ ...timing, offsetPath: `path("${d}")` }}
      />
    </>
  );
}

/**
 * Compact "AI Powered" label.
 * Dark pill with a glowing orbiting border, neon gradient icon and text,
 * and comets travelling along the sparkle outlines.
 */
export function AIPoweredBadge({
  className = "",
  ...props
}: AIPoweredBadgeProps) {
  const gradientId = `ai-powered-badge-gradient-${useId().replace(/:/g, "")}`;

  return (
    <span
      {...props}
      className={[
        "ai-powered-badge",
        "mb-4 inline-flex select-none items-center gap-2.5 rounded-full",
        "py-1.5 pl-1.5 pr-4",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="ai-badge-icon-wrap size-7" aria-hidden="true">
        <svg
          width="17"
          height="17"
          viewBox="0 0 24 24"
          fill="none"
          className="ai-badge-spark"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* Icon palette (mint → aqua → sky) lives in animations.css. */}
            <linearGradient
              id={gradientId}
              x1="3"
              y1="3"
              x2="21"
              y2="21"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" className="ai-badge-stop-1" />
              <stop offset="55%" className="ai-badge-stop-2" />
              <stop offset="100%" className="ai-badge-stop-3" />
            </linearGradient>
          </defs>

          {/* Filled bodies */}
          <path
            d={STAR_PATH}
            fill={`url(#${gradientId})`}
            className="ai-badge-spark-main"
          />
          <path
            d={SUB_STAR_PATH}
            fill={`url(#${gradientId})`}
            className="ai-badge-spark-small"
          />

          {/* Comets following each sparkle outline */}
          <PathTracer
            d={STAR_PATH}
            gradientId={gradientId}
            duration="3.2s"
            delay="0.3s"
            strokeWidth={1.4}
            orbRadius={1.2}
          />
          <PathTracer
            d={SUB_STAR_PATH}
            gradientId={gradientId}
            duration="3.2s"
            delay="1.6s"
            strokeWidth={1.1}
            orbRadius={0.85}
          />
        </svg>
      </span>

      <span className="ai-text-sheen whitespace-nowrap font-mona text-xs font-semibold uppercase leading-none tracking-[0.2em] sm:text-[13px]">
        AI Powered
      </span>

      <span className="ai-badge-dot" aria-hidden="true" />
    </span>
  );
}