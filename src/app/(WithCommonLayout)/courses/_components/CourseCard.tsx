"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { COURSE_SLUGS } from "@/constants/courses";
import graphic from "@/assets/images/thumb_2.png";
import english from "@/assets/images/thumb_1.png";
import type { CourseConfig } from "./courseData";

const thumbnailMap = { 'graphic-design': graphic, 'english': english } as const;

export default function CourseCard({ course }: { course: CourseConfig }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    card.style.transform = `perspective(1100px) rotateX(${((y - cy) / cy) * -7}deg) rotateY(${((x - cx) / cx) * 7}deg) translateZ(8px)`;
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(260px circle at ${x}px ${y}px, ${course.accentRaw}22, transparent 70%)`;
    }
  };

  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
    if (glowRef.current) {
      glowRef.current.style.background = "transparent";
    }
  };

  const href = course.slug !== COURSE_SLUGS.GRAPHIC_DESIGN
    ? `${process.env.NEXT_PUBLIC_EP_FRONTEND_URL}`
    : `/courses/${course.slug}`;

  return (
    <Link href={href} className="group block" style={{ perspective: "1100px" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d", transition: "transform 0.15s ease, box-shadow 0.3s ease, border-color 0.3s ease" }}
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1a10] via-[#0c2318] to-surface border ${course.border} ${course.glow}`}
      >
        <div ref={glowRef} className="absolute inset-0 pointer-events-none rounded-3xl transition-all duration-100 z-10" />
        <div className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent ${course.shimmer} to-transparent opacity-70`} />
        <div className="absolute top-0 left-0 w-7 h-7 border-t-[1.5px] border-l-[1.5px] border-border/60 rounded-tl-3xl" style={{ transform: "translateZ(4px)" }} />
        <div className="absolute top-0 right-0 w-7 h-7 border-t-[1.5px] border-r-[1.5px] border-border/60 rounded-tr-3xl" style={{ transform: "translateZ(4px)" }} />
        <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[1.5px] border-l-[1.5px] border-border/30 rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[1.5px] border-r-[1.5px] border-border/30 rounded-br-3xl" />

        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={thumbnailMap[course.thumbnail]}
            alt={course.title}
            fill
            className="object-cover h-full transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
          {course.isNew && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold tracking-wider shadow-[0_0_12px_hsl(217_91%_60%/0.7)]" style={{ transform: "translateZ(6px)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              NEW
            </div>
          )}
          <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.18em] uppercase bg-black/40 backdrop-blur-sm border border-white/10 text-white/60" style={{ transform: "translateZ(6px)" }}>
            {course.label}
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4 p-6" style={{ transformStyle: "preserve-3d" }}>
          <div className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-semibold tracking-[0.12em] uppercase ${course.badgeBg}`} style={{ transform: "translateZ(4px)" }}>
            {course.badge}
          </div>
          <div style={{ transform: "translateZ(6px)" }}>
            <h2 className="text-xl md:text-2xl font-bold font-bangla bg-gradient-to-r pt-2 from-white via-white/95 to-white/75 bg-clip-text text-transparent leading-snug">
              {course.title}
            </h2>
            <p className="text-[11px] text-white/30 mt-1 font-sans tracking-wide">{course.titleEn}</p>
          </div>
          <p className="text-sm text-white/55 font-bangla leading-relaxed" style={{ transform: "translateZ(2px)" }}>
            {course.description}
          </p>
          <div className={`h-px w-full bg-gradient-to-r from-transparent ${course.shimmer} to-transparent opacity-30`} />
          <div className="flex flex-wrap gap-2" style={{ transform: "translateZ(4px)" }}>
            {course.highlights.map((h) => (
              <span key={h} className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${course.highlightBg}`}>{h}</span>
            ))}
          </div>
          <div className="flex items-center justify-between mt-1" style={{ transform: "translateZ(6px)" }}>
            <div className={`flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all duration-200 ${course.ctaColor}`}>
              <span className="font-bangla">কোর্স দেখুন</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <span className="text-[10px] text-white/25 font-sans tracking-wide">Batch enrolling</span>
          </div>
        </div>

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${course.accentRaw}18 0%, transparent 65%)` }}
        />
      </div>
    </Link>
  );
}
