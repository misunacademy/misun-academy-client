'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthGuard from '@/components/shared/AuthGuard';
import EnrollmentCheckout from '@/components/module/checkout/EnrollmentCheckout';
import { useGetCourseBySlugQuery } from '@/redux/api/courseApi';
import { useGetCurrentEnrollmentBatchQuery, useGetUpcomingBatchesQuery } from '@/redux/api/batchApi';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { v4 as uuid } from "uuid";
import { track } from '@/lib/metaPixel';
import { AnimatedBorder } from '@/components/shared/AnimatedBorder';
import { isWindowOpen } from './_components/CourseEnrollmentCard';
import EnrollmentNotOpenModal from './_components/EnrollmentNotOpenModal';

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

function CheckoutContent() {
    const router = useRouter();
    const courseSlug = 'complete-graphic-design-with-freelancing';

    const { user, isLoading: authLoading } = useAuth();
    const hasTracked = useRef(false);
    const [openModal, setOpenModal] = useState(false);

    const { data: gdCourseData, isLoading: gdCourseLoading } = useGetCourseBySlugQuery('complete-graphic-design-with-freelancing');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gdCourseId = (gdCourseData?.data as any)?._id;
    const { data: gdCurrentRes, isLoading: gdCurrentLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: gdCourseId }, { skip: !gdCourseId }
    );
    const { data: gdUpcomingRes, isLoading: gdUpcomingLoading } = useGetUpcomingBatchesQuery(
        { courseId: gdCourseId }, { skip: !gdCourseId || !!gdCurrentRes?.data }
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gdBatch = (gdCurrentRes?.data as any) ?? (gdUpcomingRes?.data as any)?.[0];

    const currentBatch = gdBatch;
    const enrollmentStart = currentBatch?.enrollmentStartDate as string | undefined;
    const enrollmentEnd = currentBatch?.enrollmentEndDate as string | undefined;
    const enrollmentRunning = isWindowOpen(enrollmentStart, enrollmentEnd);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
            <EnrollmentNotOpenModal
                open={openModal}
                onOpenChange={handleModalChange}
                courseData={gdCourseData?.data}
                batchData={gdBatch}
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
