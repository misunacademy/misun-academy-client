"use client";

import Link from "next/link";
import { CheckCircle, Trophy, Sparkles } from "lucide-react";
import DarkCard from "./DarkCard";
import PrimaryBtn from "./PrimaryBtn";

interface CourseCompletedViewProps {
    courseTitle: string;
    calculatedPercentage: number;
    onDismiss: () => void;
}

export function CourseCompletedView({ courseTitle, calculatedPercentage, onDismiss }: CourseCompletedViewProps) {
    return (
        <DarkCard className="p-10 sm:p-16 text-center flex flex-col items-center justify-center min-h-[500px]">
            <button
                className="absolute top-4 right-4 p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/8 transition-all z-20"
                onClick={onDismiss}
            >
                <CheckCircle className="h-4 w-4" />
            </button>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 text-center space-y-6 max-w-md mx-auto">
                <div className="w-24 h-24 bg-primary/20 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_hsl(156_70%_42%/0.4)]">
                    <Trophy className="h-12 w-12 text-primary animate-bounce" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                        Course Complete! 🎉
                    </h2>
                    <p className="text-lg text-white/60">{courseTitle}</p>
                </div>
                <div className="text-sm text-white/40 space-y-1">
                    <p>Final progress: <span className="text-primary font-semibold">{calculatedPercentage}%</span></p>
                    <p>Completed on {new Date().toLocaleDateString()}</p>
                </div>
                <Link href="/my-classes/certificates" className="mt-6 block">
                    <PrimaryBtn className="w-full sm:w-auto">
                        <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
                        Get Your Certificate
                    </PrimaryBtn>
                </Link>
            </div>
        </DarkCard>
    );
}
