/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import { useUploadSingleImageMutation } from '@/redux/api/uploadApi';
import { toast } from 'sonner';

export function ImageUploader() {
  const [uploadImage, { isLoading }] = useUploadSingleImageMutation();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPG, PNG, and WEBP are allowed.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      const result = await uploadImage(formData).unwrap();
      
      setUploadedImage(result.data);
      toast.success('Image uploaded successfully!');
      
      // Clear preview after successful upload
      // setPreview(null);
      // fileInputRef.current!.value = '';
    } catch (error: any) {
      toast.error(error?.data?.message || 'Upload failed');
      console.error('Upload error:', error);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Image Upload
        </h2>

        {/* File Input */}
        <div className="mb-6">
          <label
            htmlFor="image-upload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Choose Image
          </label>
          <input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview
            </label>
            <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
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
              'Upload Image'
            )}
          </button>
          
          {(preview || uploadedImage) && (
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="px-6 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Upload Result */}
        {uploadedImage && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
              ✅ Upload Successful!
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">Image URL:</span>
                <a
                  href={uploadedImage.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                >
                  {uploadedImage.url}
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">File Name:</span>
                  <p className="text-gray-600 dark:text-gray-400">{uploadedImage.fileName}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Format:</span>
                  <p className="text-gray-600 dark:text-gray-400">{uploadedImage.format}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Dimensions:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {uploadedImage.width} × {uploadedImage.height}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Size:</span>
                  <p className="text-gray-600 dark:text-gray-400">
                    {(uploadedImage.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
            </div>

            {/* Uploaded Image Display */}
            <div className="mt-4">
              <span className="font-medium text-gray-700 dark:text-gray-300 block mb-2">
                Uploaded Image:
              </span>
              <img
                src={uploadedImage.url}
                alt="Uploaded"
                className="w-full max-h-96 object-contain bg-gray-100 dark:bg-gray-700 rounded"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
