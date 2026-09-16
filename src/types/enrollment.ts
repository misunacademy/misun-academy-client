import type { EnrollmentStatus } from './enums';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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
