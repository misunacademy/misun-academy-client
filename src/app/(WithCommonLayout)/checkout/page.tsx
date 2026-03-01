'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import EnrollmentCheckout from '@/components/module/checkout/EnrollmentCheckout';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from '@/components/ui/dialog';
import { useGetCourseBySlugQuery } from '@/redux/api/courseApi';
import { useGetCurrentEnrollmentBatchQuery, useGetUpcomingBatchesQuery } from '@/redux/api/batchApi';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { v4 as uuid } from "uuid";
import { track } from '@/lib/metaPixel';

// ── helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string | undefined): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('bn-BD', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
}

function isWindowOpen(start: string | undefined, end: string | undefined): boolean {
    if (!start || !end) return false;
    const now = Date.now();
    return now >= new Date(start).getTime() && now <= new Date(end).getTime();
}

// ── Spinner shared between loader states ─────────────────────────────────────
function Spinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-[#060f0a]">
            <div className="text-center space-y-5">
                <div className="relative p-[1.5px] rounded-full overflow-hidden w-16 h-16 mx-auto">
                    <span className="absolute inset-[-100%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                    <div className="relative w-full h-full rounded-full bg-[#060f0a] flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                </div>
                <p className="text-white/50 text-sm tracking-wide font-bangla">লোড হচ্ছে...</p>
            </div>
        </div>
    );
}

function hasBatchStarted(start: string | undefined): boolean {
    if (!start) return false;
    return Date.now() > new Date(start).getTime();
}

// ── Per-course info card shown inside the modal ───────────────────────────────
function CourseEnrollmentCard({ courseData, batchData }: { courseData: any; batchData: any }) {
    const courseName   = courseData?.name ?? courseData?.title;
    const batchTitle   = batchData?.title;
    const start        = batchData?.enrollmentStartDate as string | undefined;
    const end          = batchData?.enrollmentEndDate   as string | undefined;
    const fee          = batchData?.price ?? courseData?.price;
    const hasStarted   = hasBatchStarted(start);

    if (!courseName) return null;
    return (
        <div className="rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
            {/* Course header */}
            <div className="px-4 pt-4 pb-3 border-b border-white/8">
                <p className="text-xs text-yellow-400/70 uppercase tracking-widest mb-0.5">কোর্স</p>
                <p className="font-bold text-white/90 text-sm leading-snug">{courseName}</p>
                {batchTitle && (
                    <p className="text-xs text-primary/70 mt-1">{batchTitle}</p>
                )}
            </div>
            <div className="p-4 space-y-2">
                {start && (
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 shrink-0 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center">
                            <Calendar className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-primary/70">এনরোলমেন্ট শুরু</p>
                            <p className="text-sm font-bold text-white/90">{fmtDate(start)}</p>
                        </div>
                    </div>
                )}
                {end && (
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 shrink-0 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center">
                            <Clock className="h-3.5 w-3.5 text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs text-red-400/70">এনরোলমেন্টের শেষ তারিখ</p>
                            <p className="text-sm font-bold text-white/90">{fmtDate(end)}</p>
                        </div>
                    </div>
                )}
                {!start && !end && (
                    <p className="text-xs text-white/40 italic">এনরোলমেন্টের তারিখ শীঘ্রই জানানো হবে।</p>
                )}
                {fee > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t border-white/8 mt-2">
                        <span className="text-xs text-white/50">কোর্স ফি</span>
                        <span className="text-sm font-bold text-primary">৳{fee}</span>
                    </div>
                )}
                {/* Status badge */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
                    isWindowOpen(start, end)
                        ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                        : hasStarted
                        ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                        : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        isWindowOpen(start, end) ? 'bg-green-400' : hasStarted ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    {isWindowOpen(start, end) ? 'এনরোলমেন্ট চলছে' : hasStarted ? 'এনরোলমেন্ট শেষ' : 'শীঘ্রই আসছে'}
                </div>
            </div>
        </div>
    );
}

