"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { useGetCertificatesQuery, useUpdateCertificateMutation, type CertificateResponse } from "@/redux/api/certificateApi";
import { toast } from "sonner";

// Move CertificateTable outside component
const CertificateTable = ({ certificates, onViewDetails }: { certificates: CertificateResponse[]; onViewDetails: (cert: CertificateResponse) => void }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
        return (
          <Badge variant="default" className="flex items-center gap-1 w-fit">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'Pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'Rejected':
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Student</TableHead>
          <TableHead>Course</TableHead>
          <TableHead>Batch</TableHead>
          <TableHead>Application Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {certificates.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground">
              No data found
            </TableCell>
          </TableRow>
        ) : (
          certificates.map((cert) => (
            <TableRow key={cert._id}>
              <TableCell className="font-medium">
                {cert.user?.name || 'N/A'}
                <div className="text-xs text-muted-foreground">{cert.user?.email}</div>
              </TableCell>
              <TableCell>{cert.course?.title || 'N/A'}</TableCell>
              <TableCell>{cert.batch?.title || 'N/A'}</TableCell>
              <TableCell>{new Date(cert.createdAt).toLocaleDateString('en-US')}</TableCell>
              <TableCell>{getStatusBadge(cert.status)}</TableCell>
              <TableCell>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewDetails(cert)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default function CertificateManagementPage() {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateResponse | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data, isLoading, refetch } = useGetCertificatesQuery({});
  const [updateCertificate, { isLoading: isUpdating }] = useUpdateCertificateMutation();

  const certificates = data?.data || [];

  const pendingCertificates = certificates.filter((c) => c.status.toLowerCase() === 'pending');
  const approvedCertificates = certificates.filter((c) => c.status.toLowerCase() === 'approved');
  const rejectedCertificates = certificates.filter((c) => c.status.toLowerCase() === 'rejected');

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
    switch (status) {
      case 'Approved':
        return (
          <Badge variant="default" className="flex items-center gap-1 w-fit">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        );
      case 'Pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'Rejected':
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Certificate Approval</h1>
        <p className="text-muted-foreground">Review student certificate applications</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{pendingCertificates.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Approved</CardDescription>
            <CardTitle className="text-3xl text-green-600">{approvedCertificates.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Rejected</CardDescription>
            <CardTitle className="text-3xl text-red-600">{rejectedCertificates.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Certificate Lists */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Rejected ({rejectedCertificates.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardContent className="p-4">
              <CertificateTable certificates={pendingCertificates} onViewDetails={openReviewDialog} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card>
            <CardContent className="p-4">
              <CertificateTable certificates={approvedCertificates} onViewDetails={openReviewDialog} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card>
            <CardContent className="p-4">
              <CertificateTable certificates={rejectedCertificates} onViewDetails={openReviewDialog} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Review</DialogTitle>
            <DialogDescription>
              Verify student information and approve or reject certificate
            </DialogDescription>
          </DialogHeader>

          {selectedCertificate && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Student</p>
                  <p className="font-medium">{selectedCertificate.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCertificate.user?.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Course</p>
                  <p className="font-medium">{selectedCertificate.course?.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Batch</p>
                  <p className="font-medium">{selectedCertificate.batch?.title}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Course Completed</p>
                  <p className="font-medium">{selectedCertificate.completionPercentage || 0}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Application Date</p>
                  <p className="font-medium">
                    {new Date(selectedCertificate.createdAt).toLocaleDateString('en-US')}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Status</p>
                  {getStatusBadge(selectedCertificate.status)}
                </div>
              </div>

              {selectedCertificate.status.toLowerCase() === 'pending' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Rejection Reason (if applicable)</label>
                    <Textarea
                      placeholder="Enter reason to inform the student..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setReviewDialogOpen(false)}
                      disabled={isUpdating}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedCertificate._id)}
                      disabled={isUpdating}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedCertificate._id)}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Approve
                    </Button>
                  </DialogFooter>
                </>
              )}

              {selectedCertificate.status === 'Rejected' && (
                <div className="p-3 bg-red-50 rounded-md border border-red-200">
                  <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700">{selectedCertificate.rejectionReason || 'No reason specified'}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
