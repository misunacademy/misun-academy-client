import { describe, it, expect } from 'vitest';
import metaPixel, { initPixel, track, trackCustom, trackPageView } from '@/lib/metaPixel';

// NOTE: these tests run in the node environment (no window/document), so they
// only cover the module's safe-to-call-before-load behavior: every export must
// no-op without throwing when the browser globals are absent.

describe('metaPixel (no browser globals)', () => {
  it('initPixel no-ops without a pixel id or window', () => {
    expect(() => initPixel(undefined)).not.toThrow();
    expect(() => initPixel('123456')).not.toThrow();
  });

  it('track / trackCustom / trackPageView no-op without window', () => {
    expect(() => track('Purchase', { value: 10 })).not.toThrow();
    expect(() => trackCustom('MyEvent', { foo: 'bar' })).not.toThrow();
    expect(() => trackPageView()).not.toThrow();
  });

  it('exposes the same helpers on the default export', () => {
    expect(metaPixel.initPixel).toBe(initPixel);
    expect(metaPixel.track).toBe(track);
    expect(metaPixel.trackCustom).toBe(trackCustom);
    expect(metaPixel.trackPageView).toBe(trackPageView);
  });
});
