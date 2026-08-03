# Frontend Maintainability Audit

**Date:** 2026-08-01
**Branch:** `ch/admin-profile`
**Scope:** All frontend code — `src/app`, `src/features`, `src/shared`, `src/providers`, `src/infrastructure/auth`.
**Method:** Read-only analysis (no code was modified). Line counts, ripgrep/grep counts, and full-file reads.

> This is the *planning* document for a refactor. Nothing here is fixed yet — findings are organized into the 7 refactoring goals so we can turn them into actionable work items.

---

## Executive Summary

The codebase is a Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TanStack Query 5 + Zustand 5 app. It has a healthy `shared/ui` primitive layer (31 components) and a clear feature-folder structure. The main problems are **not** architectural — they are **volume, duplication, and drift**:

| Metric | Value |
|---|---|
| Frontend files audited | 345 |
| Total lines | ~29,834 |
| Average lines/file | 86 |
| Files **over the 170-line target** | **44** |
| Largest file | `src/shared/ui/sidebar.tsx` (702) |

The single biggest theme: **the same pattern was copy-pasted per-feature instead of extracted once** — 5 pagination bars, 6 confirmation dialogs, 3 video-upload pipelines, 7 admin list pages, 13 marketing pill buttons, ~109 hardcoded gray hex values, 16 direct `authClient.useSession()` call sites, and 49 ad-hoc query keys. Fixing this yields the most value per hour of effort.

---

## 1. Component Sizes (goal: ≤ 170 lines)

**44 files exceed the 170-line target.** All must be split, deleted, or extracted during the refactor.

### 1.1 Largest offenders

| Lines | File | Notes |
|---|---|---|
| 702 | `src/shared/ui/sidebar.tsx` | shadcn sidebar; split into sub-components |
| 501 | `src/app/api/courses/[id]/route.ts` | route handler; extract services |
| 498 | `src/features/admin/team/services/team-service.ts` | server list service; pagination boilerplate ×5 inside |
| 373 | `src/shared/ui/chart.tsx` | shadcn chart wrapper |
| 337 | `src/features/user-dashboard/components/course-player-content.tsx` | local inline types + player logic + video list |
| 335 | `src/features/courses/store/use-course-form-store.ts` | legacy store (see §3.3) |
| 315 | `src/features/courses/store/use-course-wizard-store.ts` | state store + orchestration |
| 313 | `src/features/courses/api/course-service.ts` | client "grab-bag": payload building, duration conversion, upload tracking, types |
| 303 | `src/features/marketing/components/donation-support-section.tsx` | form + FAQ + layout in one file |
| 281 | `src/features/marketing/components/mission-sections.tsx` | 4+ sections in one file |
| 275 | `src/app/(admin)/admin/courses/[id]/edit/page.tsx` | wizard shell + prefill + skeleton + footer |
| 274 | `src/features/courses/components/video-upload-toast.tsx` | toast + progress + retry UI |
| 267 | `src/features/marketing/components/contact-hero-section.tsx` | hero + form + schema + submit handler |
| 250 | `src/features/user-dashboard/components/course-module-sidebar.tsx` | sidebar + progress fetch + inline types |
| 246 | `src/features/courses/components/publish-actions.tsx` | legacy (dead) form tree |
| 242 | `src/app/invite/accept/content.tsx` | auth branching + mutations |
| 233 | `src/features/user-dashboard/components/course-player-shell.tsx` | shell + fetch + empty/error states |
| 232 | `src/app/(admin)/admin/profile/page.tsx` | profile + avatar upload + form |
| 231 | `src/features/auth/components/signup-form.tsx` | form + OTP flow + submit |
| 227 | `src/features/videos/components/video-uploader.tsx` | inline upload pipeline (see §2.3) |

Full list of all 44 files over 170 lines is in the appendix (§9).

### 1.2 Contributing factors (make files big even before refactor)

- **Inline type definitions** per component instead of shared types (e.g. `course-player-content.tsx`, `course-module-sidebar.tsx`, `course-detail-hero-section.tsx`). See §3.2.
- **Inline fetch helpers / submit handlers** repeated per file. See §2 and §4.
- **Dead legacy course form tree** (~15 files in `src/features/courses/components/`) that only reference each other and are superseded by the wizard store. These should be **deleted**, not refactored — see §4.6.
- **Hardcoded class strings** inflate every file (see §7).

---

## 2. Logic Repetition (goal: extract helpers)

### 2.1 Pagination — **5 near-identical components**

| File | Lines |
|---|---|
| `src/features/admin/users/components/pagination-bar.tsx` | 78 |
| `src/features/admin/team/components/pagination-bar.tsx` | 72 |
| `src/features/admin/support/components/pagination-bar.tsx` | 74 |
| `src/features/admin/donations/components/pagination-bar.tsx` | 51 |
| `src/features/admin/products/components/pagination-bar.tsx` | 51 |

