"use client";

import { LoadingBoundary } from "@/components/shared/LoadingBoundary";
import { CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useGetMyPaymentsQuery } from "@/redux/api/paymentApi";
import type { PaymentResponse } from "@/redux/api/paymentApi";
import {
    useGetMyBootcampPurchasesQuery,
    type BootcampPurchase,
} from "@/redux/api/bootcampApi";

interface GatewayResponse {
    bank_tran_id?: string;
    card_issuer?: string;
    card_type?: string;
    tran_date?: string;
    senderNumber?: string;
    phonePeTransactionId?: string;
    verifiedAt?: string;
    rejectedAt?: string;
}


export function PaymentHistoryTab() {
    const { data, isLoading, error } = useGetMyPaymentsQuery();
    const { data: bootcampData, isLoading: bootcampLoading } =
        useGetMyBootcampPurchasesQuery({ history: true });

    const payments = (data?.data || []).filter(
        (payment) => payment.status !== 'failed' && payment.status !== 'cancel'
    );
    const bootcampPurchases = (bootcampData?.data || []).filter(
        (purchase) => purchase.status !== 'rejected'
    );
    const loading = isLoading || bootcampLoading;

    const bootcampStatus = (status: BootcampPurchase['status']) =>
        status === 'paid' ? 'success' : status === 'rejected' ? 'failed' : 'pending';

    const getStatusBadge = (status: string) => {
        const statusLower = status?.toLowerCase();

        switch (statusLower) {
            case 'success':
            case 'completed':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/20">
                        <CheckCircle className="w-3.5 h-3.5" /> Successful
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-surface/50 text-white/60 border-surface/30">
                        <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
            case 'review':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-surface/50 text-white/60 border-surface/30">
                        <Clock className="w-3.5 h-3.5" /> Under Review
                    </span>
                );
            case 'failed':
            case 'cancelled':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-destructive/10 text-destructive border-destructive/20">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-white/5 text-muted-foreground border-white/10 capitalize">
                        {status}
                    </span>
                );
        }
    };

    return (
        <LoadingBoundary loading={loading}>
        {error ? (
            <div className="flex-1 bg-surface rounded-3xl border border-surface/20 p-8 flex items-center justify-center min-h-[400px]">
                <p className="text-destructive">Failed to load payment history</p>
            </div>
        ) : (
        <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Payment History
                </h2>
            </div>

            <div className="relative z-10 grid gap-6">
                {payments.length === 0 && bootcampPurchases.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                        <CreditCard className="w-16 h-16 text-primary/40 mb-4" />
                        <h3 className="text-xl text-white/90 font-medium mb-2">No Payment Records Found</h3>
                        <p className="text-white/50 max-w-md">
                            {'You haven\'t made any payments yet.'}
                        </p>
                    </div>
                ) : (
                    bootcampPurchases.map((purchase: BootcampPurchase) => (
                        <div key={purchase._id} className="flex flex-col gap-6 p-6 rounded-2xl border border-primary/20 bg-surface/40 backdrop-blur-sm hover:bg-surface/60 transition-all duration-300 hover:border-primary/40 group">
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-surface/10 pb-4">
                                <div className="space-y-1">
                                    <h3 className="text-white font-bold text-lg leading-tight">
                                        {purchase.bootcamp?.title || 'Bootcamp recording'}
                                    </h3>
                                    <p className="text-white/50 text-sm">
                                        Bootcamp{ purchase.bootcamp?.season ? (
                                            <span className="text-white/80"> • {purchase.bootcamp.season}</span>
                                        ) : null}
                                    </p>
                                </div>
                                <div>
                                    {getStatusBadge(bootcampStatus(purchase.status))}
                                </div>
                            </div>

                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Transaction ID</p>
                                        <p className="font-mono text-white/60 text-xs break-all">{purchase.transactionId}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Amount</p>
                                        <p className="font-semibold text-primary text-lg">
                                            <span className="text-primary/70 text-sm">৳</span>{" "}
                                            {purchase.amount?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Payment Method</p>
                                        <p className="capitalize text-white/60 font-medium">{purchase.method || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Date</p>
                                        <p className="text-white/60">
                                            {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString('en-US') : 'N/A'}
                                        </p>
                                        <p className="text-xs text-white/40">
                                            {purchase.createdAt ? new Date(purchase.createdAt).toLocaleTimeString('en-US') : ''}
                                        </p>
                                    </div>
                                </div>

                                {purchase.status === 'paid' && purchase.bootcamp?.slug && (
                                    <Link
                                        href={`/bootcamp/${purchase.bootcamp.slug}#bootcamp-videos`}
                                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
                                    >
                                        Watch recording →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))
                )}
                {payments.length > 0 && (
                    payments.map((payment: PaymentResponse) => {
                        const gw = payment.gatewayResponse as GatewayResponse | undefined;
                        return (
                        <div key={payment._id} className="flex flex-col gap-6 p-6 rounded-2xl border border-primary/20  bg-surface/40 backdrop-blur-sm hover:bg-surface/60 transition-all duration-300 hover:border-primary/40 group">
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-surface/10 pb-4">
                                <div className="space-y-1">
                                    <h3 className="text-white font-bold text-lg leading-tight">
                                        {payment.course?.title || 'No course information'}
                                    </h3>
                                    <p className="text-white/50 text-sm">
                                        Batch: <span className="text-white/80">{payment.batch?.title?.split(' ')[1] || 'N/A'}</span>
                                    </p>
                                </div>
                                <div>
                                    {getStatusBadge(payment.status)}
                                </div>
                            </div>

                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Transaction ID</p>
                                        <p className="font-mono text-white/60 text-xs break-all">{payment.transactionId}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Amount</p>
                                        <p className="font-semibold text-primary text-lg">
                                            {payment.method !== 'PhonePay' ? <span className="text-primary/70 text-sm">৳</span> : <span className="text-primary/70 text-sm">₹</span>}{" "}
                                            {payment.amount?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Payment Method</p>
                                        <p className="capitalize text-white/60 font-medium">{payment.method || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Date</p>
                                        <p className="text-white/60">
                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-US') : 'N/A'}
                                        </p>
                                        <p className="text-xs text-white/40">
                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleTimeString('en-US') : ''}
                                        </p>
                                    </div>
                                </div>

                                {payment.enrollmentId && (
                                    <div className="mb-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                                        <p className="text-sm text-primary">
                                            <span className="font-medium text-primary">Enrollment ID:</span> {payment.enrollmentId}
                                        </p>
                                    </div>
                                )}

                                {payment.method === 'PhonePay' && payment.verifiedAt && (
                                    <div className="mb-4 p-4 rounded-xl border border-primary/20 bg-primary/5">
                                        <p className="text-sm text-primary">
                                            <span className="font-medium text-primary">Verified:</span> {new Date(payment.verifiedAt).toLocaleString('en-US')}
                                        </p>
                                    </div>
                                )}

                                {gw && Object.keys(gw).length > 0 && (
                                    <div className="mt-4 p-4 rounded-xl border border-surface/30 bg-surface/30">
                                        <p className="text-white/60 mb-3 font-medium border-b border-white/5 pb-2">Payment Details:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {gw.bank_tran_id && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Bank Transaction:</span> {gw.bank_tran_id}</p>
                                            )}
                                            {gw.card_issuer && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Card Issuer:</span> {gw.card_issuer}</p>
                                            )}
                                            {gw.card_type && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Card Type:</span> {gw.card_type}</p>
                                            )}
                                            {gw.tran_date && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Transaction Date:</span> {gw.tran_date}</p>
                                            )}
                                            {gw.senderNumber && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Sender Number:</span> {gw.senderNumber}</p>
                                            )}
                                            {gw.phonePeTransactionId && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">PhonePe TXN:</span> {gw.phonePeTransactionId}</p>
                                            )}
                                            {gw.verifiedAt && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Verified At:</span> {new Date(gw.verifiedAt).toLocaleString('en-US')}</p>
                                            )}
                                            {gw.rejectedAt && (
                                                <p className="text-destructive"><span className="text-destructive font-medium">Rejected At:</span> {new Date(gw.rejectedAt).toLocaleString('en-US')}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {payment.status === 'review' && payment.method === 'PhonePay' && (
                                    <div className="mt-4 p-4 rounded-xl border border-surface/30 bg-surface/30">
                                        <p className="text-sm text-white/80">
                                            <span className="font-medium text-white">Payment Under Review:</span> {'Our team is verifying your PhonePe payment. You\'ll receive a confirmation email once approved.'}
                                        </p>
                                    </div>
                                )}

                                {payment.status === 'failed' && payment.method === 'PhonePay' && (
                                    <div className="mt-4 p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                                        <p className="text-sm text-destructive">
                                            <span className="font-medium text-destructive">Payment Rejected:</span> Your PhonePe payment could not be verified. Please contact support for assistance.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                ))}
            </div>
        </div>
        )}
        </LoadingBoundary>
    );
}
