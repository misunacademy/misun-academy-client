"use client"

import { useRef, type ChangeEvent } from "react"
import Image from "next/image"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Upload } from "lucide-react"
import { getFieldError, getFieldId, getErrorId, getDescriptionId } from "@/lib/forms/form-utils"

interface FileUploadFieldProps {
  name: string
  label: string
  accept?: string
  maxSizeMB?: number
  description?: string
  required?: boolean
  previewUrl?: string
  isUploading?: boolean
  onFileSelect: (file: File) => void
  onUpload: () => void
  selectedFile?: File | null
}

export function FileUploadField({
  name,
  label,
  accept = "image/jpeg,image/png,image/webp,image/jpg",
  maxSizeMB = 5,
  description,
  required,
  previewUrl,
  isUploading,
  onFileSelect,
  onUpload,
  selectedFile,
}: FileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { register, formState: { errors } } = useFormContext()
  const error = getFieldError(errors, name)
  const fieldId = getFieldId(name)
  const errorId = getErrorId(name)
  const descriptionId = getDescriptionId(name)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > maxSizeMB * 1024 * 1024) {
      return
    }

    onFileSelect(file)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            id={fieldId}
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleChange}
            aria-invalid={!!error}
            aria-describedby={
              [error ? errorId : null, description ? descriptionId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={error ? "border-destructive" : ""}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isUploading || !selectedFile}
            onClick={onUpload}
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="h-4 w-4" /> Upload
              </span>
            )}
          </Button>
        </div>
        <input type="hidden" {...register(name)} />
        {previewUrl && (
          <div className="relative h-32 w-full rounded-md border overflow-hidden">
            <Image
              src={previewUrl}
              alt={`${label} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-cover"
              unoptimized
            />
          </div>
        )}
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
