"use client"

import { AdminErrorFallback } from "@/features/admin/components/admin-error-fallback"

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <AdminErrorFallback error={error} reset={reset} title="Admin Dashboard Error" />
}
