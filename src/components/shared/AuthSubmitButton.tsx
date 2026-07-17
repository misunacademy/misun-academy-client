"use client"

import { type ReactNode } from "react"
import { useFormContext } from "react-hook-form"
import { AnimatedBorder } from "@/components/shared/AnimatedBorder"

interface AuthSubmitButtonProps {
  children: ReactNode
  loadingText: string
  className?: string
  buttonClassName?: string
}

export function AuthSubmitButton({
  children,
  loadingText,
  className,
  buttonClassName,
}: AuthSubmitButtonProps) {
  const { formState: { isSubmitting } } = useFormContext()

  return (
    <div
      className={`relative p-[2px] rounded-xl overflow-hidden ${isSubmitting ? "opacity-60" : ""} ${className || ""}`}
    >
      <AnimatedBorder variant="accent" speed="2s" />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`relative w-full bg-gradient-to-r from-emerald-darker via-primary to-emerald-dark hover:from-emerald-deep hover:via-emerald-bright hover:to-emerald-deep transition-all duration-300 text-white font-bold py-3.5 rounded-xl text-base disabled:cursor-not-allowed disabled:bg-primary/50 disabled:hover:bg-primary/50 ${buttonClassName || ""}`}
      >
        {isSubmitting ? loadingText : children}
      </button>
    </div>
  )
}
