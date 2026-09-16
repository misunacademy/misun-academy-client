import { Suspense } from 'react';
import { generateMetadata as genMeta } from '@/lib/generateMetadata';
import BootcampDetailClient from './BootcampDetailClient';

export const metadata = genMeta({
    title: 'বুটক্যাম্প রেকর্ডিং | MISUN Academy',
    description:
        'MISUN Academy বুটক্যাম্প রেকর্ডিং — একবার কিনলেই লাইফটাইম অ্যাক্সেস। সবার জন্য একই ভিডিও।',
    keywords: ['Bootcamp Recording', 'MISUN Academy', 'বুটক্যাম্প রেকর্ডিং'],
});

export default function Page() {
    return (
        <Suspense fallback={null}>
            <BootcampDetailClient />
        </Suspense>
    );
}
