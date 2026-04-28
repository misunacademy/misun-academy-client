"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, FileCheck, Clock, Ban, ExternalLink, Send, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { useGetMyCertificatesQuery, useLazyVerifyCertificateQuery, useRequestCertificateMutation, type CertificateResponse } from "@/redux/api/certificateApi";
import { useGetEnrollmentsQuery, type EnrollmentResponse } from "@/redux/api/enrollmentApi";
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

export default function MyClassesCertificatesPage() {
  const { data, isLoading, refetch } = useGetMyCertificatesQuery();
  const { data: enrollmentsData, isLoading: isEnrollmentsLoading } = useGetEnrollmentsQuery();
  const [requestCertificate, { isLoading: isRequesting }] = useRequestCertificateMutation();
  const [verifyCertificate] = useLazyVerifyCertificateQuery();
  const [downloadingCertificateId, setDownloadingCertificateId] = useState<string | null>(null);

  const certificates = data?.data || [];
  const enrollments = (enrollmentsData?.data || []) as (EnrollmentResponse & { isCertificateAvailable?: boolean })[];

  const certificateByEnrollment = new Set(
    certificates.map((c) => getEnrollmentId(c)).filter(Boolean)
  );

  const requestableEnrollments = enrollments.filter((enrollment) => {
    const enrollmentId = enrollment._id;
    const completed = enrollment.status === "completed" || enrollment.status === "active";
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

  // const handleDownloadCertificate = async (certificateId: string) => {
  //   try {
  //     setDownloadingCertificateId(certificateId);
  //     const result = await verifyCertificate(certificateId).unwrap();
  //     const verifiedCertificate = result?.data?.certificate;

  //     if (!result?.data?.isValid || !verifiedCertificate) {
  //       toast.error("Certificate is not available for download yet");
  //       return;
  //     }

  //     downloadCertificatePdf(verifiedCertificate);
  //     toast.success("Certificate PDF downloaded");
  //   } catch {
  //     toast.error("Failed to download certificate");
  //   } finally {
  //     setDownloadingCertificateId(null);
  //   }
  // };

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
      <ProtectedRoute>
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div
        className="relative min-h-screen overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #0a0f18 0%, #060f0a 60%, #040c07 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-[-90px] left-1/2 -translate-x-1/2 w-[520px] h-[220px] bg-primary/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute top-[22%] -left-20 w-[240px] h-[240px] bg-primary/6 rounded-full blur-[70px] pointer-events-none" />
        <div className="absolute top-[30%] -right-16 w-[220px] h-[220px] bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
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

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardDescription className="text-white/50">Pending</CardDescription>
                <CardTitle className="text-3xl text-white">{pendingCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardDescription className="text-white/50">Approved</CardDescription>
                <CardTitle className="text-3xl text-emerald-400">{approvedCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
              <CardHeader className="pb-3">
                <CardDescription className="text-white/50">Rejected</CardDescription>
                <CardTitle className="text-3xl text-red-400">{rejectedCount}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-white">Request Certificates</CardTitle>
              <CardDescription className="text-white/50">
                Completed enrollments without a certificate request can be submitted from here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {requestableEnrollments.length === 0 ? (
                <p className="text-sm text-white/50">No eligible enrollment found for new certificate request.</p>
              ) : (
                requestableEnrollments.map((enrollment) => (
                  <div key={enrollment._id} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <div>
                      <p className="font-medium text-white">{enrollment.batchId?.courseId?.title || "Course"}</p>
                      <p className="text-xs text-white/50">{enrollment.batchId?.title || "Batch"}</p>
                    </div>
                    <Button
                      onClick={() => handleRequestCertificate(enrollment._id)}
                      disabled={isRequesting}
                      size="sm"
                      className="bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] text-white hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41]"
                    >
                      {isRequesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-1" />}
                      Request
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/10 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Certificate Requests & History
              </CardTitle>
              <CardDescription className="text-white/50">All your pending, approved, and revoked certificates.</CardDescription>
            </CardHeader>
            <CardContent>
              {certificates.length === 0 ? (
                <p className="text-white/50">No certificates found yet.</p>
              ) : (
                <div className="space-y-3">
                  {certificates.map((certificate) => {
                    const normalizedStatus = normalizeStatus(certificate.status);

                    return (
                      <div key={certificate._id} className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="font-semibold text-white">{getCourseTitle(certificate)}</h3>
                            <p className="text-sm text-white/50">{getBatchTitle(certificate)}</p>
                            <p className="text-xs text-white/40 mt-1">
                              Certificate ID: {certificate.certificateId}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            {statusBadge(certificate.status)}
                       
                            {
                              certificate.status === 'active' &&
                              <Button asChild size="sm" variant="outline" className="border-white/15 bg-white/[0.02] text-white/80 hover:bg-primary/10 hover:text-primary hover:border-primary/40">
                                <a
                                  href={`/verify-certificate/${certificate.certificateId}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  view
                                </a>
                              </Button>
                            }

                            {/* {normalizedStatus === "approved" ? (
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
                            ) : null} */}
                          </div>
                        </div>

                        {normalizedStatus === "rejected" ? (
                          <p className="text-xs text-red-400 mt-2">
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
      </div>
    </ProtectedRoute>
  );
}
