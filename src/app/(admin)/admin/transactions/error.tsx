"use client"

import { AdminErrorFallback } from "@/features/admin/components/admin-error-fallback"

export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminErrorFallback error={error} reset={reset} message="Something went wrong on this page" />
}
