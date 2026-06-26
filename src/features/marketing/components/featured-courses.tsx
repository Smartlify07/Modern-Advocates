"use client"

import { useQuery } from "@tanstack/react-query"
import { ArrowRight, Clock, Star } from "lucide-react"

import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardTitle } from "@/shared/ui/card"
import Link from "next/link"

type Course = {
  id: string
  title: string
  overview: string | null
  thumbnailUrl: string | null
  level: "beginner" | "intermediate" | "advanced"
  price: number
  discountedPrice: number | null
  duration: number | null
  tutorName: string | null
  avgRating: number
  reviewCount: number
}

const gradients = [
  "from-violet-500/90 to-fuchsia-600/90",
  "from-blue-500/90 to-cyan-600/90",
  "from-amber-500/90 to-orange-600/90",
  "from-emerald-500/90 to-teal-600/90",
  "from-rose-500/90 to-pink-600/90",
  "from-indigo-500/90 to-purple-600/90",
]

function formatDuration(minutes: number | null) {
  if (!minutes) return ""
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h && m) return `${h}h ${m}m`
  if (h) return `${h}h`
  return `${m}m`
}

function formatLevel(level: string) {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function FeaturedCourses() {
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ["featured-courses"],
    queryFn: () => fetch("/api/courses/featured").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  return (
    <section id="courses" className="bg-muted py-20 sm:py-28 lg:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-4xl leading-[1.15] font-extrabold tracking-tight text-ma-text sm:text-5xl">
            Explore Our Most Popular Programs
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ma-text/60">
            Whether you&apos;re just starting out or looking to advance your
            expertise, our courses provide step-by-step guidance and proven
            frameworks for success.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-2xl bg-ma-bg"
                />
              ))
            : courses?.map((course, i) => (
                <Card key={course.id} className="flex flex-col py-0 ring-0">
                  <div
                    className={`flex h-44 items-end rounded-t-xl bg-gradient-to-br p-5 ${gradients[i % gradients.length]}`}
                  >
                    <span className="text-3xl leading-none font-bold text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <CardContent className="flex flex-1 flex-col justify-between pt-4">
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {course.overview}
                      </p>

                      <div className="mt-4 flex justify-between">
                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5" />
                            {formatDuration(course.duration)}
                          </span>
                          <span>{formatLevel(course.level)}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            {Number(course.avgRating).toFixed(1)}
                            <span className="text-muted-foreground/50">
                              ({course.reviewCount} reviews)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3 pb-4">
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-sm font-semibold text-ma-text underline-offset-2 hover:underline"
                      >
                        View Details
                      </Link>
                      <Button className="ml-auto h-8 rounded-full bg-ma-text px-4 text-xs font-semibold text-white shadow-none hover:bg-ma-text/90">
                        Enroll
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button
            variant="outline"
            className="h-11 rounded-full border-ma-text/15 bg-white px-6 text-sm font-semibold text-ma-text shadow-none hover:bg-ma-bg"
          >
            View All Courses
            <ArrowRight
              className="size-4"
              data-icon="inline-end"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </section>
  )
}
