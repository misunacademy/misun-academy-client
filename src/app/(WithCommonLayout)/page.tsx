import EnrollmentFixed from '@/components/module/home/EnrollmentFixed';
import HeroSection from '@/components/module/home/HeroSection';
import HomeDeferredSections from '@/components/module/home/HomeDeferredSections';
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd';
import { generateMetadata } from '@/lib/generateMetadata';

export const metadata = generateMetadata({
  title: 'কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স | MISUN Academy',
  description:
    'ডিজিটাল যুগে সফল ক্যারিয়ারের জন্য সেরা গ্রাফিক্স ডিজাইন কোর্স। ঘরে বসেই ডিজাইন শিখুন এবং ফ্রিল্যান্সিং করে ক্যারিয়ার গড়ুন MISUN Academy-এর সাথে। | Learn graphic design from home and build a successful freelancing career with MISUN Academy.',
  keywords: [
    'Graphic Design Course in Bangladesh',
    'Freelancing Graphic Course',
    'Graphic Design Online Course BD',
    'best graphic design course Bangladesh',
    'কমপ্লিট গ্রাফিক্স ডিজাইন কোর্স',
    'ফ্রিল্যান্সিং শেখা কোর্স',
    'misun academy graphic design',
    'graphic design course misun academy',
    'graphic design bangla course',
    'graphic design freelancing',
    'Adobe Photoshop course BD',
    'Illustrator course Bangladesh',
    'online graphic course',
    'freelancing skill development',
    'career in design Bangladesh',
    'design course for beginners',
    'graphic design for freelancing',
    'freelancing bd',
    'freelancing graphic',
    'misun academy',
    'misun graphic course',
    'graphic portfolio course',
  ],
  slug: '',
});

export default function page() {
  return (
    <div className="relative overflow-hidden bg-[#040a07]">
      <div
        className="absolute inset-0 opacity-[0.10] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, hsl(156 70% 42%) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[620px] h-[280px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-[8%] w-[300px] h-[200px] bg-primary/6 rounded-full blur-[90px] pointer-events-none" />

      <BreadcrumbJsonLd />
      <div className="relative z-10">
        <HeroSection />
        <HomeDeferredSections />
        <EnrollmentFixed />
      </div>
    </div>
  );
}
