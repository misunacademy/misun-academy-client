/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef } from 'react';
import { useUploadMultipleImagesMutation, useDeleteImageMutation } from '@/redux/api/uploadApi';
import { toast } from 'sonner';

export function MultiImageUploader() {
  const [uploadImages, { isLoading }] = useUploadMultipleImagesMutation();
  const [deleteImage] = useDeleteImageMutation();
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate max 10 files
    if (files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;
    const newPreviews: string[] = [];

    // Validate all files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name}: Invalid file type`);
        return;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name}: File too large (MAX 5MB)`);
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(newPreviews);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      toast.error('Please select files first');
      return;
    }

    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const result = await uploadImages(formData).unwrap();
      
      setUploadedImages(result.data.files);
      toast.success(`${result.data.totalFiles} images uploaded successfully!`);
    } catch (error: any) {
      toast.error(error?.data?.message || 'Upload failed');
      console.error('Upload error:', error);
    }
  };

  const handleDelete = async (publicId: string, index: number) => {
    try {
      await deleteImage(publicId).unwrap();
      setUploadedImages((prev) => prev.filter((_, i) => i !== index));
      toast.success('Image deleted successfully!');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Delete failed');
      console.error('Delete error:', error);
    }
  };

  const handleClear = () => {
    setPreviews([]);
    setUploadedImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Multiple Image Upload
        </h2>

        {/* File Input */}
        <div className="mb-6">
          <label
            htmlFor="multi-image-upload"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Choose Images (Max 10)
          </label>
          <input
            ref={fileInputRef}
            id="multi-image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
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
            JPG, PNG, or WEBP (MAX. 5MB each, 10 files total)
          </p>
        </div>

        {/* Previews Grid */}
        {previews.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Preview ({previews.length} {previews.length === 1 ? 'image' : 'images'})
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleUpload}
            disabled={previews.length === 0 || isLoading}
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
              `Upload ${previews.length} Image${previews.length === 1 ? '' : 's'}`
            )}
          </button>

          {(previews.length > 0 || uploadedImages.length > 0) && (
            <button
              onClick={handleClear}
              disabled={isLoading}
              className="px-6 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Upload Results */}
        {uploadedImages.length > 0 && (
          <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-3">
              ✅ {uploadedImages.length} Image{uploadedImages.length === 1 ? '' : 's'} Uploaded!
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uploadedImages.map((image, index) => (
                <div
                  key={image.publicId}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
                    <img
                      src={image.url}
                      alt={image.fileName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {image.fileName}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {image.format.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                      <span>{image.width} × {image.height}</span>
                      <span>{(image.size / 1024).toFixed(2)} KB</span>
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(image.publicId, index)}
                    className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Delete Image
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
