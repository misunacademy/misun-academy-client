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

  const getStatusBadge = (status: string, method?: string, verifiedAt?: string) => {
    const statusLower = status.toLowerCase();

    switch (statusLower) {
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
      case 'review':
        return (
          <Badge variant="outline" className="flex items-center gap-1 border-yellow-500 text-yellow-700">
            <Clock className="h-3 w-3" />
            Under Review
          </Badge>
        );
      case 'failed':
      case 'cancelled':
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
                      Batch: {payment.batch?.title || 'N/A'} ({payment.batch?.batchNumber || 'N/A'})
                    </CardDescription>
                  </div>
                  {getStatusBadge(payment.status, payment.method, payment.verifiedAt)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-xs mt-1 break-all">{payment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold text-lg mt-1">
                      {payment.currency || 'BDT'} {payment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="capitalize mt-1 font-medium">{payment.method || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="mt-1">
                      {new Date(payment.createdAt).toLocaleDateString('en-US')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleTimeString('en-US')}
                    </p>
                  </div>
                </div>

                {/* Enrollment ID - only show if available */}
                {payment.enrollmentId && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Enrollment ID:</span> {payment.enrollmentId}
                    </p>
                  </div>
                )}

                {/* Verification details for manual payments */}
                {payment.method === 'PhonePay' && payment.verifiedAt && (
                  <div className="mb-4 p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-800">
                      <span className="font-medium">Verified:</span> {new Date(payment.verifiedAt).toLocaleString('en-US')}
                    </p>
                  </div>
                )}

                {/* Gateway Response Details */}
                {payment.gatewayResponse && Object.keys(payment.gatewayResponse).length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs">
                    <p className="text-muted-foreground mb-2 font-medium">Payment Details:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {payment.gatewayResponse.bank_tran_id && (
                        <p><span className="font-medium">Bank Transaction:</span> {payment.gatewayResponse.bank_tran_id}</p>
                      )}
                      {payment.gatewayResponse.card_issuer && (
                        <p><span className="font-medium">Card Issuer:</span> {payment.gatewayResponse.card_issuer}</p>
                      )}
                      {payment.gatewayResponse.card_type && (
                        <p><span className="font-medium">Card Type:</span> {payment.gatewayResponse.card_type}</p>
                      )}
                      {payment.gatewayResponse.tran_date && (
                        <p><span className="font-medium">Transaction Date:</span> {payment.gatewayResponse.tran_date}</p>
                      )}
                      {payment.gatewayResponse.senderNumber && (
                        <p><span className="font-medium">Sender Number:</span> {payment.gatewayResponse.senderNumber}</p>
                      )}
                      {payment.gatewayResponse.phonePeTransactionId && (
                        <p><span className="font-medium">PhonePe TXN:</span> {payment.gatewayResponse.phonePeTransactionId}</p>
                      )}
                      {payment.gatewayResponse.verifiedAt && (
                        <p><span className="font-medium">Verified At:</span> {new Date(payment.gatewayResponse.verifiedAt).toLocaleString('en-US')}</p>
                      )}
                      {payment.gatewayResponse.rejectedAt && (
                        <p className="text-red-600"><span className="font-medium">Rejected At:</span> {new Date(payment.gatewayResponse.rejectedAt).toLocaleString('en-US')}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Status-specific messages */}
                {payment.status === 'review' && payment.method === 'PhonePay' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">⏳ Payment Under Review:</span> Our team is verifying your PhonePe payment. You&apos;ll receive a confirmation email once approved.
                    </p>
                  </div>
                )}

                {payment.status === 'failed' && payment.method === 'PhonePay' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">❌ Payment Rejected:</span> Your PhonePe payment could not be verified. Please contact support for assistance.
                    </p>
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
