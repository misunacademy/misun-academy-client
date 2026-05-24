export interface EnrolledCourse {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  thumbnailImage: string;
  shortDescription: string;
  instructor: { name: string } | null;
  batchTitle: string;
  batchNumber: string;
  enrolledAt: string;
  status: string;
  isCertificateAvailable?: boolean;
  accessType?: "standard" | "special";
}
