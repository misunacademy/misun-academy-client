export const COURSE_SLUGS = {
  GRAPHIC_DESIGN: 'complete-graphic-design-with-freelancing',
  ENGLISH: 'english-for-professional-communication',
} as const;

export type CourseSlug = (typeof COURSE_SLUGS)[keyof typeof COURSE_SLUGS];

/** Default course prices used for analytics tracking and fallbacks */
export const COURSE_PRICES = {
  GRAPHIC_DESIGN_BDT: 4500,
} as const;

/** Fallback title used when no enrollment/batch data is available */
export const FALLBACK_COURSE_TITLE = 'AI Powered Complete Graphic Design with Freelancing';