- Identical algorithm (windowed pages + ellipsis + "Showing X – Y of Z"), identical props (`page/total/pageSize/onPageChange`), ~85% line-set overlap.
- **Drift bug:** `support/pagination-bar.tsx:57` hardcodes `bg-[#7C3AED]`; the other 4 use `bg-ma-admin-primary`.
- Also duplicated: the render-time page-clamp side effect `if (page > ceil(total/pageSize)) setPage(1)` in `users/page.tsx:101-103` and `donations/page.tsx:72-74`.
- `shared/ui/pagination.tsx` (shadcn primitives) already exists but is only used *through* these 5 wrappers.
- **Fix:** one shared `PaginationBar` in `src/shared/ui/` + a `usePagination()` hook (page, setPage, clamp, pages, start/end). ~325 duplicated lines collapsed.

### 2.2 Confirmation dialogs — **6 copies of the same shell**

| Dialog | File | Lines |
|---|---|---|
| DeleteUserDialog | `src/features/admin/users/components/delete-user-dialog.tsx` | 76 |
| SuspendUserDialog | `src/features/admin/users/components/suspend-user-dialog.tsx` | 80 |
| ActivateUserDialog | `src/features/admin/users/components/activate-user-dialog.tsx` | 75 |
| DeleteCourseDialog | `src/app/(admin)/admin/courses/_components/delete-course-dialog.tsx` | 74 |
| ArchiveCourseDialog | `src/app/(admin)/admin/courses/_components/archive-course-dialog.tsx` | 88 |
| SaveDraftDialog | `src/app/(admin)/admin/courses/_components/save-draft-dialog.tsx` | 67 |

All share the identical `DialogContent px-7.5 py-4 sm:max-w-xl` / `DialogHeader border-b` / double-circle icon / question + description / `DialogFooter` with the same cancel+confirm buttons (`h-[53px] flex-1 rounded-button-medium`), same `isPending ? Loader2 : label` confirm, same `if (x && !isPending)` guard. Pairwise similarity 44–61%.
- **Fix:** a single generic `ConfirmDialog({ icon, title, description, tone, confirmLabel, isPending, onConfirm })`. ~460 duplicated lines collapsed.

### 2.3 Video upload pipeline — **written 4–5 times**

The sign-upload → XHR progress → finalize sequence exists in:
1. `src/features/videos/components/video-uploader.tsx:50-112` — inline XHR, ignores the existing helper
2. `src/features/courses/store/use-video-upload-store.ts:89-166` (`retryUpload`) — inline XHR
3. `src/features/courses/hooks/use-pending-uploads.tsx:113-198` (`resumeUpload`) — reuses `uploadToStorage` but re-implements sign/finalize
4. `src/features/courses/api/course-service.ts:190-209, 211-276` — 4th/5th variants
5. `src/shared/lib/storage-upload.ts` (`uploadToStorage`) — **already exists**, used by only 2 of the 4

Sign-upload POST body (`{ courseId, moduleId, topicId, title, mimeType }`) and finalize body (`{ storageKey, duration }`) are identical across all copies.
- **Fix:** one `uploadVideoWithProgress()` / `useVideoUpload()` in `src/features/videos/`, all 4 callers delegate. `formatBytes` is also duplicated (`video-upload-toast.tsx:14-21` vs `use-pending-uploads`).

### 2.4 Admin list-page skeleton — **7 pages, ~800 duplicated lines**

Same page shape recurs in: `admin/users`, `admin/team`, `admin/support`, `admin/donations`, `admin/products/sales`, `admin/products/customers`, `admin/products/all`, `admin/page.tsx` (dashboard), `admin/courses`.

Repeated building blocks:
- **Search input** `h-[44px] w-[300px] rounded-[8px] pl-9` — 4+ copies (`controls-row.tsx:40`, `team-filter-bar.tsx:40`, both `search-export-row.tsx`, `support-filter-bar.tsx:43`)
- **Export button** `h-[44px] min-w-[115px] gap-2.5 rounded-[8px] border-ma-admin-primary` — 3+ copies
- **Table header** `rounded-t-2xl bg-[#F5F5F5] hover:bg-[#f5f5f5]` — 9 tables + 5 skeletons
- **TableSkeleton** — 5 copies: inline in `admin/page.tsx:31-58`, `users/page.tsx:34-61`, `donations/page.tsx:16-39`, plus `team/.../table-skeleton.tsx`, `support/.../table-skeleton.tsx`, plus a *second* generic implementation in `products/components/products-skeleton.tsx`
- **Empty-state** `colSpan` block — 3+ copies
- **Row action menu** `DropdownMenu > ghost size-6 rounded-full border border-[#141B34] > MoreHorizontal` — 5 tables
- **Page-level:** `users/page.tsx` (218) vs `admin/page.tsx` (160) are 49.7% identical (same skeletons, same suspend/activate/delete callbacks, same 3 dialogs wired with identical `mutateAsync().then(close).catch(toast.error+close)` lines)

