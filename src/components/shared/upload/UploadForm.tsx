"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form } from "@/components/ui/form"
import { InputField, TextareaField, SelectField, SubmitButton } from "@/components/forms"

const uploadSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
})

type UploadFormValues = z.infer<typeof uploadSchema>

interface UploadFormProps {
  isLoading: boolean
  onSubmit: (data: UploadFormValues, file: File) => Promise<void>
}

const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024

export function UploadForm({ isLoading, onSubmit }: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: { title: "", description: "", category: "" },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileError(null)

    if (!VALID_TYPES.includes(file.type)) {
      setFileError("Invalid file type. Only JPG, PNG, and WEBP are allowed.")
      return
    }

    if (file.size > MAX_SIZE) {
      setFileError("File too large. Maximum size is 5MB.")
      return
    }

    setSelectedFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleFormSubmit = (data: UploadFormValues) => {
    if (!selectedFile) {
      setFileError("Please select a file first")
      return
    }
    return onSubmit(data, selectedFile)
  }

  const handleClear = () => {
    setSelectedFile(null)
    setPreview(null)
    setFileError(null)
    form.reset()
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="image-upload-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Choose Image *
          </label>
          <input
            ref={fileInputRef}
            id="image-upload-data"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">JPG, PNG, or WEBP (MAX. 5MB)</p>
          {fileError && (
            <p className="mt-1 text-sm font-medium text-destructive" role="alert">{fileError}</p>
          )}
        </div>

        {preview && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</label>
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <Image src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 400px" className="object-contain" unoptimized />
            </div>
          </div>
        )}

        <InputField name="title" label="Title" required placeholder="Enter image title" />
        <TextareaField name="description" label="Description" placeholder="Enter image description (optional)" rows={4} className="resize-none" />

        <SelectField
          name="category"
          label="Category"
          placeholder="Select a category"
          options={[
            { value: "profile", label: "Profile Picture" },
            { value: "course", label: "Course Material" },
            { value: "assignment", label: "Assignment" },
            { value: "certificate", label: "Certificate" },
            { value: "other", label: "Other" },
          ]}
        />

        <div className="flex gap-4">
          <SubmitButton loadingText="Uploading...">Upload Image & Data</SubmitButton>

          {preview && (
            <button type="button" onClick={handleClear} disabled={isLoading}
              className="px-6 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </Form>
  )
}
