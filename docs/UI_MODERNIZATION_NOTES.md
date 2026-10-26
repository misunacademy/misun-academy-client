# UI Modernization Notes — MISUN Academy (Homepage First → Rollout)

> Context checkpoint. Update before compaction / phase switch. Resume from here + `git diff` before continuing.

## Status (2026-10-21)
- Phase: public rollout verified. Homepage, /about, /courses, /feedback, /bootcamp, /checkout and the auth funnel are browser-checked desktop + 375.
- Checkout verified with an authenticated admin session (redirect lands on `/dashboard/admin` first). `/checkout` renders the selected course/batch.
- Bootcamp data endpoint (`/bootcamp/current`) returns empty `perks/schedule/faq`; page copy comes from `_components/bootcampData.ts`, so static sections still render.
- Pre-existing change preserved: `components.json` adds `@react-bits` registry. Do NOT discard/reset.

## Verification (this pass)
- `npm run typecheck` PASSED.
- `npm run lint` PASSED.
- `npm run build` PASSED; regenerated `next-env.d.ts`, `public/robots.txt`, `public/sitemap*.xml`, `tsconfig.tsbuildinfo` reverted after build.
- Playwright 1440 + 375: /courses (hero, countdown, instructor, workflow, curriculum, FAQ, CTA), /about (team, mission/vision), /feedback (hero, stats, filters, long cards), /auth, /checkout (summary, methods, CTA), /bootcamp (hero, perks, schedule, payment, poster studio, registration, FAQ, recordings), legal pages + 404 (1440 clean; 375 layout verified numerically — no horizontal overflow, 337px card at x=16/20px padding, 30px Hind Siliguri H1, 28px line-height; 404 CTAs 44/46px ×343px).
- Note: bootcamp/checkout sections use `FadeIn` (in-view). Full-page screenshots look blank below the fold unless the page is scrolled first. Also headless viewport screenshots can ghost text over sticky/backdrop regions; element screenshots and scrolled full-page captures are clean.
- Console: only the known external `fbq is not defined` pixel error. Dev-only LCP suggestions for footer + 3D liquid image remain.

## Key decisions
- Same design language everywhere: solid white headings + `text-primary-glow` large accent only; body `readable-body` (white/85 ≥16px); muted min `text-white/75`; no uppercase tracking on Bangla.
- Semantic tokens only; 44px touch on CTAs/filters; `motion-reduce` on decorative loops.
- English is allowed for brand/YAML labels (e.g. `AI Powered`, `Skill First, Career Next.`, job titles) but not for Bangla section headings.
- Preserve routes/auth/enrollment/payment/checkout logic. Checkout changes are text classes only.

## Completed
- [x] Homepage sweep (globals, Hero, Navbar, cards, carousels, Enrollment, Why*, Footer, EnrollmentFixed).
- [x] About: localized team header, mission/vision headings; verified team cards + mission/vision desktop/mobile.
- [x] Courses marketing stack: BannerContent (pill moved out of h1, solid h1, readable body), Countdown (responsive 4-up, labels), Instructor, CourseWorkflow/WorkFlowCard, CourseCurriculum/ContentPanel/StatsCard/CourseSelector, FaqSection (Bangla heading + readable answers), EnrollCtaSection.
- [x] Feedback: hero/stats/filters/cards/pagination contrast.
- [x] Checkout: localized headings/steps/labels/consent/buttons to Bangla; mobile order now form-first (`order-1`/`order-2`), sidebar below; disabled CTA uses a readable muted surface instead of 50% opacity; `role="radiogroup"` + clean radio names; decorative gateway logos `alt=""`.
- [x] Bootcamp: body copy raised from white/60→70 and white/55→65 (perks, schedule, payment, FAQ, registration, poster studio, recorded cards, dialog); no layout/logic change.
- [x] Auth funnel: subtitle/tabs/divider/login labels, 44px modal close, reset/verify/suspended copy.
- [x] Footer/cards/back-to-top from earlier pass.
- [x] Legal pages (`/terms-and-conditions`, `/privacy-policy`, `/refund-policy`): Bangla H1 in `font-bangla` + solid white with `text-primary-glow` accent (removed gradient clip-text), date `font-bangla text-sm text-white/70`, badge ping `motion-reduce:animate-none` with `aria-hidden` wrapper, card `bg-surface border-primary/15 p-5 sm:p-8 md:p-10 leading-7 sm:leading-8 text-white/80 font-bangla`, corner brackets moved `-top-6`→`top-0` (were clipped), body white/60→75, white/45→70, `text-primary/70`→`text-primary-glow`.
- [x] 404: rewrote `src/app/not-found.tsx` with `PageBackground`, big `font-monaExpanded` 404 in `text-primary-glow`, Bangla heading/body, two full-width 44px+ CTAs (হোমে ফিরুন solid / কোর্স দেখুন outline).

