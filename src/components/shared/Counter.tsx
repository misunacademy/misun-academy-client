'use client';

import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import './Counter.css';

const ROOT = 'counter';
const SR = 'counter__sr';
const ROW = 'counter__row';
const AFFIX = 'counter__affix';
const DIGIT = 'counter__digit';
const SIZER = 'counter__sizer';
const WINDOW = 'counter__window';
const STRIP = 'counter__strip';
const NUMERAL = 'counter__numeral';
const SYMBOL = 'counter__symbol';
const SYMBOL_TEXT = 'counter__symbol-text';
const BLUR = 'counter__blur';
const MEASURE = 'counter__measure';

const TAU = Math.PI * 2;
const NUMERIC = new Set<string>(['integer', 'group', 'decimal', 'fraction']);
const DIRECTIONS = ['auto', 'up', 'down', 'shortest'] as const;
const MASK =
  'linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, 0.0355) calc(var(--counter-fade, 0em) * 0.1667), rgba(0, 0, 0, 0.2099) calc(var(--counter-fade, 0em) * 0.3333), rgba(0, 0, 0, 0.5) calc(var(--counter-fade, 0em) * 0.5), rgba(0, 0, 0, 0.7901) calc(var(--counter-fade, 0em) * 0.6667), rgba(0, 0, 0, 0.9645) calc(var(--counter-fade, 0em) * 0.8333), #000 var(--counter-fade, 0em), #000 calc(100% - var(--counter-fade, 0em)), rgba(0, 0, 0, 0.9645) calc(100% - var(--counter-fade, 0em) * 0.8333), rgba(0, 0, 0, 0.7901) calc(100% - var(--counter-fade, 0em) * 0.6667), rgba(0, 0, 0, 0.5) calc(100% - var(--counter-fade, 0em) * 0.5), rgba(0, 0, 0, 0.2099) calc(100% - var(--counter-fade, 0em) * 0.3333), rgba(0, 0, 0, 0.0355) calc(100% - var(--counter-fade, 0em) * 0.1667), rgba(0, 0, 0, 0) 100%)';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export interface CounterProps {
  /** The number to show. Digits roll to every new value. */
  value?: number;
  /** Locale used for separators, symbols and numerals. */
  locale?: string;
  /** Formatting options such as currency, percent, units or compact notation. */
  format?: Intl.NumberFormatOptions;
  /** Fixed number of decimal places. Leave it out to use the format defaults. */
  decimals?: number;
  /** Pads the whole part with leading zeros. */
  minDigits?: number;
  /** Content shown before the number. */
  prefix?: ReactNode;
  /** Content shown after the number. */
  suffix?: ReactNode;
  /** Which way digits roll. Auto rolls up as the number grows and down as it shrinks. */
  direction?: (typeof DIRECTIONS)[number];
  /** Roughly how long a roll takes, in seconds. */
  duration?: number;
  /** How much digits overshoot before settling, from 0 to 0.9. */
  bounce?: number;
  /** Delay in seconds between neighbouring digits, so changes ripple from the right. */
  stagger?: number;
  /** Blurs digits along their path while they spin fast. */
  motionBlur?: boolean;
  /** Spins every digit once and lands it when the counter first scrolls into view. */
  intro?: boolean;
  /** How far in em digits roll beyond the text before fading out. 0 clips them at the edge. */
  fade?: number;
  /** Font size in px, or any CSS size such as `inherit`. */
  fontSize?: number | string;
  /** Font weight of the number. */
  fontWeight?: number | string;
  /** Color of the number. */
  textColor?: string;
  /** Space between digits and symbols in px. */
  gap?: number;
  /** Extra height in px added to each digit, which also spaces out rolling digits. */
  padding?: number;
  /** Keeps every digit the same width. When off, widths ease between digits as they roll. */
  tabular?: boolean;
  /** Styles for each digit box, for example a tile background with padding and radius. */
  digitStyle?: CSSProperties;
  /** Extra class names for the root. */
  className?: string;
  /** Inline styles for the root. */
  style?: CSSProperties;
}

type SlotKind = 'digit' | 'symbol';

interface Slot {
  key: string;
  kind: SlotKind;
  digit: number;
  text: string;
  rank: number;
  start?: number;
}

interface Item {
  kind: SlotKind;
  rank: number;
  pos: number;
  vel: number;
  target: number;
  shown: number;
  shownVel: number;
  shownTarget: number;
  wait: number;
  exiting: boolean;
  natural: number;
  el: HTMLElement | null;
  numerals: HTMLElement[] | null;
  strip: HTMLElement | null;
  blur: SVGFEGaussianBlurElement | null;
  filter: string;
  blurred: boolean;
}

