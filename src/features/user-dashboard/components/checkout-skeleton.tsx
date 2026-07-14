export function CheckoutSkeleton() {
  return (
    <div className="mt-8 grid gap-8 md:grid-cols-2 lg:gap-12">
      <div className="flex h-80 animate-pulse items-center justify-center rounded-2xl bg-gray-100">
        <div className="h-8 w-48 rounded bg-gray-200" />
      </div>
      <div className="flex h-80 animate-pulse items-center justify-center rounded-2xl bg-gray-100">
        <div className="h-8 w-48 rounded bg-gray-200" />
      </div>
    </div>
  )
}
