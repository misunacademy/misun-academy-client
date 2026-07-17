type ResourceType = 'document' | 'link' | 'download' | 'video' | 'image';

export interface Lesson {
  lessonId: string;
  title: string;
  type: 'video' | 'reading';
  duration?: number;
  isPreview?: boolean;
  content?: Record<string, unknown> | string;
  media?: {
    type: 'youtube' | 'gdrive' | 'video';
    url?: string;
    thumbnail?: string;
  };
  resources?: {
    title: string;
    type: 'link' | 'text';
    url?: string;
    textContent?: string;
  }[];
}

export interface Module {
  moduleId: string;
  title: string;
  description?: string;
  order?: number;
  duration?: number;
  lessons: Lesson[];
}

export interface Resource {
  resourceId: string;
  title: string;
  type: ResourceType;
  url: string;
  description?: string;
  isDownloadable?: boolean;
}

export interface Duration {
  hours?: number;
  weeks?: number;
  hoursPerWeek?: number;
}

export interface Pricing {
  amount?: number;
  currency?: string;
  discountPrice?: number | null;
  discountExpiry?: Date | null;
}

export interface Instructor {
  id?: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
}

export interface Course {
  _id?: string | number;
  title: string;
  slug?: string;
  courseCode?: string;
  subtitle?: string;
  description?: string;
  shortDescription?: string;
  instructor?: Instructor | string;
  category?: string;
  subcategory?: string;
  level?: string;
  language?: string;
  duration?: Duration | string;
  pricing?: Pricing;
  enrollment?: import('./enrollment').Enrollment;
  curriculum?: Module[];
  resources?: Resource[];
  tags?: string[];
  thumbnailUrl?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  isCertificateAvailable?: boolean;
  isCompleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  students?: number;
  studentsCount?: number;
  price?: number;
  status?: 'draft' | 'published' | 'archived';
  categoryDisplay?: string;
  schedule?: string;
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  courseStartDate?: Date;
  courseEndDate?: Date;
  enrollmentDeadline?: Date;
}
