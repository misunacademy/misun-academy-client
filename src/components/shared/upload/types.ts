export interface UploadImageInfo {
  url: string
  fileName: string
  format: string
  width: number
  height: number
  size: number
}

export interface UploadMetadata {
  title: string
  description?: string
  category?: string
}

export interface UploadWithDataResult {
  image: UploadImageInfo
  metadata: UploadMetadata
}

export interface UploadFormData {
  title: string
  description: string
  category: string
}
