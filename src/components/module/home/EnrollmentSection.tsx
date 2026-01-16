"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import { CalendarCheck, CalendarX } from "lucide-react";
import { useGetCurrentEnrollmentBatchQuery } from "@/redux/api/batchApi";
import { Card, CardContent } from "@/components/ui/card";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const formatCountdown = (diffInMillis: number) => {
    const dur = dayjs.duration(diffInMillis);
    const months = dur.months() ? `${dur.months()} মাস` : "";
    return `${months} ${dur.days()} দিন ${dur.hours()} ঘণ্টা ${dur.minutes()} মিনিট ${dur.seconds()} সেকেন্ড`;
};

const formatDate = (date: Date | string) => {
    return dayjs(date).format('DD MMMM, YYYY');
};

export const EnrollmentSection = () => {
    const [now, setNow] = useState(dayjs());
    const [countdown, setCountdown] = useState("");

    const { data: batchData, isLoading } = useGetCurrentEnrollmentBatchQuery({});

    const batch = batchData?.data;

    const start = batch ? dayjs(batch.enrollmentStartDate) : null;
    const end = batch ? dayjs(batch.enrollmentEndDate) : null;

    const isUpcoming = start && now.isBefore(start);
    const isOngoing = start && end && now.isAfter(start) && now.isBefore(end);
    const isEnded = end && now.isAfter(end);

    useEffect(() => {
        if (!batch) return;

        const interval = setInterval(() => {
            const current = dayjs();
            setNow(current);

            if (isUpcoming) {
                setCountdown(formatCountdown(start!.diff(current)));
            } else if (isOngoing) {
                setCountdown(formatCountdown(end!.diff(current)));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [batch, start, end, isUpcoming, isOngoing]);

    if (isLoading) {
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
                    {!isEnded && (
                        <Card className="mx-auto max-w-2xl bg-gradient-to-tr from-primary to-primary/90 shadow-elegant border-0">
                            <CardContent className="p-8">
                                <div className="text-center space-y-2">
                                    <p className="text-white/90 text-lg font-bangla">
                                        {isUpcoming ? "এনরোলমেন্ট শুরু হতে বাকি:" : "এনরোলমেন্ট শেষ হতে বাকি:"}
                                    </p>
                                    <div className="text-3xl md:text-4xl font-bold text-white font-bangla animate-countdown-pulse">
                                        {countdown}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
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