## Pending
- [ ] Manual Payment step (`ManualPaymentForm`) copy localized but not visually reached (requires submitting the phonePay flow; avoid triggering a real registration).
- [ ] Bootcamp hero/dose copy still says ১৩–১৬ সেপ্টেম্বর while the API batch is 9–11 Sept; content decision, not UI.
- [ ] Bootcamp `perks/schedule/faq` empty in API; static `bootcampData.ts` used — confirm which source is canonical.
- [ ] Optional: `EnglishSkills` gradient heading / English-course route consistency; profile/dashboard pages untouched.
- [ ] 375 screenshots in the headless browser can ghost every line of Bangla (reproduces on already-verified /courses and survives browser restart) — treat as capture artifact, not a UI bug; rely on DOM metrics/element screenshots there.
- [ ] Optional: fix LCP hints (footer SSLCommerz strip + 3D liquid image).
- [ ] Do NOT start dashboard/classroom redesign without a new phase.

## Next exact steps
1. Remaining public routes: English course (`:3001`). Legal pages + 404 are done.
2. Re-run typecheck/lint after any tweak; build only at phase end and revert generated artifacts.
3. Update this file before compaction.

## 2026-10-22 — Phases A/B/C (a11y, motion, curriculum map)

### Phase A
- Removed 6 unused files (old `CareerPath`/`EnglishSkills` trees) and fixed nested interactive elements across public, profile, admin and bootcamp surfaces (`Link > button`, `Link > Button`, nested `main`).
- `MotionConfig reducedMotion="user"`; `useCountUp` returns the target immediately under reduced motion; stat counters expose `sr-only` final values; Framer infinite loops gated; 3D scenes pause offscreen and fall back to static gradients.
- Chart colors now use `--chart-*` tokens; Recharts `accessibilityLayer` + `sr-only` summaries. Manual-payment test assertions updated to the staged Bangla `পরিমাণ:` label.

### Phase B
- New `src/lib/motion.ts` (ease, durations, offsets, reveal/stagger variants). `FadeIn` and `StaggerContainer` keep their public APIs but share those variants.

### Phase C
- Added `d3-hierarchy` (+ types). Pure `buildCurriculumTree` / `layoutCurriculumTree` produce a course → group → module/project tree and a compact cluster geometry: centered course card above two module/project panels sized to their content, with HTML rows instead of per-item nodes.
- `CourseCurriculum` is list-first; a 44px “তালিকা / ম্যাপ” toggle lazy-loads `curriculum/explorer/CurriculumMap` (no SSR). Map is hidden below 768px via `useIsMobile` and always falls back to the list. Visual rows are HTML over an `aria-hidden` SVG connector layer; a `sr-only` nested list mirrors the full tree, and the scroll region is keyboard-focusable.
- Verified 1440: 924×589 section, 704×549 map, 19 rows, no scroll. Verified 768: map fits with no horizontal scroll. Verified 375: toggle hidden, list fallback, no overflow.