**Fix:** an `AdminListPage` composite + `useListPage()` hook (search/filter/page state, debounce, clamp, slice) + one `DataTableSkeleton` + shared `AdminPageContainer`.

### 2.5 Forms

- **Contact form** (`/api/contact` POST + zod schema + toast + reset) is triplicated: `contact-hero-section.tsx:15-20,63-87`, `account/support/page.tsx:15-20,47-71`, `donation-support-section.tsx:50-77` (donations variant posts to `/api/donations`).
- **Email validation schema** defined 5× (login-form, signup-form, contact-hero, donation-support, account/support).
- **`shared/api/orders.ts`:** `createOrder` (32-43) and `createPaymentIntent` (45-56) are the same function — both POST `/api/orders` with `{courseId}`, differ only in error text. The `if (!res.ok) { body; throw new Error }` block repeats in all 5 functions of the file.
- **User creation** is implemented twice and divergently: `AddUserDialog` (local state, manual validation, POST `/api/admin/users`) vs `admin/create/page.tsx` (react-hook-form + zod, POST `/api/admin/create-user`, different layout/heading).

### 2.6 Formatting — no shared helpers

`src/shared/utils/index.ts` has only `cn`, `isValidUuid`, `formatCompactValue`. Everything else is re-implemented:

- **Currency (4 ad-hoc styles):** `Intl.NumberFormat("en-US", USD)` in `donations-table.tsx:38-41` & `transactions/page.tsx:77-80`; `` `$${...toFixed(2)}` `` in 3 product tables; `` `$${...toLocaleString()}` `` in `sales-summary-cards.tsx` & `product-earnings-card.tsx`; `` `$ ${...} ${currency.toUpperCase()}` `` in `use-checkout-payment.ts`.
- **Dates (5 styles):** `toLocaleDateString()`, manual `getMonth()+1/getDate()`, date-fns `format`, `toLocaleDateString("en-US",{weekday...})`, custom.
- **Durations (4 formatters):** `course-video-list.tsx:50`, `course-module-sidebar.tsx:133`, `featured-courses.tsx:33`, `minutesToDuration` in `course-service.ts:112`.
- **Status badge colors:** `statusStyles` records duplicated in `transactions/page.tsx:20-25` and `support-table.tsx:31-35`; inline ternaries in `user-table.tsx:68-72`, `team-table.tsx:101-115`; `statusDisplay` copied verbatim between `all-products-table.tsx:15-19` and `product-table.tsx:19-23`.

**Fix:** `formatCurrency`, `formatDate`, `formatDuration`, `StatusBadge`/`getStatusColor` in `shared/utils` / `shared/ui`.

### 2.7 Fetch/error handling — no shared `apiFetch`

The `fetch → res.ok → body.error → throw` pattern is hand-rolled in 20+ places (`shared/api/orders.ts` (×5), `use-course-mutations.tsx`, `review-dialog.tsx`, `course-player-shell.tsx`, `course-player-content.tsx`, `course-module-sidebar.tsx`, `my-learning/page.tsx`, `dashboard/page.tsx`, `featured-courses.tsx`, `sales-section.tsx`, `kpi-section.tsx`, `course-service.ts`, `use-pending-uploads.tsx`, `use-support.ts`…). Some call sites (`use-users.ts`, `transactions/page.tsx:30`) don't check `res.ok` at all.

**Fix:** one `apiFetch<T>` client (with `ApiError`), and one `apiHandler` wrapper for the ~20 route handlers that repeat the same `UnauthorizedError/ForbiddenError → 401/403` + `Sentry` guard.

### 2.8 Admin card/kpi duplication

`StatCard` (`src/features/admin/components/stat-card.tsx`) exists and is reused by `kpi-cards.tsx` and `kpi-section.tsx` — but `support/components/kpi-cards.tsx:10-30` and `products/components/sales-summary-cards.tsx:7-32` **re-implement the same card layout inline** instead of using it.

---

## 3. Data Flow & Single Sources of Truth

### 3.1 Data-fetching is inconsistent

