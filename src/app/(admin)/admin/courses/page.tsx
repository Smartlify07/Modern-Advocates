"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/shared/ui/button"
import { PlusIcon } from "lucide-react"
import CoursesToolbar from "./_components/courses-toolbar"
import CoursesList from "./_components/courses-list"
import type { Course, Filter } from "./_components/types"

export default function AdminCoursesPage() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<Filter>("All Courses")

  const {
    data: courses = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Course[]>({
    queryKey: ["admin-courses"],
    queryFn: () => fetch("/api/courses").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  const filtered = useMemo(
    () =>
      courses.filter((c) => {
        const q = c.title.toLowerCase().includes(search.toLowerCase())
        const f = filter === "All Courses" || c.status === filter.toLowerCase()
        return q && f
      }),
    [courses, search, filter]
  )

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold lg:text-[40px]/[100%]">
          Courses
        </h1>
        <Button
          asChild
          className="h-[44px] rounded-[8px] bg-ma-admin-primary px-4 py-2.5 text-white hover:bg-ma-admin-primary"
        >
          <Link href="/admin/courses/new">Create New Courses</Link>
        </Button>
      </div>
      <CoursesToolbar
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
      />
      <CoursesList
        courses={filtered}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
      />
    </div>
  )
}
