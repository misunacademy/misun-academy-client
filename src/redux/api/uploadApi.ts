import { baseApi } from "./baseApi";

export interface UploadSingleRequest {
  image: File;
}

export interface UploadMultipleRequest {
  images: File[];
}

export interface UploadWithDataRequest {
  image: File;
  title?: string;
  description?: string;
  category?: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
  fileName: string;
  format: string;
  width: number;
  height: number;
  size: number;
  uploadedAt: string;
}

export interface MultipleUploadResult {
  files: UploadResult[];
  totalFiles: number;
}

export interface UploadWithDataResult {
  image: UploadResult;
  metadata: {
    title: string;
    description: string;
    category: string;
  };
}

const uploadApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // Upload single image
    uploadSingleImage: build.mutation<{ data: UploadResult }, FormData>({
      query: (formData) => ({
        url: "/upload/single",
        method: "POST",
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
      }),
      invalidatesTags: ["Uploads"],
    }),

    // Upload multiple images
    uploadMultipleImages: build.mutation<{ data: MultipleUploadResult }, FormData>({
      query: (formData) => ({
        url: "/upload/multiple",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Uploads"],
    }),

    // Upload image with additional data
    uploadWithData: build.mutation<{ data: UploadWithDataResult }, FormData>({
      query: (formData) => ({
        url: "/upload/with-data",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Uploads"],
    }),

    // Delete image
    deleteImage: build.mutation<{ data: null }, string>({
      query: (publicId) => ({
        url: `/upload/${publicId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Uploads"],
    }),
  }),
});

export const {
  useUploadSingleImageMutation,
  useUploadMultipleImagesMutation,
  useUploadWithDataMutation,
  useDeleteImageMutation,
} = uploadApi;