- **Marketing course detail:** `src/app/(marketing)/courses/[id]/page.tsx` is an RSC calling `/api/courses/[id]` via `fetchCourse()` + a big normalization block (74-136).
- **User dashboard course detail:** `src/app/(user)/dashboard/course/[id]/page.tsx` is a **byte-for-byte duplicate** of that page (same `TiptapNode`, `extractTextFromJson`, `fetchCourse`, same 62-line mapping), differing only in the `breadcrumbHref` prop. **Fix:** one shared RSC component.
- **Everything admin is client-only react-query:** no admin page uses server data; the admin layout does a server-side `requireSession()` and then every client component re-fetches the session — auth is resolved twice per request.
- **Course player waterfall:** `course-player-shell.tsx:57` fetches `["course", courseId]`; `CourseModuleSidebar` (`:56`), `CoursePlayerContent` (`:114`), and `CoursePlayerNavbar` (`:19`) each independently fetch `/api/enrollments/by-course/[courseId]` under the same key `["enrollment-progress", courseId]` — good key sharing, but 3 copy-pasted queryFns.

### 3.2 Duplicated domain types (single-source-of-truth violations)

| Domain | Representations |
|---|---|
| Course | **Resolved (P4, 2026-08-03)** — consolidated into `features/courses/dto.ts`: `CourseApiResponse` (+ nested), `CourseSaveResult`, `CourseListItem` (featured/enrollments rows), `PlayerCourse` family. Remaining local-only shapes: admin-list `Course` (`admin/courses/_components/types.ts`), marketing `CourseDetailHeroData`/`CourseDetailContentData`, `OrderSummaryCourseData` (UI contract). |
| Order / Transaction | `Order` in `shared/api/orders.ts`, inline `Transaction` in `transactions/page.tsx:7-18`, Drizzle `$inferSelect` in `order-service.ts` — **4** |
| Enrollment | `shared/api/orders.ts`, pgEnum, inline API returns — **3** |
| User | `users/types.ts`, `user-service.ts:14-22` (`UserListItem` — identical fields), better-auth schema — **3** |
| TeamMember | `team/types.ts:1-8` and `team-service.ts:36-43` — identical fields defined twice |
| Support ticket | **Resolved (P4, 2026-08-03)** — single `Ticket` (uses `createdAt`) + `ListSupportTicketsParams`/`ListSupportTicketsResult` in `support/types.ts`; server service and client hook both import from it; inline `ApiTicket`+`mapTicket` adapter deleted. |
| Donation | Drizzle schema has `currency`/`stripeCheckoutSessionId`/`updatedAt`; client `donations/types.ts` omits all three — verified as an intentional client subset, no field drift in what it does use |
| Topic | **Partially resolved (P4)** — dead `Topic`/`Module` interfaces in `features/courses/types` deleted (zero importers); only the wizard store's own `Topic`/`Module` (with wizard-only `videoFile`) remain; `initialize()` still hand-converts |

API responses also mix number types: `courses/[id]` returns `price` as `string`; `admin/sales/route.ts` does not coerce `amount` so pages must `Number()` it (`sales/[productId]/page.tsx:60`).

**Fix:** Drizzle `$inferSelect` as the source of truth server-side; one shared client-DTO module per domain; delete inline types; normalize numeric serialization in routes.

### 3.3 Zustand stores — split-brain + circular import

- Two competing course stores: `use-course-wizard-store.ts` and `use-course-form-store.ts`. They hold overlapping copies of `title`, price, `level`, `duration`, `modules`, `courseId`, `isSaving/isPublishing/publishError`. A change in one is invisible to the other.
- **Circular import:** `course-service.ts:1` imports the wizard-store type, while the wizard store imports `minutesToDuration` from `course-service.ts` (runtime-safe only because one is type-only).
- `use-video-upload-store.ts` holds an in-memory task queue; persistence lives separately in `use-pending-uploads.tsx` (localStorage, 24h TTL). Upload orchestration logic is triplicated (see §2.3).

### 3.4 React Query keys — no factory, collisions, no defaults

- 49 ad-hoc string keys. Same resource under different keys:
  - `/api/courses/featured` → `["featured-courses"]`, `["public-courses"]`, `["user-courses"]`
  - `/api/enrollments` → `["user-enrollments"]`, `["my-learning"]`
  - `/api/courses/[id]` → `["course", id]` and `["course-summary", id]`
  - `["admin-products"]` used by two pages for the same endpoint
- `src/providers/index.tsx` builds `new QueryClient()` with **no defaults** (no global `staleTime`/`retry`); individual queries set `refetchOnWindowFocus:false` or `staleTime` inconsistently.

**Fix:** query-key factory + global defaults.

### 3.5 Auth/session — 16 call sites, no shared hook

`authClient.useSession()` is called directly in **16 files** (verified via grep), plus a hand-rolled `AccountSessionContext` (`account/_context.ts`, `account/layout.tsx`) for the account pages — so there are **two coexisting consumption patterns**. Admin pages each do `const role = session?.user?.role` (5×).

