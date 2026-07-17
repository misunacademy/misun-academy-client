import { generateMetadata as genMeta } from '@/lib/generateMetadata';
import type { Metadata } from 'next';
import FeedbackClient from './FeedbackClient';

export const revalidate = 3600;

export const metadata: Metadata = genMeta({
  title: 'Student Feedback & Testimonials | MISUN Academy',
  description:
    'Read real feedback and testimonials from MISUN Academy students. See how our courses have helped learners build successful careers in design and freelancing.',
  keywords: [
    'MISUN Academy Reviews',
    'Student Testimonials',
    'Graphic Design Feedback',
    'MISUN Academy Review',
    'Freelancing Course Feedback',
  ],
  slug: 'feedback',
});

export default function FeedbackPage() {
  return <FeedbackClient />;
}
