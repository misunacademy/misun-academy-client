"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PosterHeaderProps {
  userName: string;
  courseTitle: string;
}

export default function PosterHeader({ userName, courseTitle }: PosterHeaderProps) {
  return (
    <Card className="mb-8 overflow-hidden border-primary/20 bg-surface-darker/80 shadow-[0_0_50px_hsl(156_70%_42%/0.08)] backdrop-blur-sm">
      <CardContent className="relative p-8 text-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Congratulations, {userName.split(" ")[0]}!
        </h1>
        <p className="text-white/75 max-w-2xl mx-auto">
          You have successfully enrolled in the{" "}
          <strong>{courseTitle || "Graphic Design with Freelancing"}</strong> course.
          Download your welcome poster below and share your new journey!
        </p>
      </CardContent>
    </Card>
  );
}
