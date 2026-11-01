"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Check, X, BadgeCheck } from "lucide-react"
import ConfirmDialog from "@/components/shared/ConfirmDialog"
import {
  useApproveRefundMutation,
  useRejectRefundMutation,
  useCompleteRefundMutation,
  type Refund,
  type RefundStatus,
} from "@/redux/api/refundApi"

const statusVariant = (status: RefundStatus) =>
  status === "completed"
    ? "default"
    : status === "rejected"
      ? "destructive"
      : status === "pending"
        ? "secondary"
        : "outline"

export function RefundActions({ refund }: { refund: Refund }) {
  const [approveRefund] = useApproveRefundMutation()
  const [rejectRefund] = useRejectRefundMutation()
  const [completeRefund] = useCompleteRefundMutation()
  const [pendingAction, setPendingAction] = useState<"Approve" | "Reject" | "Complete" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const run = async () => {
    if (!pendingAction) return
    const label = pendingAction
    setIsProcessing(true)
    try {
      if (label === "Approve") await approveRefund({ id: refund._id }).unwrap()
      else if (label === "Reject") await rejectRefund({ id: refund._id }).unwrap()
      else await completeRefund(refund._id).unwrap()
      toast.success(`Refund ${label.toLowerCase()}d successfully`)
      setPendingAction(null)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || `Failed to ${label.toLowerCase()} refund`)
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmDescription =
    pendingAction === "Complete" && refund.channel === "gateway"
      ? "This calls the SSLCommerz refund API. This cannot be undone."
      : pendingAction === "Complete"
        ? "This marks the money as returned manually and revokes the enrollment. This cannot be undone."
        : pendingAction === "Reject"
          ? "The refund request will be rejected. This cannot be undone."
          : "The refund request will be approved. This cannot be undone."

  const actions = (
    <>
      <ConfirmDialog
        open={pendingAction !== null}
        onOpenChange={(open) => { if (!open) setPendingAction(null) }}
        title={pendingAction ? `${pendingAction} this refund?` : "Confirm refund action"}
        description={confirmDescription}
        confirmLabel={pendingAction ?? "Confirm"}
        variant={pendingAction === "Reject" ? "destructive" : "default"}
        confirming={isProcessing}
        onConfirm={() => { void run() }}
      />
    </>
  )

  if (refund.status === "pending") {
    return (
      <div className="flex gap-1">
        <button
          onClick={() => setPendingAction("Approve")}
          className="rounded-md bg-emerald-50 p-1.5 hover:bg-emerald-100"
          aria-label={`Approve refund ${refund.transactionId}`}
        >
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        </button>
        <button
          onClick={() => setPendingAction("Reject")}
          className="rounded-md bg-red-50 p-1.5 hover:bg-red-100"
          aria-label={`Reject refund ${refund.transactionId}`}
        >
          <X className="h-3.5 w-3.5 text-red-600" />
        </button>
        {actions}
      </div>
    )
  }

  if (refund.status === "approved") {
    return (
      <>
        <button
          onClick={() => setPendingAction("Complete")}
          className="rounded-md bg-blue-50 p-1.5 hover:bg-blue-100"
          aria-label={`Complete refund ${refund.transactionId}`}
          title={refund.channel === "gateway" ? "Calls SSLCommerz refund API" : "Mark money returned manually"}
        >
          <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
        </button>
        {actions}
      </>
    )
  }

  return <span className="text-xs text-muted-foreground">—</span>
}

export { statusVariant }