# MISUN Academy — Product Documentation

> Client web app for MISUN Academy (`misun-academy-client`).
> Stack: **Next.js 16.2.6 (App Router) + React 19 + TypeScript + Tailwind + shadcn/new-york + Redux Toolkit Query + better-auth + SSLCommerz payments.**
> Language of the product UI/SEO: **Bangla-first (`<html lang="bn">`)**, English secondary.
> Backend: external REST API at `NEXT_PUBLIC_BASE_API_URL` (default `http://localhost:5000/api/v1`).

## 1. What this product is

MISUN Academy is a Bangla-language creative-skills LMS and storefront. One Next.js app serves three surfaces:

| Surface | Layout group | Audience |
|---|---|---|
| Marketing + catalog + checkout | `src/app/(WithCommonLayout)` | Public visitors, students |
| Auth | `src/app/(Auth)` | New / returning users |
| Dashboards | `src/app/(WithDashboardLayout)` | Admin, instructor, employee, student ops |
| Certificate verification (public, no layout group) | `src/app/verify-certificate/[certificateId]` | Anyone with a certificate link |

Core loop: discover course/bootcamp → checkout via batch enrollment window → pay with SSLCommerz → learn in `my-classes` (modules/lessons/quizzes/recordings) → earn certificate → verify publicly.

## 2. Users & roles

Roles come from better-auth additional fields (`role`, `status`, `phone`, `address`, `avatar`) and drive redirects after login:

| Role | Lands on | Can do |
|---|---|---|
| `admin` / `superadmin` | `/dashboard/admin` | Full LMS ops (see §5) |
| `instructor` | `/dashboard/instructor` | Own quizzes, students, recordings, settings |
| `employee` | `/dashboard/employee` | Leave, salary-history, settings |
| `student` (default) | `/my-classes` | Courses, recordings, certificates, profile |
| Suspended | `/auth/suspended` | Blocked until reactivated |
| Anonymous | `/`, `/courses`, `/bootcamp`, `/auth` | Browse, checkout (guarded → login) |

Redirect safety: `src/lib/auth-redirect.ts` (`isAllowedRedirectUrl`) validates `?redirect_url=`. Cross-app SSO links exist to `esun.misun-academy.com` and `NEXT_PUBLIC_EP_FRONTEND_URL`.

## 3. Information architecture / routes

### 3.1 Public (`WithCommonLayout` → `LenisProvider` + `CommonLayoutShell`)

| URL | File | Purpose |
|---|---|---|
| `/` | `(WithCommonLayout)/page.tsx` | Bangla SEO home: `HeroSection`, lazy `HomeDeferredSections`, `EnrollmentFixed`, `HomepageTracker`, `PageBackground`, `BackToTop`, `FloatingChat` (dev only) |
| `/courses` | `courses/page.tsx` | Catalog (`CoursesListClient`, `CoursesListScene`) |
| `/courses/[id]` | `courses/[id]/page.tsx` | Detail, incl. flagship `AI Powered কমপ্লিট গ্রাফিক্স ডিজাইন` (Photoshop/Illustrator + freelancing) |
| `/bootcamp`, `/bootcamp/[slug]` | `bootcamp/` | Cohort bootcamps, e.g. `প্যারাসিটামল ফর ফটোশপ Season 2.0` — 4-day Zoom, ৳350, portfolio + client-hunting + gifts/internship |
| `/checkout?batch=` | `checkout/page.tsx` | Enrollment checkout. Branches `EnrollmentCheckout` vs `BootcampCheckout(batchId)`; `useCurrentBatch` + `useGetBatchByIdQuery`; enrollment-window guard `isWindowOpen()` → `EnrollmentNotOpenModal`; fires Meta Pixel + `/api/meta-conversion` CAPI `InitiateCheckout` |
| `/payment` | `payment/page.tsx` | SSLCommerz return landing (`PaymentStatus`, host `securepay.sslcommerz.com`) |
| `/my-classes`, `/my-classes/[courseId]`, `/my-classes/certificates` | `my-classes/` | Student classroom (auth-guarded, see §4) |
| `/profile` | `profile/page.tsx` | Profile + sidebar |
| `/about`, `/feedback`, `/enrollment-posters` | — | About (hero/mission/story/team), feedback wall (CSV-pregenerated JSON via `npm run generate:feedbacks`), poster studio/customizer |
| `/maintenance` | — | Maintenance mode page (see settings) |
| `/privacy-policy`, `/terms-and-conditions`, `/refund-policy` | — | Legal pages |

### 3.2 Auth (`(Auth)` group)

`/auth` (login/register tabs: `LoginForm`, `RegisterForm`, `ForgotPasswordModal`, `EmailVerificationModal`), `/auth/login`, `/auth/callback` (OAuth), `/verify-email`, `/reset-password`, `/auth/suspended`.

### 3.3 Dashboards (`WithDashboardLayout` → `DashboardShell`)

- `/dashboard/admin` — overview (`Dashboard`, `DashboardCharts`) + full ops:
  `courses` (+ `/new`, `/[courseId]`, `/[courseId]/content` with modules/lessons, batch assignment), `batch` (+ `/create`, `/[id]/edit`), `bootcamp` (catalog manager, review dialog), `bootcamp-students` (recorded-bootcamp buyers: stats, filters, Excel export), `student`, `students-progress-tracker`, `users`, `roles`, `grant-access` (special access), `payment`, `refunds`, `certificates` (review), `quizzes` (CRUD + `[quizId]/analytics`, `questions/new`, `questions/[questionId]/edit`), `recordings`, `announcements`, `emails` (enrollment/batch reminders, news), `employees` (list/leave/salary), `leaderboard`, `audit-logs`, `reports` (charts + KPIs), `settings` (community links, home video, maintenance toggle, payment tutorial, popup banner, profile).
