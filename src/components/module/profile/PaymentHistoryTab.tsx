/* eslint-disable @typescript-eslint/no-explicit-any */
import { Loader2, CreditCard, CheckCircle, XCircle, Clock } from "lucide-react";
import { useGetMyPaymentsQuery } from "@/redux/api/paymentApi";

interface PaymentHistoryTabProps {
    profile?: any;
}

export function PaymentHistoryTab({ profile }: PaymentHistoryTabProps) {
    const { data, isLoading, error } = useGetMyPaymentsQuery();

    const payments = data?.data || [];
    console.log(payments)

    const getStatusStyle = (status: string) => {
        const statusLower = status?.toLowerCase();

        switch (statusLower) {
            case 'success':
            case 'completed':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-green-500/10 text-green-400 border-green-500/20">
                        <CheckCircle className="w-3.5 h-3.5" /> Successful
                    </span>
                );
            case 'pending':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        <Clock className="w-3.5 h-3.5" /> Pending
                    </span>
                );
            case 'review':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-orange-500/10 text-orange-400 border-orange-500/20">
                        <Clock className="w-3.5 h-3.5" /> Under Review
                    </span>
                );
            case 'failed':
            case 'cancelled':
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-red-500/10 text-red-400 border-red-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Failed
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border bg-white/5 text-white/70 border-white/10 capitalize">
                        {status}
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex items-center justify-center min-h-[400px]">
                <p className="text-red-400">Failed to load payment history</p>
            </div>
        );
    }

    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            {/* Ambient glow inside right panel */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <div>
                    <h2 className="text-primary text-2xl font-semibold flex items-center gap-2 mb-1">
                        <CreditCard className="w-6 h-6" />
                        Payment History
                    </h2>
                    <p className="text-white/50 text-sm">List of all your payment transactions</p>
                </div>
            </div>

            <div className="relative z-10 grid gap-6">
                {payments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                        <CreditCard className="w-16 h-16 text-primary/40 mb-4" />
                        <h3 className="text-xl text-white/90 font-medium mb-2">No Payment Records Found</h3>
                        <p className="text-white/50 max-w-md">
                            You haven&apos;t made any payments yet.
                        </p>
                    </div>
                ) : (
                    payments.map((payment: any) => (
                        <div key={payment._id} className="flex flex-col gap-6 p-6 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors">
                            {/* Card Header equivalent */}
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 pb-4">
                                <div className="space-y-1">
                                    <h3 className="text-white font-medium text-lg leading-tight">
                                        {payment.course?.title || 'No course information'}
                                    </h3>
                                    <p className="text-white/50 text-sm">
                                        Batch: <span className="text-white/80">{payment.batch?.title?.split(' ')[1] || 'N/A'}</span> 
                                        {/* ({payment.batch?.batchNumber || 'N/A'}) */}
                                    </p>
                                </div>
                                <div>
                                    {getStatusStyle(payment.status)}
                                </div>
                            </div>

                            {/* Card Content equivalent */}
                            <div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-6">
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Transaction ID</p>
                                        <p className="font-mono text-white/80 text-xs break-all">{payment.transactionId}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Amount</p>
                                        <p className="font-semibold text-primary text-lg">
                                            {payment.currency === 'BDT' || !payment.currency ? <span className="text-primary/70 text-sm">৳</span> : payment.currency}{" "}
                                            {payment.amount?.toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Payment Method</p>
                                        <p className="capitalize text-white/80 font-medium">{payment.method || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Date</p>
                                        <p className="text-white/80">
                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-US') : 'N/A'}
                                        </p>
                                        <p className="text-xs text-white/40">
                                            {payment.createdAt ? new Date(payment.createdAt).toLocaleTimeString('en-US') : ''}
                                        </p>
                                    </div>
                                </div>

                                {/* Enrollment ID */}
                                {payment.enrollmentId && (
                                    <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <p className="text-sm text-blue-400">
                                            <span className="font-medium text-blue-300">Enrollment ID:</span> {payment.enrollmentId}
                                        </p>
                                    </div>
                                )}

                                {/* Verification details for manual payments */}
                                {payment.method === 'PhonePay' && payment.verifiedAt && (
                                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                        <p className="text-sm text-green-400">
                                            <span className="font-medium text-green-300">Verified:</span> {new Date(payment.verifiedAt).toLocaleString('en-US')}
                                        </p>
                                    </div>
                                )}

                                {/* Gateway Response Details */}
                                {payment.gatewayResponse && Object.keys(payment.gatewayResponse).length > 0 && (
                                    <div className="mt-4 p-4 bg-black/40 border border-white/5 rounded-lg text-xs">
                                        <p className="text-white/60 mb-3 font-medium border-b border-white/5 pb-2">Payment Details:</p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {payment.gatewayResponse.bank_tran_id && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Bank Transaction:</span> {payment.gatewayResponse.bank_tran_id}</p>
                                            )}
                                            {payment.gatewayResponse.card_issuer && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Card Issuer:</span> {payment.gatewayResponse.card_issuer}</p>
                                            )}
                                            {payment.gatewayResponse.card_type && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Card Type:</span> {payment.gatewayResponse.card_type}</p>
                                            )}
                                            {payment.gatewayResponse.tran_date && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Transaction Date:</span> {payment.gatewayResponse.tran_date}</p>
                                            )}
                                            {payment.gatewayResponse.senderNumber && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Sender Number:</span> {payment.gatewayResponse.senderNumber}</p>
                                            )}
                                            {payment.gatewayResponse.phonePeTransactionId && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">PhonePe TXN:</span> {payment.gatewayResponse.phonePeTransactionId}</p>
                                            )}
                                            {payment.gatewayResponse.verifiedAt && (
                                                <p className="text-white/70"><span className="text-white/40 font-medium">Verified At:</span> {new Date(payment.gatewayResponse.verifiedAt).toLocaleString('en-US')}</p>
                                            )}
                                            {payment.gatewayResponse.rejectedAt && (
                                                <p className="text-red-400"><span className="text-red-500/70 font-medium">Rejected At:</span> {new Date(payment.gatewayResponse.rejectedAt).toLocaleString('en-US')}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Status-specific messages */}
                                {payment.status === 'review' && payment.method === 'PhonePay' && (
                                    <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                        <p className="text-sm text-yellow-400">
                                            <span className="font-medium text-yellow-300">⏳ Payment Under Review:</span> Our team is verifying your PhonePe payment. You&apos;ll receive a confirmation email once approved.
                                        </p>
                                    </div>
                                )}

                                {payment.status === 'failed' && payment.method === 'PhonePay' && (
                                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <p className="text-sm text-red-400">
                                            <span className="font-medium text-red-300">❌ Payment Rejected:</span> Your PhonePe payment could not be verified. Please contact support for assistance.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}