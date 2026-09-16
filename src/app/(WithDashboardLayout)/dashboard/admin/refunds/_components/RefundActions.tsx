"use client"

import { toast } from "sonner"
import { Check, X, BadgeCheck } from "lucide-react"
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

  const run = async (label: string, action: () => Promise<unknown>) => {
    if (!window.confirm(`${label} this refund?`)) return
    try {
      await action()
      toast.success(`Refund ${label.toLowerCase()}d successfully`)
    } catch (error) {
      const err = error as { data?: { message?: string } }
      toast.error(err?.data?.message || `Failed to ${label.toLowerCase()} refund`)
    }
  }

  if (refund.status === "pending") {
    return (
      <div className="flex gap-1">
        <button
          onClick={() => run("Approve", () => approveRefund({ id: refund._id }).unwrap())}
          className="rounded-md bg-emerald-50 p-1.5 hover:bg-emerald-100"
          aria-label={`Approve refund ${refund.transactionId}`}
        >
          <Check className="h-3.5 w-3.5 text-emerald-600" />
        </button>
        <button
          onClick={() => run("Reject", () => rejectRefund({ id: refund._id }).unwrap())}
          className="rounded-md bg-red-50 p-1.5 hover:bg-red-100"
          aria-label={`Reject refund ${refund.transactionId}`}
        >
          <X className="h-3.5 w-3.5 text-red-600" />
        </button>
      </div>
    )
  }

  if (refund.status === "approved") {
    return (
      <button
        onClick={() => run("Complete", () => completeRefund(refund._id).unwrap())}
        className="rounded-md bg-blue-50 p-1.5 hover:bg-blue-100"
        aria-label={`Complete refund ${refund.transactionId}`}
        title={refund.channel === "gateway" ? "Calls SSLCommerz refund API" : "Mark money returned manually"}
      >
        <BadgeCheck className="h-3.5 w-3.5 text-blue-600" />
      </button>
    )
  }

  return <span className="text-xs text-muted-foreground">—</span>
}

export { statusVariant }