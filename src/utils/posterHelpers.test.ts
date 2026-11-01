import { describe, it, expect, vi } from 'vitest';
import {
  drawRoundedRect,
  normalizeText,
  toSlug,
  getCourseType,
  getBatchNumber,
  getTemplatePriority,
  clamp,
} from '@/utils/posterHelpers';

describe('normalizeText', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalizeText('  Hello   WORLD  ')).toBe('hello world');
  });

  it('returns empty string for nullish input', () => {
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(undefined)).toBe('');
    expect(normalizeText('')).toBe('');
  });
});

describe('toSlug', () => {
  it('converts a title to a slug', () => {
    expect(toSlug('Graphic Design Batch 5')).toBe('graphic-design-batch-5');
  });

  it('strips punctuation and collapses dashes', () => {
    expect(toSlug('Hello,  World!! -- Test')).toBe('hello-world-test');
  });

  it('returns empty string for nullish input', () => {
    expect(toSlug(null)).toBe('');
    expect(toSlug(undefined)).toBe('');
  });
});

describe('getCourseType', () => {
  it('detects graphic courses by keyword', () => {
    expect(getCourseType('Graphic Design & Freelancing')).toBe('graphic');
    expect(getCourseType('Photoshop Masterclass')).toBe('graphic');
    expect(getCourseType('Learn Illustrator')).toBe('graphic');
  });

  it('detects english courses by keyword', () => {
    expect(getCourseType('Spoken English Batch 3')).toBe('english');
    expect(getCourseType('IELTS Preparation')).toBe('english');
  });

  it('falls back to general', () => {
    expect(getCourseType('Digital Marketing 101')).toBe('general');
    expect(getCourseType(undefined)).toBe('general');
    expect(getCourseType(null)).toBe('general');
  });

  it('is case-insensitive', () => {
    expect(getCourseType('GRAPHIC DESIGN')).toBe('graphic');
    expect(getCourseType('SpOkEn EnGlIsH')).toBe('english');
  });
});

describe('getBatchNumber', () => {
  it('extracts the first number from a batch label', () => {
    expect(getBatchNumber('Batch 5')).toBe(5);
    expect(getBatchNumber('graphic-batch-12')).toBe(12);
  });

  it('returns null when there is no number', () => {
    expect(getBatchNumber('Batch X')).toBeNull();
  });

  it('returns null for nullish input', () => {
    expect(getBatchNumber(null)).toBeNull();
    expect(getBatchNumber(undefined)).toBeNull();
    expect(getBatchNumber('')).toBeNull();
  });
});

describe('getTemplatePriority', () => {
  it('alternates graphic templates by batch parity', () => {
    expect(getTemplatePriority('graphic', 2)).toEqual([1, 0]);
    expect(getTemplatePriority('graphic', 3)).toEqual([0, 1]);
  });

  it('alternates english templates opposite to graphic', () => {
    expect(getTemplatePriority('english', 2)).toEqual([0, 1]);
    expect(getTemplatePriority('english', 3)).toEqual([1, 0]);
  });

  it('treats null batch as odd (not even)', () => {
    expect(getTemplatePriority('graphic', null)).toEqual([0, 1]);
    expect(getTemplatePriority('general', null)).toEqual([0, 1]);
  });

  it('handles the general course type', () => {
    expect(getTemplatePriority('general', 4)).toEqual([1, 0]);
    expect(getTemplatePriority('general', 5)).toEqual([0, 1]);
  });
});

describe('clamp', () => {
  it('clamps below the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps above the maximum', () => {
    expect(clamp(99, 0, 10)).toBe(10);
  });

  it('passes through in-range values', () => {
    expect(clamp(4, 0, 10)).toBe(4);
  });
});

describe('drawRoundedRect', () => {
  it('traces a rounded rect path on the context', () => {
    const ctx = {
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawRoundedRect(ctx, 10, 20, 100, 50, 8);

    expect(ctx.beginPath).toHaveBeenCalledTimes(1);
    expect(ctx.moveTo).toHaveBeenCalledWith(18, 20);
    expect(ctx.quadraticCurveTo).toHaveBeenCalledTimes(4);
    expect(ctx.closePath).toHaveBeenCalledTimes(1);
  });
});
