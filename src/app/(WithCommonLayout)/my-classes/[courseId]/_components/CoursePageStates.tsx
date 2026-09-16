import { Loader2, AlertTriangle, ChevronLeft } from "lucide-react";
import Link from "next/link";
import OutlineBtn from "./OutlineBtn";

export function LoadingState() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#0a0f18] to-surface">
            <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
            />
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-white/40 text-sm">Loading your course…</p>
        </div>
    );
}

export function CourseNotFound() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center gap-6 px-4 bg-gradient-to-b from-[#0a0f18] to-surface">
            <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
                <p className="text-white/40 mb-6 max-w-sm">The course you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.</p>
            </div>
            <Link href="/my-classes">
                <OutlineBtn>
                    <ChevronLeft className="h-4 w-4" />
                    Back to My Classes
                </OutlineBtn>
            </Link>
        </div>
    );
}
