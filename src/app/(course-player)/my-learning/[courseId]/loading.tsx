export default function CoursePlayerLoading() {
  return (
    <div className="mx-auto py-8">
      <div className="grid gap-0 md:grid-cols-[2.2fr_0.8fr]">
        <div className="flex flex-col gap-6">
          <div className="aspect-video w-full animate-pulse rounded-xl bg-gray-200" />
          <div className="mx-3 flex gap-6 border-b border-border pb-2">
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-5 w-16 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mt-10 flex min-h-125 flex-col gap-7.5 px-4 lg:ml-[calc(max(100px,(100vw-1080px)/2))] lg:w-[600px] lg:px-0">
            <div>
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-4 space-y-3">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
        <aside className="border border-ma-border-light bg-white px-2 py-5">
          <div className="h-8 w-44 animate-pulse rounded bg-gray-200" />
        </aside>
      </div>
    </div>
  )
}
