import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('joins plain class names', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('ignores falsy and nullish inputs', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b');
  });

  it('supports conditional object syntax', () => {
    expect(cn({ active: true, disabled: false }, 'base')).toBe('active base');
  });

  it('supports arrays of classes', () => {
    expect(cn(['a', 'b'], 'c')).toBe('a b c');
  });

  it('merges conflicting tailwind classes, last wins', () => {
    expect(cn('px-2 px-4')).toBe('px-4');
    expect(cn('text-red-500 text-blue-500')).toBe('text-blue-500');
  });

  it('keeps non-conflicting tailwind classes together', () => {
    expect(cn('px-2 py-1', 'font-bold')).toBe('px-2 py-1 font-bold');
  });

  it('merges conflicting classes across conditional inputs', () => {
    expect(cn('bg-red-500', { 'bg-blue-500': true })).toBe('bg-blue-500');
  });

  it('returns an empty string for no inputs', () => {
    expect(cn()).toBe('');
  });
});
