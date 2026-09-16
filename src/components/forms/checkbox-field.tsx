"use client"

import { useFormContext, Controller } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { getFieldId, getErrorId } from "@/lib/forms/form-utils"

interface CheckboxFieldProps {
  name: string
  label: string
  description?: string
  disabled?: boolean
}

export function CheckboxField({
  name,
  label,
  description,
  disabled,
}: CheckboxFieldProps) {
  const { control, formState: { errors } } = useFormContext()
  const error = name.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, errors) as { message?: string } | undefined

  const fieldId = getFieldId(name)
  const errorId = getErrorId(name)

  return (
    <div className="space-y-2">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={fieldId}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
            />
            <Label htmlFor={fieldId} className="cursor-pointer font-normal">
              {label}
            </Label>
          </div>
        )}
      />
      {description && (
        <p className="text-sm text-muted-foreground pl-7">{description}</p>
      )}
      {error?.message && (
        <p id={errorId} className="text-sm font-medium text-destructive" role="alert">
          {error.message}
        </p>
      )}
    </div>
  )
}
