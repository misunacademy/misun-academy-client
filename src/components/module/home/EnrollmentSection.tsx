/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { CalendarCheck, CalendarX } from "lucide-react";
import { useGetCurrentEnrollmentBatchQuery } from "@/redux/api/batchApi";
import { useGetBatchByIdQuery } from "@/redux/api/batchApi";
import { useGetSettingsQuery } from "@/redux/api/settingsApi";
import Countdown from "../course/Countdown";

dayjs.extend(relativeTime);
dayjs.extend(duration);


const formatDate = (date: Date | string) => {
    return dayjs(date).format('DD MMMM, YYYY');
};

export const EnrollmentSection = () => {
    const { data: settingsData, isLoading: settingsLoading } = useGetSettingsQuery();
    const featuredCourseId = (settingsData?.data?.featuredEnrollmentCourse as any)?._id;
    const featuredBatchId = (settingsData?.data?.featuredEnrollmentBatch as any)?._id;

    const { data: batchData, isLoading: batchLoading } = useGetCurrentEnrollmentBatchQuery(
        { courseId: featuredCourseId },
        { skip: !featuredCourseId || !!featuredBatchId }
    );

    const { data: featuredBatchData, isLoading: featuredBatchLoading } = useGetBatchByIdQuery(
        featuredBatchId || "",
        { skip: !featuredBatchId }
    );

    const batch = featuredBatchData?.data || batchData?.data;


    if (settingsLoading || batchLoading || featuredBatchLoading) {
        return (
            <section className="py-16 px-4 bg-primary/15 font-bangla">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center">
                        <p>Loading enrollment information...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!featuredCourseId) {
        return (
            <section className="py-16 px-4 bg-primary/15 font-bangla">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center">
                        <p>No featured course selected for enrollment.</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!batch) {
        return (
            <section className="py-16 px-4 bg-primary/15 font-bangla">
                <div className="max-w-6xl mx-auto space-y-8">
                    <div className="text-center">
                        <p>No active enrollment batches available at the moment.</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 px-4 bg-primary/15 font-bangla">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Hero Header */}
                <div className="text-center space-y-4 animate-fade-in">
                    <h2 className="text-3xl md:text-5xl font-bold text-secondary font-bangla">
                        <span className="text-primary"> কোর্সে ভর্তি</span> হতে চান? সময়ের সঙ্গে পাল্লা দিন!
                    </h2>
                    <p>তাই আর দেরি না করে এখনই প্রস্তুতি নিন, কারণ সময় শেষ হয়ে গেলে আবার অপেক্ষা...!</p>

                    {/* Countdown Timer */}
                    <Countdown/>
                </div>

                {/* Information Cards Grid */}
                <div className="">
                    {/* Enrollment dates */}
                    <div className="mt-6 text-gray-700 font-medium flex flex-row texl-lg md:text-xl justify-center gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            <CalendarCheck size={20} className="text-green-600" />
                            <p>এনরোলমেন্ট শুরু: <span className="text-primary font-semibold">{formatDate(batch.enrollmentStartDate)}</span></p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <CalendarX size={20} className="text-red-600" />
                            <p>এনরোলমেন্ট শেষ: <span className="text-primary font-bold">{formatDate(batch.enrollmentEndDate)}</span></p>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <div className="mt-4 w-fit border border-primary/20 rounded-lg px-6 py-4 bg-primary text-white font-bold font-bangla text-xl">
                            কোর্স ফি: মাত্র {batch.price} টাকা
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};