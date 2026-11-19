import { Metadata } from 'next';
import DigitalProductsPageClient from './DigitalProductsPageClient';

export const metadata: Metadata = {
    title: 'ডিজিটাল প্রোডাক্টস ও শর্টকাট স্ক্রিপ্ট | MISUN Academy',
    description:
        'ফটোশপ ও ইলাস্ট্রেটর অটোমেশন স্ক্রিপ্ট, অ্যাকশন ও রিসোর্স। ডিজাইনারদের কাজের গতি ১০ গুণ বাড়িয়ে দেওয়ার প্রফেশনাল শর্টকাট স্ক্রিপ্ট প্যাক।',
    keywords: [
        'Photoshop scripts',
        'Illustrator scripts',
        'Graphic design automation',
        'ফটোশপ স্ক্রিপ্ট',
        'ইলাস্ট্রেটর স্ক্রিপ্ট',
        'MISUN Academy',
        'Digital Products',
    ],
    openGraph: {
        title: 'ডিজিটাল প্রোডাক্টস ও শর্টকাট স্ক্রিপ্ট | MISUN Academy',
        description:
            'ফটোশপ ও ইলাস্ট্রেটর অটোমেশন স্ক্রিপ্ট, অ্যাকশন ও রিসোর্স। ডিজাইনারদের কাজের গতি ১০ গুণ বাড়িয়ে দেওয়ার প্রফেশনাল শর্টকাট স্ক্রিপ্ট প্যাক।',
        url: 'https://misunacademy.com/digital-products',
        siteName: 'MISUN Academy',
        locale: 'bn_BD',
        type: 'website',
    },
};

export default function DigitalProductsPage() {
    return <DigitalProductsPageClient />;
}
