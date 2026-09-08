'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/shared/AuthGuard';
import EnrollmentCheckout from '@/components/module/checkout/EnrollmentCheckout';
import BootcampCheckout from '@/components/module/checkout/BootcampCheckout';
import { useGetBatchByIdQuery } from '@/redux/api/batchApi';
import { useCurrentBatch } from '@/hooks/useCurrentBatch';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { v4 as uuid } from "uuid";
import { track } from '@/lib/metaPixel';
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';
import { isWindowOpen } from './_components/CourseEnrollmentCard';
import EnrollmentNotOpenModal from './_components/EnrollmentNotOpenModal';
import { COURSE_SLUGS } from '@/constants/courses';

function Spinner() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-surface">
            <div className="text-center space-y-5">
                <div className="relative p-[1.5px] rounded-full overflow-hidden w-16 h-16 mx-auto">
                    <AnimatedBorder variant="simple" speed="2s" />
                    <div className="relative w-full h-full rounded-full bg-surface flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                </div>
                <p className="text-white/50 text-sm tracking-wide font-bangla">লোড হচ্ছে...</p>
            </div>
        </div>
    );
}

function BootcampBranch({ batchId }: { batchId: string }) {
    const { user, isLoading: authLoading } = useAuth();
    const { data, isLoading } = useGetBatchByIdQuery(batchId);

    if (authLoading || isLoading) return <Spinner />;
    if (!user) return null;
    if (!data?.data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-surface">
                <p className="font-bangla text-white/70">ব্যাচ পাওয়া যায়নি।</p>
            </div>
        );
    }

    const batch = data.data as unknown as Record<string, unknown>;
    const course = (batch.courseId ?? {}) as Record<string, unknown>;

    return (
        <div>
            <BreadcrumbJsonLd />
            <BootcampCheckout batchId={batchId} course={course} batch={batch} />
        </div>
    );
}

function CheckoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bootcampBatchId = searchParams.get('batch');
    const courseSlug = COURSE_SLUGS.GRAPHIC_DESIGN;

    const { user, isLoading: authLoading } = useAuth();
    const hasTracked = useRef(false);
    const [openModal, setOpenModal] = useState(false);

    const { course, batch, isLoading: allLoading } = useCurrentBatch();

    const enrollmentStart = batch?.enrollmentStartDate as string | undefined;
    const enrollmentEnd = batch?.enrollmentEndDate as string | undefined;
    const enrollmentRunning = bootcampBatchId ? true : isWindowOpen(enrollmentStart, enrollmentEnd);

    const courseFee = (batch?.price as number) ?? (course?.price as number);
    const courseTitle = (course?.name as string) ?? 'MISUN Academy Course Enrollment';

    useEffect(() => {
        if (bootcampBatchId) return;
        if (!allLoading && !enrollmentRunning && user) {
            const frame = requestAnimationFrame(() => setOpenModal(true));
            return () => cancelAnimationFrame(frame);
        }
    }, [allLoading, enrollmentRunning, user, bootcampBatchId]);

    useEffect(() => {
        if (bootcampBatchId) return;
        if (!user?.email) return;
        if (hasTracked.current) return;
        hasTracked.current = true;
        const eventId = uuid();
        const knownFee = typeof courseFee === 'number' ? courseFee : undefined;
        track('InitiateCheckout', {
            ...(knownFee !== undefined ? { value: knownFee, currency: 'BDT' } : {}),
            content_name: courseTitle,
            content_type: 'course',
        }, { eventID: eventId });
        fetch("/api/meta-conversion", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                eventName: "InitiateCheckout",
                email: user.email,
                value: knownFee,
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

    if (bootcampBatchId) {
        return <BootcampBranch batchId={bootcampBatchId} />;
    }

    if (!enrollmentRunning) {
        return (
            <EnrollmentNotOpenModal
                open={openModal}
                onOpenChange={handleModalChange}
                courseData={course}
                batchData={batch}
            />
        );
    }

    return (
        <div>
            <BreadcrumbJsonLd />
            <EnrollmentCheckout courseSlug={courseSlug} />
        </div>
    );
}

export default function Page() {
    return (
        <AuthGuard>
            <Suspense fallback={<Spinner />}>
                <CheckoutContent />
            </Suspense>
        </AuthGuard>
    );
}
