'use client';

import { type LucideIcon } from 'lucide-react';

interface TimelineCardProps {
  feature: { icon: LucideIcon; title: string; description: string; highlight: string };
  index: number;
  Icon: LucideIcon;
}

function TimelineCard({ feature, Icon }: TimelineCardProps) {
  return (
    <div
      className="group relative w-full md:max-w-[420px] bg-surface border border-primary/15 rounded-2xl p-6 overflow-hidden
        hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1
        transition-all duration-300 ease-out cursor-default font-bangla"
    >
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-2xl" />
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative flex items-start gap-4">
        {/* Icon badge */}
        <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-darker via-primary to-emerald-dark
          flex items-center justify-center
          shadow-md shadow-primary/30
          group-hover:scale-110 group-hover:shadow-primary/50 group-hover:shadow-lg
          transition-all duration-300">
          <Icon className="w-5 h-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="text-white font-semibold text-base leading-snug group-hover:text-primary-glow transition-colors duration-300">
              {feature.title}
            </h3>
            <span className="flex-shrink-0 text-[11px] bg-primary/15 text-primary border border-primary/25 px-2 py-0.5 rounded-full font-medium">
              {feature.highlight}
            </span>
          </div>
          {/* Description */}
          <p className="text-white/55 text-sm leading-relaxed group-hover:text-white/75 transition-colors duration-300">
            {feature.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TimelineCard;
