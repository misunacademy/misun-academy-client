'use client';

import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import TimelineCard, {
  CARD_BRANCH_ANCHOR_Y,
  type TimelineFeature,
} from './TimelineCard';

/* ── Motion constants (tune here, nowhere else) ─────────────────────────── */
const TRIGGER_LINE = '65%'; // viewport height at which a step starts drawing
const BRANCH_SPAN = 0.35; // how much segment progress the branch takes to draw
const CARD_REVEAL_AT = 0.6; // branch progress at which the card appears (then stays)

/**
 * The spine fill reaches the node at a different point depending on where the
 * step sits: the first segment starts AT its node, middle segments pass through
 * the node halfway, and the last segment ends at its node. The node and branch
 * must wait for the line to arrive, so their timing depends on position.
 */
function getTimings(isFirst: boolean, isLast: boolean) {
  const nodeAt = isFirst ? 0.05 : isLast ? 0.6 : 0.5;
  return {
    nodeAt,
    branchRange: [nodeAt, nodeAt + BRANCH_SPAN] as [number, number],
    // The last segment stops at its node, so it reaches full length early,
    // leaving room afterwards for the branch to draw.
    spineRange: (isLast ? [0, 0.6] : [0, 1]) as [number, number],
  };
}
const SPRING = { stiffness: 120, damping: 30, restDelta: 0.001 };
const EASE: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

/* Row vertical padding is py-5 (20px); spine segments extend by the same
   amount so neighbouring segments join without a gap. */
const SPINE_TOP = { first: 'top-1/2', other: '-top-5' };
const SPINE_BOTTOM = { first: 'bottom-1/2', other: '-bottom-5' };

interface TimelineItemProps {
  feature: TimelineFeature;
  index: number;
  Icon: LucideIcon;
  isFirst: boolean;
  isLast: boolean;
}

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const width = el.clientWidth;
      const height = el.clientHeight;
      setSize((prev) =>
        prev.width === width && prev.height === height ? prev : { width, height },
      );
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

