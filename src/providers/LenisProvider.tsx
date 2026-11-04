'use client';

import { useReducedMotion } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import 'lenis/dist/lenis.css';

const MARKETING_ROUTES = [
  '/about',
  '/bootcamp',
  '/course-details',
  '/feedback',
  '/maintenance',
  '/privacy-policy',
  '/refund-policy',
  '/terms-and-conditions',
];

export function isMarketingPath(pathname: string) {
  if (pathname === '/') return true;

  return MARKETING_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion || !isMarketingPath(pathname ?? '/')) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
