import { useState } from "react"
import { LoaderCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/shared/ui/button"
import { authClient } from "@/infrastructure/auth/client"

function GoogleMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 18 18"
      className="size-4"
      focusable="false"
    >
      <path
        fill="#4285f4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34a853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#fbbc05"
        d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.94H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.06l3.01-2.34Z"
      />
      <path
        fill="#ea4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58A8.65 8.65 0 0 0 9 0 9 9 0 0 0 .96 4.94l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  )
}

export function AuthGoogleButton({ label }: { label: string }) {
  const [pending, setPending] = useState(false)

  const handleSignIn = async () => {
    setPending(true)
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/auth/callback" })
    } catch {
      toast.error("Failed to sign in with Google. Please try again.")
    } finally {
      setPending(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      className="h-[53px] w-full gap-2.5 rounded-[60px] border-[#d9d9d9] bg-white px-5 py-4 text-base font-medium text-ma-text hover:bg-[#f5f5f5] disabled:opacity-60"
      onClick={handleSignIn}
    >
      {pending ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <GoogleMark />}
      {label}
    </Button>
  )
}
