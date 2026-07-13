"use client"

import Image from "next/image"
import type { UploadFormData } from "./types"

interface UploadFormProps {
  preview: string | null
  formData: UploadFormData
  isLoading: boolean
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  onSubmit: (e: React.FormEvent) => void
  onClear: () => void
}

export function UploadForm({
  preview, formData, isLoading, fileInputRef,
  onFileChange, onInputChange, onSubmit, onClear,
}: UploadFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label htmlFor="image-upload-data" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Choose Image *
        </label>
        <input
          ref={fileInputRef}
          id="image-upload-data"
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={onFileChange}
          required
          className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-300 dark:hover:file:bg-blue-800"
        />
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">JPG, PNG, or WEBP (MAX. 5MB)</p>
      </div>

      {preview && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</label>
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <Image src={preview} alt="Preview" fill sizes="(max-width: 768px) 100vw, 400px" className="object-contain" unoptimized />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title *</label>
        <input id="title" name="title" type="text" value={formData.title} onChange={onInputChange} required
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter image title" />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={onInputChange} rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter image description (optional)" />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
        <select id="category" name="category" value={formData.category} onChange={onInputChange}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          <option value="profile">Profile Picture</option>
          <option value="course">Course Material</option>
          <option value="assignment">Assignment</option>
          <option value="certificate">Certificate</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={!preview || isLoading}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Uploading...
            </span>
          ) : (
            "Upload Image & Data"
          )}
        </button>

        {(preview) && (
          <button type="button" onClick={onClear} disabled={isLoading}
            className="px-6 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Clear
          </button>
        )}
      </div>
    </form>
  )
}
