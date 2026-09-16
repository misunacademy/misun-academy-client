export const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

export const normalizeText = (value?: string | null) =>
  (value || '').toLowerCase().replace(/\s+/g, ' ').trim();

export const toSlug = (value?: string | null) =>
  normalizeText(value)
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

export const getCourseType = (title?: string | null): 'graphic' | 'english' | 'general' => {
  const normalized = normalizeText(title);
  if (/(graphic|design|freelancing|photoshop|illustrator)/i.test(normalized)) return 'graphic';
  if (/(english|spoken|ielts|language)/i.test(normalized)) return 'english';
  return 'general';
};

export const getBatchNumber = (batchValue?: string | null): number | null => {
  if (!batchValue) return null;
  const match = batchValue.match(/(\d+)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
};

export const getTemplatePriority = (
  courseType: 'graphic' | 'english' | 'general',
  batchNumber: number | null,
) => {
  const isEvenBatch = batchNumber !== null ? batchNumber % 2 === 0 : false;
  if (courseType === 'graphic') return isEvenBatch ? [1, 0] : [0, 1];
  if (courseType === 'english') return isEvenBatch ? [0, 1] : [1, 0];
  return isEvenBatch ? [1, 0] : [0, 1];
};

export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
