import { apiFetch } from "@/shared/lib/api-fetch"

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
  return apiFetch<CreateOrderResponse>("/api/orders", {
    method: "POST",
    body: { courseId },
  })
}

export async function createPaymentIntent(courseId: string): Promise<CreatePaymentIntentResponse> {
  return apiFetch<CreatePaymentIntentResponse>("/api/orders", {
    method: "POST",
    body: { courseId },
  })
}

export async function confirmPaymentOnServer(orderId: string): Promise<ConfirmPaymentResponse> {
  return apiFetch<ConfirmPaymentResponse>(`/api/orders/${orderId}/confirm-payment`, {
    method: "POST",
  })
}

export async function getOrderStatus(orderId: string): Promise<OrderStatusResponse> {
  return apiFetch<OrderStatusResponse>(`/api/orders/${orderId}/status`)
}

export async function retryEnrollment(orderId: string): Promise<RetryEnrollmentResponse> {
  return apiFetch<RetryEnrollmentResponse>(`/api/orders/${orderId}/retry-enrollment`, {
    method: "POST",
  })
}
