import Link from "next/link"

export default function CoursePlayerNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-4xl font-bold text-ma-text lg:text-5xl">
        Course not found
      </h2>
      <p className="text-[#6b7280]">
        This course is no longer available or you may not have access to it.
      </p>
      <Link
        href="/my-learning"
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-white hover:bg-primary/90"
      >
        Go to my learning
      </Link>
    </div>
  )
}
