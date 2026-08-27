import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/generateMetadata';
import BootcampPage from './BootcampPage';

export const metadata: Metadata = generateMetadata({
  title: 'প্যারাসিটামল ফর ফটোশপ Season 2.0 | ৪-দিনের গ্রাফিক ডিজাইন বুটক্যাম্প',
  description:
    'MISUN Academy-র প্যারাসিটামল ফর ফটোশপ Season 2.0 — ৪ দিনের অ্যাডভান্সড গ্রাফিক ডিজাইন বুটক্যাম্প। অ্যাডভান্সড ডিজাইন, পোর্টফোলিও, ক্লায়েন্ট হান্টিং, গিফট ও ইন্টার্নশিপ। ফি মাত্র ৩৫০ টাকা। ১৩–১৬ সেপ্টেম্বর, রাত ৯টা, জুমে।',
  keywords: [
    'Photoshop Bootcamp',
    'Graphic Design Bootcamp',
    'MISUN Academy',
    'প্যারাসিটামল ফর ফটোশপ',
    'গ্রাফিক ডিজাইন বুটক্যাম্প',
    'ফটোশপ কোর্স',
    'Online Bootcamp Bangladesh',
  ],
  slug: 'bootcamp',
});

export default function Page() {
  return <BootcampPage />;
}
