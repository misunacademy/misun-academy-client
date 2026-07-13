"use client"

import Image from "next/image"
import type { UploadWithDataResult } from "./types"

interface UploadResultProps {
  result: UploadWithDataResult
}

export function UploadResult({ result }: UploadResultProps) {
  return (
    <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
      <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
        ✅ Upload Successful!
      </h3>

      <div className="space-y-4">
        <div className="relative w-full h-96 max-h-96">
          <Image
            src={result.image.url}
            alt={result.metadata.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-contain bg-gray-100 dark:bg-gray-700 rounded"
            unoptimized
          />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-white">Metadata:</h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
              <p className="text-gray-600 dark:text-gray-400">{result.metadata.title}</p>
            </div>
            {result.metadata.description && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                <p className="text-gray-600 dark:text-gray-400">{result.metadata.description}</p>
              </div>
            )}
            {result.metadata.category && (
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                <p className="text-gray-600 dark:text-gray-400 capitalize">{result.metadata.category}</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm">
          <h4 className="font-semibold text-gray-900 dark:text-white">Image Details:</h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">File Name:</span>
              <p className="text-gray-600 dark:text-gray-400">{result.image.fileName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Format:</span>
              <p className="text-gray-600 dark:text-gray-400">{result.image.format}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Dimensions:</span>
              <p className="text-gray-600 dark:text-gray-400">{result.image.width} × {result.image.height}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700 dark:text-gray-300">Size:</span>
              <p className="text-gray-600 dark:text-gray-400">{(result.image.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
