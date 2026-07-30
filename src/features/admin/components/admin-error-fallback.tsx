"use client"

export function AdminErrorFallback({
  reset,
  title = "Something went wrong",
  message = "Something went wrong on this page",
}: {
  error?: Error & { digest?: string }
  reset: () => void
  title?: string
  message?: string
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold tracking-[-3%] text-ma-text">
        {title}
      </h2>
      <p className="text-[#6b7280]">{message}</p>
      <button
        onClick={reset}
        className="rounded-lg bg-ma-admin-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-ma-admin-primary/90"
      >
        Try again
      </button>
    </div>
  )
}
