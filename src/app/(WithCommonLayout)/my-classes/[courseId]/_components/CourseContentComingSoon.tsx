import { PlayCircle } from "lucide-react";
import DarkCard from "./DarkCard";

export default function CourseContentComingSoon() {
    return (
        <DarkCard className="p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
            <div className="relative text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 border border-primary/25 rounded-2xl flex items-center justify-center mx-auto">
                    <PlayCircle className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white">Content Coming Soon</h2>
                <p className="text-white/50 max-w-md mx-auto leading-relaxed">
                    The course content is being released gradually. New modules and lessons will be available soon.
                </p>
                <p className="text-sm text-white/30">Check back later or contact your instructor for more information.</p>
            </div>
        </DarkCard>
    );
}