interface Settings {
  direction: (typeof DIRECTIONS)[number];
  duration: number;
  bounce: number;
  stagger: number;
  motionBlur: boolean;
  tabular: boolean;
}

interface Engine {
  items: Map<string, Item>;
  raf: number;
  last: number;
  ready: boolean;
  value: number;
  widths: number[];
  em: number;
}

type CounterStyle = CSSProperties & {
  '--counter-fade'?: string;
  '--counter-gap'?: string;
  '--counter-padding'?: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const mod = (value: number, base: number) => ((value % base) + base) % base;

const wrap = (offset: number) => mod(offset + 5, 10) - 5;

const prefersReduced = () =>
  typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

const stepBetween = (from: number, to: number, direction: Settings['direction']) => {
  const up = mod(to - from, 10);
  if (direction === 'up') return up;
  if (direction === 'down') return up === 0 ? 0 : up - 10;
  return up > 5 ? up - 10 : up;
};

const createFormatter = (locale: string, options?: Intl.NumberFormatOptions) => {
  try {
    return new Intl.NumberFormat(locale, options);
  } catch {
    return new Intl.NumberFormat('en-US');
  }
};

const digitsFor = (formatter: Intl.NumberFormat) => {
  const { locale, numberingSystem } = formatter.resolvedOptions();
  const plain = createFormatter(locale, { numberingSystem, useGrouping: false });
  return Array.from({ length: 10 }, (_, digit) => plain.format(digit));
};

const slotsFor = (formatter: Intl.NumberFormat, digits: string[], value: number): Slot[] => {
  const parts = formatter.formatToParts(value);
  let first = -1;
  let last = -1;
  let place = 0;
  parts.forEach((part, index) => {
    if (!NUMERIC.has(part.type)) return;
    if (first < 0) first = index;
    last = index;
    if (part.type === 'integer') place += [...part.value].length;
  });
  let fraction = 0;
  const counts: Record<string, number> = {};
  const slots: Slot[] = [];
  parts.forEach((part, index) => {
    if (part.type === 'integer' || part.type === 'fraction') {
      [...part.value].forEach((char) => {
        const digit = Math.max(0, digits.indexOf(char));
        if (part.type === 'integer') {
          place -= 1;
          slots.push({ key: `i${place}`, kind: 'digit', digit, text: '', rank: -2 * place });
        } else {
          slots.push({ key: `f${fraction}`, kind: 'digit', digit, text: '', rank: 1 + fraction });
          fraction += 1;
        }
      });
    } else if (part.type === 'group') {
      slots.push({ key: `g${place}`, kind: 'symbol', digit: 0, text: part.value, rank: 1 - 2 * place });
    } else if (part.type === 'decimal') {
      slots.push({ key: 'd', kind: 'symbol', digit: 0, text: part.value, rank: 0.5 });
    } else {
      const before = first < 0 || index < first;
      const name = `${before ? 'p' : 's'}-${part.type}`;
      counts[name] = (counts[name] || 0) + 1;
      slots.push({
        key: `${name}-${counts[name]}`,
        kind: 'symbol',
        digit: 0,
        text: part.value,
        rank: before ? -10000 - (first - index) : 10000 + (index - last),
      });
    }
  });
  return slots;
};

const makeItem = (slot: Slot, position: number, shown: number): Item => ({
  kind: slot.kind,
  rank: slot.rank,
  pos: position,
  vel: 0,
  target: position,
  shown,
  shownVel: 0,
  shownTarget: shown,
  wait: 0,
  exiting: false,
  natural: 0,
  el: null,
  numerals: null,
  strip: null,
  blur: null,
  filter: '',
  blurred: false,
});

/** Writes an item's animated state to the DOM. Only called from effects or the rAF loop. */
const paintItem = (item: Item, e: Engine, s: Settings) => {
  const el = item.el;
  if (!el) return;
  const shown = clamp(item.shown, 0, 1);
  const resting = item.pos === item.target && item.vel === 0;
  if (item.kind === 'digit') {
    item.numerals?.forEach((numeral, n) => {
      numeral.style.transform = `translateY(${(wrap(n - item.pos) * 100).toFixed(3)}%)`;
    });
    if (shown >= 1 && (s.tabular || resting)) {
      el.style.width = '';
    } else {
      const at = mod(item.pos, 10);
      const low = Math.floor(at);
      const from = e.widths[low % 10] ?? 0;
      const to = e.widths[(low + 1) % 10] ?? from;
      el.style.width = `${((from + (to - from) * (at - low)) * shown).toFixed(2)}px`;
    }
    if (item.blur && item.strip) {
      const radius = s.motionBlur ? clamp((Math.abs(item.vel) - 3) * 0.006, 0, 0.09) * e.em : 0;
      if (radius > 0.25) {
        item.blur.setAttribute('stdDeviation', `0 ${radius.toFixed(2)}`);
        if (!item.blurred) {
          item.strip.style.filter = `url(#${item.filter})`;
          item.blurred = true;
        }
      } else if (item.blurred) {
        item.strip.style.filter = '';
        item.blurred = false;
      }
    }
  } else {
    el.style.width = shown >= 1 ? '' : `${(item.natural * shown).toFixed(2)}px`;
  }
  el.style.setProperty('--counter-shown', shown >= 1 ? '' : shown.toFixed(3));
};

export default function Counter({
  value = 0,
  locale = 'en-US',
  format,
  decimals,
  minDigits = 1,
  prefix,
  suffix,
  direction = 'auto',
  duration = 0.7,
  bounce = 0.2,
  stagger = 0.04,
  motionBlur = true,
  intro = true,
  fade = 0.3,
  fontSize = 100,
  fontWeight = 'inherit',
  textColor = 'inherit',
  gap = 0,
  padding = 0,
  tabular = true,
  digitStyle,
  className = '',
  style,
}: CounterProps) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const rowRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const blurId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const amount = Object.is(value, -0) ? 0 : Number(value);
  const formatKey = JSON.stringify(format ?? {});

  const formatter = useMemo(() => {
    const options: Intl.NumberFormatOptions = { ...(JSON.parse(formatKey) as Intl.NumberFormatOptions) };
    if (decimals !== undefined) {
      const fixed = clamp(Math.round(decimals), 0, 20);
      options.minimumFractionDigits = fixed;
      options.maximumFractionDigits = fixed;
    }
    if (minDigits > 1) options.minimumIntegerDigits = clamp(Math.round(minDigits), 1, 21);
    return createFormatter(locale, options);
  }, [locale, formatKey, decimals, minDigits]);

  const digits = useMemo(() => digitsFor(formatter), [formatter]);
  const slots = useMemo(() => slotsFor(formatter, digits, amount), [formatter, digits, amount]);
  const label = useMemo(() => formatter.format(amount), [formatter, amount]);
  const [list, setList] = useState<Slot[]>(() =>
    slots.map((slot) => ({ ...slot, start: slot.kind === 'digit' ? slot.digit : 0 }))
  );

  const engine = useRef<Engine>({
    items: new Map(),
    raf: 0,
    last: 0,
    ready: false,
    value: amount,
    widths: [],
    em: 16,
  });
  const settings: Settings = {
    direction: DIRECTIONS.includes(direction) ? direction : 'auto',
    duration: Math.max(0.05, duration),
    bounce: clamp(bounce, 0, 0.9),
    stagger: Math.max(0, stagger),
    motionBlur,
    tabular,
  };
  const settingsRef = useRef<Settings>(settings);
  const kickRef = useRef<() => void>(() => {});

  // Keep the animation settings from the latest render without writing refs during render.
  useIsoLayoutEffect(() => {
    settingsRef.current = settings;
  });

  function frame(now: number) {
    const e = engine.current;
    e.raf = 0;
    const s = settingsRef.current;
    const elapsed = clamp((now - e.last) / 1000, 0, 1 / 20);
    e.last = now;
    const reduced = prefersReduced();
    const omega = TAU / s.duration;
    const zeta = 1 - s.bounce;
    const presence = TAU / (s.duration * 0.85);
    const done: string[] = [];
    let busy = false;
    e.items.forEach((item, key) => {
      if (reduced) {
        item.wait = 0;
        item.pos = item.target;
        item.vel = 0;
        item.shown = item.shownTarget;
        item.shownVel = 0;
      } else {
        let left = elapsed;
        if (item.wait > 0) {
          const used = Math.min(item.wait, left);
          item.wait -= used;
          left -= used;
        }
        if (left > 0) {
          const steps = Math.ceil(left * 240);
          const dt = left / steps;
          for (let i = 0; i < steps; i++) {
            item.vel += (-omega * omega * (item.pos - item.target) - 2 * zeta * omega * item.vel) * dt;
            item.pos += item.vel * dt;
            item.shownVel +=
              (-presence * presence * (item.shown - item.shownTarget) - 2 * presence * item.shownVel) * dt;
            item.shown += item.shownVel * dt;
          }
        }
      }
      const settled =
        item.wait <= 0 &&
        Math.abs(item.pos - item.target) < 0.002 &&
        Math.abs(item.vel) < 0.02 &&
        Math.abs(item.shown - item.shownTarget) < 0.002 &&
        Math.abs(item.shownVel) < 0.02;
      if (settled) {
        item.target = mod(Math.round(item.target), 10);
        item.pos = item.target;
        item.vel = 0;
        item.shown = item.shownTarget;
        item.shownVel = 0;
        if (item.exiting) done.push(key);
      } else {
        busy = true;
      }
      paintItem(item, e, s);
    });
    if (done.length) {
      done.forEach((key) => e.items.delete(key));
      setList((previous) => previous.filter((slot) => !done.includes(slot.key)));
    }
    if (busy) e.raf = requestAnimationFrame(frame);
  }

  function kick() {
    const e = engine.current;
    if (e.raf || typeof window === 'undefined') return;
    e.last = performance.now();
    e.raf = requestAnimationFrame(frame);
  }

  useIsoLayoutEffect(() => {
    kickRef.current = kick;
  });

  useIsoLayoutEffect(() => {
    const e = engine.current;
    const s = settingsRef.current;
    if (!e.ready) {
      slots.forEach((slot) => e.items.set(slot.key, makeItem(slot, slot.kind === 'digit' ? slot.digit : 0, 1)));
      e.ready = true;
      e.value = amount;
      return;
    }
    const previous = e.value;
    e.value = amount;
    const trend: Settings['direction'] =
      s.direction !== 'auto'
        ? s.direction
        : Math.abs(amount) > Math.abs(previous)
          ? 'up'
          : Math.abs(amount) < Math.abs(previous)
            ? 'down'
            : 'shortest';
    const next = new Set(slots.map((slot) => slot.key));
    const moving: Item[] = [];
    slots.forEach((slot) => {
      let item = e.items.get(slot.key);
      if (!item) {
        item = makeItem(slot, 0, 0);
        e.items.set(slot.key, item);
      }
      item.exiting = false;
      item.shownTarget = 1;
      item.rank = slot.rank;
      if (slot.kind !== 'digit') return;
      const step = stepBetween(mod(Math.round(item.target), 10), slot.digit, trend);
      if (step !== 0 || item.shown < 1) {
        item.target += step;
        moving.push(item);
      }
    });
    e.items.forEach((item, key) => {
      if (next.has(key) || item.exiting) return;
      item.exiting = true;
      item.shownTarget = 0;
      if (item.kind !== 'digit') return;
      item.target += stepBetween(mod(Math.round(item.target), 10), 0, trend);
      moving.push(item);
    });
    moving
      .sort((a, b) => b.rank - a.rank)
      .forEach((item, order) => {
        item.wait = order * s.stagger;
      });
    e.items.forEach((item, key) => {
      if (item.kind !== 'symbol' || key[0] !== 'g') return;
      const owner = e.items.get(`i${key.slice(1)}`);
      if (owner && (owner.shown < 1 || owner.shownTarget < 1)) item.wait = owner.wait;
    });
    // The slot list mirrors the formatted value: new digits/symbols must be committed so the
    // engine can bind and paint them, and exiting slots stay mounted until their roll finishes.
    setList((previousSlots) => {
      const known = new Map(previousSlots.map((slot) => [slot.key, slot]));
      const merged: Slot[] = slots.map((slot) => ({ ...slot, start: known.get(slot.key)?.start ?? 0 }));
      previousSlots.forEach((slot) => {
        if (!next.has(slot.key)) merged.push(slot);
      });
      merged.sort((a, b) => a.rank - b.rank);
      const same =
        merged.length === previousSlots.length &&
        merged.every(
          (slot, index) =>
            slot.key === previousSlots[index].key &&
            slot.digit === previousSlots[index].digit &&
            slot.text === previousSlots[index].text
        );
      return same ? previousSlots : merged;
    });
    kickRef.current();
  }, [slots]);

  useIsoLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const e = engine.current;
    row.querySelectorAll<HTMLElement>('[data-slot]').forEach((el) => {
      const item = e.items.get(el.dataset.slot ?? '');
      if (!item) return;
      item.el = el;
      if (item.kind === 'digit') {
        item.numerals = Array.from(el.querySelectorAll<HTMLElement>('[data-numeral]'));
        item.strip = el.querySelector<HTMLElement>('[data-strip]');
        item.blur = el.querySelector<SVGFEGaussianBlurElement>('feGaussianBlur');
        item.filter = el.querySelector<SVGFilterElement>('filter')?.id ?? '';
        if (!item.blur && item.strip) item.strip.style.filter = '';
        item.blurred = Boolean(item.blur && item.strip?.style.filter);
      } else if (item.shown < 1 || item.shownTarget < 1) {
        item.natural = el.firstElementChild?.getBoundingClientRect().width ?? 0;
      }
      paintItem(item, e, settingsRef.current);
    });
  }, [list, motionBlur]);

  useIsoLayoutEffect(() => {
    const row = measureRef.current;
    const root = rootRef.current;
    if (!row || !root) return undefined;
    let alive = true;
    const measure = () => {
      if (!alive) return;
      const e = engine.current;
      e.widths = [...row.children].map((child) => child.getBoundingClientRect().width);
      e.em = parseFloat(getComputedStyle(root).fontSize) || 16;
    };
    measure();
    document.fonts?.ready?.then(measure).catch(() => {});
    if (typeof ResizeObserver === 'undefined') {
      return () => {
        alive = false;
      };
    }
    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => {
      alive = false;
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!intro || !root || prefersReduced()) return undefined;
    const spin = () => {
      const e = engine.current;
      const s = settingsRef.current;
      const turn = s.direction === 'down' ? -10 : 10;
      [...e.items.values()]
        .filter((item) => item.kind === 'digit' && !item.exiting)
        .sort((a, b) => a.rank - b.rank)
        .forEach((item, order) => {
          item.target += turn;
          item.wait = order * s.stagger;
        });
      kickRef.current();
    };
    if (typeof IntersectionObserver === 'undefined') {
      spin();
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        spin();
      },
      { threshold: 0.5 }
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, [intro]);

  useEffect(() => {
    const e = engine.current;
    return () => cancelAnimationFrame(e.raf);
  }, []);

  const affix = (node: ReactNode) =>
    node === undefined || node === null || node === false ? null : <span className={AFFIX}>{node}</span>;

  const rootStyle: CounterStyle = {
    fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize,
    fontWeight,
    color: textColor,
    fontVariantNumeric: tabular ? 'tabular-nums' : undefined,
    '--counter-fade': `${Math.max(0, fade)}em`,
    '--counter-gap': `${Math.max(0, gap)}px`,
    '--counter-padding': `${Math.max(0, padding)}px`,
    ...style,
  };

  return (
    <span ref={rootRef} className={[ROOT, className].filter(Boolean).join(' ')} style={rootStyle}>
      <span className={SR}>
        {prefix}
        {label}
        {suffix}
      </span>
      <span ref={rowRef} className={ROW} aria-hidden="true">
        {affix(prefix)}
        {list.map((slot) =>
          slot.kind === 'digit' ? (
            <span key={slot.key} data-slot={slot.key} className={DIGIT} style={digitStyle}>
              <span className={SIZER}>{digits[slot.digit]}</span>
              <span className={WINDOW} style={{ maskImage: MASK, WebkitMaskImage: MASK }}>
                <span className={STRIP} data-strip="">
                  {digits.map((char, n) => (
                    <span
                      key={n}
                      className={NUMERAL}
                      data-numeral=""
                      style={{ transform: `translateY(${wrap(n - (slot.start ?? 0)) * 100}%)` }}
                    >
                      {char}
                    </span>
                  ))}
                </span>
              </span>
              {motionBlur && (
                <svg className={BLUR} aria-hidden="true">
                  <filter
                    id={`${blurId}-${slot.key}`}
                    x="-10%"
                    y="-50%"
                    width="120%"
                    height="200%"
                    colorInterpolationFilters="sRGB"
                  >
                    <feGaussianBlur stdDeviation="0 0" />
                  </filter>
                </svg>
              )}
            </span>
          ) : (
            <span key={slot.key} data-slot={slot.key} className={SYMBOL}>
              <span className={SYMBOL_TEXT}>{slot.text}</span>
            </span>
          )
        )}
        {affix(suffix)}
      </span>
      <span ref={measureRef} className={MEASURE} aria-hidden="true">
        {digits.map((char, n) => (
          <span key={n}>{char}</span>
        ))}
      </span>
    </span>
  );
}
