# Refactor Plan — Frontend Maintainability

**Status:** In progress
**Base branch:** `refactor/frontend` (cut from `origin/main` @ 189d1bd)
**Source audit:** `FRONTEND_AUDIT.md`
**Goals**

1. Every component ≤ 170 lines
2. Extract helpers for repeated logic
3. Proper data flow + single sources of truth
4. Extract reusable hooks
5. Strict Prettier (single quotes, trailing commas; `printWidth` stays 80)
6. Reusable components (page headers, pagination, create/edit)
7. Design tokens + spacing vars + container queries

## Locked decisions

| #   | Decision                           | Choice                                                   |
| --- | ---------------------------------- | -------------------------------------------------------- |
| 1   | `rounded-[8px]` (81×)              | New `--radius-8` token                                   |
| 2   | `#F5F5F5` (49×)                    | New `--ma-surface-2` token (exact fidelity)              |
| 3   | Auth input `border-[#6b7280]` (5×) | Treat as bug → `border-input`                            |
| 4   | Prettier `printWidth`              | **Keep 80**                                              |
| 5   | User creation                      | Consolidate onto `/api/admin/users`; drop `admin/create` |
| 6   | Two course stores                  | Merge into wizard store, delete legacy tree              |
| 7   | KPI badge palette                  | Semantic `--ma-success/-warning/-info` tokens            |

## Git strategy

- `refactor/frontend` is the long-lived integration base; it never merges into `main` until all phases are done (then one PR).
- One phase branch per phase, cut from the tip of `refactor/frontend` after the previous phase merged.
- **Rebase `refactor/frontend` onto the latest `origin/main` before cutting each phase** to minimize drift (repo moves fast; many branches sit 40+ commits behind).
- Verify (`npm run lint` + `npm run typecheck` + `npm run build`) before each phase merges into the base.
- Unrelated WIP was stashed on `ch/admin-profile` (`stash@{0}`) before branching.

## Phases

### P1 — Token foundation (additive, zero visual change)

File: `src/app/globals.css`

- `:root` additions: `--ma-surface-2: #f5f5f5`, `--ma-muted-text: #6b7280`, `--ma-border-light: #d9d9d9`, `--ma-star: #ff9d00`, `--ma-gold: #a38524`, `--ma-admin-primary-dark: #6a4ae0`, `--ma-accent-blue: #448aff`, `--ma-border-strong: #141b34`, `--ma-success`/`--ma-warning`/`--ma-info` (bg + text pairs)
- Structural: `--radius-8: 8px`, `--radius-pill: 60px`, `--radius-card-2: 24px`, `--spacing-pill-h: 53px`, tracking tokens (`-1.5%`/`-3%`/`-5%`)
- `@theme inline` mappings + `.dark` variants for semantic colors

### P2 — Dead code deletion

- Legacy course form tree (~15 files): `basic-info-section`, `course-content-section`, `module-editor`, `topic-editor`, `topic-editor-panel`, `topic-tabs`, `publish-section`, `publish-preview`, `publish-actions`, `pricing-section`, `date-range-picker`, `module-title`, `thumbnail-upload`, `video-uploader`, `video-upload-toast`
- `use-course-form-store.ts`
- Unused primitives: `shared/ui/tabs.tsx`, `shared/ui/breadcrumb.tsx`
- `app/(admin)/admin/create/page.tsx` + `api/admin/create-user/route.ts` (decision 5)
- Verify zero importers before each delete.

### P3 — Mechanical token swaps (one commit per family)

- Colors: `#F5F5F5→bg-ma-surface-2`, `#6b7280→text-muted-foreground` (+ auth borders → `border-input`), `#E5E7EB→border-border`, `#D9D9D9→border-ma-border-light`, `#7C3AED→bg-ma-admin-primary` (fixes drift), `#6A4AE0→ma-admin-primary-dark`, `#141B34→ma-border-strong`, destructive hex → `bg-destructive`, green/amber → success/warning, KPI bespoke → semantic, `#ff9d00→ma-star`, `#A38524→ma-gold`
- Sizing: `rounded-[8px]→rounded-8`, `rounded-[60px]→rounded-pill`, `h-[53px]→h-pill`, `h-[44px]→h-11`, `rounded-[24px]→rounded-card-2`, tracking classes, `text-4xl/[100%]→leading-none`

### P4 — Shared infrastructure

- `shared/lib/api-fetch.ts`: `apiFetch<T>` + `ApiError`; replace 20+ hand-rolled fetch blocks; fix the 2 call sites that skip `res.ok`
- `apiHandler` wrapper for ~20 route try/catch guards
- `shared/utils`: `formatCurrency`, `formatDate`, `formatDuration`, `getStatusColor`
- Client DTO modules per domain (consolidate 5+ Course shapes, Ticket/Donation/Topic drift); `Suspense` around `useSearchParams` in course-player-shell
- Query-key factory + global QueryClient defaults; unify duplicate keys
- `useSession()` hook; replace 16 call sites + `AccountSessionContext`

