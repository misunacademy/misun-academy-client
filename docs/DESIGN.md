# MISUN Academy — Design System

Source of truth: `src/app/globals.css` (HSL CSS vars), `tailwind.config.ts` (semantic tokens), `components.json` (shadcn), `src/app/layout.tsx` (fonts), `src/components/ui/*`, `src/components/shared/*`.

## 1. Foundations

### Design tokens (light `:root` / `.dark`)

| Token | Light | Dark | Usage |
|---|---|---|---|
| `background` / `foreground` | `0 0% 100%` / `20 14.3% 4.1%` | `20 14.3% 4.1%` / `60 9.1% 97.8%` | Page base |
| `primary` / `primary-foreground` / `primary-glow` | `156 70% 42%` emerald / white / `156 85% 70%` | same primary | Brand actions, focus, glow |
| `secondary` | `222 32% 10%` navy | same | Dark sections, footer |
| `muted` / `accent` | `9 100% 96%` warm tint | `12 6.5% 15.1%` | Subtle fills, hovers |
| `destructive` | `0 84.2% 60.2%` | `0 72.2% 50.6%` | Errors, refunds |
| `border` / `input` / `ring` | `20 5.9% 90%` / `20.5 90.2% 48.2%` | `12 6.5% 15.1%` / same ring | Lines, fields |
| `chart 1–5` | warm set (`12 76% 61%` …) | cool set (`220 70% 50%` …) | `recharts` dashboards |
| `sidebar-*` | near-white set | dark set | Dashboard sidebar |

Extended palette (`tailwind.config`): `surface.{darker:#040a07, DEFAULT:#060f0a, navy:#171f33}`, `sage:#bccbb9`, `emerald.{darker:#0d5c36, dark:#0a5f38, deep:#0f6e41, bright:#18a06a}`. Radius `--radius: 0.5rem` (`lg/md/sm` derived). All colors consumed as `hsl(var(--…))` — never hardcode hex in components; use `bg-primary text-primary-foreground`, `bg-surface text-sage`, etc.

### Typography

- Body/UI: **Mona Sans** (`next/font`, `--font-mona-sans`, `font-mona`).
- Display: **Mona Sans Expanded** (`font-monaExpanded`) + self-hosted **Clash Display** (200–700) and **Nova Quinta** (`src/styles/fonts.css`).
- Bangla: **Hind Siliguri** (`--font-bangla`, `font-bangla`, weights 400/700, `display: optional`) — required since `<html lang="bn">`.
- Convention: Bangla headings in `font-bangla` bold; English display accents in Clash/Mona Expanded; body in Mona Sans.

### Shape, elevation, texture

- Radius `0.5rem`; cards `rounded-lg/xl`, pills for badges/tabs.
- Marketing pages are **dark immersive**: `PageBackground` (dot-grid + emerald orbs/glows) over `bg-surface`, `AnimatedBorder` gradient frames, floating `BackToTop`, `ThreeDScene`/`ClassesSceneBackground` (`@react-three/fiber` + `drei` + `three`).
- Dashboards are dense light/dark-neutral surfaces with `boneyard-js` skeletons, `@tanstack/react-table` tables, `recharts` charts.

## 2. Component system (shadcn new-york, neutral, CSS vars, lucide)

`components.json`: `style: new-york`, `baseColor: neutral`, `rsc: true`, `cssVariables: true`, `iconLibrary: lucide`. Registry aliases `@/components`, `@/lib/utils`, `@/components/ui`.

- Base: `src/components/ui/*` (button, dialog, dropdown, tabs, accordion, avatar, tooltip, select, popover, progress, separator, switch, checkbox, scroll-area, table…). Variants via `class-variance-authority` + `tailwind-merge` + `clsx`.
- Domain: `src/components/module/{home,checkout,payment,auth}`, `src/components/shared/*` (`AuthGuard`, `PageBackground`, `AnimatedBorder`, `BackToTop`, `FloatingChat`), `src/components/seo/*`, `src/components/analytics/*`, `src/bones/registry`.
- Icons: `lucide-react` only. No emoji in UI.
- Feedback: `sonner` Toaster (global in `Providers`); API layer toasts on 404/403; forms show zod field errors.

