"use client"

import { useSearchParams } from "next/navigation"

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId")

  return (
    <div className="mt-8">
      <p className="text-lg text-[#6b7280]">
        Course ID: {courseId ?? "Not specified"}
      </p>
      <p className="mt-4 text-lg text-ma-text">
        Checkout functionality coming soon.
      </p>
    </div>
  )
}
