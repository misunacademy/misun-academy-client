"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, RotateCcw } from "lucide-react";
import { useGetPaymentDetailQuery, type PaymentResponse } from "@/redux/api/paymentApi";
import { RefundCreateDialog } from "@/components/module/refund/RefundCreateDialog";

interface GatewayResponse {
  senderNumber?: string;
  phonePeTransactionId?: string;
  card_issuer?: string;
  bank_tran_id?: string;
}

const statusBadgeVariant = (status: string) =>
  status === "success" ? "default" : status === "failed" ? "destructive" : status === "pending" ? "secondary" : "outline";

export function PaymentDetailDialog({ transactionId }: { transactionId: string }) {
  const [open, setOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const { data, isLoading } = useGetPaymentDetailQuery(transactionId, { skip: !open });

  const payment = data?.data?.payment as (PaymentResponse & { paidAt?: string }) | undefined;
  const enrollment = data?.data?.enrollment;
  const gw = (payment?.gatewayResponse ?? null) as GatewayResponse | null;

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={() => setOpen(true)}
        aria-label={`View payment detail for ${transactionId}`}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle className="font-mono text-sm sm:text-base">{transactionId}</DialogTitle>
            <DialogDescription>Transaction detail — payment, student and enrollment</DialogDescription>
          </DialogHeader>
          {isLoading || !payment ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant={statusBadgeVariant(payment.status)} className="capitalize">
                  {payment.status}
                </Badge>
                <div className="flex items-center gap-2">
                  {payment.status === "success" && (
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => setRefundOpen(true)}>
                      <RotateCcw className="h-3.5 w-3.5" />
                      Refund
                    </Button>
                  )}
                  <span className="text-lg font-semibold">
                    {payment.amount.toFixed(2)} {payment.currency}
                  </span>
                </div>
              </div>

              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Student</dt>
                <dd className="font-medium">{payment.student?.name || "N/A"}</dd>
                <dt className="text-muted-foreground">Email</dt>
                <dd className="break-all">{payment.student?.email || "N/A"}</dd>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{payment.student?.phone || "N/A"}</dd>
                <dt className="text-muted-foreground">Course</dt>
                <dd>{payment.course?.title || "N/A"}</dd>
                <dt className="text-muted-foreground">Batch</dt>
                <dd>{payment.batch?.title || "N/A"}</dd>
                <dt className="text-muted-foreground">Method</dt>
                <dd>{payment.method}</dd>
                <dt className="text-muted-foreground">Enrollment</dt>
                <dd>
                  {enrollment ? (
                    <span className="capitalize">
                      {enrollment.enrollmentId} · {enrollment.status}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </dd>
                <dt className="text-muted-foreground">Created</dt>
                <dd>{new Date(payment.createdAt).toLocaleString()}</dd>
                {payment.verifiedAt && (
                  <>
                    <dt className="text-muted-foreground">Verified</dt>
                    <dd>{new Date(payment.verifiedAt).toLocaleString()}</dd>
                  </>
                )}
                {payment.paidAt && (
                  <>
                    <dt className="text-muted-foreground">Paid at</dt>
                    <dd>{new Date(payment.paidAt).toLocaleString()}</dd>
                  </>
                )}
              </dl>

              {gw && payment.method === "PhonePay" && (
                <div className="space-y-1 rounded-md bg-muted/40 p-3 text-sm">
                  <p className="font-medium">Manual payment (PhonePe)</p>
                  <p>Sender: {gw.senderNumber || "N/A"}</p>
                  <p>TXN: {gw.phonePeTransactionId || "N/A"}</p>
                </div>
              )}
              {gw && payment.method === "SSLCommerz" && (
                <div className="space-y-1 rounded-md bg-muted/40 p-3 text-sm">
                  <p className="font-medium">Gateway (SSLCommerz)</p>
                  <p>Card issuer: {gw.card_issuer || "N/A"}</p>
                  <p>Bank TXN: {gw.bank_tran_id || "N/A"}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
      <RefundCreateDialog
        open={refundOpen}
        onOpenChange={setRefundOpen}
        defaultTransactionId={transactionId}
      />
    </>
  );
}