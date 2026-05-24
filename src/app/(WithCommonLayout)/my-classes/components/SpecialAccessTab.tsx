import { KeyRound } from "lucide-react";
import { CourseCard } from "./CourseCard";
import { EnrolledCourse } from "../types";

export function SpecialAccessTab({ courses }: { courses: EnrolledCourse[] }) {
  if (courses.length === 0) {
    return (
      <div className="relative rounded-2xl border border-primary/20 bg-[#060f0a] overflow-hidden flex flex-col items-center justify-center py-20 gap-5 text-center px-6">
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
          <KeyRound className="h-10 w-10 text-primary" />
        </div>
        <div className="relative">
          <h3 className="text-xl font-bold text-white mb-2">No special access yet</h3>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            Special access courses granted by admins will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {courses.map((enrollment) => (
        <CourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
}
