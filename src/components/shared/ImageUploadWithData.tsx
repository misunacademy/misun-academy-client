"use client"

import { useState } from "react"
import { useUploadWithDataMutation } from "@/redux/api/uploadApi"
import { toast } from "sonner"
import { UploadForm, UploadResult } from "./upload"
import type { UploadWithDataResult } from "./upload"

export type { UploadWithDataResult }

export function ImageUploadWithData() {
  const [uploadWithData, { isLoading }] = useUploadWithDataMutation()
  const [uploadedResult, setUploadedResult] = useState<UploadWithDataResult | null>(null)

  const handleSubmit = async (data: { title: string; description?: string; category?: string }, file: File) => {
    setUploadedResult(null)

    const formData = new FormData()
    formData.append("image", file)
    formData.append("title", data.title)
    formData.append("description", data.description || "")
    formData.append("category", data.category || "")

    try {
      const result = await uploadWithData(formData).unwrap()
      setUploadedResult(result.data as UploadWithDataResult)
      toast.success("Image and data uploaded successfully!")
    } catch (error: unknown) {
      const apiError = error as { data?: { message?: string } }
      toast.error(apiError?.data?.message || "Upload failed")
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Upload Image with Metadata
        </h2>

        <UploadForm isLoading={isLoading} onSubmit={handleSubmit} />

        {uploadedResult && <UploadResult result={uploadedResult} />}
      </div>
    </div>
  )
}
