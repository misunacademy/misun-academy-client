"use client"

import { useState } from "react"
import { useFormContext, type RegisterOptions } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getFieldError, getFieldId, getErrorId, getDescriptionId } from "@/lib/forms/form-utils"

interface PasswordFieldProps {
  name: string
  label: string
  required?: boolean
  description?: string
  placeholder?: string
  className?: string
  rules?: RegisterOptions
  labelClassName?: string
}

export function PasswordField({
  name,
  label,
  required,
  description,
  placeholder = "••••••••",
  rules,
  labelClassName,
  className,
}: PasswordFieldProps) {
  const [show, setShow] = useState(false)
  const { register, formState: { errors } } = useFormContext()
  const error = getFieldError(errors, name)
  const fieldId = getFieldId(name)
  const errorId = getErrorId(name)
  const descriptionId = getDescriptionId(name)

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className={labelClassName}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={fieldId}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : null, description ? descriptionId : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={cn("pr-10", className, error && "border-destructive")}
          {...register(name, rules)}
        />
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
