import { EnrollmentStatus } from './enums';

export type { PaymentStatus } from './enums';
export {
    Role, UserStatus, BatchStatus, CourseStatus, CourseLevel,
    LessonType, SubmissionStatus, CertificateStatus, ProgressStatus, Status,
} from './enums';

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
}

export interface IEducationItem {
    degree: string;
    institution: string;
    passingYear: string;
    result?: string;
}

export interface IUserProfile {
    _id?: string;
    user?: {
        name?: string;
        email?: string;
        phone?: string;
        studentId?: string;
    };
    bio?: string;
    dateOfBirth?: string;
    address?: string;
    linkedinUrl?: string;
    currentJob?: string;
    company?: string;
    industry?: string;
    experience?: string;
    education?: IEducationItem[];
    wpnumber?: string;
}

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

export type ResourceType = 'document' | 'link' | 'download' | 'video' | 'image';

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

export interface Enrollment {
    _id?: string;
    userId: string;
    batchId: string;
    enrollmentId?: string;
    paymentId?: string;
    status: EnrollmentStatus;
    enrolledAt: Date;
    completedAt?: Date;
    certificateIssued: boolean;
    certificateId?: string;
    createdAt?: Date;
    updatedAt?: Date;
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
