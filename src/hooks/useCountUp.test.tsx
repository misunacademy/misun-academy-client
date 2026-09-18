// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCountUp } from '@/hooks/useCountUp';

describe('useCountUp', () => {
  let rafCallbacks: FrameRequestCallback[];
  let rafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    rafCallbacks = [];
    rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      });
  });

  afterEach(() => {
    rafSpy.mockRestore();
  });

  const runFrames = (timestamps: number[]) => {
    act(() => {
      for (const t of timestamps) {
        const cb = rafCallbacks.shift();
        cb?.(t);
      }
    });
  };

  it('stays at 0 until started', () => {
    const { result } = renderHook(() => useCountUp(100, 1000, false));
    expect(result.current).toBe(0);
    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('counts up to the target with easing', () => {
    const { result } = renderHook(() => useCountUp(100, 1000, true));
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);

    // NOTE: timestamps must be non-zero — the hook guards startTime with
    // `if (!startTime)`, so a 0 timestamp would reset it every frame.
    // first frame establishes startTime, progress 0
    runFrames([16]);
    expect(result.current).toBe(0);

    // halfway through duration=1000: eased = 1 - (1-0.5)^3 = 0.875 -> 87
    runFrames([516]);
    expect(result.current).toBe(87);

    // completion lands exactly on target
    runFrames([1016]);
    expect(result.current).toBe(100);
  });

  it('restarts when start flips from false to true', () => {
    const { result, rerender } = renderHook(
      ({ start }: { start: boolean }) => useCountUp(50, 1000, start),
      { initialProps: { start: false } },
    );
    expect(result.current).toBe(0);
    rerender({ start: true });
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