### Verification (this pass)
- `npm run typecheck` PASSED.
- `npm run lint` PASSED (2 pre-existing unused-var warnings in `EnrollmentFixed.tsx`).
- `npm run test` PASSED (25 files / 173 tests).
- `npm run build` PASSED (Next 16.3.4). Reverted `next-env.d.ts`, `public/sitemap-0.xml`, `tsconfig.tsbuildinfo` after build.


## 2026-10-22 — Phase 1 P0 (SSR, carousel a11y, fonts, Lenis)

### Implemented
- `HomeDeferredSections` is now a Server Component. The five homepage sections use `next/dynamic` with SSR enabled (no `ssr:false`), so their headings/copy/cards are present in the initial HTML. The IntersectionObserver gate and fixed 700–1100px skeletons were removed.
- Fixed the real blocker to homepage prerendering: `CurrentYear` evaluated `new Date()` during prerender. It now reads the year through `useSyncExternalStore` with an empty server snapshot, so the footer year hydrates without making the whole route client-only.
- Removed `embla-carousel-autoplay` from both feedback carousels. Added labelled 44px previous/next controls and `aria-label` regions.
- Success-story video thumbnails are real `<button>` elements with specific Bangla labels/alt text; YouTube embeds use specific iframe titles and no `autoplay=1`.
- Removed the hard-coded five-star row from `StudentOpinionsCarousel`; no rating data exists.
- `next/font/google` Mona Sans was removed (local Mona Sans already ships via `fonts.css`). Added `font-display: swap` to local Mona Sans/Mona Sans Expanded faces.
- Lenis now runs only on marketing routes (`/`, about, bootcamp, courses, feedback, legal, maintenance) and skips entirely under reduced motion. Task routes keep native scrolling.
- `useScrollProgress` batches scroll updates with `requestAnimationFrame`; back-to-top respects reduced motion.

### Verification
- `pnpm typecheck` PASSED.
- `pnpm lint` PASSED with 2 pre-existing warnings in `EnrollmentFixed.tsx`.
- `pnpm test --run` PASSED (25 files / 173 tests); scroll-progress test now waits for rAF.
- `pnpm build` PASSED (Next 16.3.4).
- Prerendered homepage shell: 299,802 bytes, 8 sections, 7 H2s, success-story + student-opinion sections present, 10 video buttons, 2 previous/2 next controls, no `fill-yellow-500`, no autoplay plugin marker.
- Playwright 1440 + 375: carousel controls visible and 44px; manual next moves the track (`translate3d(-377px)` on 375). Homepage gets `html.lenis`; `/enrollment-posters` does not. Reduced-motion reload removes Lenis.
- Console during local verification only showed expected backend/CORS failures (`localhost:5000`) because the API server was not running.

### Still pending from Phase 1
- Source-image re-encoding (footer, bootcamp poster, large team/3D assets) after visual-reference QA. Delivery already uses `next/image`; do not replace imagery wholesale.
- Optional: `WorkFlowCard` mouse-only hover and inline motion variants in `WhyUs`/`FeatureCard`/`SkillBadge` are Phase 2 cleanup.

## 2026-10-25 — React Bits review (home + course-details): Counter only

