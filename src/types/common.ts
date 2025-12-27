/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Student {
    _id: string;
    name: string;
    email: string;
    studentId: string;
    address: string;
    phone: string;
    paymentStatus: 'pending' | 'success' | 'failed';
    batch: object;
    createdAt?: unknown;
    updatedAt?: unknown;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export type PaymentStatus = 'pending' | 'success' | 'failed';

export interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export interface Lesson {
    lessonId: string;
    title: string;
    type: 'video' | 'reading' | 'quiz' | 'assignment' | 'project';
    duration?: number;
    isPreview?: boolean;
    content?: any;
    media?: {
        type: 'youtube' | 'gdrive' | 'video';
        url?: string;
        thumbnail?: string;
    };
}

export interface Module {
    moduleId: string;
    title: string;
    description?: string;
    order?: number;
    duration?: number;
    lessons: Lesson[];
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

export interface Enrollment {
  capacity?: number;
  currentEnrollment?: number;
  status?: 'open' | 'closed' | 'waitlist' | 'coming_soon';
  startDate?: Date;
  endDate?: Date;
  enrollmentDeadline?: Date;
  waitlistAvailable?: boolean;
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
  enrollment?: Enrollment;
  curriculum?: Module[];
  tags?: string[];
  thumbnailUrl?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;

  // UI-friendly/derived fields (kept for compatibility with the page)
  students?: number;
  price?: number;
  status?: 'active' | 'draft' | 'archived';
  categoryDisplay?: string;
  schedule?: string;

  // Dates used in the editor (kept as Date for the client)
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  courseStartDate?: Date;
  courseEndDate?: Date;
  enrollmentDeadline?: Date;
}