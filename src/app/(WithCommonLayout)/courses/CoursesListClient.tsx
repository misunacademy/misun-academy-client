"use client";

import React, { useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { COURSE_SLUGS } from "@/constants/courses";
import graphic from "@/assets/images/thumb_2.png";
import english from "@/assets/images/thumb_1.png";

const SceneBackground = dynamic(() => import("./CoursesListScene"), { ssr: false });

// ─── Course card data ─────────────────────────────────────────────────────────

const courses = [
  {
    slug: COURSE_SLUGS.GRAPHIC_DESIGN,
    badge: "কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স",
    label: "Design",
    title: "কমপ্লিট গ্রাফিক্স ডিজাইন উইথ ফ্রিল্যান্সিং",
    titleEn: "Complete Graphic Design With Freelancing",
    description:
      "বেসিক থেকে অ্যাডভান্স লেভেল পর্যন্ত হাতে-কলমে প্রজেক্ট, ক্লায়েন্ট হান্টিং ও AI-ইন্টিগ্রেটেড ডিজাইন শিখুন।",
    highlights: ["৪ মাসের কোর্স", "লাইভ ক্লাস", "১:১ মেন্টরশিপ", "সার্টিফিকেট"],
    accent: "hsl(156 70% 42%)",
    accentRaw: "#16a34a",
    glow: "group-hover:shadow-[0_20px_60px_hsl(156_70%_42%/0.30),0_4px_16px_hsl(156_70%_42%/0.15)]",
    border: "group-hover:border-primary/60",
    badgeBg: "bg-primary/10 border-primary/25 text-primary/90",
    highlightBg: "bg-primary/10 text-primary/80 border-primary/20",
    ctaColor: "text-primary",
    shimmer: "via-primary/60",
    isNew: false,
    thumbnail: "graphic-design" as const,
  },
  {
    slug: COURSE_SLUGS.ENGLISH,
    badge: "English For Professional Communication",
    label: "Language",
    title: "English For Professional Communication",
    titleEn: "English For Professional Communication",
    description:
      "প্রফেশনাল পরিবেশে আত্মবিশ্বাসের সাথে ইংরেজি বলতে শিখুন। Puspita Singha-র তত্ত্বাবধানে ইন্টারভিউ, প্রেজেন্টেশন ও বিজনেস কমিউনিকেশন শিখুন।",
    highlights: ["প্রফেশনাল ইংরেজি", "স্পিকিং প্র্যাকটিস", "লাইভ সাপোর্ট", "সার্টিফিকেট"],
    accent: "hsl(217 91% 60%)",
    accentRaw: "#3b82f6",
    glow: "group-hover:shadow-[0_20px_60px_hsl(217_91%_60%/0.28),0_4px_16px_hsl(217_91%_60%/0.14)]",
    border: "group-hover:border-blue-500/60",
    badgeBg: "bg-blue-500/10 border-blue-500/25 text-blue-400/90",
    highlightBg: "bg-blue-500/10 text-blue-400/80 border-blue-500/20",
    ctaColor: "text-blue-400",
    shimmer: "via-blue-500/60",
    isNew: true,
    thumbnail: "english" as const,
  },
];

// ─── 3D-tilt card ─────────────────────────────────────────────────────────────

function CourseCard({ course }: { course: (typeof courses)[number] }) {
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
    const rx = ((y - cy) / cy) * -7;
    const ry = ((x - cx) / cx) * 7;
    card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(8px)`;
    // move inner glow with cursor
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

  return (
    <Link href={course.slug !== COURSE_SLUGS.GRAPHIC_DESIGN
      ? `${process.env.NEXT_PUBLIC_EP_FRONTEND_URL}`
      : `/courses/${course.slug}`
    } className="group block" style={{ perspective: "1100px" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transformStyle: "preserve-3d", transition: "transform 0.15s ease, box-shadow 0.3s ease, border-color 0.3s ease" }}
        className={`
          relative overflow-hidden rounded-3xl
          bg-gradient-to-br from-[#0a1a10] via-[#0c2318] to-surface
          ${course.border}
          ${course.glow}
        `}
      >
        {/* ── Cursor-following radial glow ── */}
        <div ref={glowRef} className="absolute inset-0 pointer-events-none rounded-3xl transition-all duration-100 z-10" />

        {/* ── Shimmer top edge ── */}
        <div className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent ${course.shimmer} to-transparent opacity-70`} />

        {/* ── Corner accents — lifted via translateZ ── */}
        <div className="absolute top-0 left-0 w-7 h-7 border-t-[1.5px] border-l-[1.5px] border-white/20 rounded-tl-3xl" style={{ transform: "translateZ(4px)" }} />
        <div className="absolute top-0 right-0 w-7 h-7 border-t-[1.5px] border-r-[1.5px] border-white/20 rounded-tr-3xl" style={{ transform: "translateZ(4px)" }} />
        <div className="absolute bottom-0 left-0 w-7 h-7 border-b-[1.5px] border-l-[1.5px] border-white/10 rounded-bl-3xl" />
        <div className="absolute bottom-0 right-0 w-7 h-7 border-b-[1.5px] border-r-[1.5px] border-white/10 rounded-br-3xl" />

        {/* ── Thumbnail ── */}
        <div className="relative w-full h-56 overflow-hidden">
          <Image
            src={course.thumbnail === "graphic-design" ? graphic : english}
            alt="Graphic Design Course"
            fill
            className="object-cover h-full transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />

          {/* NEW badge */}
          {course.isNew && (
            <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold tracking-wider shadow-[0_0_12px_hsl(217_91%_60%/0.7)]" style={{ transform: "translateZ(6px)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              NEW
            </div>
          )}

          {/* Category label */}
          <div className="absolute top-3 right-3 z-20 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.18em] uppercase bg-black/40 backdrop-blur-sm border border-white/10 text-white/60" style={{ transform: "translateZ(6px)" }}>
            {course.label}
          </div>
        </div>

        {/* ── Card body ── */}
        <div className="relative z-10 flex flex-col gap-4 p-6" style={{ transformStyle: "preserve-3d" }}>
          {/* Badge */}
          <div className={`inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-semibold tracking-[0.12em] uppercase ${course.badgeBg}`} style={{ transform: "translateZ(4px)" }}>
            {course.badge}
          </div>

          {/* Title block */}
          <div style={{ transform: "translateZ(6px)" }}>
            <h2 className="text-xl md:text-2xl font-bold font-bangla bg-gradient-to-r pt-2 from-white via-white/95 to-white/75 bg-clip-text text-transparent leading-snug">
              {course.title}
            </h2>
            <p className="text-[11px] text-white/30 mt-1 font-sans tracking-wide">{course.titleEn}</p>
          </div>

          {/* Description */}
          <p className="text-sm text-white/55 font-bangla leading-relaxed" style={{ transform: "translateZ(2px)" }}>
            {course.description}
          </p>

          {/* Divider */}
          <div className={`h-px w-full bg-gradient-to-r from-transparent ${course.shimmer} to-transparent opacity-30`} />

          {/* Highlights */}
          <div className="flex flex-wrap gap-2" style={{ transform: "translateZ(4px)" }}>
            {course.highlights.map((h) => (
              <span key={h} className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${course.highlightBg}`}>
                {h}
              </span>
            ))}
          </div>

          {/* CTA row */}
          <div className={`flex items-center justify-between mt-1`} style={{ transform: "translateZ(6px)" }}>
            <div className={`flex items-center gap-2 font-semibold text-sm group-hover:gap-3 transition-all duration-200 ${course.ctaColor}`}>
              <span className="font-bangla">কোর্স দেখুন</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            {/* Enroll count indicator */}
            <span className="text-[10px] text-white/25 font-sans tracking-wide">Batch enrolling</span>
          </div>
        </div>

        {/* ── Bottom ambient glow layer ── */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${course.accentRaw}18 0%, transparent 65%)` }}
        />
      </div>
    </Link>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CoursesListClient() {
  return (
    <section className="relative bg-surface min-h-screen overflow-hidden font-bangla">

      {/* ── Three.js 3D background canvas ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Suspense fallback={null}>
          <SceneBackground />
        </Suspense>
      </div>

      {/* ── Dot-grid texture ── */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Large ambient glows ── */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[140px] pointer-events-none z-[1]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-500/3 rounded-full blur-[100px] pointer-events-none z-[1]" />

      <div className="relative z-10 container mx-auto px-4 pt-28 pb-24">

        {/* ── Header ── */}
        <div className="text-center mb-20">
          {/* Premium badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-7 shadow-[0_0_20px_hsl(156_70%_42%/0.15)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="text-xs font-semibold  uppercase text-primary/90">আমাদের কোর্সসমূহ</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight">
            <span className="block bg-gradient-to-r from-white via-white/95 to-white/75 bg-clip-text text-transparent pt-4">
              স্বপ্নকে পেশায় রূপ দিন
            </span>
            <span className="block bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_hsl(156_70%_42%/0.45)] mt-1 pt-4">
              সঠিক লার্নিং ট্র্যাক বেছে নিন
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-white/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-bangla">
            দক্ষতা অর্জন করুন, ক্যারিয়ার গড়ুন। MISUN Academy-এর বিশেষজ্ঞ ইন্সট্রাক্টরদের সাথে শিখুন।
          </p>

          {/* Decorative divider */}
          <div className="flex items-center justify-center gap-3 mt-7">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-primary/40" />
            <div className="flex gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
              <div className="w-2.5 h-1.5 rounded-full bg-primary" />
              <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            </div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-primary/40" />
          </div>
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-5xl mx-auto">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {/* ── Bottom note ── */}
        <p className="text-center text-white/25 text-xs mt-14 tracking-wide font-sans">
          সকল কোর্সে লাইফটাইম অ্যাক্সেস • ডিজিটাল সার্টিফিকেট • ২৪/৭ সাপোর্ট
        </p>
      </div>
    </section>
  );
}
