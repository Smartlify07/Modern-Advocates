"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/shared/ui/input"
import { Button } from "@/shared/ui/button"
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/shared/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  SearchIcon,
  PlusIcon,
  MoreHorizontalIcon,
  PencilIcon,
  ArchiveIcon,
  ImageIcon,
} from "lucide-react"

interface Course {
  id: string
  title: string
  level: string
  status: "draft" | "published" | "archived"
  price: number
  discountedPrice: number | null
  isFree: boolean
  thumbnailUrl: string | null
  tutorName: string | null
  createdAt: string
}

const filterOptions = ["All Courses", "Published", "Draft", "Archived"] as const
type Filter = (typeof filterOptions)[number]

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("All Courses")

  const router = useRouter()

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["admin-courses"],
    queryFn: () => fetch("/api/courses").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase())
      const matchesFilter =
        filter === "All Courses" || c.status === filter.toLowerCase()
      return matchesSearch && matchesFilter
    })
  }, [courses, search, filter])

  return (
    <div className="flex flex-col gap-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Courses</h1>
        <Button asChild className="rounded-(--radius-button-medium) bg-purple-600 text-white hover:bg-purple-700">
          <Link href="/admin/courses/new">
            <PlusIcon className="size-4" />
            Create New Courses
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-72">
          <SearchIcon className="absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="ps-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-1 rounded-lg border bg-card p-0.5">
          {filterOptions.map((option) => (
            <button
              key={option}
              onClick={() => setFilter(option)}
              className={
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors " +
                (filter === option
                  ? "bg-purple-600 text-white"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50 py-32">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-xl bg-muted/50 py-32">
          <h3 className="text-lg font-semibold">No Course Yet</h3>
          <p className="text-sm text-muted-foreground">
            Start creating a course by clicking on the &ldquo;Create New Courses&rdquo; button.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <Card key={course.id} className="group overflow-hidden">
              <CardHeader className="p-0">
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="aspect-video w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-video w-full items-center justify-center bg-muted">
                    <ImageIcon className="size-10 text-muted-foreground/40" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-1 pt-3">
                <h3 className="font-semibold leading-snug">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.tutorName ?? "Unknown Instructor"}
                </p>
              </CardContent>
              <CardFooter className="flex items-center justify-between pt-0">
                <div className="flex items-baseline gap-2">
                  {course.isFree ? (
                    <span className="font-semibold">Free</span>
                  ) : (
                    <>
                      <span className="font-semibold">
                        $ {course.discountedPrice?.toFixed(2) ?? course.price.toFixed(2)} USD
                      </span>
                      {course.discountedPrice != null && (
                        <span className="text-sm text-muted-foreground line-through">
                          $ {course.price.toFixed(2)} USD
                        </span>
                      )}
                    </>
                  )}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuItem onClick={() => router.push(`/admin/courses/${course.id}/edit`)}>
                      <PencilIcon className="size-4" />
                      Edit
                    </DropdownMenuItem>
                    {course.status === "archived" ? (
                      <DropdownMenuItem>
                        <ArchiveIcon className="size-4" />
                        Unarchive
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <ArchiveIcon className="size-4" />
                        Archive
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
