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
import type { BootcampRegistration } from "@/redux/api/bootcampApi";

interface BootcampReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  registration: BootcampRegistration | null;
  adminNote: string;
  onAdminNoteChange: (value: string) => void;
  onVerify: (id: string) => void;
  onReject: (id: string) => void;
  isUpdating: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
}

const BootcampReviewDialog = ({
  open,
  onOpenChange,
  registration,
  adminNote,
  onAdminNoteChange,
  onVerify,
  onReject,
  isUpdating,
  getStatusBadge,
}: BootcampReviewDialogProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Bootcamp Registration Review</DialogTitle>
        <DialogDescription>
          Verify the payment details and confirm the registration
        </DialogDescription>
      </DialogHeader>

      {registration && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Name</p>
              <p className="font-medium">{registration.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium break-all">{registration.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">WhatsApp</p>
              <p className="font-medium">{registration.whatsapp || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment (Last 4 digits)</p>
              <p className="font-mono font-semibold">{registration.paymentLast4}</p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Present Address</p>
              <p className="font-medium">{registration.address}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Registered At</p>
              <p className="font-medium">
                {new Date(registration.createdAt).toLocaleString("en-US")}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Current Status</p>
              {getStatusBadge(registration.status)}
            </div>
          </div>

          {registration.adminNote && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <p className="mb-1 text-sm font-medium text-amber-800">Admin Note:</p>
              <p className="text-sm text-amber-700">{registration.adminNote}</p>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="bootcamp-admin-note" className="text-sm font-medium">
              Admin Note (optional)
            </label>
            <Textarea
              id="bootcamp-admin-note"
              placeholder="Add a note about this registration..."
              value={adminNote}
              onChange={(e) => onAdminNoteChange(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => onReject(registration._id)} disabled={isUpdating}>
              <XCircle className="mr-1 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={() => onVerify(registration._id)} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-1 h-4 w-4" />
              )}
              Verify Payment
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  </Dialog>
);

export default BootcampReviewDialog;