### Audit → mapping
Evaluated all eight reference components against the real pages (`/` and `/course-details`; there is no `/courses` route — the nav item “কোর্সের বিস্তারিত” points at `/course-details`).
- **Counter — used.** Homepage `StatCard` (60+/35+/20+ from `statsData.tsx`) and `InstructorSection` stat tiles (6+/500+/2000+). Real numbers that already shipped; no new claims invented.
- **DitherVeil, FlexCarousel, TechText, AeroShards, InfiniteSpiral, GridScan, Galaxy — rejected:**
  - DitherVeil would veil the instructor photo in `VideoThumb` (the brand's most human asset) and adds `ogl` + a WebGL context beside existing decorative motion; no hover on touch.
  - FlexCarousel duplicates the working embla carousels and moves real course/feedback content into a canvas (not indexable, not selectable); needs `ogl`.
  - TechText rasterises text to canvas — `Array.from(text)` breaks Bangla conjuncts, the wordmark stops being indexable, and its design-inspector labels/dragging fight the brand.
  - AeroShards needs `vgpu` + WebGPU (Chromium-only), no cross-browser fallback.
  - InfiniteSpiral needs a square image set that does not exist and repeats gallery content.
  - GridScan is a sci-fi scan room off-brand for education; its webcam mode pulls a `cdn.jsdelivr.net` face-api script the CSP (`default-src 'self'`) blocks.
  - Galaxy is a cosmic starfield — off-brand and another continuous WebGL context.
  Rule applied: one decorative effect per viewport; animation never replaces typography/layout.

### Implemented
- New `src/components/shared/Counter.tsx` + `Counter.css` — typed port of the React Bits source (same markup, CSS, spring/stagger engine, intro observer). Kept `direction: ltr; unicode-bidi: isolate` so Bengali digits + a `+` suffix lay out correctly.
- Compatibility changes only: typed props/state (no `any`), ref writes moved into layout effects (satisfies `react-hooks/refs`), `paintItem` hoisted to module scope, rAF loop self-recursive via a stable kick ref; unmount still cancels the frame.
- Homepage `StatCard` renders `<Counter locale="bn-BD" fontSize="inherit" … />`; `WhyThisCourse` drops its own IntersectionObserver/`animate` flag (Counter observes itself at threshold 0.5).
- `InstructorSection` stats became `{ value, suffix, label }` numbers with the same claims; the section stays a Server Component, Counter is the only client island.
- Deleted `src/hooks/useCountUp.ts` + `useCountUp.test.tsx` (Counter supersedes its only consumer).
- Intentional copy change: homepage stats now use Bengali numerals (৬০+/৩৫+/২০+ instead of 60+/35+/20+, matching the Bangla labels) and `২০০০+` groups as `২,০০০+`.

### Accessibility / performance
- The final value always lives in the DOM in Counter's `sr-only` span (SSR HTML contains ৬০+/৩৫+/২০+ and ৬+/৫০০+/২,০০০+); the rolling row is `aria-hidden`. Same guarantee as the old `useCountUp` + manual `sr-only`, without duplicated markup.
- `prefers-reduced-motion`: intro observer is not created and the loop snaps to the target — no roll.
- No new dependencies. rAF runs only while a digit is settling; digits are `tabular`, so rolling does not shift layout (110.61px measured across the roll at 1440).
- Nothing interactive, so no new focus/touch surface.

### Verification (this pass)
- `npm run typecheck` PASSED.
- `npm run lint` PASSED — 0 errors, 5 pre-existing unused-import warnings (InstructorSection `AnimatedBorder`, EnrollmentFixed ×2, SuccessStoriesCarousel ×2); no new warnings.
- `npm run test` PASSED (25 files / 174 tests; +4 Counter, −3 from the removed `useCountUp`).
- `npm run build` PASSED; generated `next-env.d.ts`, `public/robots.txt`, `public/sitemap*.xml` restored to their pre-build working-tree state (`tsconfig.tsbuildinfo` unchanged).
- Playwright `/` + `/course-details` at 1440 and 375: ৬০+/৩৫+/২০+ (60px desktop, 48px mobile) and ৬+/৫০০+/২,০০০+ (24px desktop, 20px mobile); 0 console errors; no horizontal overflow (doc width 369 at 375). Intro roll observed (translateY moved, then settled); width constant while rolling. Reduced-motion emulation shows final values immediately.
- Known, unrelated: `next/image` preload warning for `Mithun-Sarkar.png` on `/course-details` (the image is `priority`); `CourseJsonLd` still emits `/courses/<slug>` URLs that 404.

