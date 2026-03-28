"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, FileCheck, Clock, Ban, ExternalLink, Send } from "lucide-react";
import { useGetMyCertificatesQuery, useLazyVerifyCertificateQuery, useRequestCertificateMutation, type CertificateResponse } from "@/redux/api/certificateApi";
import { useGetEnrollmentsQuery } from "@/redux/api/enrollmentApi";
import { toast } from "sonner";
import { downloadCertificatePdf } from "@/lib/certificateDownload";

const normalizeStatus = (status?: string) => {
  const value = (status || "").toLowerCase();
  if (value === "active" || value === "approved") return "approved";
  if (value === "revoked" || value === "rejected") return "rejected";
  return "pending";
};

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

export default function StudentCertificatesPage() {
  const { data, isLoading, refetch } = useGetMyCertificatesQuery();
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery();
  const [requestCertificate, { isLoading: isRequesting }] = useRequestCertificateMutation();
  const [verifyCertificate] = useLazyVerifyCertificateQuery();
  const [downloadingCertificateId, setDownloadingCertificateId] = useState<string | null>(null);

  const certificates = data?.data || [];
  const enrollments = enrollmentsData?.data || [];

  const certificateByEnrollment = new Set(
    certificates.map((c) => getEnrollmentId(c)).filter(Boolean)
  );

  const requestableEnrollments = enrollments.filter((enrollment) => {
    const enrollmentId = enrollment._id;
    const completed = enrollment.status === "completed" || enrollment.status === "active";
    const missingCertificate = !certificateByEnrollment.has(enrollmentId);
    return completed && missingCertificate;
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

  const handleDownloadCertificate = async (certificateId: string) => {
    try {
      setDownloadingCertificateId(certificateId);
      const result = await verifyCertificate(certificateId).unwrap();
      const verifiedCertificate = result?.data?.certificate;

      if (!result?.data?.isValid || !verifiedCertificate) {
        toast.error("Certificate is not available for download yet");
        return;
      }

      downloadCertificatePdf(verifiedCertificate);
      toast.success("Certificate PDF downloaded");
    } catch {
      toast.error("Failed to download certificate");
    } finally {
      setDownloadingCertificateId(null);
    }
  };

  const statusBadge = (status: string) => {
    const normalized = normalizeStatus(status);

    if (normalized === "approved") {
      return (
        <Badge variant="default" className="flex items-center gap-1 w-fit">
          <FileCheck className="h-3 w-3" />
          Approved
        </Badge>
      );
    }

    if (normalized === "rejected") {
      return (
        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
          <Ban className="h-3 w-3" />
          Rejected
        </Badge>
      );
    }

    return (
      <Badge variant="secondary" className="flex items-center gap-1 w-fit">
        <Clock className="h-3 w-3" />
        Pending
      </Badge>
    );
  };

  if (isLoading || isEnrollmentsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Certificates</h1>
        <p className="text-muted-foreground">Request, track, and verify your certificates.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{pendingCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl text-green-600">{approvedCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl text-red-600">{rejectedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request Certificates</CardTitle>
          <CardDescription>
            Completed enrollments without a certificate request can be submitted from here.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {requestableEnrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No eligible enrollment found for new certificate request.</p>
          ) : (
            requestableEnrollments.map((enrollment) => (
              <div key={enrollment._id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div>
                  <p className="font-medium">{enrollment.batchId?.courseId?.title || "Course"}</p>
                  <p className="text-xs text-muted-foreground">{enrollment.batchId?.title || "Batch"}</p>
                </div>
                <Button
                  onClick={() => handleRequestCertificate(enrollment._id)}
                  disabled={isRequesting}
                  size="sm"
                >
                  {isRequesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                  Request
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            Certificate Requests & History
          </CardTitle>
          <CardDescription>All your pending, approved, and revoked certificates.</CardDescription>
        </CardHeader>
        <CardContent>
          {certificates.length === 0 ? (
            <p className="text-muted-foreground">No certificates found yet.</p>
          ) : (
            <div className="space-y-3">
              {certificates.map((certificate) => {
                const normalizedStatus = normalizeStatus(certificate.status);

                return (
                  <div key={certificate._id} className="rounded-lg border p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="font-semibold">{getCourseTitle(certificate)}</h3>
                        <p className="text-sm text-muted-foreground">{getBatchTitle(certificate)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Certificate ID: {certificate.certificateId}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {statusBadge(certificate.status)}

                        <Button asChild size="sm" variant="outline">
                          <a
                            href={`/verify-certificate/${certificate.certificateId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Verify
                          </a>
                        </Button>

                        {normalizedStatus === "approved" ? (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]"
                            onClick={() => void handleDownloadCertificate(certificate.certificateId)}
                            disabled={downloadingCertificateId === certificate.certificateId}
                          >
                            {downloadingCertificateId === certificate.certificateId ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : null}
                            Download
                          </Button>
                        ) : null}
                      </div>
                    </div>

                    {normalizedStatus === "rejected" ? (
                      <p className="text-xs text-red-600 mt-2">
                        Reason: {certificate.rejectionReason || certificate.revokedReason || "Not provided"}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
