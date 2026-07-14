"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useCourse } from "@/features/user-dashboard/hooks/use-course"
import { useStripePromise } from "@/features/user-dashboard/hooks/use-stripe-promise"
import { useCheckoutPayment } from "@/features/user-dashboard/hooks/use-checkout-payment"
import { FreeCheckoutView } from "@/features/user-dashboard/components/free-checkout-view"
import { PaidCheckoutView } from "@/features/user-dashboard/components/paid-checkout-view"
import { CheckoutSkeleton } from "@/features/user-dashboard/components/checkout-skeleton"

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId")

  const { data: course } = useCourse(courseId)
  const getStripePromise = useStripePromise()
  const {
    orderId,
    clientSecret,
    paymentState,
    modalOpen,
    errorMessage,
    paymentReady,
    formKey,
    setPaymentReady,
    initPayment,
    handleFreeCourse,
    handlePay,
    handleRetry,
    handleModalChange,
  } = useCheckoutPayment()

  useEffect(() => {
    if (course?.isFree) {
      handleFreeCourse(courseId!)
    } else if (course && !course.isFree) {
      initPayment(courseId!)
    }
  }, [course, courseId, initPayment, handleFreeCourse])

  if (!courseId) {
    return (
      <div className="mt-8 text-center">
        <p className="text-lg text-[#6b7280]">No course selected.</p>
      </div>
    )
  }

  if (!course) return <CheckoutSkeleton />

  if (course.isFree) {
    return (
      <FreeCheckoutView
        course={course}
        paymentState={paymentState}
        modalOpen={modalOpen}
        errorMessage={errorMessage}
        onRetry={() => handleRetry(courseId)}
        onModalChange={handleModalChange}
      />
    )
  }

  return (
    <PaidCheckoutView
      course={course}
      courseId={courseId}
      clientSecret={clientSecret}
      orderId={orderId}
      paymentState={paymentState}
      modalOpen={modalOpen}
      errorMessage={errorMessage}
      paymentReady={paymentReady}
      formKey={formKey}
      getStripePromise={getStripePromise}
      onPay={handlePay}
      onRetry={() => handleRetry(courseId)}
      onModalChange={handleModalChange}
      onReadyChange={setPaymentReady}
    />
  )
}
