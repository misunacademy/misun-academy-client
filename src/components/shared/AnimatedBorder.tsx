import { type ComponentPropsWithoutRef } from "react";

type Variant = "branded" | "simple" | "accent" | "success-story" | "course-card" | "multi-color" | "blue-branded" | "blue-accent";
type Direction = "from-0" | "from-180";

interface AnimatedBorderProps extends ComponentPropsWithoutRef<"span"> {
  speed?: string;
  variant?: Variant;
  reverse?: boolean;
  delay?: string;
  direction?: Direction;
}

const gradients: Record<Variant, string> = {
  branded:
    "conic-gradient(from 90deg at 50% 50%, transparent 0%, hsl(156 70% 42%) 25%, hsl(156 85% 70%) 50%, hsl(156 70% 42%) 75%, transparent 100%)",
  simple:
    "conic-gradient(from 0deg, transparent 60%, hsl(156 70% 42%) 100%)",
  accent:
    "conic-gradient(from 0deg, transparent 35%, hsl(156 100% 60%) 50%, transparent 65%)",
  "success-story":
    "conic-gradient(from 0deg, transparent 0%, transparent 30%, hsl(156 70% 42% / 0.5) 44%, hsl(156 80% 65%) 52%, hsl(156 70% 42% / 0.4) 60%, transparent 75%)",
  "course-card":
    "conic-gradient(from 0deg, transparent 20%, hsl(156 70% 42% / 0.5) 38%, hsl(156 80% 60%) 50%, hsl(156 70% 42% / 0.5) 62%, transparent 80%)",
  "multi-color":
    "conic-gradient(from 0deg, transparent 0%, transparent 22%, hsl(156 60% 35% / 0.4) 34%, hsl(156 75% 52%) 44%, hsl(156 90% 72%) 50%, hsl(0 0% 100% / 0.9) 53%, hsl(156 90% 72%) 56%, hsl(156 75% 52%) 62%, hsl(156 60% 35% / 0.3) 74%, transparent 84%)",
  "blue-branded":
    "conic-gradient(from 90deg at 50% 50%, transparent 0%, hsl(217 91% 60%) 25%, hsl(217 80% 58%) 50%, hsl(217 91% 60%) 75%, transparent 100%)",
  "blue-accent":
    "conic-gradient(from 0deg at 50% 50%, transparent 0%, transparent 40%, hsl(217 91% 60% / 0.4) 50%, transparent 60%, transparent 100%)",
};

const directionOverrides: Record<Direction, string> = {
  "from-0": "conic-gradient(from 0deg, transparent 60%, hsl(156 70% 42%) 100%)",
  "from-180": "conic-gradient(from 180deg, transparent 60%, hsl(156 70% 42%) 100%)",
};

export function AnimatedBorder({
  speed = "3s",
  variant = "branded",
  reverse = false,
  delay = "0s",
  direction,
  style,
  ...props
}: AnimatedBorderProps) {
  const bg = direction ? directionOverrides[direction] : gradients[variant];
  return (
    <span
      {...props}
      aria-hidden="true"
      style={{
        ...style,
        background: bg,
        animation: `spin ${speed} linear infinite${reverse ? " reverse" : ""}`,
        animationDelay: delay,
      }}
      className={`absolute inset-[-100%] ${props.className ?? ""}`}
    />
  );
}
