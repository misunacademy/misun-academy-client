"use client"

import { useFormContext, Controller } from "react-hook-form"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getFieldId, getErrorId, getDescriptionId } from "@/lib/forms/form-utils"

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  name: string
  label: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
  description?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
  labelClassName?: string
}

export function SelectField({
  name,
  label,
  options,
  placeholder = "Select...",
  required,
  description,
  disabled,
  onValueChange,
  labelClassName,
}: SelectFieldProps) {
  const { control, watch, formState: { errors } } = useFormContext()
  const watchedValue = watch(name)

  const error = name.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, errors) as { message?: string } | undefined

  const fieldId = getFieldId(name)
  const errorId = getErrorId(name)
  const descriptionId = getDescriptionId(name)

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className={labelClassName}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            key={`${name}:${watchedValue ?? ""}`}
            onValueChange={(value) => {
              field.onChange(value)
              onValueChange?.(value)
            }}
            value={watchedValue || ""}
            disabled={disabled}
          >
            <SelectTrigger
              id={fieldId}
              aria-invalid={!!error}
              aria-describedby={
                [error ? errorId : null, description ? descriptionId : null]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              className={cn(error && "border-destructive")}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {error?.message && (
        <p id={errorId} className="text-sm font-medium text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}
