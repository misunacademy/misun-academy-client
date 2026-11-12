import React from "react";
import { AlertCircle } from "lucide-react";
import AuthGuard from "@/components/shared/AuthGuard";

interface CoursePageLayoutProps {
  children: React.ReactNode;
}

export function CoursePageLayout({ children }: CoursePageLayoutProps) {
  return (
    <AuthGuard>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AuthGuard>
  );
}

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  const [error, setError] = React.useState<Error | null>(null);
  const [hasError, setHasError] = React.useState(false);

  if (hasError) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertCircle className="h-12 w-12 text-red-400 mb-3" />
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-white/40 text-sm mb-6">{error?.message ?? "An unexpected error occurred."}</p>
        <button
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-white/[0.08] hover:bg-white/[0.06] transition-colors"
          onClick={() => { setHasError(false); setError(null); }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return children;
}