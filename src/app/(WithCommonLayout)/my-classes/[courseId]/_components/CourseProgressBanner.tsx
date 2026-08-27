import DarkCard from "./DarkCard";
import { TrendingUp } from "lucide-react";

export default function CourseProgressBanner({
    totalModules,
    totalLessons,
    completedLessonsCount,
    calculatedPercentage,
}: {
    totalModules: number;
    totalLessons: number;
    completedLessonsCount: number;
    calculatedPercentage: number;
}) {
    return (
        <DarkCard className="p-5">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-white/60">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            <span>{totalModules} modules • {totalLessons} lessons</span>
                        </div>
                        <span className="font-bold text-primary">{calculatedPercentage}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/8 overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${calculatedPercentage}%`,
                                background: "linear-gradient(90deg, hsl(156 70% 42%), hsl(156 85% 65%))",
                                boxShadow: calculatedPercentage > 0 ? "0 0 8px hsl(156 70% 42% / 0.6)" : "none",
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-white/35">
                        <span>{completedLessonsCount} of {totalLessons} completed</span>
                        <span>{totalLessons - completedLessonsCount} remaining</span>
                    </div>
                </div>
                <div className="hidden shrink-0 w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 sm:flex items-center justify-center gap-1">
                    <span className="text-xl font-black text-primary">{calculatedPercentage}</span>
                    <span className="text-[10px] text-white/40 font-medium">%</span>
                </div>
            </div>
        </DarkCard>
    );
}
