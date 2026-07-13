"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import AuthGuard from "@/components/shared/AuthGuard";
import PageBackground from "@/components/shared/PageBackground";
import { normalizeStatus } from "@/components/shared/CertificateStatusBadge";
import { useGetMyCertificatesQuery, useRequestCertificateMutation, type CertificateResponse } from "@/redux/api/certificateApi";
import { useGetEnrollmentsQuery, type EnrollmentResponse } from "@/redux/api/enrollmentApi";
import CertificateStatsCards from "./_components/CertificateStatsCards";
import CertificateRequestList from "./_components/CertificateRequestList";
import CertificateHistoryList from "./_components/CertificateHistoryList";

const getEnrollmentId = (certificate: CertificateResponse) =>
  typeof certificate.enrollmentId === "string"
    ? certificate.enrollmentId
    : (certificate.enrollmentId as unknown as { _id?: string })?._id || "";

const getCourseTitle = (certificate: CertificateResponse) => {
  if (certificate.course?.title) return certificate.course.title;
  const batch = certificate.batchId as unknown as { courseId?: { title?: string } };
  return batch?.courseId?.title || "Course";
};

const getBatchTitle = (certificate: CertificateResponse) => {
  if (certificate.batch?.title) return certificate.batch.title;
  return (certificate.batchId as unknown as { title?: string })?.title || "Batch";
};

export default function MyClassesCertificatesPage() {
  const { data, isLoading, refetch } = useGetMyCertificatesQuery();
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery();
  const [requestCertificate, { isLoading: isRequesting }] = useRequestCertificateMutation();

  const certificates = data?.data || [];
  const enrollments = (enrollmentsData?.data || []) as (EnrollmentResponse & { isCertificateAvailable?: boolean })[];

  const certificateByEnrollment = new Set(
    certificates.map((c) => getEnrollmentId(c)).filter(Boolean)
  );

  const requestableEnrollments = enrollments.filter((enrollment) => {
    const enrollmentId = enrollment._id;
    const completed = (enrollment.status === "completed" || enrollment.status === "active") && enrollment.accessType !== "special";
    const missingCertificate = !certificateByEnrollment.has(enrollmentId);
    const certificateAllowed = enrollment.isCertificateAvailable !== false;
    return completed && missingCertificate && certificateAllowed;
  });

  const pendingCount = certificates.filter((c) => normalizeStatus(c.status) === "pending").length;
  const approvedCount = certificates.filter((c) => normalizeStatus(c.status) === "approved").length;
  const rejectedCount = certificates.filter((c) => normalizeStatus(c.status) === "rejected").length;

  const handleRequestCertificate = async (enrollmentId: string) => {
    try {
      await requestCertificate(enrollmentId).unwrap();
      toast.success("Certificate request submitted. Awaiting admin approval.");
      refetch();
    } catch (error: unknown) {
      const message =
        typeof error === "object" && error !== null && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : undefined;
      toast.error(message || "Failed to request certificate");
    }
  };

  if (isLoading || isEnrollmentsLoading) {
    return (
      <AuthGuard>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PageBackground>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-white">My Certificates</h1>
              <p className="text-white/50">Request, track, and verify your certificates.</p>
            </div>
            <Button
              asChild
              variant="outline"
              className="border-white/15 bg-white/[0.02] text-white/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40"
            >
              <Link href="/my-classes">
                <ChevronLeft className="h-4 w-4 mr-1" />
                My Classes
              </Link>
            </Button>
          </div>

          <CertificateStatsCards pendingCount={pendingCount} approvedCount={approvedCount} rejectedCount={rejectedCount} />

          <CertificateRequestList requestableEnrollments={requestableEnrollments} isRequesting={isRequesting} onRequest={handleRequestCertificate} />

          <CertificateHistoryList certificates={certificates} getCourseTitle={getCourseTitle} getBatchTitle={getBatchTitle} />
        </div>
      </PageBackground>
    </AuthGuard>
  );
}
