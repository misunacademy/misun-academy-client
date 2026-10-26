"use client";

import { useEffect, useState, type MouseEvent } from 'react';
import { Skeleton } from 'boneyard-js/react'
// import Link from 'next/link';
import { ArrowRight, CalendarCheck, CalendarX, X } from 'lucide-react';
import { BatchResponse } from '@/redux/api/batchApi';
import { useCurrentBatch } from '@/hooks/useCurrentBatch';
import { formatDate } from './EnrollmentSection';

type EnrollmentFixedContentProps = {
    batch: BatchResponse;
    onScrollToEnroll: (e: MouseEvent<HTMLAnchorElement>) => void;
};

function EnrollmentFixedContent({ batch, onScrollToEnroll }: EnrollmentFixedContentProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isFooterVisible, setIsFooterVisible] = useState(false);

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsFooterVisible(entry.isIntersecting),
            { rootMargin: '0px 0px -25% 0px' }
        );
        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    const safeFormatDate = (date?: Date | string | null) => {
        if (!date) return 'তথ্য পাওয়া যায়নি';

        try {
            return formatDate(date);
        } catch {
            return 'তথ্য পাওয়া যায়নি';
        }
    };

    if (!isOpen || isFooterVisible) return null;

    return (
        <div className=''>
            <div
                className="
        fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-auto
        sm:w-[calc(100vw-2.5rem)] max-w-[210px] sm:max-w-[344px]
        bg-surface border border-primary/25
        shadow-[0_12px_30px_hsl(156_70%_42%/0.18)] rounded-xl
        p-2.5 pr-12 sm:p-4 sm:pr-14
        font-bangla text-white/85
        text-xs sm:text-base font-medium
        z-50
      "
                style={{ backdropFilter: 'blur(6px)' }}
            >
                <button
                    type="button"
                    aria-label="পপআপ বন্ধ করুন"
                    onClick={() => setIsOpen(false)}
                    className="absolute top-1.5 right-1.5 grid h-11 w-11 min-h-[44px] min-w-[44px] place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                    <X size={16} />
                </button>

                <div className="flex items-center gap-3 sm:block">
                    <div className="min-w-0 flex-1 space-y-0.5 sm:space-y-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <CalendarCheck size={16} className="shrink-0 text-primary-glow sm:h-5 sm:w-5" aria-hidden="true" />
                            <p className="truncate">
                                <span className="hidden sm:inline">এনরোলমেন্ট শুরু: </span>
                                <span className="sm:hidden">শুরু: </span>
                                <span className="text-primary-glow font-semibold">{safeFormatDate(batch.enrollmentStartDate)}</span>
                            </p>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <CalendarX size={16} className="shrink-0 text-red-400 sm:h-5 sm:w-5" aria-hidden="true" />
                            <p className="truncate">
                                <span className="hidden sm:inline">এনরোলমেন্ট শেষ: </span>
                                <span className="sm:hidden">শেষ: </span>
                                <span className="text-primary-glow font-semibold">{safeFormatDate(batch.enrollmentEndDate)}</span>
                            </p>
                        </div>
                    </div>

                    {/* <Link
                        href="#enroll-now"
                        onClick={onScrollToEnroll}
                        className="inline-flex shrink-0 min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:mt-4 sm:w-full sm:gap-2 sm:px-4 sm:py-2.5"
                    >
                        এনরোল করুন
                        <ArrowRight size={16} aria-hidden="true" />
                    </Link> */}
                </div>
            </div>
        </div>
    );
}

export default function EnrollmentFixed() {
    const scrollToEnrollSection = (e: MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();

        const targetSectionId = 'enroll-now';
        const fallbackAnchorId = 'enroll-now-anchor';
        const scrollToElement = (el: HTMLElement) => {
            const targetTop = el.getBoundingClientRect().top + window.scrollY - 24;
            window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        };

        const scrollToCurrentBestTarget = () => {
            const section = document.getElementById(targetSectionId);
            if (section) {
                scrollToElement(section);
                return true;
            }

            const fallback = document.getElementById(fallbackAnchorId);
            if (fallback) {
                scrollToElement(fallback);
                return true;
            }

            return false;
        };

        window.history.replaceState(null, '', `#${targetSectionId}`);
        scrollToCurrentBestTarget();

        const startedAt = Date.now();
        const retryUntilReady = () => {
            const hasRealSection = !!document.getElementById(targetSectionId);
            if (hasRealSection) {
                scrollToCurrentBestTarget();
                return;
            }

            if (Date.now() - startedAt < 4000) {
                window.setTimeout(retryUntilReady, 180);
            }
        };

        window.setTimeout(retryUntilReady, 180);
    };
    const { batch, isLoading, isError } = useCurrentBatch();

    return (
        <Skeleton name="EnrollmentFixed" loading={isLoading}>
            {isError || !batch ? null : (
                <EnrollmentFixedContent
                    key={batch._id ?? 'batch'}
                    batch={batch}
                    onScrollToEnroll={scrollToEnrollSection}
                />
            )}
        </Skeleton>
    );
}
