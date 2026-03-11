import { notFound } from 'next/navigation';
import { generateMetadata as genMeta } from '@/lib/generateMetadata';
import type { Metadata } from 'next';
import CourseDetails from '../GraphicDesignCourseDetails';


// ─── Static course config ────────────────────────────────────────────────────

const courseConfig = {
  'graphic-design': {
    title: 'কমপ্লিট গ্রাফিক্স ডিজাইন উইথ ফ্রিল্যান্সিং | MISUN Academy',
    description:
      'বেসিক থেকে অ্যাডভান্স লেভেল পর্যন্ত গ্রাফিক্স ডিজাইন শিখুন। লাইভ ক্লাস, ১:১ মেন্টরশিপ এবং ফ্রিল্যান্সিং গাইডসহ সম্পূর্ণ কোর্স।',
    keywords: [
      'Graphic Design Course',
      'Freelancing',
      'Graphic Design Bangladesh',
      'MISUN Academy',
      'কমপ্লিট গ্রাফিক্স ডিজাইন',
      'ফ্রিল্যান্সিং শেখা',
      'অনলাইন ডিজাইন কোর্স',
    ],
    image: '/course-og-image.png',
  },
  'english-for-professional-communication': {
    title: 'English For Professional Communication | MISUN Academy',
    description:
      'প্রফেশনাল পরিবেশে আত্মবিশ্বাসের সাথে ইংরেজি বলুন। Puspita Singha-র তত্ত্বাবধানে লাইভ ক্লাস, স্পিকিং প্র্যাকটিস ও সার্টিফিকেটসহ সম্পূর্ণ কোর্স।',
    keywords: [
      'English For Professional Communication',
      'Professional English Course',
      'English Speaking Bangladesh',
      'MISUN Academy',
      'ইংরেজি শেখা',
      'Business English',
      'English Course Online',
    ],
    image: '/english-og-image.png',
  },
} as const;

type CourseSlug = keyof typeof courseConfig;

// ─── Dynamic Metadata ────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const config = courseConfig[id as CourseSlug];
  if (!config) return {};

  return genMeta({
    title: config.title,
    description: config.description,
    keywords: [...config.keywords],
    slug: `courses/${id}`,
    image: config.image,
  });
}

// ─── Static Params (optional SSG) ───────────────────────────────────────────

export function generateStaticParams() {
  return Object.keys(courseConfig).map((id) => ({ id }));
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!courseConfig[id as CourseSlug]) notFound();

  return <CourseDetails />;


  notFound();
}
