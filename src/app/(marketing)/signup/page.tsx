import { SignupForm } from "@/features/auth/components/signup-form"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-white p-6 md:py-15.5">
      <div className="w-full max-w-110.5">
        <SignupForm />
      </div>
    </div>
  )
}
