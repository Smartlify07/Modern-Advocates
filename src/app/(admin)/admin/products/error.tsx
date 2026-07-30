"use client"

import { AdminErrorFallback } from "@/features/admin/components/admin-error-fallback"

export default function ProductsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminErrorFallback error={error} reset={reset} title="Products Error" />
}
