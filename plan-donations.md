# Donation Payments Integration Plan (Revised)

**Branch:** `feature/donation-payments`
**Worktree:** `C:\Client Projects\modern-advocates-donations`

---

## What Already Exists on `main` (from merge)

| Asset | Status |
|---|---|
| `donations` table (id, donorName, donorEmail, amount, donationType, createdAt) | ✅ Already in DB + migration 0006 |
| `donationType` enum (`fixed`, `tier`, `monthly`) | ✅ Already defined |
| `donations` export in `schema.ts` | ✅ Already done |
| Admin `GET /api/admin/donations` | ✅ Already exists |
| Admin donations page (table, search, filter, pagination, export) | ✅ Already exists |
| Public donation page (`/donation`) | ✅ Already exists |
| `DonationSupportSection` component (uncontrolled form — no payment wiring) | ✅ Exists, **needs rewrite** |
| `react-hook-form`, `zod`, `@hookform/resolvers` | ✅ Already in `package.json` |
| Stripe server + client libs | ✅ Already in `package.json` |

---

## What We Need to Build

### Step 1 — Extend `donations` table schema

**File:** `src/infrastructure/database/schema/donation.ts`

Add columns for payment tracking (reuse existing `paymentStatus` enum from `course.ts`):

```ts
// New imports needed:
import { paymentStatus } from "./course"

// Add to donations table:
currency: text("currency").notNull().default("USD"),
stripeCheckoutSessionId: text("stripe_checkout_session_id"),
paymentStatus: paymentStatus("payment_status").notNull().default("pending"),
updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
```

Replace `text("id").primaryKey()` with `uuid("id").defaultRandom().primaryKey()` for consistency.

**Migration:** Run `pnpm db:generate` → new migration file (e.g. `0008_...`).

**Admin API (`src/app/api/admin/donations/route.ts`):** Add `paymentStatus` to the select query — no other changes needed since the existing admin page already fetches all columns.

**Admin types (`src/features/admin/donations/types.ts`):** Add `paymentStatus` field.

---

### Step 2 — API: `POST /api/donations` (Stripe Checkout creation)

**File:** `src/app/api/donations/route.ts`

- Accepts: `{ amount, donorName, donorEmail, donationType }` (validated via Zod on frontend)
- Creates a Stripe Checkout Session with `mode: "payment"`:
  - `line_items[0]`: `price_data` with `unit_amount = amount * 100` (cents), `currency = "usd"`, `product_data.name = "Donation to Modern Advocates"`
  - `customer_email`: donor email
  - `success_url`: absolute URL to `/donation/success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url`: absolute URL to `/donation`
  - `metadata`: `{ donationId }` (stored after DB insert)
- Inserts donation row with `stripeCheckoutSessionId`, `paymentStatus: "pending"`
- Returns `{ url }` (the Checkout Session URL to redirect to)
- No auth required

---

### Step 3 — API: `GET /api/donations/success`

**File:** `src/app/api/donations/success/route.ts`

- Query param: `session_id`
- Retrieves Stripe Checkout Session
- Verifies `payment_status === "paid"`
- Looks up donation by `stripeCheckoutSessionId`
- Updates `paymentStatus` to `"paid"`
- Returns `{ donation }`

---

### Step 4 — Webhook: extend `checkout.session.completed`

**File:** `src/app/api/webhooks/stripe/route.ts`

Add handler:
- `checkout.session.completed` → lookup donation by `stripeCheckoutSessionId`, mark `paymentStatus = "paid"` (async fallback to the success API above)
- `checkout.session.expired` → mark `paymentStatus = "failed"`

---

### Step 5 — Frontend: Rewrite `DonationSupportSection` with RHF + Zod

**File:** `src/features/marketing/components/donation-support-section.tsx`

**Zod schema:**
```ts
const donationFormSchema = z.object({
  donationType: z.enum(["Fixed Donation", "Tier Donation", "Monthly Pay"]),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  donorName: z.string().min(1, "Full name is required"),
  donorEmail: z.string().email("Please enter a valid email address"),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: "You must confirm the donation to proceed" }),
  }),
})
```

**Form structure:**
- `useForm<z.infer<typeof donationFormSchema>>` with `zodResolver`
- `Controller` for each field, using shadcn `<Field>`, `<FieldLabel>`, `<FieldError>` (follow pattern from `login-form.tsx` which already uses RHF + Field components)
- **Donation type:** `Controller` wrapping radio group (existing UI preserved, with `field.onChange` / `field.value`)
- **Amount:** Conditional — `Controller` for preset radio buttons (Tier/Monthly) or `<Input type="number">` (Fixed)
- **Personal info:** `Controller` for name (`<Input>`) and email (`<Input type="email">`)
- **Confirmation:** `Controller` for checkbox
- **Submit button:** `form.handleSubmit(onSubmit)` — calls `POST /api/donations`, then `window.location.href = data.url` (Stripe Checkout redirect)
- **States:** submitting (disable button, show spinner), error (show toast/alert)

**Key changes from current:**
- Swap `useState` for RHF `useForm`
- Wrap all inputs in `Controller` + `Field`
- Add Zod validation
- Wire submit to API + Stripe Checkout redirect

---

### Step 6 — Thank-you page

**File:** `src/app/(marketing)/donation/success/page.tsx`

- Client component that reads `session_id` from URL search params
- Calls `GET /api/donations/success?session_id=...` on mount
- Shows thank-you message with donor name and amount after verification
- Loading state while verifying; error state if verification fails

---

## Files to Modify / Create

| File | Action |
|---|---|
| `src/infrastructure/database/schema/donation.ts` | **Edit** — add currency, stripeCheckoutSessionId, paymentStatus, updatedAt |
| `src/infrastructure/database/schema/course.ts` | No change (already exports `paymentStatus`) |
| — | Run `pnpm db:generate` + `pnpm db:migrate` |
| `src/features/admin/donations/types.ts` | **Edit** — add `paymentStatus` field |
| `src/app/api/donations/route.ts` | **New** — create Stripe Checkout Session |
| `src/app/api/donations/success/route.ts` | **New** — confirm donation after redirect |
| `src/app/api/webhooks/stripe/route.ts` | **Edit** — add donation webhook handlers |
| `src/features/marketing/components/donation-support-section.tsx` | **Rewrite** — RHF + Zod + Stripe Checkout |
| `src/app/(marketing)/donation/success/page.tsx` | **New** — thank-you page |

---

## Architecture Diagram

```
User fills form (RHF + Zod)
        │
        ▼
POST /api/donations ─────→ Stripe Checkout Session (mode: payment)
        │                         │
        │                   success_url ───► /donation/success?session_id=xxx
        │                         │                │
        │                         │        GET /api/donations/success
        │                         │                │
        │                         │          Mark donation "paid"
        │                         │                │
        │                         ▼          Show thank-you
        │                  Stripe Webhook (async backup)
        │                   checkout.session.completed
        │                         │
        ▼                         ▼
   DB: donations row       Mark donation "paid"
   (paymentStatus: pending)
```

## Dependencies

All already installed — no `pnpm add` needed.

---
