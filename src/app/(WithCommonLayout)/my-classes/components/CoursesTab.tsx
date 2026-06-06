import { BookOpen } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "./CourseCard";
import { EnrolledCourse } from "../types";

export function CoursesTab({ enrolledCourses }: { enrolledCourses: EnrolledCourse[] }) {
  if (enrolledCourses.length === 0) {
    return (
      <div className="relative rounded-2xl border border-primary/20 bg-[#060f0a] overflow-hidden flex flex-col items-center justify-center py-20 gap-5 text-center px-6">
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative p-5 rounded-2xl bg-primary/10 border border-primary/25">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-2">কোনো কোর্সে নথিভুক্ত নেই</h3>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            আপনি এখনো কোনো কোর্সে ভর্তি হননি। শেখা শুরু করতে কোর্সগুলো ব্রাউজ করুন।
          </p>
        </div>
        <Link href="/courses" className="relative">
          <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm
            bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white
            shadow-[0_0_20px_hsl(156_70%_42%/0.3)] hover:shadow-[0_0_30px_hsl(156_70%_42%/0.5)]
            transition-all duration-300 hover:-translate-y-0.5">
            Browse Courses
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {enrolledCourses.map((enrollment) => (
        <CourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
}
