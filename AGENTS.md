<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — misun-academy-client

Next.js 16.2.6 (App Router, `cacheComponents: true`) + React 19 + TypeScript + Tailwind 3 + shadcn/new-york + Redux Toolkit Query + better-auth. Bangla-first LMS storefront + classroom + admin dashboards. See `docs/PRODUCT_DOC.md` (product/routes) and `docs/DESIGN.md` (tokens/components).

## Commands

```bash
npm run dev                  # next dev
npm run build                # tsx src/lib/readCsvToJson.ts && next build (feedbacks pregenerated — never skip the tsx step)
npm start                    # next start
npm run typecheck            # tsc --noEmit
npm run lint                 # eslint .
npm run analyze              # ANALYZE=true bundle-analyzer build
npm run generate:feedbacks   # regenerate feedback JSON from CSV
```

Env: `NEXT_PUBLIC_BASE_API_URL` required (zod-validated in `src/lib/env.ts`); copy `.env.example`. Docker: `builder`/`production`/`dev` stages in `Dockerfile` (`node:20-alpine`, :3000).

## Structure

- `src/app/` — route groups: `(WithCommonLayout)` (public + classroom), `(Auth)` (auth), `(WithDashboardLayout)/dashboard` (admin/instructor/employee), `verify-certificate/[certificateId]`, `api/meta-conversion` (CAPI proxy). Per-route `_components/` = route-only UI; `loading.tsx` + `error.tsx` required on new routes.
- `src/components/` — `ui/` (shadcn primitives), `module/<home|checkout|payment|auth>` (features), `shared/` (`AuthGuard`, `PageBackground`, …), `seo/`, `analytics/`. `src/bones/registry` for bones.
- `src/redux/api/` — `baseApi.ts` + ~30 injected APIs; `src/redux/hooks.ts` typed hooks, `store.ts` is baseApi-only (no slices). `src/hooks/`, `src/lib/` (`auth-client`, `auth-actions`, `auth-server-api`, `auth-redirect`, `apiConfig.ts`, `env.ts`), `src/providers/Providers.tsx` (Redux + Socket + Toaster).
- No `middleware.ts` — auth enforced via `AuthGuard` + server-action session checks. No global dark toggle (dark-surfaced marketing via `bg-surface*`); `darkMode: ['class']` + `next-themes` present.

## Conventions

- Server Components by default; `"use client"` only for hooks/interactivity; heavy 3D/tabs via `next/dynamic` (no SSR) + `HomeDeferredSections`-style lazying.
- Data: RTK Query hooks (`useGetXQuery`/`useXMutation`); never raw `fetch` to the API except CAPI proxy. `credentials: "include"` + CSRF handled in `baseApi`; 401 → sign out + redirect to `/auth?redirect_url=`. Errors via `getErrorMessage`/`getFieldErrors` (`lib/apiConfig.ts`).
- Auth: better-auth client `baseURL = NEXT_PUBLIC_BASE_API_URL/auth`; role redirects in `useAuth` (`admin/superadmin→/dashboard/admin`, `employee`, `instructor`, else `/my-classes`); validate custom redirects with `isAllowedRedirectUrl`.
- Forms: `react-hook-form + zod + @hookform/resolvers`. Tables: `@tanstack/react-table` + filters/pagination cards. Charts: `recharts`.
- Styling: semantic HSL tokens only (`bg-primary`, `bg-surface`, `text-muted-foreground`…); `font-bangla` for Bangla, Clash/Mona Expanded for display; `lucide-react` icons; `cva + tailwind-merge + clsx` variants.
- SEO: `generateMetadata` + JSON-LD on public pages; `next/image` (avif/webp) with allowlisted remotes in `next.config.ts`.
- `npm run build` runs the CSV→JSON step — keep `src/lib/readCsvToJson.ts` working if touching feedbacks.

## Do / Don't

- DO run `typecheck` + `lint` after changes; keep the `nextjs-agent-rules` block at the top of this file.
- DO check `node_modules/next/dist/docs/` when using new/changed Next APIs (this is not stock Next).
- DON'T add slices to the store without need (baseApi-only is intentional); DON'T hardcode colors/hex; DON'T bypass `AuthGuard`/redirect validation; DON'T add unallowlisted image domains without updating `next.config.ts`.
