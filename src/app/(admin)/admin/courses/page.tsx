"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/shared/ui/button"
import { PlusIcon, EditIcon, FileTextIcon } from "lucide-react"

interface Course {
  id: string
  title: string
  level: string
  status: string
  price: number
  createdAt: string
}

export default function AdminCoursesPage() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["admin-courses"],
    queryFn: () => fetch("/api/courses").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  return (
    <div className="flex flex-1 flex-col gap-4 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-medium">Courses</h1>
        <Button asChild>
          <Link href="/admin/courses/new">
            <PlusIcon className="size-4" />
            Create Course
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
          <p className="text-muted-foreground">No courses yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="flex items-center gap-4 rounded-lg border bg-card p-4"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                <FileTextIcon className="size-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{course.title}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {course.level} &middot; {course.status}
                </p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/courses/${course.id}/edit`}>
                  <EditIcon className="size-4" />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
