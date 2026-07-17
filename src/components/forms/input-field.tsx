"use client"

import { useFormContext, type RegisterOptions } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getFieldError, getFieldId, getErrorId, getDescriptionId } from "@/lib/forms/form-utils"

interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string
  label: string
  required?: boolean
  description?: string
  rules?: RegisterOptions
  labelClassName?: string
}

export function InputField({
  name,
  label,
  required,
  description,
  rules,
  labelClassName,
  className,
  ...props
}: InputFieldProps) {
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
      <Input
        id={fieldId}
        aria-invalid={!!error}
        aria-describedby={
          [error ? errorId : null, description ? descriptionId : null]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={cn(className, error && "border-destructive")}
        {...register(name, rules)}
        {...props}
      />
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
