// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Counter from '@/components/shared/Counter';

const mockReducedMotion = (matches: boolean) => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
};

describe('Counter', () => {
  let rafSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockReducedMotion(true);
    rafSpy = vi.spyOn(window, 'requestAnimationFrame');
  });

  afterEach(() => {
    rafSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it('exposes the formatted value to assistive technology', () => {
    render(<Counter value={1234} />);
    expect(screen.getByText('1,234')).toBeInTheDocument();
  });

  it('formats Bengali numerals and affixes with the bn-BD locale', () => {
    render(<Counter value={2000} suffix="+" locale="bn-BD" />);
    expect(screen.getByText('২,০০০+')).toBeInTheDocument();
  });

  it('hides the animated digits from assistive technology', () => {
    const { container } = render(<Counter value={60} locale="en-US" />);
    expect(container.querySelector('.counter__row')).toHaveAttribute('aria-hidden', 'true');
    // two digits × ten numerals in each rolling strip
    expect(container.querySelectorAll('.counter__numeral')).toHaveLength(20);
  });

  it('does not schedule an animation frame when reduced motion is preferred', () => {
    render(<Counter value={60} />);
    expect(rafSpy).not.toHaveBeenCalled();
  });
});
