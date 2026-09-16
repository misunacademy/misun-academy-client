import { Clock, BookOpen, Users, CheckCircle } from "lucide-react";
import DarkCard from "./DarkCard";

export default function CourseOverviewTab({
    description,
    duration,
    totalLessons,
    instructorName,
    calculatedPercentage,
}: {
    description?: string;
    duration?: unknown;
    totalLessons: number;
    instructorName: string;
    calculatedPercentage: number;
}) {
    const durationText = duration
        ? typeof duration === "object"
            ? `${(duration as { weeks?: number }).weeks || 0} weeks, ${(duration as { hours?: number }).hours || 0} hours`
            : String(duration)
        : "TBD";

    return (
        <div className="mt-4 space-y-4">
            <DarkCard className="p-5">
                <h3 className="font-bold text-white mb-3">About This Course</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-4">{description}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                        { icon: <Clock className="h-4 w-4 text-primary" />, text: durationText },
                        { icon: <BookOpen className="h-4 w-4 text-primary" />, text: `${totalLessons} Lessons` },
                        { icon: <Users className="h-4 w-4 text-primary" />, text: `By ${instructorName}` },
                        { icon: <CheckCircle className="h-4 w-4 text-primary" />, text: `${calculatedPercentage}% Complete` },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-2 text-white/50 bg-white/[0.02] rounded-xl px-3 py-2 border border-white/[0.04]"
                        >
                            {item.icon}
                            <span className="truncate">{item.text}</span>
                        </div>
                    ))}
                </div>
            </DarkCard>

            <DarkCard className="p-5">
                <div className="flex items-start gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                        <span className="text-amber-400 text-sm font-bold">©</span>
                    </div>
                    <div>
                        <p className="font-semibold text-amber-400 text-sm mb-1">Copyright Notice</p>
                        <p className="text-xs text-white/40 leading-relaxed">
                            This course content is protected by copyright. Unauthorized distribution, reproduction, or sharing of
                            course materials is strictly prohibited and may result in legal action. All rights reserved.
                        </p>
                    </div>
                </div>
            </DarkCard>
        </div>
    );
}
