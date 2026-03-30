/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShoppingBagIcon } from "lucide-react";
import { format, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EnrollmentsTabProps {
    profile: any;
}

export function EnrollmentsTab({ profile }: EnrollmentsTabProps) {
    const enrollments = profile?.enrollments || [];

    const normalizeStatus = (status?: string) =>
        (status || "").toLowerCase().replace(/_/g, "-");

    const getStatusLabel = (status?: string) => {
        if (!status) return "unknown";
        return status.replace(/[_-]+/g, " ");
    };

    const getFormattedDate = (dateValue: string | Date | undefined) => {
        if (!dateValue) return "N/A";
        const parsed = new Date(dateValue);
        return isValid(parsed) ? format(parsed, 'MMM dd, yyyy') : "N/A";
    };

    const getStatusStyle = (status?: string) => {
        switch (normalizeStatus(status)) {
            case 'active':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'completed':
                return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'pending':
            case 'payment-pending':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'payment-failed':
            case 'failed':
            case 'cancelled':
            case 'canceled':
            case 'suspended':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-white/5 text-white/70 border-white/10';
        }
    };

    return (
        <div className="flex-1 bg-[#060f0a] rounded-2xl border border-primary/20 p-8 flex flex-col shadow-[0_0_40px_hsl(156_70%_42%/0.03)] relative overflow-hidden">
            {/* Ambient glow inside right panel */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-dashed border-primary/20 pb-6 mb-8">
                <h2 className="text-primary text-2xl font-semibold flex items-center gap-2">
                    <ShoppingBagIcon className="w-6 h-6" />
                    My Enrollments
                </h2>
                <div className="">
                    <Link href="/enrollment-posters" className="">
                        <Button variant={"outline"} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">
                            Get Your Enrollment Posters
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative z-10 grid gap-6">
                {enrollments.length > 0 ? (
                    enrollments.map((enrollment: any, index: number) => (
                        <div key={enrollment?.enrollmentId || enrollment?._id || index} className="flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-primary/10 bg-primary/5 hover:bg-primary/10 transition-colors">
                            <div className="flex-1 space-y-4">
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-white/50 text-sm font-mono bg-white/5 px-2 py-1 rounded-md">
                                                {enrollment?.enrollmentId || "N/A"}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${getStatusStyle(enrollment.status)}`}>
                                                {getStatusLabel(enrollment?.status)}
                                            </span>
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
                                        <p className="text-white/80 text-sm font-mono truncate" title={typeof enrollment?.batchId === 'object' ? enrollment?.batchId?.title : enrollment?.batchId?._id}>
                                            {typeof enrollment?.batchId === 'object' && (enrollment?.batchId?.title) ? (
                                                <span className="font-sans">{enrollment?.batchId?.title}</span>
                                            ) : (
                                                enrollment?.batchId?._id || 'N/A'
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-white/40 text-xs mb-1">Course Fee</p>
                                        <p className="text-white/80 text-sm font-mono truncate" title={typeof enrollment?.batchId === 'object' ? enrollment?.batchId?.title : enrollment?.batchId}>
                                            {typeof enrollment?.batchId === 'object' && (enrollment?.batchId?.price || enrollment?.batchId?.price === 0) ? (
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
                            You haven&apos;t enrolled in any courses yet. Browse our catalog to start your learning journey!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
