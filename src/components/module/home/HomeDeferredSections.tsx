'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import dynamic from 'next/dynamic';

const WhyThisCourse = dynamic(() => import('./WhyThisCourse'), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="900px" />,
});

const GraphicsSkills = dynamic(() => import('./GraphicsSkills'), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="900px" />,
});

const WhyUs = dynamic(() => import('./WhyUs'), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="1000px" />,
});

const EnrollmentSection = dynamic(
  () => import('./EnrollmentSection').then((m) => m.EnrollmentSection),
  {
    ssr: false,
    loading: () => <SectionSkeleton minHeight="700px" />,
  }
);

const Feedback = dynamic(() => import('./Feedback'), {
  ssr: false,
  loading: () => <SectionSkeleton minHeight="1100px" />,
});

function SectionSkeleton({ minHeight }: { minHeight: string }) {
  return (
    <div
      aria-hidden="true"
      className="w-full bg-[#060f0a]"
      style={{ minHeight }}
    />
  );
}

function DeferredSection({
  children,
  minHeight,
  rootMargin = '300px',
  anchorId,
}: {
  children: ReactNode;
  minHeight: string;
  rootMargin?: string;
  anchorId?: string;
}) {
  const [visible, setVisible] = useState(false);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible || !placeholderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(placeholderRef.current);

    return () => observer.disconnect();
  }, [visible, rootMargin]);

  if (visible) {
    return <div id={anchorId}>{children}</div>;
  }

  return (
    <div id={anchorId} ref={placeholderRef}>
      <SectionSkeleton minHeight={minHeight} />
    </div>
  );
}

export default function HomeDeferredSections() {
  return (
    <>
      <DeferredSection minHeight="900px">
        <WhyThisCourse />
      </DeferredSection>

      <DeferredSection minHeight="900px">
        <GraphicsSkills />
      </DeferredSection>

      <DeferredSection minHeight="1000px">
        <WhyUs />
      </DeferredSection>

      <DeferredSection minHeight="700px" rootMargin="250px" anchorId="enroll-now-anchor">
        <EnrollmentSection />
      </DeferredSection>

      <DeferredSection minHeight="1100px" rootMargin="250px">
        <Feedback />
      </DeferredSection>
    </>
  );
}
