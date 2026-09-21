import { Suspense } from 'react';
import { generateMetadata as genMeta } from '@/lib/generateMetadata';
import BootcampWatchClient from './BootcampWatchClient';

export const metadata = genMeta({
    title: 'রেকর্ডেড সেশন দেখুন | MISUN Academy',
    description:
        'আপনার কেনা বুটক্যাম্প রেকর্ডিং দেখুন — ভিডিও প্লেলিস্ট ও প্রতিটা সেশনের রিসোর্সসহ।',
    keywords: ['Bootcamp Recording', 'MISUN Academy', 'বুটক্যাম্প রেকর্ডিং'],
});

export default function Page() {
    return (
        <Suspense fallback={null}>
            <BootcampWatchClient />
        </Suspense>
    );
}