- `/dashboard/instructor`, `/dashboard/employee`, `/dashboard/notifications` — scoped views.
- `/verify-certificate/[certificateId]` — public verification + PNG/PDF download (`html-to-image` pixelRatio 3 + `jspdf`; `?download=pdf|png` auto-downloads).

## 4. Student learning experience

- Guarded by `components/shared/AuthGuard`; data via `useGetStudentDashboardDataQuery` (`redux/api/dashboardApi`).
- Tabs (`CoursesTab`, `LiveRecordingsTab`, `SpecialAccessTab`, dynamically imported, no SSR) over a Three.js backdrop (`ClassesSceneBackground`) + `WelcomeBanner`.
- Course player `[courseId]`: curriculum progress (`useCurriculumProgress`, `useCourseNavigation`, `useLessonNav`), YouTube embeds (`useYouTubePlayer`), tabs (overview / content / resources), quiz player (`QuizPlayer`, `QuestionCard`), completion card, progress banner, module sidebar.
- Certificates: request list + history + stats; public verification page described above.

## 5. Admin / ops capabilities

Courses + content (modules/lessons, batch scoping), batches (enrollment windows drive checkout eligibility), bootcamps, users/roles, students + progress tracker, grant/special access, payments + refunds, quizzes/questions/attempts/analytics/leaderboard, recordings, certificates issuance + review, announcements + transactional/bulk emails, employees (salary/leave), audit logs, reports, site settings (maintenance mode, popup banner, payment tutorial, home video, community links).

## 6. Commerce & payments

- Batch-based enrollment: checkout requires an open window (`isWindowOpen()`), otherwise `EnrollmentNotOpenModal`.
- Provider: **SSLCommerz** (`securepay.sslcommerz.com` image domain allowlisted). `/payment` handles the return; admin `payment`/`refunds` pages reconcile.
- Tracking: Meta Pixel (browser) + Conversions API (`/api/meta-conversion`) for `InitiateCheckout`/`Lead`; Google Analytics via `@next/third-parties`; Vercel Analytics.

## 7. Auth & session handling

- `better-auth@1.6` client (`src/lib/auth-client.ts`, `baseURL = NEXT_PUBLIC_BASE_API_URL/auth`), server actions (`auth-actions.ts`, `auth-server-api.ts`), `useAuth` hook (`useGetSessionQuery`), `AuthGuard` component.
- API layer (`src/redux/api/baseApi.ts`): `fetchBaseQuery` with `credentials: "include"` + `X-CSRF-Token` from cookie. `baseQueryWithSessionHandling` toasts on 404/403 and on **401 signs out via `authServerApi.signOut()` and redirects to `/auth?redirect_url=…`**.
- ~30 RTK Query injects: auth, course, batch, bootcamp, enrollment, courseEnrollment, payment, refund, dashboard, admin, instructor, employee(+Admin), quiz, question, attempt, gamification, certificate, recording, lesson, module, courseContent, upload, notification, announcements, auditLog, profile, settings. Helpers in `src/lib/apiConfig.ts` (`ApiError`, `getErrorMessage`, pagination/query builders). `keepUnusedDataFor: 300`.
- Forms: `react-hook-form + zod + @hookform/resolvers`.

## 8. Content, SEO, analytics

- SEO per page via `generateMetadata` + JSON-LD (`OrganizationJsonLd`, `WebSiteJsonLd`, `CourseJsonLd`, `BreadcrumbJsonLd`); `next-sitemap` (`postbuild`) with `siteUrl = NEXT_PUBLIC_SITE_URL`, robots generated, excludes `/secret-page`, `/admin/*`, `/dashboard`.
- Feedback wall content is pregenerated at build: `npm run build` first runs `tsx src/lib/readCsvToJson.ts`.
- Images: `avif/webp`, qualities 65/75, remote patterns for sslcommerz, `lh3.googleusercontent`, `res.cloudinary`, `i.ytimg`/`img.youtube`, `misun-academy.com`.

## 9. Non-functional notes

- No `middleware.ts` — all guards are client-side (`AuthGuard`, layout checks) + server-action session checks.
- Smooth scroll via `lenis` (Common layout only). Providers (`src/providers/Providers.tsx`): Redux `Provider` + `SocketProvider` (`socket.io-client`) + `sonner` Toaster.
- Error/loading conventions: per-route `error.tsx` / `loading.tsx`; `boneyard-js` skeletons; dashboard tables via `@tanstack/react-table`; charts via `recharts`.
- Env is zod-validated (`src/lib/env.ts`); required: `NEXT_PUBLIC_BASE_API_URL`. See `.env.example`.

## 10. Run / build / deploy

| Command | What |
|---|---|
| `npm run dev` | `next dev` |
| `npm run generate:feedbacks` | `tsx src/lib/readCsvToJson.ts` |
| `npm run build` | pregenerate feedbacks + `next build` |
| `npm start` | `next start` |
| `npm run typecheck` / `lint` / `analyze` | `tsc --noEmit` / `eslint .` / bundle-analyzer (`ANALYZE=true`) |
| `postbuild` | `next-sitemap` |

Docker (multi-stage `node:20-alpine`): `base` (install) → `builder` (build) → `production` (`npm start`, :3000); `dev` stage runs `npm run dev`. Vercel-ready (`.vercel/`, Analytics).
