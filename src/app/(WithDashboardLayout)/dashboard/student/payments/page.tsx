/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { useGetMyPaymentsQuery } from "@/redux/api/paymentApi";

export default function PaymentHistoryPage() {
  const { data, isLoading, error } = useGetMyPaymentsQuery();

  const payments = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Failed to load payment history</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'completed':
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Successful
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Payment History</h1>
        <p className="text-muted-foreground">List of all your payment transactions</p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payment records found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {payments.map((payment: any) => (
            <Card key={payment._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {payment.course?.title || 'No course information'}
                    </CardTitle>
                    <CardDescription>
                      Batch: {payment.batch?.title || 'N/A'} ({payment.batch?.batchCode || 'N/A'})
                    </CardDescription>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-xs mt-1">{payment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold text-lg mt-1">
                      BDT {payment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="capitalize mt-1">{payment.method || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="mt-1">
                      {new Date(payment.createdAt).toLocaleDateString('en-US')}
                    </p>
                  </div>
                </div>

                {payment.gatewayResponse && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs">
                    <p className="text-muted-foreground mb-2">Payment Info:</p>
                    {payment.gatewayResponse.bank_tran_id && (
                      <p>Bank Transaction: {payment.gatewayResponse.bank_tran_id}</p>
                    )}
                    {payment.gatewayResponse.card_issuer && (
                      <p>Card Issuer: {payment.gatewayResponse.card_issuer}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
