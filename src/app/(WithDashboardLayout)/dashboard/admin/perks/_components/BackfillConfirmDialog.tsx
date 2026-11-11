"use client";

import { toast } from "sonner";
import { Loader2, Users, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  EnrollmentPerkRule,
  useExecutePerkBackfillMutation,
  usePreviewPerkBackfillQuery,
} from "@/redux/api/enrollmentPerkApi";
import { Badge } from "@/components/ui/badge";

interface BackfillConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: EnrollmentPerkRule | null;
}

export default function BackfillConfirmDialog({
  open,
  onOpenChange,
  rule,
}: BackfillConfirmDialogProps) {
  const ruleId = rule?._id || "";

  const { data, isLoading: loadingPreview } = usePreviewPerkBackfillQuery(ruleId, {
    skip: !ruleId || !open,
  });

  const [executeBackfill, { isLoading: executing }] = useExecutePerkBackfillMutation();

  const preview = data?.data;
  const eligibleCount = preview?.eligibleCount ?? 0;
  const totalEnrolled = preview?.totalEnrolled ?? 0;

  const handleConfirm = async () => {
    if (!ruleId) return;
    try {
      const res = await executeBackfill(ruleId).unwrap();
      toast.success(res.message || `Successfully backfilled perks for ${res.data.totalGranted} student(s)`);
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to execute backfill");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <AlertDialogTitle>Apply Perks to Existing Students</AlertDialogTitle>
              <AlertDialogDescription>
                Backfill bonus benefits for learners already enrolled in this batch.
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>

        <div className="py-3 space-y-4">
          <div className="p-3 bg-muted/40 rounded-lg space-y-1.5 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Rule:</span>
              <span className="font-semibold text-foreground">{rule?.title}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Course:</span>
              <span>{typeof rule?.courseId === "object" ? rule.courseId.title : ""}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Batch:</span>
              <span>{typeof rule?.batchId === "object" ? rule.batchId.title : ""}</span>
            </div>
          </div>

          {loadingPreview ? (
            <div className="flex items-center justify-center py-6 gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Scanning enrolled students...
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-card">
                <div>
                  <p className="text-xs text-muted-foreground">Enrolled Students</p>
                  <p className="text-lg font-bold">{totalEnrolled}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Eligible for Bonus</p>
                  <p className="text-lg font-bold text-primary">{eligibleCount}</p>
                </div>
              </div>

              {eligibleCount === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>All currently enrolled students already have these benefits granted.</span>
                </div>
              ) : (
                <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500 text-xs leading-relaxed">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    This action will immediately create complimentary bonus enrollments for{" "}
                    <strong>{eligibleCount}</strong> eligible student(s) and notify them. This action is idempotent and safe.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={executing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            disabled={executing || loadingPreview || eligibleCount === 0}
            className="gap-1.5"
          >
            {executing && <Loader2 className="w-4 h-4 animate-spin" />}
            Confirm & Grant ({eligibleCount})
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
