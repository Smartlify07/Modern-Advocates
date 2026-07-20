# Donation Payments Integration Plan

**Branch:** `feature/donation-payments`
**Worktree:** `C:\Client Projects\modern-advocates-donations`

---

## 1. Database — New `donations` table

**File:** `src/infrastructure/database/schema/donation.ts`

New standalone table (no FK to courses or users, since we collect name/email directly):

```ts
export const donationType = pgEnum("donation_type", ["fixed", "tier", "monthly"])

export const donations = pgTable("donations", {
  id: uuid("id").defaultRandom().primaryKey(),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2, mode: "number" }).notNull(),
  currency: text("currency").notNull().default("USD"),
  donationType: donationType("donation_type").notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  stripeCheckoutSessionId: text("stripe_checkout_session_id"),
  paymentStatus: paymentStatus("payment_status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
})
```

- Reuse existing `paymentStatus` enum from `course.ts`
- Export from `schema.ts`
- Generate migration via `pnpm db:generate`
- Run via `pnpm db:migrate`

---

## 2. API Route — `POST /api/donations`

**File:** `src/app/api/donations/route.ts`

- Accepts: `{ amount, donorName, donorEmail, donationType }`
- Creates a Stripe Checkout Session (mode: `payment`) with:
  - `line_items`: single item with `amount` (in cents), name = "Donation to Modern Advocates", quantity = 1
  - `customer_email`: donor email
  - `success_url`: `/donation/success?session_id={CHECKOUT_SESSION_ID}`
  - `cancel_url`: `/donation?cancelled=true`
  - `metadata`: `{ donationType, donorName, donorEmail }`
- Stores donation row with `stripeCheckoutSessionId`, `paymentStatus: "pending"`
- Returns `{ donationId, url }` (the Checkout Session URL to redirect to)

No auth required — donations are open to anyone.

---

## 3. API Route — `GET /api/donations/success`

**File:** `src/app/api/donations/success/route.ts`

- Query param: `session_id`
- Retrieves Stripe Checkout Session
- Verifies `payment_status === "paid"`
- Looks up donation by `stripeCheckoutSessionId`
- Updates `paymentStatus` to `"paid"`
- Returns `{ donation }`

---

## 4. Stripe Webhook — extend `api/webhooks/stripe/route.ts`

Add `checkout.session.completed` handler:

```ts
case "checkout.session.completed": {
  const session = event.data.object as Stripe.Checkout.Session
  // Look up donation by stripeCheckoutSessionId
  // Mark donation as paid
}
```

Also handle `checkout.session.expired` to mark as failed.

---

## 5. Frontend — Rewire `DonationSupportSection` with RHF + Zod

**File:** `src/features/marketing/components/donation-support-section.tsx`

**Schema (Zod):**
```ts
const donationFormSchema = z.object({
  donationType: z.enum(["Fixed Donation", "Tier Donation", "Monthly Pay"]),
  amount: z.coerce.number().positive("Amount must be positive"),
  donorName: z.string().min(1, "Name is required"),
  donorEmail: z.string().email("Invalid email"),
  confirmation: z.literal(true, {
    errorMap: () => ({ message: "You must confirm the donation" }),
  }),
})
```

**Form behavior:**
- RHF `useForm` with `zodResolver`
- `Controller` for each field using shadcn `<Field>`, `<FieldLabel>`, `<FieldError>`
- Radio group for `donationType` (existing UI preserved)
- Conditional amount: preset radio buttons for Tier/Monthly, custom input for Fixed
- Text inputs for name, email
- Checkbox for confirmation
- Submit → `POST /api/donations` → redirect browser to `session.url` (Stripe Checkout)
- Loading state on submit button

**Key changes from current:**
- Replace uncontrolled inputs with `Controller`
- Wire submit to API call + window.location redirect
- Use `"use client"` (already present)

---

## 6. Success/Cancel Pages

**File:** `src/app/(marketing)/donation/success/page.tsx`
- Fetches `GET /api/donations/success?session_id=...`
- Shows thank-you message with donor name and amount

**File:** `src/app/(marketing)/donation/cancelled/page.tsx` (optional)
- Shows "Donation was not completed" message with link back

---

## 7. Files Changed (Summary)

| File | Action |
|---|---|
| `src/infrastructure/database/schema/donation.ts` | **New** — table + enum |
| `src/infrastructure/database/schema/schema.ts` | Edit — add `donations` export |
| `src/app/api/donations/route.ts` | **New** — create Checkout Session |
| `src/app/api/donations/success/route.ts` | **New** — confirm donation |
| `src/app/api/webhooks/stripe/route.ts` | Edit — add checkout.session.completed |
| `src/features/marketing/components/donation-support-section.tsx` | Rewrite — RHF + Zod + Stripe Checkout |
| `src/app/(marketing)/donation/success/page.tsx` | **New** — thank-you page |
| `src/shared/api/donations.ts` | **New** — client-side API helpers (optional) |

---

## 8. Dependencies

All already installed:
- `react-hook-form`
- `@hookform/resolvers`
- `zod`
- `stripe` (server)
- `@stripe/stripe-js` (client, for success page verification)

---