## 3. Motion & interaction

- Page/section reveals: `framer-motion` (hero, deferred home sections via `HomeDeferredSections`).
- Smooth scroll: `lenis` (`LenisProvider`, Common layout only).
- Carousels: `embla-carousel-react` + autoplay + class-names.
- Drawers: `vaul`. Keyframes in config: `accordion-down/up`, `float`, `glow`, `shimmer`, `draw`, `zoom-in-out` — use sparingly (glow/float for hero CTAs, shimmer for skeletons).
- Scrollbar: 6px, thumb `hsl(var(--primary))`, rounded full. Focus: global `:focus-visible` → `outline-2 outline-offset-2 outline-primary/60`.

## 4. Page patterns

- **Marketing hero**: dark `surface` + dot-grid/orbs → Bangla headline (`font-bangla`) → emerald CTA (`bg-primary`) → social proof strip → deferred sections (lazy) → `EnrollmentFixed` sticky bar → footer. Track `Lead`/`InitiateCheckout` via Pixel+CAPI.
- **Catalog cards** (`CourseCard`, `BootcampRecordedCard`, `PreviousBootcampsGrid`): thumbnail (avif/webp, YouTube/Cloudinary domains), title, meta row, price/batch badge, CTA.
- **Checkout**: card layout (`CourseEnrollmentCard`), batch selector, enrollment-window guard modal (`EnrollmentNotOpenModal`), payment tutorial tab content.
- **Classroom**: `WelcomeBanner` → tabs (courses / live recordings / special access) → progress banner → module sidebar + lesson nav + tabs (overview/resources) → quiz player → completion card.
- **Dashboard**: `DashboardShell` + `app-sidebar` → stat cards (`*StatsCards`) → filters card → table (pagination) → row dialogs/sheets (forms, review, delete, preview). Charts on overview/reports.
- **Certificates**: stats + request/history lists (in-app); public verify page with `CertificateDisplay` + download actions (PNG/PDF).

## 5. Accessibility & responsive

- Skip link to `#main-content` in root layout; semantic landmarks; visible focus ring (see §3); `sonner` announces via live regions.
- Mobile-first Tailwind; dashboard sidebar collapses (`use-mobile` hook); tables get pagination + filters cards on small screens; Three.js backdrops are decorative (no content dependency) and deferred/lazy where heavy.
- Bangla text must use `font-bangla` for correct shaping; never rely on color alone (pair with icon/label, e.g. `PaymentStatusBadge`).

## 6. Imagery & media

- `next/image` with `avif`/`webp`, qualities 65/75. Remote allowlist in `next.config.ts`: SSLCommerz, `lh3.googleusercontent` (avatars), `res.cloudinary`, `i.ytimg`/`img.youtube` (thumbnails), `misun-academy.com`, `via.placeholder.com` (dev only).
- Posters: `PosterStudio` / enrollment-posters customizer (`CustomizationPanel` + `PosterPreviewPanel` + `PosterHeader`) with `html-to-image` export hooks (`usePosterGenerator`, `useImageEditor`).

## 7. Rules for contributors

1. Use semantic tokens (`bg-background`, `text-muted-foreground`, `border-border`, `bg-primary`) — no raw emerald/navy hex outside `tailwind.config.ts`.
2. New UI goes in `src/components/ui` (primitive) or `module/<domain>` (feature); shared visuals in `components/shared`. Colocate route-only pieces in `_components/` next to the page.
3. Bangla copy → `font-bangla`; English display → Clash/Mona Expanded sparingly.
4. Keep animations to the defined keyframes; heavy 3D only behind dynamic imports.
5. Every new route needs loading + error states and metadata (title/description); public pages need JSON-LD where relevant.
