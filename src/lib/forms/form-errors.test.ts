import { describe, it, expect, vi } from 'vitest';

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

import { toast } from 'sonner';
import {
  parseApiFormError,
  showFormToast,
  showFormSuccessToast,
  mapServerErrorsToForm,
} from '@/lib/forms/form-errors';

describe('parseApiFormError', () => {
  it('prefers the server message and maps field errors', () => {
    const result = parseApiFormError({
      data: { message: 'Validation failed', errors: { email: ['Taken'], name: ['Too short', 'Other'] } },
    });
    expect(result.message).toBe('Validation failed');
    expect(result.fieldErrors).toEqual({ email: 'Taken', name: 'Too short' });
  });

  it('falls back to error.message then a generic message', () => {
    expect(parseApiFormError({ message: 'Boom' }).message).toBe('Boom');
    expect(parseApiFormError({}).message).toBe('Something went wrong');
  });

  it('handles non-object errors', () => {
    expect(parseApiFormError(null).message).toBe('An unexpected error occurred');
    expect(parseApiFormError('oops').message).toBe('An unexpected error occurred');
  });

  it('omits fieldErrors when the server sent none', () => {
    expect(parseApiFormError({ data: { message: 'Nope' } }).fieldErrors).toBeUndefined();
  });
});

describe('showFormToast / showFormSuccessToast', () => {
  it('surfaces the parsed message as an error toast', () => {
    showFormToast({ data: { message: 'Bad input' } });
    expect(toast.error).toHaveBeenCalledWith('Bad input');
  });

  it('shows a success toast with default text', () => {
    showFormSuccessToast();
    expect(toast.success).toHaveBeenCalledWith('Saved successfully');
    showFormSuccessToast('Done!');
    expect(toast.success).toHaveBeenCalledWith('Done!');
  });
});

describe('mapServerErrorsToForm', () => {
  it('passes server errors through as form errors', () => {
    expect(mapServerErrorsToForm({ email: 'Taken' })).toEqual({ email: 'Taken' });
  });
});
