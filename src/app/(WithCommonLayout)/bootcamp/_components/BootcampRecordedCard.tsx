import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Clock, Video } from 'lucide-react';
import type { BootcampRecordedCard as Card } from '@/redux/api/bootcampApi';

export const BootcampRecordedCard = ({ item }: { item: Card }) => {
    const image = item.thumbnail || item.posterImage;
    const hours = item.durationMinutes > 0 ? `${Math.round(item.durationMinutes / 60)} ঘণ্টা` : 'সেলফ-পেসড';

    return (
        <Link
            href={`/bootcamp/${item.slug}`}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-transform hover:scale-[1.01]"
        >
            <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                {image ? (
                    <Image
                        src={image}
                        alt={`${item.title} ${item.season}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Video className="h-10 w-10 text-white/30" />
                    </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-1 font-bangla text-xs font-semibold text-[#ffd60a]">
                    রেকর্ডিং
                </span>
                <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-xs text-white/85">
                    <PlayCircle className="h-3.5 w-3.5" />
                    {item.lessonsCount > 0 ? `${item.lessonsCount} ভিডিও` : 'ভিডিও'}
                </span>
            </div>
            <div className="space-y-2 p-4">
                <p className="font-bangla text-xs font-semibold tracking-wide text-white/50">
                    {item.season}
                </p>
                <h3 className="font-bangla text-lg font-bold leading-snug text-white group-hover:text-[#ffd60a]">
                    {item.title}
                </h3>
                {item.tagline ? (
                    <p className="line-clamp-2 font-bangla text-sm text-white/60">{item.tagline}</p>
                ) : null}
                <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 font-bangla text-xs text-white/55">
                        <Clock className="h-3.5 w-3.5" />
                        {hours} • লাইফটাইম অ্যাক্সেস
                    </span>
                    <span className="font-bangla text-base font-bold text-[#ffd60a]">
                        ৳{item.recordedPrice}
                    </span>
                </div>
            </div>
        </Link>
    );
};
