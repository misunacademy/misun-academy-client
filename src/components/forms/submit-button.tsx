"use client"

import { type ReactNode } from "react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SubmitButtonProps {
  children: ReactNode
  loadingText?: string
  disabled?: boolean
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function SubmitButton({
  children,
  loadingText,
  disabled,
  className,
  variant = "default",
}: SubmitButtonProps) {
  const { formState: { isSubmitting } } = useFormContext()

  const isLoading = isSubmitting
  const isDisabled = disabled || isLoading

  return (
    <Button type="submit" disabled={isDisabled} className={className} variant={variant}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading && loadingText ? loadingText : children}
    </Button>
  )
}
