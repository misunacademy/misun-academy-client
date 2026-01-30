import { generateMetadata } from '@/lib/generateMetadata';
import CourseDetails from './CourseDetails';

export const metadata = generateMetadata({
  title: 'কোর্স সম্পর্কে | MISUN Academy',
  description:
    'ঘরে বসেই ডিজাইন শেখা এবং সফল ক্যারিয়ার গড়ার সেরা সুযোগ। MISUN Academy-এর সাথে শুরু হোক আপনার গ্রাফিক্স ডিজাইন জার্নি। | Learn from home, build your creative career with MISUN Academy.',
  keywords: [
    'Graphic Design Course',
    'Freelancing',
    'course details',
    'misun academy course',
    'misun academy course details',
    'Graphic Design Bangladesh',
    'MISUN Academy',
    'Design Career',
    'কমপ্লিট গ্রাফিক্স ডিজাইন',
    'ফ্রিল্যান্সিং শেখা',
    'অনলাইন ডিজাইন কোর্স',
  ],
  slug: 'courses',
  image: '/course-og-image.png'
});


export default function CoursesPage() {
  return (
    <div>
     <CourseDetails />
    </div>
  );
}
