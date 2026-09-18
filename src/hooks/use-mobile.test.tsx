// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/use-mobile';

function stubMatchMedia() {
  const listeners = new Set<() => void>();
  const mql = {
    addEventListener: vi.fn((_type: string, cb: () => void) => {
      listeners.add(cb);
    }),
    removeEventListener: vi.fn((_: string, cb: () => void) => {
      listeners.delete(cb);
    }),
  };
  // jsdom does not implement matchMedia, so assign a stub directly
  // instead of spying on it.
  Object.defineProperty(window, 'matchMedia', {
    value: vi.fn().mockReturnValue(mql),
    configurable: true,
    writable: true,
  });
  return { mql, listeners };
}

let lastStub: ReturnType<typeof stubMatchMedia>;

describe('useIsMobile', () => {
  beforeEach(() => {
    lastStub = stubMatchMedia();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns true on narrow viewports', () => {
    Object.defineProperty(window, 'innerWidth', { value: 375, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false on wide viewports', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('updates when the media query changes', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1280, configurable: true });
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 500, configurable: true });
      // trigger the subscribed change listener
      const cb = lastStub.mql.addEventListener.mock.calls[0][1] as () => void;
      cb();
    });
    expect(result.current).toBe(true);
  });
});
