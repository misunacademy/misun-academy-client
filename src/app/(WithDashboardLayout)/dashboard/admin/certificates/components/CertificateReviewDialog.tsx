import type { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import type { CertificateResponse } from "@/redux/api/certificateApi";

interface CertificateReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificate: CertificateResponse | null;
  rejectionReason: string;
  onRejectionReasonChange: (value: string) => void;
  onReject: (id: string) => void;
  onApprove: (id: string) => void;
  isUpdating: boolean;
  getStudentName: (cert: CertificateResponse) => string;
  getStudentEmail: (cert: CertificateResponse) => string;
  getCourseTitle: (cert: CertificateResponse) => string;
  getBatchTitle: (cert: CertificateResponse) => string;
  getStatusBadge: (status: string) => ReactNode;
  normalizeStatus: (status: string) => string;
}

const CertificateReviewDialog = ({
  open,
  onOpenChange,
  certificate,
  rejectionReason,
  onRejectionReasonChange,
  onReject,
  onApprove,
  isUpdating,
  getStudentName,
  getStudentEmail,
  getCourseTitle,
  getBatchTitle,
  getStatusBadge,
  normalizeStatus,
}: CertificateReviewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Certificate Review</DialogTitle>
          <DialogDescription>
            Verify student information and approve or reject certificate
          </DialogDescription>
        </DialogHeader>

        {certificate && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Student</p>
                <p className="font-medium">{getStudentName(certificate)}</p>
                <p className="text-xs text-muted-foreground">{getStudentEmail(certificate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-medium">{getCourseTitle(certificate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Batch</p>
                <p className="font-medium">{getBatchTitle(certificate)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Course Completed</p>
                <p className="font-medium">{certificate.completionPercentage ?? 0}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Application Date</p>
                <p className="font-medium">
                  {new Date(certificate.createdAt).toLocaleDateString("en-US")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Current Status</p>
                {getStatusBadge(certificate.status)}
              </div>
            </div>

            {certificate.status.toLowerCase() === "pending" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rejection Reason (if applicable)</label>
                  <Textarea
                    placeholder="Enter reason to inform the student..."
                    value={rejectionReason}
                    onChange={(e) => onRejectionReasonChange(e.target.value)}
                    rows={3}
                  />
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => onReject(certificate._id)}
                    disabled={isUpdating}
                  >
                    <XCircle className="mr-1 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => onApprove(certificate._id)}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-1 h-4 w-4" />
                    )}
                    Approve
                  </Button>
                </DialogFooter>
              </>
            )}

            {normalizeStatus(certificate.status) === "rejected" && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3">
                <p className="mb-1 text-sm font-medium text-red-800">Rejection Reason:</p>
                <p className="text-sm text-red-700">
                  {certificate.rejectionReason || certificate.revokedReason || "No reason specified"}
                </p>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CertificateReviewDialog;