**Status (2026-08-03):** DTO consolidation **done** — course DTOs in `features/courses/dto.ts` (`CourseApiResponse`, `CourseSaveResult`, `CourseListItem`, `PlayerCourse` family); `types/index.ts` slimmed to `CourseStatus`/`TopicType`; dead `getCourse()` + `Topic`/`Module` deleted; player trio + card + featured-courses migrated; support `Ticket` unified on `createdAt` with `ListSupportTickets*` contract in `support/types.ts` (service + hook + route import from it). Full session log in `FRONTEND_AUDIT.md` §11. Remaining P4 item: `Suspense` around `useSearchParams` in the player shell. Changes uncommitted on `refactor/frontend-p4-shared-infra`; build not yet re-verified.

### P5 — Reusable components

- `shared/ui/pagination-bar.tsx` + `usePagination()` (5→1)
- `shared/ui/confirm-dialog.tsx` (6→1)
- Promote `PageHeader` + `AdminPageContainer`
- `AdminListPage` + `useListPage()` + `DataTableSkeleton` + `StatusBadge` + `EmptyState`; merge users↔dashboard pages; merge all-products↔product tables; consolidate KPI card copies onto `StatCard`
- Marketing atoms: `MarketingButton`, `MarketingContainer`, `SectionHeading`, `useContactForm()`
- `CourseWizardShell` (create|edit)
- `CreateUserForm` (decision 5)

**Status (2026-08-04):** P5 done on `refactor/frontend-p5-reusable-components`. Committed: `shared/ui/pagination-bar.tsx` (5→1), `shared/ui/confirm-dialog.tsx` (6→1), `shared/ui/page-header.tsx` + `shared/ui/admin-page-container.tsx` (rewired all admin pages), `shared/ui/table-skeleton.tsx` + `shared/ui/data-table-skeleton.tsx` (6→1, deleted team/support feature skeletons, migrated products-skeleton), `shared/ui/status-badge.tsx`, `shared/ui/empty-state.tsx`, `shared/ui/stat-card.tsx` (moved `features/admin/components/stat-card`), marketing atoms `MarketingButton`/`MarketingContainer`/`SectionHeading`/`useContactForm` (rewired login/signup/auth-code/contact-hero/donation-support/account-support), `CreateUserForm` + extended `/api/admin/users` POST with optional `password`/`role` (`AdminRole` union). Deferred: `usePagination()` (pages mix client-slice and server-query pagination), `AdminListPage`/`useListPage`, users↔dashboard and all-products↔product-table page merges, and `CourseWizardShell` — lower value and higher risk; revisit in a later phase. Added back-nav (`backHref`) to product sub-route headers: `/admin/products/all`, `/admin/products/customers`, `/admin/products/sales` → `/admin/products`; `/admin/products/sales/[productId]` → `/admin/products/sales`. P5 merged (`--no-ff`) into `refactor/frontend` as `a366239`.

### P6 — Data flow & stores

- Merge form store into wizard store; break `course-service`↔store circular import
- `use-video-upload` unify sign→upload→finalize (4→1)
- One shared course-detail RSC page (2 byte-identical pages → 1)

**Status (2026-08-04):** P6 done on `refactor/frontend-p6-data-flow-stores` (commit `9fec8ec`). The legacy form store was already gone (merged into the wizard store in a prior phase), so the store merge was a no-op. Circular import **broken**: duration utils (`DURATION_UNITS`/`DurationUnit`/`durationToMinutes`/`minutesToDuration`) moved out of `api/course-service.ts` into `features/courses/lib/duration.ts`; the wizard store, schemas, and `course-information-card` now import from lib instead of the service. Video upload **unified**: new `features/videos/lib/upload-video.ts` (`signVideoUpload` + `uploadVideoWithProgress` doing sign→XHR→duration→finalize); the three duplicated pipelines in `course-service` (`uploadSingleVideoWithTracking`), `use-pending-uploads.tsx` (`resumeUpload`), and `use-video-upload-store.ts` (`retryUpload`) all delegate — the last inline XHR copy (store `retryUpload`) is removed. Course-detail **unified**: byte-identical `(marketing)/courses/[id]` and `(user)/dashboard/course/[id]` pages collapsed into one shared RSC `features/marketing/components/course-detail-page.tsx` (accepts optional `breadcrumbHref`); both routes are thin wrappers. tsc + eslint + build all pass. P6 merge pending.

### P7 — Size compliance (≤170 lines)

- Re-measure all files; split anything still over 170 (see audit §1 + appendix)

### P8 — Prettier + container queries

- `.prettierrc`: `singleQuote: true`, `trailingComma: "all"`, `printWidth: 80`; add `format:check` script
- Run `npm run format` (last)
- Container queries: `@container` on course-card grid + wizard preview + player sidebar

## Definition of done

- 0 frontend files > 170 lines
- 0 arbitrary hex colors / arbitrary radius/spacing values
- Single instances of `PaginationBar`, `ConfirmDialog`, `PageHeader`, `useSession`, `apiFetch`, `useVideoUpload`
- One course store; one course-detail page; one user-creation endpoint
- Prettier enforced via `format:check`
