"use client"

import { useState, useRef } from "react"
import { useUploadWithDataMutation } from "@/redux/api/uploadApi"
import { toast } from "sonner"
import { UploadForm, UploadResult } from "./upload"
import type { UploadWithDataResult, UploadFormData } from "./upload"

export type { UploadWithDataResult, UploadFormData }

const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
const MAX_SIZE = 5 * 1024 * 1024

export function ImageUploadWithData() {
  const [uploadWithData, { isLoading }] = useUploadWithDataMutation()
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadedResult, setUploadedResult] = useState<UploadWithDataResult | null>(null)
  const [formData, setFormData] = useState<UploadFormData>({
    title: "",
    description: "",
    category: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!VALID_TYPES.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, and WEBP are allowed.")
      return
    }

    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 5MB.")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const file = fileInputRef.current?.files?.[0]
    if (!file) { toast.error("Please select a file first"); return }
    if (!formData.title.trim()) { toast.error("Please enter a title"); return }

    try {
      const data = new FormData()
      data.append("image", file)
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("category", formData.category)

      const result = await uploadWithData(data).unwrap()
      setUploadedResult(result.data as UploadWithDataResult)
      toast.success("Image and data uploaded successfully!")
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || "Upload failed")
    }
  }

  const handleClear = () => {
    setPreview(null)
    setUploadedResult(null)
    setFormData({ title: "", description: "", category: "" })
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Upload Image with Metadata
        </h2>

        <UploadForm
          preview={preview}
          formData={formData}
          isLoading={isLoading}
          fileInputRef={fileInputRef}
          onFileChange={handleFileChange}
          onInputChange={handleInputChange}
          onSubmit={handleUpload}
          onClear={handleClear}
        />

        {uploadedResult && <UploadResult result={uploadedResult} />}
      </div>
    </div>
  )
}
