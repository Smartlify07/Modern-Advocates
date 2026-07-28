import { Suspense } from "react"
import { LoginForm } from "@/features/auth/components/login-form"
import { Skeleton } from "@/shared/ui/skeleton"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-white p-6 md:py-15.5">
      <div className="w-full max-w-110.5">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
