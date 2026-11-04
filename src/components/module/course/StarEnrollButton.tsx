
"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarEnrollButtonProps {
  href?: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function StarEnrollButton({
  href,
  loading = false,
  disabled = false,
  className ="text-lg",
  children,
}: StarEnrollButtonProps) {
  const isLink = Boolean(href) && !loading && !disabled;

  const content = (
    <>
      {loading && (
        <Loader2
          className="h-4 w-4 animate-spin"
          aria-label="Loading"
        />
      )}
      <span>{loading ? "Loading..." : children}</span>
    </>
  );

  const sharedClasses = cn(
    "border-pulse-button",
    "relative inline-flex min-h-[44px] items-center justify-center gap-2",
    "rounded-[12px] border-2 px-6 py-3",
    "font-bangla text-sm font-bold tracking-wide text-white",
    "transition-colors duration-300",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-green-500 focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
    className
  );

  if (isLink && href) {
    return (
      <Link
        href={href}
        className={sharedClasses}
      >
        {content}
        <ArrowRight
          className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          aria-hidden="true"
        />
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={loading || disabled}
      aria-busy={loading}
      className={cn(
        sharedClasses,
        "disabled:cursor-not-allowed disabled:opacity-50"
      )}
    >
      {content}
    </button>
  );
}
