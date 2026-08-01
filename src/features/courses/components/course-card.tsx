import Image from "next/image"
import Link from "next/link"
import { Star, ArrowRight } from "lucide-react"
import { cn } from "@/shared/utils"

type RootProps = {
  href: string
  children: React.ReactNode
}

function Root({ href, children }: RootProps) {
  return (
    <Link
      href={href}
      className="group flex w-full flex-col gap-5 rounded-card-2 border border-ma-border-light bg-white px-2.5 pt-2.5 pb-7.5 transition-colors duration-300 hover:bg-gray-50 sm:max-w-[334px]"
    >
      {children}
    </Link>
  )
}

function Thumbnail({ src, alt }: { src: string | null; alt: string }) {
  return (
    <div className="relative h-[254px] overflow-hidden rounded-card-2">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 314px, calc(100vw - 68px)"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-gray-100" />
      )}
    </div>
  )
}

function Content({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-1 flex-col px-2.5", className)}>
      {children}
    </div>
  )
}

function Title({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h2
      className={cn(
        "text-2xl leading-normal font-bold text-ma-text",
        className
      )}
    >
      {children}
    </h2>
  )
}

function Tutor({ name }: { name: string | null }) {
  return (
    <p className="text-sm leading-normal font-medium text-muted-foreground">{name}</p>
  )
}

function Rating({ avg, count }: { avg: number; count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="inline-flex items-center gap-1 rounded-md border border-border p-[5px] text-sm leading-normal font-medium text-muted-foreground">
        <Star
          className="size-5 fill-ma-star text-ma-star"
          aria-hidden="true"
        />
        {Number(avg).toFixed(1)}
      </span>
      <span className="inline-flex items-center rounded-md border border-border px-[5px] py-1.5 text-sm leading-normal font-medium text-muted-foreground">
        {count} ratings
      </span>
    </div>
  )
}

function Price({
  price,
  discountedPrice,
}: {
  price: number
  discountedPrice: number | null
}) {
  const displayPrice = discountedPrice ?? price
  const originalPrice = discountedPrice ? price : null

  return (
    <div className="flex flex-wrap items-baseline gap-2.5 leading-normal font-medium">
      <p className="text-xl text-ma-text">$ {displayPrice.toFixed(2)} USD</p>
      {originalPrice && (
        <p className="text-base text-muted-foreground line-through">
          $ {originalPrice.toFixed(2)} USD
        </p>
      )}
    </div>
  )
}

function DiscountedPrice({
  discountedPrice,
  className,
}: {
  discountedPrice: number
  className?: string
}) {
  return (
    <p className={cn("text-xl text-ma-text", className)}>
      $ {discountedPrice.toFixed(2)} USD
    </p>
  )
}

function DisplayPrice({
  displayPrice,
  className,
}: {
  displayPrice: number | null
  className?: string
}) {
  return (
    <p className={cn("text-base text-muted-foreground line-through", className)}>
      $ {displayPrice?.toFixed(2)} USD
    </p>
  )
}

function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

function ContinueButton() {
  return (
    <span className="relative inline-flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-pill bg-ma-text px-5 py-4 text-base font-semibold text-white">
      <span className="relative z-10 inline-flex items-center gap-2.5">
        Continue Learning
        <ArrowRight className="size-5 transition-transform duration-300 group-hover:rotate-[-30deg]" />
      </span>
      <span className="pointer-events-none absolute inset-0 rounded-pill bg-gradient-to-r from-ma-glow-blue to-ma-glow-violet opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </span>
  )
}

export type Course = {
  id: string
  title: string
  thumbnailUrl: string | null
  instructorName: string | null
  avgRating: number
  reviewCount: number
  price: number
  discountedPrice: number | null
  progress?: number
}

export const CourseCard = {
  Root,
  Thumbnail,
  Content,
  Title,
  Tutor,
  Rating,
  Price,
  Progress,
  ContinueButton,
  DisplayPrice,
  DiscountedPrice,
}
