'use client';

import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { BootcampHero } from './_components/BootcampHero';
import { BootcampPerks } from './_components/BootcampPerks';
import { BootcampDoseSchedule } from './_components/BootcampDoseSchedule';
import { BootcampPayment } from './_components/BootcampPayment';
import { PosterStudio } from './_components/PosterStudio';
import { BootcampRegistrationForm } from './_components/BootcampRegistrationForm';
import { BootcampFaq } from './_components/BootcampFaq';
import { PreviousBootcampsGrid } from './_components/PreviousBootcampsGrid';
import {
    useGetCurrentBootcampQuery,
    useGetPastBootcampsQuery,
} from '@/redux/api/bootcampApi';

const BootcampPage = () => {
    const { data: currentData, isLoading: currentLoading } = useGetCurrentBootcampQuery();
    const { data: pastData, isLoading: pastLoading } = useGetPastBootcampsQuery();

    const current = currentData?.data ?? null;
    const past = pastData?.data ?? [];

    if (currentLoading || pastLoading) {
        return (
            <main className="bg-[#0a0a0b]">
                <div className="mx-auto max-w-6xl px-4 py-20">
                    <div className="h-64 animate-pulse rounded-2xl bg-white/5" />
                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/5" />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (!current) {
        return (
            <main className="bg-[#0a0a0b]">
                <section className="mx-auto max-w-6xl px-4 pb-2 pt-12">
                    <p className="font-bangla text-sm font-semibold tracking-wide text-[#ffd60a]">
                        বুটক্যাম্প রেকর্ডিং
                    </p>
                    <h1 className="mt-2 font-bangla text-3xl font-bold text-white sm:text-4xl">
                        আগের বুটক্যাম্পগুলো যেকোনো সময় কিনুন
                    </h1>
                    <p className="mt-3 max-w-2xl font-bangla text-white/60">
                        এখন কোনো লাইভ বুটক্যাম্প চলছে না। নিচের যেকোনো রেকর্ডিং কিনে লাইফটাইম অ্যাক্সেস নিন।
                    </p>
                </section>
                {past.length > 0 ? (
                    <PreviousBootcampsGrid items={past} title="সব রেকর্ডিং" />
                ) : (
                    <section className="mx-auto max-w-6xl px-4 py-14">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
                            <p className="font-bangla text-lg text-white/70">
                                এখনো কোনো রেকর্ডিং প্রকাশ হয়নি। শিগগিরই আসছে।
                            </p>
                        </div>
                    </section>
                )}
                <BreadcrumbJsonLd />
            </main>
        );
    }

    return (
        <main className="bg-[#0a0a0b]">
            <BootcampHero />
            <BootcampPerks />
            <BootcampDoseSchedule />
            <BootcampPayment />
            <PosterStudio />
            <BootcampRegistrationForm />
            <BootcampFaq />
            <PreviousBootcampsGrid items={past} />
            <BreadcrumbJsonLd />
        </main>
    );
};

export default BootcampPage;