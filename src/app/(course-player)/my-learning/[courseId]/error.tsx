"use client"

export default function CoursePlayerError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold text-ma-text">
        Something went wrong
      </h2>
      <p className="text-[#6b7280]">
        {error.message || "An unexpected error occurred while loading this course."}
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-ma-admin-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-ma-admin-primary/90"
      >
        Try again
      </button>
    </div>
  )
}