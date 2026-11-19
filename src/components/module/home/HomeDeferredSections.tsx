import { DigitalProductsSection } from '@/app/(WithCommonLayout)/bootcamp/_components/DigitalProductsSection';
import dynamic from 'next/dynamic';

const WhyThisCourse = dynamic(() => import('./WhyThisCourse'));
const GraphicsSkills = dynamic(() => import('./GraphicsSkills'));
const WhyUs = dynamic(() => import('./WhyUs'));
const EnrollmentSection = dynamic(() =>
  import('./EnrollmentSection').then((m) => m.EnrollmentSection)
);
const Feedback = dynamic(() => import('./Feedback'));

export default function HomeDeferredSections() {
  return (
    <>
      <WhyThisCourse />
      <GraphicsSkills />
      <WhyUs />
      <div id="enroll-now-anchor">
        <EnrollmentSection />
      </div>
      <DigitalProductsSection />
      <Feedback />
    </>
  );
}
