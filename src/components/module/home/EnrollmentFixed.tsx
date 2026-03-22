/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CalendarCheck, CalendarX, Rocket, X } from 'lucide-react';
import { useGetCourseBySlugQuery } from '@/redux/api/courseApi';
import { BatchResponse, useGetCurrentEnrollmentBatchQuery } from '@/redux/api/batchApi';
import { formatDate } from './EnrollmentSection';

export default function EnrollmentFixed() {
    const [isOpen, setIsOpen] = useState(true);
    const { data: gdCourseData, isLoading: gdCourseLoading } = useGetCourseBySlugQuery('complete-graphic-design-with-freelancing');
    const gdCourseId = (gdCourseData?.data as any)?._id;
    const { data: gdCurrentRes, isLoading: gdCurrentLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: gdCourseId }, { skip: !gdCourseId });


    const batch = useMemo(() => (gdCurrentRes?.data ?? {}) as BatchResponse, [gdCurrentRes]);

    if (!isOpen) return null;

    if (gdCourseLoading || gdCurrentLoading) {
        return (
            <div
                className="
        fixed bottom-5 left-5
        bg-white bg-opacity-90
        shadow-lg rounded-md
        p-4 max-w-xs
        font-bangla text-gray-700
        text-sm font-medium
        z-50
      "
                style={{ backdropFilter: 'blur(6px)' }}
            >
                Loading enrollment details...
            </div>
        );
    }
    return (
        <div className=''>
            <div
                className="
        fixed bottom-5 left-5 
        bg-white bg-opacity-90 
        shadow-lg rounded-md 
        p-4 max-w-xs 
        font-bangla text-gray-700 
        text-sm font-medium
        z-50
      "
                style={{ backdropFilter: 'blur(6px)' }}
            >
                <button
                    type="button"
                    aria-label="পপআপ বন্ধ করুন"
                    onClick={() => setIsOpen(false)}
                    className="absolute -top-2 -right-2 grid h-6 w-6 place-items-center rounded-full border border-white/80 bg-white text-slate-600 shadow-md transition hover:scale-105 hover:text-slate-900"
                >
                    <X size={14} />
                </button>

                <div className="flex items-center gap-2 mb-2">
                    <CalendarCheck size={20} className="text-green-600" />
                    <p>
                        এনরোলমেন্ট শুরু: <span className="text-primary font-semibold">{formatDate(batch.enrollmentStartDate)}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarX size={20} className="text-red-600" />
                    <p>
                        এনরোলমেন্ট শেষ: <span className="text-primary font-semibold">{formatDate(batch.enrollmentEndDate)}</span>
                    </p>
                </div>
            </div>

            <Link
                href="#enroll-now"
                aria-label="এনরোলমেন্ট করুন"
                className="fixed left-[270px] bottom-[37px] z-50 group"
            >
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-400/55 via-cyan-400/45 to-blue-500/55 blur-lg group-hover:blur-xl transition-all duration-300" />
                <span className="absolute inset-[-7px] rounded-full border border-cyan-200/60 animate-ping" />
                <span className="absolute inset-[-10px] rounded-full border border-dashed border-white/35 animate-[spin_7s_linear_infinite]" />
                <span className="absolute -top-1 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(251,191,36,0.95)] animate-pulse" />

                <span className="relative grid h-11 w-11 place-items-center rounded-full border border-white/45 bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 text-white shadow-[0_12px_30px_rgba(6,182,212,0.52)] ring-1 ring-white/15 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:rotate-6">
                    <span className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white/28 via-white/10 to-transparent" />
                    <Rocket className="relative h-4.5 w-4.5 animate-bounce" />
                </span>

                <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-full border border-cyan-200/40 bg-slate-900/85 px-2 py-0.5 text-[9px] font-semibold tracking-[0.16em] text-cyan-100 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0.5">
                    ENROLL
                </span>
            </Link>
        </div>
    );
}
