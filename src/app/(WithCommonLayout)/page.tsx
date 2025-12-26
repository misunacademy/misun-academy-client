import { EnrollmentSection } from '@/components/module/home/EnrollmentSection';
import Feedback from '@/components/module/home/Feedback';
import GraphicsSkills from '@/components/module/home/GraphicsSkills';
import HeroSection from '@/components/module/home/HeroSection';
import WhyThisCourse from '@/components/module/home/WhyThisCourse';
import WhyUs from '@/components/module/home/WhyUs';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { generateMetadata } from '@/lib/generateMetadata';

export const metadata = generateMetadata({
  title: 'কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স | MISUN Academy',
  description:
    'ডিজিটাল যুগে সফল ক্যারিয়ারের জন্য সেরা গ্রাফিক্স ডিজাইন কোর্স। ঘরে বসেই ডিজাইন শিখুন এবং ফ্রিল্যান্সিং করে ক্যারিয়ার গড়ুন MISUN Academy-এর সাথে। | Learn graphic design from home and build a successful freelancing career with MISUN Academy.',
  keywords: [
    'Graphics Design Course in Bangladesh',
    'Freelancing Graphics Course',
    'Graphic Design Online Course BD',
    'best graphics design course Bangladesh',
    'কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স',
    'ফ্রিল্যান্সিং শেখা কোর্স',
    'misun academy graphics design',
    'graphic design course misun academy',
    'graphic design bangla course',
    'graphic design freelancing',
    'Adobe Photoshop course BD',
    'Illustrator course Bangladesh',
    'online graphics course',
    'freelancing skill development',
    'career in design Bangladesh',
    'design course for beginners',
    'graphic design for freelancing',
    'freelancing bd',
    'freelancing graphics',
    'misun academy',
    'misun graphic course',
    'graphics portfolio course',
  ],
  slug: '',
});

export default function page() {
  return (
    <div>
      <BreadcrumbJsonLd />
      <HeroSection />
      <WhyThisCourse />
      <GraphicsSkills />
      <WhyUs />
      <EnrollmentSection />
      <Feedback />
      {/* <Partner /> */}
      {/* <EnrollmentFixed /> */}
    </div>
  );
}
