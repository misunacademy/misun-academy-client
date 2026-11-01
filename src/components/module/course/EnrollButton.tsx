"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { AnimatedBorder } from "@/components/shared/AnimatedBorder";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EnrollButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "href"> {
  /** Navigation target. When set, renders a link styled as a button (via shadcn `asChild`). */
  href?: string;
  loading?: boolean;
  className?: string;
}

export function EnrollButton({
  href,
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}: EnrollButtonProps) {
  const asChild = Boolean(href);

  const content = (
    <span className="relative flex items-center justify-center gap-2">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" aria-label="Loading" />
      ) : (
        <>
          {children}
          <ArrowRight
            className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </>
      )}
    </span>
  );

  const childElement = href ? (
    <Link href={href}>{content}</Link>
  ) : (
    content
  );

  const button = (
    <Button
      asChild={asChild}
      variant="default"
      size="lg"
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      className={cn(
        "relative z-10 overflow-hidden rounded-xl border border-primary/20",
        "bg-gradient-to-r from-primary to-primary-glow text-primary-foreground",
        "font-semibold font-bangla text-lg px-10 py-4 min-h-[44px]",
        "shadow-[0_0_20px_hsl(var(--primary)/0.35)]",
        "hover:bg-transparent hover:shadow-[0_0_36px_hsl(var(--primary)/0.6)] hover:-translate-y-0.5",
        "transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      {childElement}
    </Button>
  );

  return (
    <div className="relative inline-block overflow-hidden rounded-xl p-[1.5px] group">
      <AnimatedBorder variant="simple" speed="3s" />
      {button}
    </div>
  );
}
