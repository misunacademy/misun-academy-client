"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { courses } from "./_components/courseData";
import CourseCard from "./_components/CourseCard";

const SceneBackground = dynamic(() => import("./CoursesListScene"), { ssr: false });

export default function CoursesListClient() {
  return (
    <section className="relative bg-surface min-h-screen overflow-hidden font-bangla">
      <div className="absolute inset-0 pointer-events-none z-0">
        <Suspense fallback={null}>
          <SceneBackground />
        </Suspense>
      </div>

      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
        style={{
          backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/6 rounded-full blur-[140px] pointer-events-none z-[1]" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-purple-500/3 rounded-full blur-[100px] pointer-events-none z-[1]" />

      <div className="relative z-10 container mx-auto px-4 pt-28 pb-24">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 mb-7 shadow-[0_0_20px_hsl(156_70%_42%/0.15)]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            <span className="text-xs font-semibold uppercase text-primary/90">আমাদের কোর্সসমূহ</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] tracking-tight">
            <span className="block bg-gradient-to-r from-white via-white/95 to-white/75 bg-clip-text text-transparent pt-4">
              স্বপ্নকে পেশায় রূপ দিন
            </span>
            <span className="block bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent drop-shadow-[0_0_30px_hsl(156_70%_42%/0.45)] mt-1 pt-4">
              সঠিক লার্নিং ট্র্যাক বেছে নিন
            </span>
          </h1>

          <p className="mt-5 text-white/50 text-sm md:text-base max-w-lg mx-auto leading-relaxed font-bangla">
            দক্ষতা অর্জন করুন, ক্যারিয়ার গড়ুন। MISUN Academy-এর বিশেষজ্ঞ ইন্সট্রাক্টরদের সাথে শিখুন।
          </p>

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-5xl mx-auto">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        <p className="text-center text-white/25 text-xs mt-14 tracking-wide font-sans">
          সকল কোর্সে লাইফটাইম অ্যাক্সেস • ডিজিটাল সার্টিফিকেট • ২৪/৭ সাপোর্ট
        </p>
      </div>
    </section>
  );
}
