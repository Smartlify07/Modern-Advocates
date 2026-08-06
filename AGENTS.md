<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend Refactor Practices

These rules were written from the P1-P6 frontend refactor session. Follow them for any frontend work in this repo.

## Git / PR workflow

- Use a flat, single-branch-per-phase strategy: `refactor/frontend-pN-<slug>`, each stacked on the previous phase.
- Maintain one base branch (e.g. `refactor/frontend`) and merge each completed phase into it with `--no-ff`.
- Before pushing a phase, merge the previous phase (or `main`) into it and resolve conflicts; keep PRs as close to `main` as possible.
- Set the PR base to the previous phase's branch, and after that phase merges, retarget the PR to `main` (GitHub can do this automatically). Confirm with `gh pr view <n> --json mergeable,mergeStateStatus,baseRefName`.
- Only merge when the build passes and the PR reports `MERGEABLE`. Check `gh pr checks`.
- Use `gh` for all PR tasks and return PR URLs.

## Verification before commit (required)

1. `npx tsc --noEmit` must be clean. If it reports generated-type errors (e.g. TS1128 in `.next`), delete stale generated output first: `Remove-Item -Recurse -Force .next\dev`, then re-run.
2. `npm run build` is the real gate. It can take 300-600s, so give it a generous timeout (600000 ms). Build-log warnings such as `BetterAuthError: default secret` are pre-existing.
3. `npm run lint` — compare against the known pre-existing issues; do not introduce new ones:
   - `use-users.ts:6` unused `User` import
   - `user-service.ts:4` unused `eq` import
   - `use-pending-uploads` `set-state-in-effect` (line ~87) and unused `err` (line ~132)
4. When tsc/lint/build fails, confirm whether the issue is introduced by your change or pre-existing — check with `git stash` before "fixing" things.
5. Check `git status` before committing; never stage untracked files like `public/figma-home/logo-icon.svg` (intentionally untracked).
6. Commit messages match repo style: `refactor: P<N> <short name>`.

## Shared infrastructure (DO — reuse these)

- **Shared components**: `shared/ui` — PaginationBar, ConfirmDialog, PageHeader, AdminPageContainer, TableSkeleton, DataTableSkeleton, StatusBadge, EmptyState, StatCard. `features/marketing/components` — MarketingContainer, MarketingButton, SectionHeading.
- **Shared libs**: `shared/lib/api-fetch` (`apiFetch`) for all server calls; `shared/lib` queryKeys factory as the single source of truth for react-query keys; `shared/lib/storage-upload.ts` `uploadToStorage` is the only place raw XHR upload remains.
- **Shared hooks**: `useContactForm`; `useSession` from auth.
- **Shared pages/RSC**: a single course-detail RSC (`features/marketing/components/course-detail-page.tsx`) is reused by both `(marketing)/courses/[id]` and `(user)/dashboard/course/[id]` — thin wrappers only.
- **Upload pipeline**: use `signVideoUpload` + `uploadVideoWithProgress` from `features/videos/lib/upload-video.ts` (sign → upload → finalize in one place). All call sites delegate.
- **DTOs / types**: import `UserDTO`, `AdminRole`, etc. from their single source (`user-service`); never redefine.
- **Feature-internal circular deps**: extract shared pure logic into `features/<name>/lib/` (e.g. `features/courses/lib/duration.ts` broke the course-service ↔ wizard-store cycle).
- **Admin dialogs**: use `<form id={...}>` with the footer button `type="submit" form={FORM_ID}` so both Enter-in-field and the dialog footer submit.

## Anti-patterns (AVOID — all fixed during P1-P6)

- Do NOT duplicate per-feature components. Search `shared/ui` and `features/marketing/components` first before writing a new PaginationBar, ConfirmDialog, PageHeader, skeleton, or StatusBadge.
- Do NOT reimplement the sign→XHR→finalize upload flow anywhere; delegate to `features/videos/lib/upload-video.ts`.
- Do NOT create circular imports between services and stores; extract shared logic to a `lib/` file.
- Do NOT copy-paste pages across route groups; make one shared RSC and thin wrappers.
- Do NOT redefine DTOs or query keys in multiple places.
- Do NOT use arbitrary hex colors/spacing; use design tokens.
- Do NOT fix pre-existing lint issues as part of an unrelated refactor.
- Do NOT push or merge without a passing build.

## Conflict resolution on Windows

- CRLF vs LF makes whole files appear changed; before resolving, compare with trimmed lines and `git diff -w` and check numstat superset (e.g. 229/227 churn where the real diff is one container div).
- When the old per-feature file is fully superseded by a shared component, resolve with `--ours` (keep the shared version), then verify the real diff is only the shared-component rewire.
- Never commit binary/purposely-untracked artifacts; check `git status --short` first.
- Avoid `Select-Object -First/-Last` to truncate command output (it breaks full-output capture to file); use Grep/Read on the captured output instead.
