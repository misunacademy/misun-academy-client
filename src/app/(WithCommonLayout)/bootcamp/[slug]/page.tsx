import type { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/lib/generateMetadata';
import BootcampDetailClient from './BootcampDetailClient';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    return genMeta({
        title: `বুটক্যাম্প রেকর্ডিং | ${slug}`,
        description:
            'MISUN Academy বুটক্যাম্প রেকর্ডিং — একবার কিনলেই লাইফটাইম অ্যাক্সেস। সবার জন্য একই ভিডিও।',
        keywords: ['Bootcamp Recording', 'MISUN Academy', 'বুটক্যাম্প রেকর্ডিং'],
        slug: `bootcamp/${slug}`,
    });
}

export default function Page() {
    return <BootcampDetailClient />;
}
