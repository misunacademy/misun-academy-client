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
        <p className="text-red-500">পেমেন্ট হিস্ট্রি লোড করতে ব্যর্থ হয়েছে</p>
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
            সফল
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            অপেক্ষমাণ
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            ব্যর্থ
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">পেমেন্ট হিস্ট্রি</h1>
        <p className="text-muted-foreground">আপনার সকল পেমেন্ট লেনদেনের তালিকা</p>
      </div>

      {payments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি</p>
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
                      {payment.course?.title || 'কোর্স তথ্য নেই'}
                    </CardTitle>
                    <CardDescription>
                      ব্যাচ: {payment.batch?.title || 'N/A'} ({payment.batch?.batchCode || 'N/A'})
                    </CardDescription>
                  </div>
                  {getStatusBadge(payment.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">লেনদেন আইডি</p>
                    <p className="font-mono text-xs mt-1">{payment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">পরিমাণ</p>
                    <p className="font-semibold text-lg mt-1">
                      ৳{payment.amount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">পেমেন্ট মাধ্যম</p>
                    <p className="capitalize mt-1">{payment.method || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">তারিখ</p>
                    <p className="mt-1">
                      {new Date(payment.createdAt).toLocaleDateString('bn-BD')}
                    </p>
                  </div>
                </div>

                {payment.gatewayResponse && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md text-xs">
                    <p className="text-muted-foreground mb-2">পেমেন্ট তথ্য:</p>
                    {payment.gatewayResponse.bank_tran_id && (
                      <p>ব্যাংক লেনদেন: {payment.gatewayResponse.bank_tran_id}</p>
                    )}
                    {payment.gatewayResponse.card_issuer && (
                      <p>কার্ড ইস্যুকারী: {payment.gatewayResponse.card_issuer}</p>
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
