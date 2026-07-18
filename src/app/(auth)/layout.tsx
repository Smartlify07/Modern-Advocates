import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="bg-white">
        <div className="mx-auto px-4 py-5 lg:max-w-7xl lg:px-25 2xl:max-w-360 2xl:px-50">
          <Link href="/" className="flex w-[157px] flex-col gap-1">
            <Image
              src="/figma-home/logo.svg"
              alt="ModernAdvocates Inc."
              width={58}
              height={44}
              priority
            />
          </Link>
        </div>
      </header>
      {children}
    </div>
  )
}