// ── Inner content (uses useSearchParams — must be inside Suspense) ─────────-
function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseSlug = searchParams.get('course') ?? undefined;

    const { user, isLoading: authLoading } = useAuth();
    const hasTracked = useRef(false);
    const [openModal, setOpenModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'graphic-design' | 'english-for-professional-communication'>(
        courseSlug === 'english-for-professional-communication' ? 'english-for-professional-communication' : 'graphic-design'
    );

    // Always fetch BOTH courses so the modal can show info for each
    const { data: gdCourseData, isLoading: gdCourseLoading } = useGetCourseBySlugQuery('graphic-design');
    const gdCourseId = (gdCourseData?.data as any)?._id;
    const { data: gdCurrentRes, isLoading: gdCurrentLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: gdCourseId }, { skip: !gdCourseId }
    );
    const { data: gdUpcomingRes, isLoading: gdUpcomingLoading } = useGetUpcomingBatchesQuery(
        { courseId: gdCourseId }, { skip: !gdCourseId || !!gdCurrentRes?.data }
    );
    const gdBatch = (gdCurrentRes?.data as any) ?? (gdUpcomingRes?.data as any)?.[0];

    const { data: enCourseData, isLoading: enCourseLoading } = useGetCourseBySlugQuery('english-for-professional-communication');
    const enCourseId = (enCourseData?.data as any)?._id;
    const { data: enCurrentRes, isLoading: enCurrentLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: enCourseId }, { skip: !enCourseId }
    );
    const { data: enUpcomingRes, isLoading: enUpcomingLoading } = useGetUpcomingBatchesQuery(
        { courseId: enCourseId }, { skip: !enCourseId || !!enCurrentRes?.data }
    );
    const enBatch = (enCurrentRes?.data as any) ?? (enUpcomingRes?.data as any)?.[0];

    // Determine if the current course's enrollment window is open
    const currentBatch = courseSlug === 'graphic-design' ? gdBatch
        : courseSlug === 'english-for-professional-communication' ? enBatch
        : gdBatch; // fallback to GD for settings-driven path
    const enrollmentStart  = currentBatch?.enrollmentStartDate as string | undefined;
    const enrollmentEnd    = currentBatch?.enrollmentEndDate   as string | undefined;
    const enrollmentRunning = isWindowOpen(enrollmentStart, enrollmentEnd);

    // For Meta Pixel tracking
    const currentCourse = courseSlug === 'graphic-design' ? (gdCourseData?.data as any)
        : courseSlug === 'english-for-professional-communication' ? (enCourseData?.data as any)
        : (gdCourseData?.data as any);
    const courseFee   = currentBatch?.price ?? currentCourse?.price ?? 4000;
    const courseTitle = currentCourse?.name ?? 'MISUN Academy Course Enrollment';

    const allLoading =
        gdCourseLoading || (!!gdCourseId && gdCurrentLoading) || (!!gdCourseId && !gdCurrentRes?.data && gdUpcomingLoading) ||
        enCourseLoading || (!!enCourseId && enCurrentLoading) || (!!enCourseId && !enCurrentRes?.data && enUpcomingLoading);

    useEffect(() => {
        if (!allLoading && !enrollmentRunning && user) {
            setOpenModal(true);
        }
    }, [allLoading, enrollmentRunning, user]);

    // Meta Pixel + CAPI
    useEffect(() => {
        if (!user?.email) return;
        if (hasTracked.current) return;
        hasTracked.current = true;
        const eventId = uuid();
        track('Purchase', {
            value: courseFee,
            currency: 'BDT',
            content_name: courseTitle,
            content_type: 'course',
        }, { eventID: eventId });
        fetch("/api/meta-conversion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName: "Purchase",
                email: user.email,
                value: courseFee,
                currency: "BDT",
                eventId,
            }),
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.email]);

    const handleModalChange = (open: boolean) => {
        setOpenModal(open);
        if (!open) router.back();
    };

    if (authLoading || allLoading) return <Spinner />;
    if (!user) return null;

    if (!enrollmentRunning) {
        return (
            <Dialog open={openModal} onOpenChange={handleModalChange}>
                <DialogContent className="sm:max-w-lg font-bangla bg-[#060f0a] border border-primary/20 text-white">
                    <DialogHeader className="space-y-4">
                        <div className="flex items-center justify-center">
                            <div className="relative p-[1.5px] rounded-full overflow-hidden">
                                <span className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(40_90%_55%)_100%)]" />
                                <div className="relative w-16 h-16 rounded-full bg-[#0f1a10] flex items-center justify-center">
                                    <AlertTriangle className="h-7 w-7 text-yellow-400" />
                                </div>
                            </div>
                        </div>
                        <DialogTitle className="text-center text-xl font-bold text-white">
                            এনরোলমেন্ট এখনো শুরু হয়নি
                        </DialogTitle>
                        <DialogDescription className="text-center text-white/50">
                            নিচে সকল কোর্সের এনরোলমেন্ট সময়সূচি দেখুন।
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-3">
                        {/* Tab buttons */}
                        <div className="flex rounded-xl overflow-hidden border border-white/10 p-1 gap-1 bg-white/3">
                            {([
                                { key: 'graphic-design', label: 'গ্রাফিক ডিজাইন' },
                                { key: 'english-for-professional-communication', label: 'ইংলিশ' },
                            ] as const).map(({ key, label }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                                        activeTab === key
                                            ? 'bg-primary text-white shadow'
                                            : 'text-white/50 hover:text-white/80'
                                    }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        {/* Active tab content */}
                        {activeTab === 'graphic-design' && (
                            <CourseEnrollmentCard courseData={gdCourseData?.data} batchData={gdBatch} />
                        )}
                        {activeTab === 'english-for-professional-communication' && (
                            <CourseEnrollmentCard courseData={enCourseData?.data} batchData={enBatch} />
                        )}
                        <div className="rounded-xl bg-primary/8 border border-primary/20 p-3 text-center">
                            <p className="text-sm text-white/60">📌 এই পেজটি বুকমার্ক করে রাখুন!</p>
                        </div>
                    </div>

                    <DialogFooter className="pt-2">
                        <div className="relative p-[1.5px] rounded-xl overflow-hidden w-full">
                            <span className="absolute inset-[-100%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_60%,hsl(156_70%_42%)_100%)]" />
                            <button
                                onClick={() => handleModalChange(false)}
                                className="relative w-full bg-gradient-to-r from-[#0d5c36] via-primary to-[#0a5f38] hover:from-[#0f6e41] hover:via-[#18a06a] hover:to-[#0f6e41] transition-all duration-300 text-white font-bold py-3 rounded-xl cursor-pointer"
                            >
                                বুঝেছি
                            </button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <div>
            <BreadcrumbJsonLd />
            <EnrollmentCheckout courseSlug={courseSlug} />
        </div>
    );
}

// ── Page export — wraps content in Suspense for useSearchParams ───────────────
export default function Page() {
    return (
        <Suspense fallback={<Spinner />}>
            <CheckoutContent />
        </Suspense>
    );
}


