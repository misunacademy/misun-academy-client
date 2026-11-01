'use client';

import { type LucideIcon } from 'lucide-react';

export interface TimelineFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  highlight: string;
}

/**
 * Vertical distance (px) from the card's top edge to the centre of the title
 * line. The curved branch in TimelineItem ends here, so it must match the
 * card's top padding (p-6 = 24px) plus roughly half the title line height
 * (text-base + leading-snug is about 22px / 2). If you change the padding or
 * the title size, update this value.
 */
export const CARD_BRANCH_ANCHOR_Y = 35;

interface TimelineCardProps {
  feature: TimelineFeature;
  /** True while the scroll-driven line for this step is being drawn. */
  isCurrent?: boolean;
}

function TimelineCard({ feature, isCurrent = false }: TimelineCardProps) {
  return (
    <div
      data-current={isCurrent || undefined}
      className={`group relative w-full md:max-w-[420px] bg-surface border rounded-2xl p-6 overflow-hidden
        hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1
        transition-all duration-300 ease-out cursor-default font-bangla
        ${isCurrent ? 'border-primary/50 shadow-lg shadow-primary/10' : 'border-primary/15'}`}
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-2xl" />
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative min-w-0">
        {/* Title row */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <h3 className="text-white font-semibold text-base leading-snug group-hover:text-primary-glow transition-colors duration-300">
            {feature.title}
          </h3>
          <span className="flex-shrink-0 text-xs font-medium bg-primary/15 text-primary-glow border border-primary/25 px-2 py-0.5 rounded-full">
            {feature.highlight}
          </span>
        </div>
        {/* Description */}
        <p className="text-white/80 text-sm sm:text-base leading-relaxed group-hover:text-white transition-colors duration-300">
          {feature.description}
        </p>
      </div>
    </div>
  );
}

export default TimelineCard;