import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroCta() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
      <Button className="h-11 rounded-full bg-ma-text px-6 text-sm font-semibold text-white shadow-sm hover:bg-ma-text/90">
        Browse Courses
        <ArrowRight
          className="size-4"
          data-icon="inline-end"
          aria-hidden="true"
        />
      </Button>
      <Button
        variant="outline"
        className="h-11 rounded-full border-ma-text/15 bg-white px-6 text-sm font-semibold text-ma-text shadow-none hover:bg-ma-bg"
      >
        Get Started
        <ArrowRight
          className="size-4"
          data-icon="inline-end"
          aria-hidden="true"
        />
      </Button>
    </div>
  )
}
