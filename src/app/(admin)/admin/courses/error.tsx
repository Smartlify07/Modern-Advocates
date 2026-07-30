"use client"

import { AdminErrorFallback } from "@/features/admin/components/admin-error-fallback"

export default function CoursesError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminErrorFallback error={error} reset={reset} />
}
