'use client';

import { useEffect } from 'react';
import { trackCustom } from '@/lib/metaPixel';

export default function HomepageTracker() {
  useEffect(() => {
    trackCustom("HomepageView");
  }, []);

  return null;
}
