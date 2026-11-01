import { ShoppingBagIcon, CheckCircle, XCircle, Clock } from "lucide-react";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { ProfileData, EnrollmentRef } from "@/redux/api/profileApi";

interface EnrollmentsTabProps {
    profile: ProfileData | undefined;
}

export function EnrollmentsTab({ profile }: EnrollmentsTabProps) {
    const normalizeStatus = (status?: string) =>
        (status || "").toLowerCase().replace(/_/g, "-");
    // Terminal payment failures/expired attempts are internal bookkeeping and
    // never part of the learner-facing enrollment history.
    const hiddenStatuses = new Set([
        "payment-failed",
        "expired",
        "failed",
        "cancelled",
        "canceled",
    ]);
    const enrollments = (profile?.enrollments || []).filter(
        (enrollment) => !hiddenStatuses.has(normalizeStatus(enrollment.status))
    );
    const hasEnrollments = enrollments.length > 0;

    const getStatusLabel = (status?: string) => {
        if (!status) return "unknown";
        return status.replace(/[_-]+/g, " ");
    };

    const getFormattedDate = (dateValue: string | Date | undefined) => {
        if (!dateValue) return "N/A";
        const parsed = new Date(dateValue);
        return isValid(parsed) ? format(parsed, 'MMM dd, yyyy') : "N/A";
    };

    const getStatusBadge = (status?: string) => {
        const normalized = normalizeStatus(status);
        switch (normalized) {
            case 'active':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/20">
                        <CheckCircle className="w-3 h-3" /> Active
                    </span>
                );
            case 'completed':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border bg-primary/20 text-primary border-primary/30">
                        <CheckCircle className="w-3 h-3" /> Completed
                    </span>
                );
            case 'pending':
            case 'payment-pending':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border bg-primary/10 text-primary border-primary/20">
                        <Clock className="w-3 h-3" /> Pending
                    </span>
                );
            case 'payment-failed':
            case 'expired':
            case 'failed':
            case 'cancelled':
            case 'canceled':
            case 'suspended':
                return (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border bg-destructive/10 text-destructive border-destructive/20">
                        <XCircle className="w-3 h-3" /> {getStatusLabel(status)}
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border bg-white/5 text-muted-foreground border-white/10 capitalize">
                        {getStatusLabel(status)}
                    </span>
                );
        }
    };

    return (
        <div className="flex-1 bg-surface rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold flex items-center gap-2">
                    <ShoppingBagIcon className="w-6 h-6" />
                    My Enrollments
                </h2>
                {
                    hasEnrollments &&
                    <div className="hidden md:block">
                        <Button asChild variant="outline" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors text-xs">
                            <Link href="/enrollment-posters">Get Your Enrollment Posters</Link>
                        </Button>
                    </div>
                }
            </div>

            <div className="relative z-10 grid gap-6">
                {enrollments.length > 0 ? (
                    enrollments.map((enrollment: EnrollmentRef, index: number) => (
                        <div key={enrollment?.enrollmentId || enrollment?._id || index} className="flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors">
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-white/50 text-sm font-mono bg-white/5 px-2 py-1 rounded-md">
                                                {enrollment?.enrollmentId || "N/A"}
                                            </span>
                                            {getStatusBadge(enrollment.status)}
                                            {
                                                enrollment?.accessType && enrollment?.accessType === 'special' &&
                                                (<span className="px-3 py-1 rounded-full text-xs font-medium border bg-accent/10 text-accent-foreground border-accent/20 capitalize">
                                                    Special Access
                                                </span>)
                                            }
                                        </div>
                                        <h3 className="text-white font-medium text-lg leading-tight">
                                            {typeof enrollment?.batchId?.courseId === 'object' && enrollment?.batchId?.courseId?.title ? (
                                                <span className="text-white">{enrollment.batchId.courseId.title}</span>
                                            ) : typeof enrollment?.courseId === 'object' && enrollment?.courseId?.title ? (
                                                <span className="text-white">{enrollment.courseId.title}</span>
                                            ) : (
                                                <>Course: <span className="text-primary/80 font-mono text-base">N/A</span></>
                                            )}
                                        </h3>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-white/5 pt-4">
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Enrolled On</p>
                                        <p className="text-white/80 text-sm">
                                            {getFormattedDate(enrollment?.enrolledAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Batch</p>
                                        <p className="text-white/80 text-sm font-mono truncate" title={enrollment?.batchId?.title ?? enrollment?.batchId?._id ?? 'N/A'}>
                                            {enrollment?.batchId?.title ?? enrollment?.batchId?._id ?? 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Course Fee</p>
                                        <p className="text-white/80 text-sm font-mono truncate" title={enrollment?.batchId?.title ?? 'N/A'}>
                                            {enrollment?.batchId?.price !== undefined ? (
                                                <span className="font-sans text-primary text-base"> <span className="text-white/50 text-lg">৳</span> {enrollment?.batchId?.price}</span>
                                            ) : (
                                                'N/A'
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Certificate</p>
                                        <p className="text-white/80 text-sm">
                                            {enrollment?.certificateIssued ? (
                                                <span className="text-primary">Issued</span>
                                            ) : (
                                                <span className="text-white/30">Not issued</span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-primary/20 rounded-xl bg-primary/5">
                        <ShoppingBagIcon className="w-16 h-16 text-primary/40 mb-4" />
                        <h3 className="text-xl text-white/90 font-medium mb-2">No Enrollments Found</h3>
                        <p className="text-white/50 max-w-md">
                            {'You haven\'t enrolled in any courses yet. Browse our catalog to start your learning journey!'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
