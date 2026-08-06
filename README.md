# Modern Advocates

A full-stack learning platform for modern advocates, built with Next.js, React, and shadcn/ui. It combines a public marketing site, a video-based course player, user dashboards, an admin panel, and secure payments — all in a single app.

## Features

- **Marketing site** — public pages for courses, about, contact, and donations.
- **Course platform** — video courses with a dedicated player, enrollment, reviews, and a learning dashboard.
- **Payments** — Stripe-powered checkout for courses and donations.
- **Admin panel** — manage users, courses, products, sales, categories, and site content.
- **Auth** — Better Auth with email/password, Google OAuth, OTP/email sign-in, and role-based access.
- **Storage** — Backblaze B2 (S3-compatible) for video and file uploads.
- **Observability** — Sentry for error tracking.

## Tech stack

- **Framework**: Next.js 16 (App Router), React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Data**: Drizzle ORM + Neon (PostgreSQL)
- **State / data fetching**: TanStack Query, Zustand, react-hook-form + zod
- **Auth**: Better Auth
- **Payments**: Stripe
- **Email**: Resend
- **Video**: Vidstack
- **Scheduling**: node-cron

## Getting started

### Prerequisites

- Node.js 20+ and pnpm
- A PostgreSQL database (Neon works well)
- Accounts/keys for: Backblaze B2, Stripe, Resend, and (optional) Google OAuth

### Install

```bash
# 1. Install dependencies
pnpm install

# 2. Copy the example env file and fill in your values
cp .env.example .env.local

# 3. Generate and run database migrations
pnpm db:generate
pnpm db:migrate:dev

# 4. (Optional) Seed the database
pnpm db:seed:dev

# 5. Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

All required variables are documented in `.env.example`, including:

- `DATABASE_URL` — PostgreSQL connection string
- B2 storage keys (`B2_ACCESS_KEY_ID`, `B2_SECRET_ACCESS_KEY`, `B2_BUCKET_NAME`)
- Stripe keys and webhook secret
- `RESEND_API_KEY`
- Google OAuth client ID/secret
- `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`

## Scripts

| Command               | Description                                    |
| --------------------- | ---------------------------------------------- |
| `pnpm dev`            | Start the dev server                           |
| `pnpm build`          | Production build                               |
| `pnpm start`          | Start the production server                    |
| `pnpm lint`           | Run ESLint                                     |
| `pnpm typecheck`      | Type-check with `tsc --noEmit`                 |
| `pnpm format`         | Format code with Prettier                      |
| `pnpm db:generate`    | Generate Drizzle migrations                    |
| `pnpm db:migrate`     | Run migrations                                 |
| `pnpm db:migrate:dev` | Run migrations against the dev database        |
| `pnpm db:push`        | Push schema changes directly to the database   |
| `pnpm db:seed`        | Seed the database                              |

## Project structure

```
src/
├── app/               # Next.js App Router routes
│   ├── (admin)/       # Admin panel
│   ├── (auth)/        # Auth pages
│   ├── (course-player)/ # Course player
│   ├── (marketing)/   # Public marketing pages
│   ├── (user)/        # User dashboard, checkout, learning
│   └── api/           # API routes
├── components/        # Shared UI components
├── features/          # Feature modules (admin, auth, courses,
│                      #   marketing, orders, platform, videos)
├── infrastructure/    # Database config and scripts
└── lib/               # Shared libraries and utilities
```

## Contributing

1. **Branch per task.** Create a feature branch off `main`:

   ```bash
   git checkout -b feat/my-change
   ```

2. **Follow the repo conventions.** Read `AGENTS.md` first — it documents the frontend refactor practices, shared infrastructure to reuse, and anti-patterns to avoid.

3. **Write or update code.** Reuse the shared components, hooks, and libraries before adding new ones.

4. **Verify before committing:**

   ```bash
   pnpm typecheck
   pnpm lint
   pnpm build
   ```

   All three must pass before you push. See `AGENTS.md` for the known pre-existing lint issues so you don't chase them.

5. **Commit with a clear message** matching the repo style (e.g. `feat: add course search`, `refactor: consolidate shared components`).

6. **Open a pull request.** Keep PRs small and focused; describe what changed and why.
