import type { BootcampRecordedCard as Card } from '@/redux/api/bootcampApi';
import { BootcampRecordedCard } from './BootcampRecordedCard';

export const PreviousBootcampsGrid = ({ items, title }: { items: Card[]; title?: string }) => {
    if (!items || items.length === 0) return null;

    return (
        <section className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="font-bangla text-sm font-semibold tracking-wide text-[#ffd60a]">
                        পূর্বের বুটক্যাম্প
                    </p>
                    <h2 className="mt-1 font-bangla text-2xl font-bold text-white sm:text-3xl">
                        {title ?? 'সব রেকর্ডিং বুটক্যাম্প'}
                    </h2>
                    <p className="mt-2 max-w-2xl font-bangla text-sm text-white/60">
                        লাইভ বুটক্যাম্প মিস করেছেন? রেকর্ডিং কিনে যেকোনো সময় দেখুন — লাইফটাইম অ্যাক্সেস, সবার জন্য একই ভিডিও।
                    </p>
                </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                    <BootcampRecordedCard key={item._id} item={item} />
                ))}
            </div>
        </section>
    );
};
