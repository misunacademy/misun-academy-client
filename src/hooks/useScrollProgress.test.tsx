// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('lenis/react', () => ({ useLenis: () => null }));

import { useScrollProgress } from '@/hooks/useScrollProgress';

describe('useScrollProgress', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('starts hidden with zero progress at the top', () => {
    const { result } = renderHook(() => useScrollProgress(200));
    expect(result.current.isVisible).toBe(false);
    expect(result.current.progress).toBe(0);
  });

  it('becomes visible after scrolling past the threshold', () => {
    const { result } = renderHook(() => useScrollProgress(200));
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isVisible).toBe(true);
  });

  it('hides again when scrolled back above the threshold', () => {
    const { result } = renderHook(() => useScrollProgress(200));
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isVisible).toBe(true);
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isVisible).toBe(false);
  });

  it('scrollToTop falls back to window.scrollTo without lenis', () => {
    const { result } = renderHook(() => useScrollProgress());
    act(() => result.current.scrollToTop());
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
