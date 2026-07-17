export enum Role {
    LEARNER = 'learner',
    INSTRUCTOR = 'instructor',
    ADMIN = 'admin',
    SUPERADMIN = 'superadmin',
    EMPLOYEE = 'employee',
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

export type PaymentStatus = 'pending' | 'success' | 'failed';
