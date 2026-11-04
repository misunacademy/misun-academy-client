"use client";

import { useEffect } from "react";
import OutlineBtn from "./_components/OutlineBtn";
import DarkCard from "./_components/DarkCard";

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log error to monitoring if available
  }, [error]);

  return (
    <DarkCard className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-white/40 text-sm mb-6">{error?.message ?? "An unexpected error occurred."}</p>
      <OutlineBtn className="w-full justify-center py-2.5" onClick={reset}>
        Try Again
      </OutlineBtn>
    </DarkCard>
  );
}
