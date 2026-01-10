'use client';

import { useState } from 'react';
import { ImageUploader } from '@/components/shared/ImageUploader';
import { MultiImageUploader } from '@/components/shared/MultiImageUploader';
import { ImageUploadWithData } from '@/components/shared/ImageUploadWithData';

type TabType = 'single' | 'multiple' | 'with-data';

export default function ImageUploadDemo() {
  const [activeTab, setActiveTab] = useState<TabType>('single');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Image Upload System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Complete demo of Cloudinary image upload integration
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('single')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors
                  ${
                    activeTab === 'single'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
              >
                Single Upload
              </button>
              <button
                onClick={() => setActiveTab('multiple')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors
                  ${
                    activeTab === 'multiple'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
              >
                Multiple Upload
              </button>
              <button
                onClick={() => setActiveTab('with-data')}
                className={`flex-1 py-4 px-6 text-center font-medium text-sm border-b-2 transition-colors
                  ${
                    activeTab === 'with-data'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                  }`}
              >
                Upload with Metadata
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'single' && (
              <div>
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Single Image Upload
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Upload one image at a time to Cloudinary. Perfect for profile pictures,
                    featured images, or any single image upload scenario.
                  </p>
                </div>
                <ImageUploader />
              </div>
            )}

            {activeTab === 'multiple' && (
              <div>
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Multiple Image Upload
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Upload up to 10 images at once. Ideal for galleries, photo albums,
                    or batch uploading course materials.
                  </p>
                </div>
                <MultiImageUploader />
              </div>
            )}

            {activeTab === 'with-data' && (
              <div>
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Upload with Metadata
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Upload an image along with additional metadata like title, description,
                    and category. Perfect for structured content management.
                  </p>
                </div>
                <ImageUploadWithData />
              </div>
            )}
          </div>
        </div>

        {/* Feature List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Features
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">File Validation</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Only JPG, PNG, and WEBP formats accepted (max 5MB)
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Image Preview</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  See your images before uploading
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Cloud Storage</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Images stored securely on Cloudinary
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Auto Optimization</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Images automatically resized to 1000×1000
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Metadata Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload images with titles, descriptions, categories
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <svg
                className="w-6 h-6 text-green-500 mr-3 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Delete Support</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Remove uploaded images from Cloudinary
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-300 mb-4">
            ⚙️ Setup Required
          </h2>
          <div className="space-y-3 text-sm text-yellow-800 dark:text-yellow-400">
            <p>Before using the upload system, make sure to:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Install dependencies: <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">npm install multer cloudinary multer-storage-cloudinary</code></li>
              <li>Create a Cloudinary account at <a href="https://cloudinary.com" target="_blank" rel="noopener noreferrer" className="underline">cloudinary.com</a></li>
              <li>Add Cloudinary credentials to your <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">.env</code> file:
                <pre className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded mt-2 overflow-x-auto">
{`CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret`}
                </pre>
              </li>
              <li>Start the server with <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">npm run dev</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
