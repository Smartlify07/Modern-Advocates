# Course Purchase and Enrollment Architecture

## Core Principle

Payment and enrollment are separate concerns and must be modeled independently.

- An **Order** represents a financial transaction or purchase event.
- An **Enrollment** represents access to a course.

A user can successfully pay for a course without being enrolled immediately due to system failures, processing delays, retries, or asynchronous workflows.

---

## Database Design

### Orders

Source of truth for purchases.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | defaultRandom |
| student_id | text FK → user.id | restrict delete |
| course_id | uuid FK → courses.id | restrict delete |
| amount | numeric(10,2) | |
| currency | text | default "USD" |
| payment_provider | text? | |
| payment_reference | text? | |
| payment_status | payment_status enum | pending / paid / failed / refunded |
| source | order_source enum | purchase / admin / scholarship / coupon / gift |
| created_at | timestamp | default now() |
| updated_at | timestamp | default now(), $onUpdate |

### Enrollments

Source of truth for course access.

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | defaultRandom |
| order_id | uuid? FK → orders.id | set null on delete |
| student_id | text FK → user.id | restrict delete |
| course_id | uuid FK → courses.id | cascade delete |
| status | enrollment_status enum | pending / active / revoked / failed |
| enrolled_at | timestamp | default now() |
| completed_at | timestamp? | |
| expires_at | timestamp? | |

**Constraint:** `UNIQUE(student_id, course_id)` — prevents duplicate enrollments.

---

## Purchase Flow

1. User initiates checkout.
2. Payment provider processes payment.
3. System creates Order record with `payment_status = paid`.
4. System attempts to create Enrollment record.
5. On success: Enrollment created, user gains access.
6. On failure: Order preserved, enrollment can be retried.

---

## Implementation Phases

### Piece 1 ✅ — Schema + Migration

**Status: Complete (PR #50)**

- Add `orders` table with `payment_status` and `order_source` enums
- Update `enrollment_status` enum: `pending | active | revoked | failed`
- Add `order_id` (FK → orders) and `expires_at` to `enrollments`
- Change `enrollments.status` default from `active` to `pending`
- Migration maps old `completed` → `active`, `cancelled` → `revoked`
- Applied to database

### Piece 2 — Orders API

- `POST /api/orders` — creates order with `payment_status: "paid"`, then attempts enrollment (status `"pending"` → `"active"` on success, `"failed"` on error)
- `POST /api/orders/[id]/retry-enrollment` — retries enrollment for a paid-but-not-enrolled order
- `GET /api/orders/[id]/status` — returns order + enrollment state (for frontend polling)
- Remove old `POST /api/enrollments` (replaced by orders flow)

### Piece 3 — Frontend Checkout

State machine: `idle → processing → payment_success (polling) → enrollment_complete`

- **Payment succeeds**: Show "Payment successful! We're preparing your course access." with polling against `GET /api/orders/[id]/status`
- **Enrollment succeeds**: Show "Enrollment complete! Go to course." → redirect to `/my-learning`
- **Payment fails**: Show failure modal with retry (re-pay)
- **Enrollment fails**: Show failure modal with retry (enrollment-only, no re-payment)

Also update `handlePay` to call `POST /api/orders` instead of `POST /api/enrollments`.

### Piece 4 — My Learning Polish

- Handle `pending` enrollment state (show "preparing" state for course cards where enrollment isn't active yet)

---

## Failure Handling

### Enrollment Creation Failure

- Order record is preserved (never lost)
- Enrollment status set to `failed`
- Retried via `POST /api/orders/[id]/retry-enrollment`
- Future: background job system (BullMQ / Trigger.dev / Inngest) with exponential backoff + dead-letter queue

### Reconciliation

Future: scheduled job that finds Orders with `payment_status = paid` but no corresponding Enrollment, and repairs them.

---

## Admin (Future)

- View all Orders
- View all Enrollments
- Filter: paid orders without enrollment, failed enrollment jobs, refunded orders
- Manual enrollment / refund actions
