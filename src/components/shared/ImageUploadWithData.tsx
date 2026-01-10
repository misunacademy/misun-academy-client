/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import { useUploadWithDataMutation } from '@/redux/api/uploadApi';
import { toast } from 'sonner';

export function ImageUploadWithData() {
  const [uploadWithData, { isLoading }] = useUploadWithDataMutation();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedResult, setUploadedResult] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const data = new FormData();
      data.append('image', file);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);

      const result = await uploadWithData(data).unwrap();
      
      setUploadedResult(result.data);
      toast.success('Image and data uploaded successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Upload failed');
      console.error('Upload error:', error);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUploadedResult(null);
    setFormData({ title: '', description: '', category: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Upload Image with Metadata
        </h2>

        <form onSubmit={handleUpload} className="space-y-6">
          {/* File Input */}
          <div>
            <label
              htmlFor="image-upload-data"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Choose Image *
            </label>
            <input
              ref={fileInputRef}
              id="image-upload-data"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              required
              className="block w-full text-sm text-gray-500 dark:text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100
                dark:file:bg-blue-900 dark:file:text-blue-300
                dark:hover:file:bg-blue-800"
            />
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              JPG, PNG, or WEBP (MAX. 5MB)
            </p>
          </div>

          {/* Preview */}
          {preview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preview
              </label>
              <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter image title"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter image description (optional)"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              <option value="profile">Profile Picture</option>
              <option value="course">Course Material</option>
              <option value="assignment">Assignment</option>
              <option value="certificate">Certificate</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={!preview || isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                'Upload Image & Data'
              )}
            </button>

            {(preview || uploadedResult) && (
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading}
                className="px-6 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Upload Result */}
        {uploadedResult && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
              ✅ Upload Successful!
            </h3>

            <div className="space-y-4">
              {/* Uploaded Image */}
              <div>
                <img
                  src={uploadedResult.image.url}
                  alt={uploadedResult.metadata.title}
                  className="w-full max-h-96 object-contain bg-gray-100 dark:bg-gray-700 rounded"
                />
              </div>

              {/* Metadata */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white">Metadata:</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Title:</span>
                    <p className="text-gray-600 dark:text-gray-400">{uploadedResult.metadata.title}</p>
                  </div>
                  {uploadedResult.metadata.description && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Description:</span>
                      <p className="text-gray-600 dark:text-gray-400">{uploadedResult.metadata.description}</p>
                    </div>
                  )}
                  {uploadedResult.metadata.category && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">Category:</span>
                      <p className="text-gray-600 dark:text-gray-400 capitalize">{uploadedResult.metadata.category}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Details */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg space-y-2 text-sm">
                <h4 className="font-semibold text-gray-900 dark:text-white">Image Details:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">File Name:</span>
                    <p className="text-gray-600 dark:text-gray-400">{uploadedResult.image.fileName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Format:</span>
                    <p className="text-gray-600 dark:text-gray-400">{uploadedResult.image.format}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Dimensions:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {uploadedResult.image.width} × {uploadedResult.image.height}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Size:</span>
                    <p className="text-gray-600 dark:text-gray-400">
                      {(uploadedResult.image.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
