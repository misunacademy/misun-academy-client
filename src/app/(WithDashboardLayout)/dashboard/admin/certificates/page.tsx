"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { useGetCertificatesQuery, useUpdateCertificateMutation, type CertificateResponse } from "@/redux/api/certificateApi";
import { toast } from "sonner";
import DashboardPageContainer from "@/components/layout/DashboardPageContainer";
import DashboardPageTableWithPagination from "@/components/layout/DashboardPageTableWithPagination";
import DashboardPageTabs from "@/components/layout/DashboardPageTabs";
import CertificateTableRow from "./components/CertificateTableRow";
import CertificateStatsCards from "./components/CertificateStatsCards";
import CertificateReviewDialog from "./components/CertificateReviewDialog";

const normalizeStatus = (status: string) => {
  const value = status.toLowerCase();
  if (value === "active" || value === "approved") return "approved";
  if (value === "revoked" || value === "rejected") return "rejected";
  return "pending";
};

const getStudentName = (cert: CertificateResponse) =>
  cert.user?.name || (cert.userId as unknown as { name?: string })?.name || "N/A";

const getStudentEmail = (cert: CertificateResponse) =>
  cert.user?.email || (cert.userId as unknown as { email?: string })?.email || "";

const getCourseTitle = (cert: CertificateResponse) =>
  cert.course?.title ||
  (cert.batchId as unknown as { courseId?: { title?: string } })?.courseId?.title ||
  "N/A";

const getBatchTitle = (cert: CertificateResponse) =>
  cert.batch?.title || (cert.batchId as unknown as { title?: string })?.title || "N/A";

export default function CertificateManagementPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateResponse | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isFetching, refetch } = useGetCertificatesQuery({
    status: activeTab,
    page,
    limit,
  });

  const { data: pendingMetaData } = useGetCertificatesQuery({ status: "pending", page: 1, limit: 1 });
  const { data: approvedMetaData } = useGetCertificatesQuery({ status: "approved", page: 1, limit: 1 });
  const { data: rejectedMetaData } = useGetCertificatesQuery({ status: "rejected", page: 1, limit: 1 });

  const [updateCertificate, { isLoading: isUpdating }] = useUpdateCertificateMutation();

  const certificates = data?.data || [];
  const meta = data?.meta ?? { total: 0, page: 1, limit, totalPages: 1 };
  const pendingCount = pendingMetaData?.meta?.total ?? 0;
  const approvedCount = approvedMetaData?.meta?.total ?? 0;
  const rejectedCount = rejectedMetaData?.meta?.total ?? 0;
  const totalPages = meta.totalPages ?? 1;

  const handleApprove = async (certificateId: string) => {
    try {
      await updateCertificate({
        id: certificateId,
        data: { status: 'Approved', approvedAt: new Date().toISOString() }
      }).unwrap();
      toast.success('Certificate approval successful');
      refetch();
      setReviewDialogOpen(false);
    } catch {
      toast.error('Approval failed');
    }
  };

  const handleReject = async (certificateId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      await updateCertificate({
        id: certificateId,
        data: {
          status: 'Rejected',
          rejectionReason,
          rejectedAt: new Date().toISOString()
        }
      }).unwrap();
      toast.success('Certificate rejection successful');
      refetch();
      setReviewDialogOpen(false);
      setRejectionReason("");
    } catch {
      toast.error('Rejection failed');
    }
  };

  const openReviewDialog = (certificate: CertificateResponse) => {
    setSelectedCertificate(certificate);
    setReviewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (normalizeStatus(status)) {
      case 'approved':
        return (
          <Badge variant="default" className="flex items-center gap-1 w-fit">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderCertificateRow = (cert: CertificateResponse) => (
    <CertificateTableRow
      certificate={cert}
      getStudentName={getStudentName}
      getStudentEmail={getStudentEmail}
      getCourseTitle={getCourseTitle}
      getBatchTitle={getBatchTitle}
      getStatusBadge={getStatusBadge}
      onViewDetails={openReviewDialog}
    />
  );

  const tableColumns = ["Student", "Course", "Batch", "Application Date", "Status", "Actions"];
  const tablePagination = {
    page,
    totalPages,
    total: meta.total,
    limit,
    onPageChange: setPage,
  };

  const tableContent = (
    <DashboardPageTableWithPagination
      columns={tableColumns}
      data={certificates}
      renderRow={renderCertificateRow}
      getRowKey={(cert) => cert._id}
      isFetching={isFetching}
      emptyState="No certificates found."
      pagination={tablePagination}
    />
  );

  const tabTriggers = [
    { value: "pending", label: `Pending (${pendingCount})` },
    { value: "approved", label: `Approved (${approvedCount})` },
    { value: "rejected", label: `Rejected (${rejectedCount})` },
  ];

  const tabContents = [
    { value: "pending", content: tableContent },
    { value: "approved", content: tableContent },
    { value: "rejected", content: tableContent },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (

    <DashboardPageContainer
      heading="Certificate Approval"
      subheading="Review student certificate applications"
      content={
        <>
          {/* Stats Cards */}
          <CertificateStatsCards
            pendingCount={pendingCount}
            approvedCount={approvedCount}
            rejectedCount={rejectedCount}
          />

          {/* Certificate Lists */}
          <DashboardPageTabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "pending" | "approved" | "rejected");
              setPage(1);
            }}
            triggers={tabTriggers}
            contents={tabContents}
          />

          {/* Review Dialog */}
          <CertificateReviewDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            certificate={selectedCertificate}
            rejectionReason={rejectionReason}
            onRejectionReasonChange={setRejectionReason}
            onReject={handleReject}
            onApprove={handleApprove}
            isUpdating={isUpdating}
            getStudentName={getStudentName}
            getStudentEmail={getStudentEmail}
            getCourseTitle={getCourseTitle}
            getBatchTitle={getBatchTitle}
            getStatusBadge={getStatusBadge}
            normalizeStatus={normalizeStatus}
          />
        </>
      }
    />

  );
}
