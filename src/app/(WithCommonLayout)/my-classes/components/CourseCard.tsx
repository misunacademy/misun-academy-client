"use client";

import { CheckCircle2, PlayCircle, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useGetCourseProgressQuery } from "@/redux/api/courseApi";
import { EnrolledCourse } from "../types";

export function CourseCard({ enrollment }: { enrollment: EnrolledCourse }) {
  const { data: progressData } = useGetCourseProgressQuery(enrollment.courseId, {
    skip: !enrollment.courseId,
  });

  const isActive = enrollment.status === "active";
  const isCompleted = enrollment.status === "completed";
  const apiProgress = progressData?.data?.percentage;
  const progress =
    typeof apiProgress === "number"
      ? Math.min(100, Math.max(0, Math.round(apiProgress)))
      : isCompleted
      ? 100
      : 0;

  return (
    <div
      className="group relative p-[1.5px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-0.5"
    >
      {/* Spinning conic gradient border on hover */}
      <span
        className="absolute inset-[-100%] opacity-0 group-hover:opacity-100 animate-[spin_5s_linear_infinite] transition-opacity duration-800"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 20%, hsl(156 70% 42% / 0.5) 38%, hsl(156 80% 60%) 50%, hsl(156 70% 42% / 0.5) 62%, transparent 80%)",
        }}
      />
      {/* Static border when not hovered */}
      <span className="absolute inset-0 rounded-2xl border border-primary/10  group-hover:border-transparent transition-all duration-300" />

      {/* Card body */}
      <div className="relative flex flex-col sm:flex-row min-h-[160px] rounded-2xl bg-[#060f0a] overflow-hidden
        group-hover:shadow-xl group-hover:shadow-primary/10 transition-all duration-500">

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-primary/30 rounded-tl-2xl z-10" />
        <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-primary/30 rounded-tr-2xl z-10" />
        <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-primary/15 rounded-bl-2xl z-10" />
        <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-primary/15 rounded-br-2xl z-10" />

        {/* Thumbnail */}
        <div className="relative w-full sm:w-56 md:w-64 shrink-0 min-h-[140px] sm:min-h-0">
          {enrollment.thumbnailImage ? (
             <Image 
               src={enrollment.thumbnailImage} 
               alt={enrollment.courseTitle} 
               fill  
               className="object-cover w-full h-full" 
               sizes="(max-width: 640px) 100vw, 256px"
             />
          ) : (
            <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/30 text-xs">No Image</div>
          )}
          {/* Status pill */}
          <div className="absolute top-3 left-3 z-10">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                isActive
                  ? "bg-primary/20 text-primary border-primary/40"
                  : isCompleted
                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-400/40"
                  : "bg-white/10 text-white/60 border-white/10"
              }`}
            >
              {isCompleted && <CheckCircle2 className="w-3 h-3" />}
              {isActive ? "Active" : isCompleted ? "Completed" : enrollment.status}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex-1 p-5 sm:p-6 flex flex-col gap-3">
          {/* Background hover glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative">
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-2">
              {enrollment.courseTitle}
            </h3>
            <p className="text-sm text-white/45 mt-1">
              {enrollment.instructor?.name || "Mithun Sarkar"}
              {enrollment.batchTitle ? (
               <span className="text-white/30"> • {enrollment.batchTitle}</span>
              ) : null}
            </p>
          </div>

          {enrollment.shortDescription && (
            <p className="relative text-sm text-white/35 line-clamp-2 leading-relaxed">
              {enrollment.shortDescription}
            </p>
          )}

          {/* Progress */}
          <div className="relative space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/40 font-medium">Progress</span>
              <span className="font-bold text-primary">{progress}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  background:
                    "linear-gradient(90deg, hsl(156 70% 42%), hsl(156 85% 65%))",
                  boxShadow: progress > 0 ? "0 0 8px hsl(156 70% 42% / 0.6)" : "none",
                }}
              />
            </div>
          </div>

          {/* Meta + Buttons row */}
          <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 mt-auto pt-1">
            <div className="flex items-center gap-1.5 text-xs text-white/35">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Enrolled:{" "}
                {new Date(enrollment.enrolledAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:ml-auto">
              {enrollment.courseId ? (
                <Link
                  href={`/my-classes/${enrollment.courseId}${enrollment.batchId ? `?batchId=${enrollment.batchId}` : ""}`}
                >
                  <button className="group/btn inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm
                    bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white
                    shadow-[0_0_14px_hsl(156_70%_42%/0.35)] hover:shadow-[0_0_22px_hsl(156_70%_42%/0.55)]
                    transition-all duration-300 hover:-translate-y-px">
                    <PlayCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                    Continue Learning
                  </button>
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm opacity-40 cursor-not-allowed bg-white/5 border border-white/10 text-white/60"
                >
                  <PlayCircle className="w-4 h-4" />
                  Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
