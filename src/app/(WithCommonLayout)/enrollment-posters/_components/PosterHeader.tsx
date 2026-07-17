"use client";

import { CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PosterHeaderProps {
  userName: string;
  courseTitle: string;
}

export default function PosterHeader({ userName, courseTitle }: PosterHeaderProps) {
  return (
    <Card className="mb-8 border-primary/20 bg-[#0a1610]/90 shadow-[0_0_50px_hsl(156_70%_42%/0.08)]">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-primary/15 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
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
