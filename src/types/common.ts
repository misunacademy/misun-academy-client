
// Enums and Types from server (matching server-side enums)
export enum Role {
    LEARNER = 'learner',
    INSTRUCTOR = 'instructor',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
}

export enum UserStatus {
    Active = 'active',
    Suspended = 'suspended',
    Deleted = 'deleted',
}

export enum EnrollmentStatus {
    Pending = 'pending',
    PaymentPending = 'payment-pending',
    Active = 'active',
    Completed = 'completed',
    Suspended = 'suspended',
    Refunded = 'refunded',
    PaymentFailed = 'payment-failed',
}

export enum BatchStatus {
    Draft = 'draft',
    Upcoming = 'upcoming',
    Running = 'running',
    Completed = 'completed',
}

export enum CourseStatus {
    Draft = 'draft',
    Published = 'published',
    Archived = 'archived',
}

export enum CourseLevel {
    Beginner = 'beginner',
    Intermediate = 'intermediate',
    Advanced = 'advanced',
}

export enum LessonType {
    Video = 'video',
    Reading = 'reading',
    Quiz = 'quiz',
    Project = 'project',
}

export enum SubmissionStatus {
    Submitted = 'submitted',
    UnderReview = 'under-review',
    RevisionRequested = 'revision-requested',
    Approved = 'approved',
    Rejected = 'rejected',
}

export enum CertificateStatus {
    Active = 'active',
    Revoked = 'revoked',
}

export enum ProgressStatus {
    Locked = 'locked',
    Unlocked = 'unlocked',
    InProgress = 'in-progress',
    Completed = 'completed',
}

export enum Status {
    Pending = "pending",
    Success = "success",
    Failed = "failed",
    Review = "review",
    Risk = "risk",
    Cancel = "cancel",
    Completed = "completed"
}

// Auth/User Types
export interface IAuth {
    _id?: string;
    name: string;
    email: string;
    password?: string;
    role: Role;
    isActive: boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    emailVerified?: boolean;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ILogin {
    email: string;
    password: string;
}

export interface IRegister {
    name: string;
    email: string;
    password: string;
}

export interface IRefreshToken {
    refreshToken: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

// Student Types
export interface IStudent {
    _id?: string;
    name: string;
    email: string;
    studentId: string;
    address: string;
    phone: string;
    paymentStatus: Status;
    batch: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Batch Types
export interface IBatch {
    _id?: string;
    batchName: string;
    course: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    currentEnrollment: number;
    status: Status;
    createdAt?: Date;
    updatedAt?: Date;
}

// Payment Types
export interface IPayment {
    _id?: string;
    transactionId: string;
    studentId: string;
    courseId: string;
    batchId: string;
    amount: number;
    status: Status;
    method: "SSLCommerz" | "phonePay";
    gatewayResponse: Record<string, unknown>;
    createdAt?: Date;
    updatedAt?: Date;
}

// Course Enrollment Types
export interface ICourseEnrollment {
    _id?: string;
    student: string;
    course: string;
    batch: string;
    payment: string;
    status: Status;
    createdAt?: Date;
    updatedAt?: Date;
}

// Student Enrollment Types (EnrolledStudent)
export interface IEnrolledStudent {
    _id?: string;
    student: string;
    studentId: string;
    batch: string;
    course: string;
    payment: string;
    status: Status;
    createdAt?: Date;
    updatedAt?: Date;
}

// Profile Types
export interface IProfile {
    _id?: string;
    user: string;
    bio?: string;
    avatar?: string;
    socialLinks?: {
        linkedin?: string;
        github?: string;
        twitter?: string;
        website?: string;
    };
    skills?: string[];
    experience?: string;
    education?: string;
    certifications?: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

// Recording Types
export interface IRecording {
    _id?: string;
    title: string;
    description?: string;
    course: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration?: number;
    isPublished: boolean;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}

// Course Types
// export type LessonType = 'video' | 'reading'; // Removed duplicate declaration

export interface ILesson {
    lessonId: string;
    title: string;
    type: 'video' | 'reading' | 'quiz' | 'project';
    duration?: number;
    isPreview?: boolean;
    content?: Record<string, unknown> | string;
    media?: {
        type: 'youtube' | 'gdrive' | 'video';
        url: string;
        thumbnail?: string;
    };
    resources?: {
        title: string;
        type: 'link' | 'text';
        url?: string;
        textContent?: string;
    }[];
}

export interface IModule {
    moduleId: string;
    title: string;
    description?: string;
    order?: number;
    duration?: number;
    lessons?: ILesson[];
}

export type ResourceType = 'document' | 'link' | 'download' | 'video' | 'image';

export interface IResource {
    resourceId: string;
    title: string;
    type: ResourceType;
    url: string;
    description?: string;
    isDownloadable?: boolean;
}

export interface ICourse {
    _id?: string;
    title: string;
    slug: string;
    courseCode?: string;
    subtitle?: string;
    description?: string;
    shortDescription?: string;
    instructor?: {
        id?: string | string;
        name?: string;
        email?: string;
        avatarUrl?: string;
    };
    category?: string;
    subcategory?: string;
    level?: string;
    language?: string;
    duration?: {
        hours?: number;
        weeks?: number;
        hoursPerWeek?: number;
    };
    pricing?: {
        amount?: number;
        currency?: string;
        discountPrice?: number | null;
        discountExpiry?: Date | null;
    };
    enrollment?: Record<string, unknown>;
    curriculum?: IModule[];
    resources?: IResource[];
    tags?: string[];
    thumbnailUrl?: string;
    coverImageUrl?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    isCompleted?: boolean;
    createdBy?: string | string;
    updatedBy?: string | string;
    studentsCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// Legacy types for backward compatibility (keeping existing ones)
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
    type: 'video' | 'reading';
    duration?: number;
    isPreview?: boolean;
    content?: any;
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

export interface Resource {
    resourceId: string;
    title: string;
    type: 'document' | 'link' | 'download' | 'video' | 'image';
    url: string;
    description?: string;
    isDownloadable?: boolean;
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
    isCompleted?: boolean;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;

    // UI-friendly/derived fields (kept for compatibility with the page)
    students?: number;
    studentsCount?: number;
    price?: number;
    status?: 'draft' | 'published' | 'archived';
    categoryDisplay?: string;
    schedule?: string;

    // Dates used in the editor (kept as Date for the client)
    enrollmentStartDate?: Date;
    enrollmentEndDate?: Date;
    courseStartDate?: Date;
    courseEndDate?: Date;
    enrollmentDeadline?: Date;
}