### 3.6 Hydration notes

- `course-player-shell.tsx` uses `useSearchParams` without a `<Suspense>` boundary at its page (`(course-player)/my-learning/[courseId]/page.tsx` has none) — potential CSR bailout in Next 16. Checkout and donation/success wrap theirs correctly.
- `review-dialog.tsx:68-104` does optimistic cache writes with `crypto.randomUUID()` — fine (dialog is closed pre-hydration) but noted.

---

## 4. Extractable Hooks & Logic

| Hook | Replaces | Est. savings |
|---|---|---|
| `useSession()` (shared) | 16 `authClient.useSession()` sites + `AccountSessionContext` | ~16 call sites |
| `usePagination()` | clamp + slice + windowed pages in 7 admin pages | ~200 lines |
| `useVideoUpload()` / `uploadVideoWithProgress()` | 4 copies of sign→upload→finalize | ~200 lines |
| `useContactForm()` | 3 duplicate submit handlers + schemas | ~100 lines |
| `useListPage()` | search/filter/page/debounce state in 7 admin pages | ~150 lines |
| `useIsMobile(breakpoint)` | duplicated `use-mobile.ts` variant in `testimonials.tsx:26-36` (uses 1023px, canonical uses 768px) | 1 copy |
| `apiFetch<T>` + `ApiError` | 20+ hand-rolled fetch blocks | ~200 lines |
| `apiHandler` | ~20 route try/catch guards | ~300 lines |

---

## 5. Prettier Rules (explicitly deferred)

