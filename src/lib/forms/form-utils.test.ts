import { describe, it, expect } from 'vitest';
import type { FieldErrors } from 'react-hook-form';
import {
  getFieldError,
  isFieldInvalid,
  getFieldId,
  getErrorId,
  getDescriptionId,
  cn,
} from '@/lib/forms/form-utils';

describe('getFieldError', () => {
  it('reads a top-level field message', () => {
    const errors = { title: { message: 'Required' } } as unknown as FieldErrors;
    expect(getFieldError(errors, 'title')).toBe('Required');
  });

  it('reads nested messages via dot paths', () => {
    const errors = { user: { email: { message: 'Bad email' } } } as unknown as FieldErrors;
    expect(getFieldError(errors, 'user.email')).toBe('Bad email');
  });

  it('returns undefined for missing fields or message-less errors', () => {
    const errors = { title: { type: 'required' } } as unknown as FieldErrors;
    expect(getFieldError({} as FieldErrors, 'missing')).toBeUndefined();
    expect(getFieldError(errors, 'title')).toBeUndefined();
  });
});

describe('isFieldInvalid', () => {
  it('is true only when a message exists', () => {
    const errors = { title: { message: 'Required' } } as unknown as FieldErrors;
    expect(isFieldInvalid(errors, 'title')).toBe(true);
    expect(isFieldInvalid({} as FieldErrors, 'title')).toBe(false);
  });
});

describe('id helpers', () => {
  it('builds stable ids with dots replaced by dashes', () => {
    expect(getFieldId('user.email')).toBe('field-user-email');
    expect(getErrorId('user.email')).toBe('field-user-email-error');
    expect(getDescriptionId('user.email')).toBe('field-user-email-description');
  });

  it('handles simple names', () => {
    expect(getFieldId('title')).toBe('field-title');
  });
});

describe('cn (form-utils)', () => {
  it('joins truthy classes and drops falsy ones', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });

  it('returns empty string with no classes', () => {
    expect(cn()).toBe('');
  });
});
