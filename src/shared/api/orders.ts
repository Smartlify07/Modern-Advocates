export type Order = {
  id: string
  studentId: string
  courseId: string
  amount: number
  currency: string
  paymentProvider: string | null
  paymentReference: string | null
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  source: "purchase" | "admin" | "scholarship" | "coupon" | "gift"
  createdAt: string
  updatedAt: string
}

export type Enrollment = {
  id: string
  orderId: string | null
  courseId: string
  studentId: string
  status: "pending" | "active" | "revoked" | "failed"
  enrolledAt: string
  completedAt: string | null
  expiresAt: string | null
}

export type CreateOrderResponse = { order: Order; enrollment: Enrollment | null }
export type CreatePaymentIntentResponse = { orderId: string; clientSecret: string }
export type OrderStatusResponse = { order: Order; enrollment: Enrollment | null }
export type RetryEnrollmentResponse = { enrollment: Enrollment }
export type ConfirmPaymentResponse = { order: Order; enrollment: Enrollment | null }

export async function createOrder(courseId: string): Promise<CreateOrderResponse> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Failed to create order")
  }
  return res.json()
}

export async function createPaymentIntent(courseId: string): Promise<CreatePaymentIntentResponse> {
  const res = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseId }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Failed to create payment")
  }
  return res.json()
}

export async function confirmPaymentOnServer(orderId: string): Promise<ConfirmPaymentResponse> {
  const res = await fetch(`/api/orders/${orderId}/confirm-payment`, {
    method: "POST",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Failed to confirm payment")
  }
  return res.json()
}

export async function getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
  const res = await fetch(`/api/orders/${orderId}/status`)
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Failed to get order status")
  }
  return res.json()
}

export async function retryEnrollment(orderId: string): Promise<RetryEnrollmentResponse> {
  const res = await fetch(`/api/orders/${orderId}/retry-enrollment`, {
    method: "POST",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? "Failed to retry enrollment")
  }
  return res.json()
}
