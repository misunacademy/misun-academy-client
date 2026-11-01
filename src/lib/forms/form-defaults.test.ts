import { describe, it, expect } from 'vitest';
import { pickDefault } from '@/lib/forms/form-defaults';

describe('pickDefault', () => {
  const defaults = { name: 'anon', age: 0, active: false };

  it('returns a copy of defaults when no data is given', () => {
    expect(pickDefault(defaults)).toEqual(defaults);
    expect(pickDefault(defaults, null)).toEqual(defaults);
    expect(pickDefault(defaults, undefined)).toEqual(defaults);
  });

  it('overrides defaults with provided values', () => {
    expect(pickDefault(defaults, { name: 'Ada' })).toEqual({
      name: 'Ada',
      age: 0,
      active: false,
    });
  });

  it('ignores undefined/null values and unknown keys', () => {
    expect(
      pickDefault(defaults, { name: undefined, age: null, extra: 1 } as unknown as Partial<typeof defaults>),
    ).toEqual(defaults);
  });

  it('does not mutate the defaults object', () => {
    const before = { ...defaults };
    pickDefault(defaults, { name: 'Grace' });
    expect(defaults).toEqual(before);
  });
});
