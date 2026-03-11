'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
import { AlertTriangle, Calendar, Clock, ArrowRight } from 'lucide-react';
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
function CourseEnrollmentCard({
    courseData,
    batchData,
    courseSlug,
}: {
    courseData: any;
    batchData: any;
    courseSlug: string;
}) {
    const courseName = courseData?.name ?? courseData?.title;
    const batchTitle = batchData?.title;
    const start = batchData?.enrollmentStartDate as string | undefined;
    const end = batchData?.enrollmentEndDate as string | undefined;
    const fee = batchData?.price ?? courseData?.price;
    const hasStarted = hasBatchStarted(start);
    const isOpen = isWindowOpen(start, end);

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
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${isOpen
                    ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                    : hasStarted
                        ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                        : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/25'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isOpen ? 'bg-green-400' : hasStarted ? 'bg-red-400' : 'bg-yellow-400'
                        }`} />
                    {isOpen ? 'এনরোলমেন্ট চলছে' : hasStarted ? 'এনরোলমেন্ট শেষ' : 'শীঘ্রই আসছে'}
                </div>

                {/* Enroll CTA — only shown when the window is currently open */}
                {isOpen && (
                    <div className="mt-3 relative group">
                        {/* Ambient pulse halo */}
                        <div
                            className="absolute inset-0 rounded-xl blur-md opacity-50 animate-pulse"
                            style={{ background: 'radial-gradient(ellipse at center, hsl(156 80% 45% / 0.5) 0%, transparent 70%)' }}
                        />
                        {/* Spinning conic border wrapper */}
                        <div
                            className="relative p-[1.5px] rounded-xl overflow-hidden transition-all duration-500 group-hover:shadow-[0_0_24px_6px_hsl(156_70%_42%/0.45)] shadow-[0_0_14px_2px_hsl(156_70%_38%/0.3)]"
                        >
                            {/* Spinning border */}
                            <div
                                className="absolute inset-[-100%] animate-[spin_3s_linear_infinite]"
                                style={{ background: 'conic-gradient(from 0deg, transparent 0%, transparent 22%, hsl(156 60% 35% / 0.4) 34%, hsl(156 75% 52%) 44%, hsl(156 90% 72%) 50%, hsl(0 0% 100% / 0.9) 53%, hsl(156 90% 72%) 56%, hsl(156 75% 52%) 62%, hsl(156 60% 35% / 0.3) 74%, transparent 84%)' }}
                            />
                            {/* Inner pill */}
                            <Link
                                href={`/checkout?course=${courseSlug}`}
                                className="relative z-10 flex items-center justify-center gap-2.5 w-full py-3 rounded-xl overflow-hidden transition-all duration-500 group-hover:-translate-y-[1px]"
                                style={{ background: 'linear-gradient(135deg, hsl(156 30% 7%) 0%, hsl(156 25% 11%) 50%, hsl(156 20% 8%) 100%)' }}
                            >
                                {/* Shimmer sweep */}
                                <div
                                    className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out"
                                    style={{ background: 'linear-gradient(105deg, transparent 35%, hsl(156 80% 70% / 0.15) 50%, transparent 65%)' }}
                                />
                                {/* Live dot */}
                                <span className="relative flex h-[7px] w-[7px] shrink-0">
                                    <span
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
                                        style={{ backgroundColor: 'hsl(156 75% 55%)' }}
                                    />
                                    <span
                                        className="relative inline-flex rounded-full h-[7px] w-[7px]"
                                        style={{ backgroundColor: 'hsl(156 80% 65%)' }}
                                    />
                                </span>
                                {/* Label */}
                                <span
                                    className="relative text-sm font-bold tracking-wide font-mona"
                                    style={{ background: 'linear-gradient(90deg, hsl(156 75% 62%) 0%, hsl(156 85% 78%) 50%, hsl(156 70% 60%) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                >
                                    এখনই এনরোল করুন
                                </span>
                                {/* Arrow */}
                                <ArrowRight
                                    className="relative w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 shrink-0"
                                    style={{ color: 'hsl(156 80% 72%)' }}
                                />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ── Inner content (uses useSearchParams — must be inside Suspense) ─────────-
function CheckoutContent() {
    const router = useRouter();
    const courseSlug = 'graphic-design'; // single supported course

    const { user, isLoading: authLoading } = useAuth();
    const hasTracked = useRef(false);
    const [openModal, setOpenModal] = useState(false);

    // Fetch the single course's data for modal and checkout
    const { data: gdCourseData, isLoading: gdCourseLoading } = useGetCourseBySlugQuery('graphic-design');
    const gdCourseId = (gdCourseData?.data as any)?._id;
    const { data: gdCurrentRes, isLoading: gdCurrentLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: gdCourseId }, { skip: !gdCourseId }
    );
    const { data: gdUpcomingRes, isLoading: gdUpcomingLoading } = useGetUpcomingBatchesQuery(
        { courseId: gdCourseId }, { skip: !gdCourseId || !!gdCurrentRes?.data }
    );
    const gdBatch = (gdCurrentRes?.data as any) ?? (gdUpcomingRes?.data as any)?.[0];



    // Determine if the current course's enrollment window is open
    const currentBatch = gdBatch; // single course only
    const enrollmentStart = currentBatch?.enrollmentStartDate as string | undefined;
    const enrollmentEnd = currentBatch?.enrollmentEndDate as string | undefined;
    const enrollmentRunning = isWindowOpen(enrollmentStart, enrollmentEnd);

    // For Meta Pixel tracking
    const currentCourse = (gdCourseData?.data as any);
    const courseFee = currentBatch?.price ?? currentCourse?.price ?? 4000;
    const courseTitle = currentCourse?.name ?? 'MISUN Academy Course Enrollment';

    const allLoading =
        gdCourseLoading || (!!gdCourseId && gdCurrentLoading) || (!!gdCourseId && !gdCurrentRes?.data && gdUpcomingLoading);

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
                <DialogContent className="sm:max-w-lg font-bangla bg-[#060f0a] border border-primary/20 text-white z-50 mt-5">
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
                        <CourseEnrollmentCard
                            courseData={gdCourseData?.data}
                            batchData={gdBatch}
                            courseSlug="graphic-design"
                        />
                    </div>

                    <DialogFooter className="pt-2">
                        {/* Dismiss button — frosted glass ghost style (secondary vs green enroll CTA) */}
                        <div className="relative group w-full">
                            {/* Subtle white halo */}
                            <div
                                className="absolute inset-0 rounded-xl blur-sm opacity-20 group-hover:opacity-35 transition-opacity duration-500"
                                style={{ background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, transparent 70%)' }}
                            />
                            <button
                                onClick={() => handleModalChange(false)}
                                className="relative w-full flex items-center justify-center gap-2 py-3 rounded-xl overflow-hidden cursor-pointer
                                    border border-white/15 group-hover:border-white/30
                                    transition-all duration-400 group-hover:-translate-y-[1px]
                                    group-hover:shadow-[0_0_18px_3px_rgba(255,255,255,0.08)]"
                                style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 100%)', backdropFilter: 'blur(8px)' }}
                            >
                                {/* White shimmer sweep */}
                                <div
                                    className="absolute inset-0 translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-700 ease-in-out"
                                    style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.1) 50%, transparent 65%)' }}
                                />
                                {/* Check icon */}
                                <svg className="relative w-4 h-4 shrink-0 text-white/50 group-hover:text-white/70 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 6 9 17l-5-5" />
                                </svg>
                                {/* Label */}
                                <span
                                    className="relative text-sm font-bold tracking-wide font-bangla"
                                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.80) 50%, rgba(255,255,255,0.5) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                                >
                                    বুঝেছি
                                </span>
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