Current `.prettierrc`:
```json
{
  "endOfLine": "lf",
  "semi": false,
  "singleQuote": false,     // <- target: true
  "tabWidth": 2,
  "trailingComma": "es5",   // <- target: "all"
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

Agreed target (for the *later* formatting pass, not now):
- `"singleQuote": true` (single quotes for non-HTML attributes — JS/TS strings)
- `"trailingComma": "all"`
- Consider bumping `printWidth` (80 is aggressive; e.g. 100) to reduce wrapping churn — decision needed.

Formatting must run **after** the structural refactor to avoid rewriting code twice. Plan: add a `format:check` script (`prettier --check`) alongside the existing `format` script.

---

## 6. Reusable Components

### 6.1 Page headers

`text-4xl/[100%] font-semibold tracking-[-3%]` heading is re-declared in **8 admin pages**, with drift (`/[100%]` missing in donations/products, `font-bold` in support). A `PageHeader` component exists only at `src/features/admin/products/components/page-header.tsx` (15 lines) with a **products-specific default** `backHref`, used in just 4 pages — it should be promoted to `src/shared/ui/`.

### 6.2 Pagination — see §2.1

`shared/ui/pagination.tsx` (shadcn primitives) is never imported directly; all 5 feature `pagination-bar.tsx` wrappers re-implement the same algorithm. One shared `PaginationBar` in `shared/ui`.

### 6.3 Create/edit pages

- **Courses:** `new/page.tsx` and `[id]/edit/page.tsx` are ~75% identical (same stepper, step array, `handlePrevious`/`handleSaveAndContinue`, footer buttons, save dialog). The only real differences: `edit` prefills via `useCourseWizardStore.initialize(course)`, fetches, and has status-aware publish labels. **Fix:** a `CourseWizardShell` with `mode: "create" | "edit"`.
- **User creation:** `AddUserDialog` and `admin/create/page.tsx` duplicate the concept with different endpoints, validation stacks, and layouts. **Fix:** shared `CreateUserForm` + one endpoint.

### 6.4 Admin table shell + `StatusBadge` + `EmptyState`

The `rounded-t-2xl bg-[#F5F5F5]` table-header + hover rows + row-action menu + empty-state block recurs in all 8 admin tables. A `StatusBadge` (green/amber/destructive) and `EmptyState` would collapse the duplicated badge ternaries and `colSpan` blocks.

### 6.5 Marketing atoms

- **Glow pill button** (`rounded-[60px] bg-ma-text` + `from-ma-glow-blue to-ma-glow-violet` hover overlay) — appears in **13 files** (login, signup, auth-code, contact, donation, enroll-now-button, course-card, navbar, hero, footer, donation-cta, donation/success, account/support). Extract `MarketingButton`/`GlowPillButton`.
- **Page container** `mx-auto px-4 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50` — 9+ marketing files + admin.
- **Section wrapper** + **SectionHeading** (eyebrow + big heading) — ~10 files.
- **Form card** `rounded-[24px] bg-[#f5f5f5] px-4 py-7.5` — 5 files.

### 6.6 Existing `shared/ui` inventory (31 files)

- Broadly used: button, card, dialog, dropdown-menu, field, input, label, select, separator, skeleton, table, badge, avatar, user-avatar, sonner, error-state, popover.
- **Unused/dead primitives:** `tabs.tsx` (0 imports), `breadcrumb.tsx` (0 imports).
- Under-used: `stepper.tsx` (2 pages), `chart.tsx` (1), `calendar.tsx` (legacy only).
- Missing generics that audits show are needed: `PageHeader`, `SectionHeading`, `StatusBadge`, `EmptyState`, `TableSkeleton`, `SearchInput`, `InlineAlert`, `PaginationBar`.

---

## 7. Reusable Design Tokens (Tailwind 4)

Tokens live in `src/app/globals.css` (`:root`/`.dark` raw values + `@theme inline` mapping). Brand tokens exist: `--ma-primary-text/bg/card`, `--ma-glow-blue/violet`, `--ma-admin-primary`. **Discipline is broken by ~400+ arbitrary `[...]` values**, the worst offenders:

### 7.1 Hardcoded colors that should be tokens (verified counts)

| Value | Matches | Existing token it approximates | Action |
|---|---|---|---|
| `#6b7280` / `#6B7280` (text, placeholder) | **~109** | `muted-foreground` (already used 142×) | → `text-muted-foreground` / new `--ma-muted-text` |
| `#F5F5F5` / `#f5f5f5` (bg) | **~49** | `--ma-primary-bg` is `#f5f7fa` (2-unit delta) | → `bg-ma-bg` or new `--ma-surface-2` (decision) |
| `#E5E7EB` / `#e5e7eb` (border) | **~43** | `--border` (`oklch(0.922)`) | → `border-border` |
| `#D9D9D9` (border) | **24** | none | new `--ma-border-light` |
| `#ff9d00` (stars) | **13** | none | new `--ma-star` |
| `#A38524` (gold accents) | **11** | none | new `--ma-gold` |
| `#7C3AED` (admin purple) | **3** | `--ma-admin-primary` is `#7b5cff` | → `bg-ma-admin-primary` (bug — used in support table + pagination) |
| `#6A4AE0` (hover) | **2** | none | new `--ma-admin-primary-dark` |
| `#141B34` (row-menu border) | **5** | `--ma-primary-text` `#111827` | → token |
| `#448AFF`, `#6d63ff` | 3+3 | none / glow-violet | tokens |
| `#F62323`/`#FEE2E1` (destructive) | **3** | `--destructive` | → `bg-destructive` |
| `bg-green-700/10 text-green-700`, `bg-amber-100 text-amber-800` | **~15** | none | semantic `--ma-success`/`--ma-warning` tokens |

### 7.2 Arbitrary sizing/spacing/radius values

| Value | Matches | Note |
|---|---|---|
| `rounded-[8px]` | **81** | no token equals 8px (`--radius-sm` ≈ 8.4px, `rounded-button-medium` = 6px) — decision needed |
| `rounded-[60px]` | **42** | → `--radius-pill` |
| `h-[53px]` | **37** | → `--spacing-pill-h` |
| `h-[44px]` | **33** | byte-identical to `h-11` — just use `h-11` |
| `max-w-360` | **40** | → `--container-page` or keep (it is consistent) |
| `rounded-[24px]` | **22** | ≈ `rounded-2xl` (25.2px) — decision |
| `tracking-[-5%]`/`[-3%]`/`[-1.5%]` | 9/9/10 | → tracking tokens |
| `px-7.5`, `p-7.5`, `py-12.5`, `py-19.25`, `mt-15.5` | many | valid in TW4 dynamic scale; standardize (`py-19.25` is exotic) |
| `text-4xl/[100%]` | **7** | → `text-4xl leading-none` |

### 7.3 Container queries

- Infra exists only inside `shared/ui/card.tsx` (`@container/card-header`) and `field.tsx` (`@container/field-group`).
- **No container-query-driven layout anywhere.** The course-card grid, wizard preview, and course-player sidebar render in variable-width containers but use viewport `md:`/`lg:` breakpoints.
- **Start:** add `@container` to the `course-card` parent and switch its inner breakpoints to `@md:`/`@lg:`.

### 7.4 Token plan

1. Add raw tokens in `:root` (surface-2, muted-text, border-light, star, gold, admin-primary-dark, accent-blue, success, warning).
2. Map in `@theme inline`.
3. Add structural tokens: `--radius-pill`, `--radius-8` (or decision), `--spacing-pill-h`, tracking tokens.
4. Mechanical regex swaps (one commit per color family for bisectable history).

---

## 8. Suggested Refactor Phases (priority order)

| # | Phase | ROIs on |
|---|---|---|
| 1 | Delete dead code: legacy course form tree (~15 files), `tabs.tsx`, `breadcrumb.tsx` | size, clarity |
| 2 | Shared `apiFetch<T>` + `apiHandler`; consolidate `orders.ts` (`createOrder`/`createPaymentIntent`) | §2.7, §3.1 |
| 3 | Shared types (server: Drizzle `$inferSelect`; client DTOs per domain); reconcile Topic/Donation/Ticket drift | §3.2 |
| 4 | Formatting utils (`formatCurrency`, `formatDate`, `formatDuration`, `StatusBadge`) | §2.6 |
| 5 | `PaginationBar` + `usePagination`; `ConfirmDialog`; `PageHeader`/`AdminPageContainer` | §2.1, §2.2, §6.1 |
| 6 | `AdminListPage` + `useListPage` + `DataTableSkeleton`; collapse users↔dashboard pages; merge `all-products-table`/`product-table` | §2.4 |
| 7 | Video upload unification (`useVideoUpload`); merge/eliminate the form store; break wizard-store↔course-service cycle; `CourseWizardShell`; reconcile `AddUserDialog`/`create` page | §2.3, §3.3, §6.3 |
| 8 | `useSession()` shared hook; query-key factory + global QueryClient defaults | §3.4, §3.5 |
| 9 | Marketing atoms (`MarketingButton`, `MarketingContainer`, `SectionHeading`, `useContactForm`) | §2.5, §6.5 |
| 10 | Split the 44 over-170-line files down to ≤170 | §1 |
| 11 | Design tokens + regex swaps (colors → sizing → components); container-query adoption on `course-card` | §7 |
| 12 | Prettier: `singleQuote: true`, `trailingComma: "all"`, add `format:check` | §5 |

---

## 9. Appendix — All 44 files over 170 lines

```
702  src/shared/ui/sidebar.tsx
501  src/app/api/courses/[id]/route.ts
498  src/features/admin/team/services/team-service.ts
373  src/shared/ui/chart.tsx
337  src/features/user-dashboard/components/course-player-content.tsx
335  src/features/courses/store/use-course-form-store.ts
315  src/features/courses/store/use-course-wizard-store.ts
313  src/features/courses/api/course-service.ts
303  src/features/marketing/components/donation-support-section.tsx
281  src/features/marketing/components/mission-sections.tsx
275  src/app/(admin)/admin/courses/[id]/edit/page.tsx
274  src/features/courses/components/video-upload-toast.tsx
269  src/shared/ui/dropdown-menu.tsx
267  src/features/marketing/components/contact-hero-section.tsx
250  src/features/user-dashboard/components/course-module-sidebar.tsx
246  src/features/courses/components/publish-actions.tsx
242  src/app/invite/accept/content.tsx
238  src/shared/ui/field.tsx
237  src/app/(marketing)/sentry-example-page/page.tsx
233  src/features/user-dashboard/components/course-player-shell.tsx
232  src/app/(admin)/admin/profile/page.tsx
231  src/features/auth/components/signup-form.tsx
227  src/features/videos/components/video-uploader.tsx
222  src/shared/ui/calendar.tsx
218  src/app/(admin)/admin/users/page.tsx
217  src/features/videos/services/video-service.ts
217  src/app/(admin)/admin/courses/_components/course-card-item.tsx
210  src/app/(user)/account/support/page.tsx
210  src/app/(user)/account/page.tsx
206  src/features/courses/hooks/use-pending-uploads.tsx
203  src/features/user-dashboard/hooks/use-checkout-payment.ts
201  src/features/auth/components/login-form.tsx
193  src/features/courses/components/course-card.tsx
193  src/features/courses/components/review-dialog.tsx
192  src/shared/ui/select.tsx
189  src/features/auth/components/auth-code-form.tsx
186  src/features/courses/components/wizard/topic-row.tsx
182  src/app/api/orders/route.ts
179  src/app/(user)/dashboard/page.tsx
178  src/features/platform/components/sidebar-navigation.tsx
177  src/features/courses/components/topic-editor.tsx
177  src/app/api/courses/route.ts
173  src/features/courses/hooks/use-course-mutations.tsx
171  src/features/admin/team/components/edit-permission-dialog.tsx
```

---

## 10. Open Decisions — RESOLVED

The fix phase is tracked in `REFACTOR_PLAN.md`. Decisions locked on 2026-08-01:

| # | Decision | Choice |
|---|---|---|
| 1 | `rounded-[8px]` (81×) | New `--radius-8` token |
| 2 | `#F5F5F5` (49×) | New `--ma-surface-2` token (exact fidelity) |
| 3 | Auth input `border-[#6b7280]` (5×) | Treat as bug → `border-input` |
| 4 | Prettier `printWidth` | **Keep 80** |
| 5 | User creation | Consolidate onto `/api/admin/users`; drop `admin/create` |
| 6 | Two course stores | Merge into wizard store, delete legacy tree |
| 7 | KPI badge palette | Semantic `--ma-success/-warning/-info` tokens |

---

## 11. Work Log — P4 Client DTO Consolidation (2026-08-03)

Branch: `refactor/frontend-p4-shared-infra` (tip `cf9d737`). Not yet committed/merged; **`npm run build` not yet completed** (timed out twice, then aborted).

### Course domain — new single source `src/features/courses/dto.ts`

- Moved `CourseApiResponse` + `CourseApiReview`/`CourseApiModule`/`CourseApiTopic` out of `features/courses/types/index.ts` into `dto.ts`.
- Renamed the *mutation result* `CourseResponse` (in `course-service.ts`) → `CourseSaveResult` (DTO). This was the misleading-name collision; `CourseApiResponse` kept its name deliberately (renaming to `CourseDetail` would churn 6 importers for no clarity gain).
- Added `CourseListItem` — one shape for `/api/courses/featured` **and** `/api/enrollments` rows (featured fields + optional `progress`).
- Added player-view types `PlayerCourse`/`PlayerModule`/`PlayerTopic`/`PlayerTutor`/`PlayerReview`.
- `features/courses/types/index.ts` reduced to `CourseStatus` + `TopicType`; deleted dead `Topic`/`Module` interfaces (verified zero importers).
- `course-service.ts`: deleted dead `getCourse()` — it was mis-typed to the save-result shape while hitting the **detail** endpoint `/api/courses/[id]`; zero callers.

### Player trio migrated to shared types

- `course-player-shell.tsx`: `queryFn` returns `Promise<PlayerCourse | null>` (null = 404 → `notFound()`).
- `course-player-content.tsx`: deleted local `Topic`/`Module`/`Review`/`Tutor`/`CourseData` (~38 lines); uses `PlayerCourse`/`PlayerModule`/`PlayerTopic`; removed unused `TutorCard` import; fixed two **pre-existing** `react-hooks/preserve-manual-memoization` errors by aligning `useCallback` deps with compiler-inferred deps (`video` instead of `video?.duration`; dropped `videoIdRef` ref from deps).
- `course-module-sidebar.tsx`: deleted local types (~30 lines); uses `PlayerCourse`; replaced leftover ad-hoc key `["enrollment-progress", courseId]` with `queryKeys.enrollment.progress(courseId)`; fixed a `no-unused-expressions` ternary in `toggleWeek`.

### List types

- `course-card.tsx`: `export type Course = CourseListItem` (marketing `Course` type deleted; consumers unchanged).
- `featured-courses.tsx`: local `Course` → `CourseListItem`.

### Importers of `CourseApiResponse`/`CourseApiReview` re-pointed to `dto.ts`

- `(marketing)/courses/[id]/page.tsx`, `(user)/dashboard/course/[id]/page.tsx`, `(admin)/admin/courses/[id]/edit/page.tsx` (`CourseStatus` stays in `types`), wizard store (`TopicType` stays in `types`).

### Support ticket — one contract in `features/admin/support/types.ts`

- `Ticket` now uses `createdAt` (was `date`); added `ListSupportTicketsParams`/`ListSupportTicketsResult`.
- `support-service.ts`: removed duplicate `TicketDTO` + the two `ListSupportTickets*` interfaces; imports from `types.ts`; `updateTicketStatus` takes `TicketStatus`.
- `use-support.ts` and `api/admin/support/route.ts` now import the contract from `types.ts`, not the server service (removes a client→server coupling).
- `support/page.tsx`: deleted inline `ApiTicket` + `mapTicket` adapter; tickets flow through directly.
- `support-table.tsx`: formats `createdAt` via `formatDate` — **user-visible change**: date column now renders `Mon DD, YYYY` instead of `M/D/YYYY`.

### Not done (deliberate scope trims / remaining)

- `Suspense` around `useSearchParams` in the player shell (separate P4 item, §3.6) — deferred.
- Admin-list `Course` (`admin/courses/_components/types.ts`) left in place — already single-sourced within the admin feature.
- `OrderSummaryCourseData` (checkout.ts) left as a UI contract.
- Donation `Donation` type left as-is — verified it already matches the API response fields it uses.
- The two byte-identical course-detail RSC pages (marketing vs dashboard) are **not** merged (that's P6).

### Verification status

- `npx tsc --noEmit` — clean.
- `npx eslint` on all 19 changed files — clean (0 problems).
- `npm run build` — **INCOMPLETE**; timed out after 10 min with buffered output, second run aborted by user. Re-run to completion before committing.
