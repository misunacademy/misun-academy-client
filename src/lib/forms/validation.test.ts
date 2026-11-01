import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  requiredString,
  optionalString,
  emailField,
  passwordField,
  phoneField,
  urlField,
  dateField,
  optionalDateField,
  imageUrlField,
  numericField,
  optionalNumericField,
  enumField,
  booleanField,
  tagsField,
  linesField,
  confirmPasswordField,
  passwordsMustMatch,
  dateRange,
  createFormDefaults,
} from '@/lib/forms/validation';

describe('requiredString', () => {
  it('rejects empty strings with the label in the message', () => {
    const result = requiredString('Title').safeParse('');
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Title is required');
    }
  });

  it('accepts non-empty strings', () => {
    expect(requiredString('Title').safeParse('hello').success).toBe(true);
  });
});

describe('optionalString / phoneField / optionalDateField', () => {
  it('defaults missing values to empty string', () => {
    expect(optionalString().parse(undefined)).toBe('');
    expect(phoneField().parse(undefined)).toBe('');
    expect(optionalDateField().parse(undefined)).toBe('');
  });
});

describe('emailField', () => {
  it('accepts valid emails and rejects invalid ones', () => {
    expect(emailField().safeParse('a@b.com').success).toBe(true);
    const bad = emailField().safeParse('not-an-email');
    expect(bad.success).toBe(false);
    if (!bad.success) {
      expect(bad.error.issues[0].message).toBe('Please enter a valid email address');
    }
  });
});

describe('passwordField', () => {
  it('enforces the minimum length', () => {
    expect(passwordField().safeParse('12345').success).toBe(false);
    expect(passwordField().safeParse('123456').success).toBe(true);
    const custom = passwordField(10).safeParse('123456789');
    expect(custom.success).toBe(false);
    if (!custom.success) {
      expect(custom.error.issues[0].message).toContain('10');
    }
  });
});

describe('urlField / imageUrlField', () => {
  it('accepts empty string as "no url"', () => {
    expect(urlField().safeParse('').success).toBe(true);
    expect(imageUrlField().safeParse('').success).toBe(true);
  });

  it('rejects non-url strings', () => {
    expect(urlField().safeParse('not a url').success).toBe(false);
  });

  it('accepts valid urls', () => {
    expect(urlField().safeParse('https://example.com/x').success).toBe(true);
  });
});

describe('dateField', () => {
  it('requires a date', () => {
    expect(dateField().safeParse('').success).toBe(false);
    expect(dateField().safeParse('2026-01-01').success).toBe(true);
  });
});

describe('numericField / optionalNumericField', () => {
  it('coerces numeric strings and rejects negatives', () => {
    expect(numericField('Price').parse('42')).toBe(42);
    const bad = numericField('Price').safeParse(-1);
    expect(bad.success).toBe(false);
    if (!bad.success) {
      expect(bad.error.issues[0].message).toBe('Price must be positive');
    }
  });

  it('optional numeric accepts undefined', () => {
    expect(optionalNumericField().safeParse(undefined).success).toBe(true);
  });
});

describe('enumField', () => {
  it('accepts listed values and rejects others with a friendly message', () => {
    const schema = enumField(['a', 'b'] as const, 'choice');
    expect(schema.safeParse('a').success).toBe(true);
    const bad = schema.safeParse('zzz');
    expect(bad.success).toBe(false);
    if (!bad.success) {
      expect(bad.error.issues[0].message).toBe('Please select a choice');
    }
  });
});

describe('booleanField', () => {
  it('defaults to false', () => {
    expect(booleanField().parse(undefined)).toBe(false);
  });
});

describe('tagsField', () => {
  it('splits comma/newline separated tags and trims', () => {
    expect(tagsField().parse('a, b\nc ,, ')).toEqual(['a', 'b', 'c']);
  });

  it('parses missing input to an empty array (default flows through the transform)', () => {
    expect(tagsField().parse(undefined)).toEqual([]);
  });
});

describe('linesField', () => {
  it('splits lines and commas into an array', () => {
    expect(linesField().parse('one\ntwo, three')).toEqual(['one', 'two', 'three']);
  });
});

describe('confirmPasswordField', () => {
  it('requires a value', () => {
    expect(confirmPasswordField().safeParse('').success).toBe(false);
  });
});

describe('passwordsMustMatch', () => {
  it('passes when passwords match', () => {
    const schema = passwordsMustMatch();
    expect(
      schema.safeParse({ password: 'secret1', confirmPassword: 'secret1' }).success,
    ).toBe(true);
  });

  it('fails on confirmPassword when they differ', () => {
    const schema = passwordsMustMatch();
    const result = schema.safeParse({ password: 'secret1', confirmPassword: 'other' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['confirmPassword']);
      expect(result.error.issues[0].message).toBe('Passwords do not match');
    }
  });
});

describe('dateRange', () => {
  it('accepts a valid range', () => {
    expect(
      dateRange().safeParse({ from: '2026-01-01', to: '2026-02-01' }).success,
    ).toBe(true);
  });

  it('rejects an end date before the start date', () => {
    const result = dateRange().safeParse({ from: '2026-02-01', to: '2026-01-01' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(['to']);
    }
  });

  it('requires both dates', () => {
    expect(dateRange().safeParse({ from: '', to: '' }).success).toBe(false);
  });
});

describe('createFormDefaults', () => {
  it('builds defaults per field type', () => {
    const schema = z.object({
      title: z.string(),
      count: z.number(),
      active: z.boolean(),
      items: z.array(z.string()),
      maybe: z.string().optional(),
      role: z.enum(['admin', 'user']),
      nick: z.string().default('anon'),
    });
    expect(createFormDefaults(schema)).toEqual({
      title: '',
      count: 0,
      active: false,
      items: [],
      maybe: undefined,
      role: 'admin',
      nick: 'anon',
    });
  });
});
