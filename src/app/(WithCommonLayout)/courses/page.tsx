import { generateMetadata } from '@/lib/generateMetadata';
import CoursesListClient from './CoursesListClient';

export const metadata = generateMetadata({
  title: 'কোর্সসমূহ | MISUN Academy',
  description:
    'MISUN Academy-এর সকল কোর্স দেখুন। গ্রাফিক্স ডিজাইন থেকে ইংরেজি শেখা — আপনার পছন্দের কোর্সে এনরোল করুন এবং ক্যারিয়ার গড়ুন।',
  keywords: [
    'Graphic Design Course',
    'Spoken English Course',
    'Freelancing',
    'MISUN Academy',
    'অনলাইন কোর্স',
    'গ্রাফিক্স ডিজাইন',
    'ইংরেজি শেখা',
    'Design Career',
    'Bangladesh',
  ],
  slug: 'courses',
});

export default function CoursesPage() {
  return <CoursesListClient />;
}