export default function TimelineItem({
  feature,
  index,
  Icon,
  isFirst,
  isLast,
}: TimelineItemProps) {
  const rowRef = useRef<HTMLLIElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const [branchRef, { width, height }] = useElementSize<HTMLDivElement>();

  const reduceMotion = useReducedMotion();
  const isEven = index % 2 === 0;

  /* Scroll progress of this row: 0 when its top reaches the trigger line,
     1 when its bottom does. The spring smooths raw scroll jitter. */
  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: [`start ${TRIGGER_LINE}`, `end ${TRIGGER_LINE}`],
  });
  const progress = useSpring(scrollYProgress, SPRING);
  const { nodeAt, branchRange, spineRange } = getTimings(isFirst, isLast);
  const spineScale = useTransform(progress, spineRange, [0, 1]);
  const branchProgress = useTransform(progress, branchRange, [0, 1]);
  /* A zero-length dash with round line caps still paints a dot, so the
     branch stays invisible until it actually has length. */
  const branchOpacity = useTransform(branchProgress, [0, 0.01], [0, 1]);

  /* React state changes only at thresholds, never per frame. */
  const [nodeOn, setNodeOn] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [portOn, setPortOn] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useMotionValueEvent(progress, 'change', (v) => {
    setNodeOn(v >= nodeAt);
    setIsDrawing(v > 0.01 && v < 0.99);
  });

  useMotionValueEvent(branchProgress, 'change', (v) => {
    setPortOn(v >= 0.99);
    if (v >= CARD_REVEAL_AT) setRevealed(true); // latched: never hides again

    /* Leading dot rides the tip of the branch. Imperative on purpose:
       it updates every frame and must not re-render React. */
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot) return;
    if (v <= 0 || v >= 1) {
      dot.style.opacity = '0';
      return;
    }
    const point = path.getPointAtLength(path.getTotalLength() * v);
    dot.setAttribute('cx', String(point.x));
    dot.setAttribute('cy', String(point.y));
    dot.style.opacity = '1';
  });

  /* Reduced motion: everything is shown in its final state. */
  const active = reduceMotion || nodeOn;
  const showCard = reduceMotion || revealed;
  const showPort = reduceMotion || portOn;
  const current = !reduceMotion && isDrawing;

  const anchorY = CARD_BRANCH_ANCHOR_Y;
  const branchPath =
    width > 0 && height > 0
      ? `M 0 ${height / 2} C ${width * 0.6} ${height / 2}, ${width * 0.4} ${anchorY}, ${width} ${anchorY}`
      : '';

  const spineEdges = `${isFirst ? SPINE_TOP.first : SPINE_TOP.other} ${
    isLast ? SPINE_BOTTOM.first : SPINE_BOTTOM.other
  }`;

  return (
    <li
      ref={rowRef}
      className="grid grid-cols-[36px_minmax(0,1fr)] gap-x-4 py-5
        md:grid-cols-[minmax(0,1fr)_56px_44px_56px_minmax(0,1fr)] md:gap-x-0"
    >
      {/* ── Spine segment + node ── */}
      <div className="relative col-start-1 row-start-1 flex items-center justify-center md:col-start-3">
        <span
          aria-hidden="true"
          className={`absolute left-1/2 -ml-px w-[2px] bg-primary/15 ${spineEdges}`}
        />
        <motion.span
          aria-hidden="true"
          className={`absolute left-1/2 -ml-px w-[2px] origin-top bg-gradient-to-b from-primary to-primary-glow
            shadow-[0_0_10px_1px] shadow-primary/50 ${spineEdges}`}
          style={{ scaleY: reduceMotion ? 1 : spineScale }}
        />

        <div
          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border text-xs font-bold
            ring-4 ring-surface transition-[transform,border-color,color] duration-300 md:h-11 md:w-11 md:text-sm
            ${active ? 'border-transparent text-white' : 'border-primary/30 bg-surface text-primary/60'}
            ${current ? 'scale-110' : ''}`}
        >
          <span
            aria-hidden="true"
            className={`absolute inset-0 rounded-full bg-gradient-to-br from-emerald-darker via-primary to-emerald-dark
              shadow-lg shadow-primary/50 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
          />
          {active ? (
            <Icon className="relative h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
          ) : (
            <span className="relative">{index + 1}</span>
          )}

          {/* One-time pulse when the node lights up */}
          {active && !reduceMotion && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-full border-2 border-primary"
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 1.9 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}
        </div>
      </div>

      {/* ── Curved branch: node -> card (desktop only) ── */}
      <div
        ref={branchRef}
        aria-hidden="true"
        className={`relative row-start-1 hidden md:block ${isEven ? 'md:col-start-2' : 'md:col-start-4'}`}
      >
        {branchPath && (
          <svg
            className={`absolute inset-0 h-full w-full overflow-visible ${isEven ? '-scale-x-100' : ''}`}
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
          >
            <path
              d={branchPath}
              className="stroke-primary/20"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
            <motion.path
              ref={pathRef}
              d={branchPath}
              className="stroke-primary"
              strokeWidth={1.5}
              strokeLinecap="round"
              style={{
                pathLength: reduceMotion ? 1 : branchProgress,
                opacity: reduceMotion ? 1 : branchOpacity,
              }}
            />
            <circle
              ref={dotRef}
              r={4}
              className="fill-primary-glow"
              style={{ opacity: 0 }}
            />
            <circle
              cx={width}
              cy={anchorY}
              r={3.5}
              strokeWidth={1.5}
              className={`transition-colors duration-200 ${
                showPort ? 'fill-primary stroke-primary' : 'fill-surface stroke-primary/30'
              }`}
            />
          </svg>
        )}
      </div>

      {/* ── Card ── */}
      <motion.div
        className={`col-start-2 row-start-1 flex min-w-0 self-start
          ${isEven ? 'md:col-start-1 md:justify-end' : 'md:col-start-5 md:justify-start'}`}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={showCard ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <TimelineCard feature={feature} isCurrent={current} />
      </motion.div>
    </li>
  );
}