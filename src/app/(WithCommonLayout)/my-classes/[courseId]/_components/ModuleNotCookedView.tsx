"use client";

import { Sparkles } from "lucide-react";
import DarkCard from "./DarkCard";

export default function ModuleNotCookedView() {
    return (
        <DarkCard className="p-10 sm:p-14 text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 text-center space-y-6 max-w-md mx-auto">
                <div className="w-20 h-20 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_hsl(156_70%_42%/0.3)]">
                    <Sparkles className="h-10 w-10 text-primary animate-pulse motion-reduce:animate-none" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Module Not Cooked Yet 🍳
                </h2>
                <p className="text-white/60 max-w-md mx-auto leading-relaxed">
                    This course is running, but modules are released day by day. This module hasn&apos;t been unlocked yet — check back soon!
                </p>
                <p className="text-sm text-white/40">
                    New content drops on a daily schedule. Stay tuned.
                </p>
            </div>
        </DarkCard>
    );
}
