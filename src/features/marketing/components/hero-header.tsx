import { Button } from "@/shared/ui/button"

export function HeroHeader() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <span className="text-lg font-bold tracking-tight text-ma-text">
          ModernAdvocates
        </span>
        <div className="flex items-center gap-6">
          <a
            href="/login"
            className="text-sm font-medium text-ma-text/50 transition-colors hover:text-ma-text"
          >
            Login
          </a>
          <Button className="h-9 rounded-full bg-ma-text px-5 text-sm font-medium text-white shadow-none hover:bg-ma-text/90">
            Get Started
          </Button>
        </div>
      </div>
      <hr className="border-t border-ma-text/5" />
    </header>
  )
}
