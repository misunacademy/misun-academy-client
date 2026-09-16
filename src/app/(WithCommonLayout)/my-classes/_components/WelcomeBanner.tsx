import { GraduationCap, Sparkles } from "lucide-react";
import NotificationBell from "@/components/shared/NotificationBell";
import type { EnrolledCourse } from "../types";

interface WelcomeBannerProps {
  firstName: string;
  enrolledCourses: EnrolledCourse[];
}

export default function WelcomeBanner({ firstName, enrolledCourses }: WelcomeBannerProps) {
  return (
    <div className="relative p-[1.5px] rounded-2xl overflow-hidden">
      <span
        className="absolute inset-[-100%] animate-[spin_8s_linear_infinite] opacity-50"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 30%, hsl(156 70% 42% / 0.4) 50%, transparent 70%)",
        }}
      />
      <div className="relative rounded-2xl bg-surface border border-primary/10 p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-3 right-3 z-50">
          <NotificationBell />
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/40 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/40 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-2xl" />

        <div className="relative flex items-center gap-4">
          <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-darker via-primary to-emerald-dark flex items-center justify-center shadow-lg shadow-primary/40">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.15em] uppercase text-primary/70 mb-0.5">Welcome back</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {firstName}
              <span
                className="ml-2 font-medium text-xl sm:text-2xl"
                style={{
                  background: "linear-gradient(90deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                — Ready for your next lesson?
              </span>
            </h1>
          </div>
        </div>

        {enrolledCourses.length > 0 && (
          <div className="relative mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs text-white/60">
              You have{" "}
              <span className="font-bold text-primary">{enrolledCourses.length}</span>{" "}
              enrolled course{enrolledCourses.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
