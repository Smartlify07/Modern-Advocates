"use client"

import { useState, useMemo, useCallback, useRef } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/shared/ui/button"
import { PlusIcon, UploadCloudIcon, XIcon } from "lucide-react"
import { usePendingUploads } from "@/features/courses/hooks/use-pending-uploads"
import CoursesToolbar from "./_components/courses-toolbar"
import CoursesList from "./_components/courses-list"
import type { Course, Filter } from "./_components/types"

function ResumeUploadBanner() {
  const { pending, resumeUpload, dismiss } = usePendingUploads()
  const fileRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  const setFileRef = useCallback(
    (uploadId: string, el: HTMLInputElement | null) => {
      if (el) {
        fileRefs.current.set(uploadId, el)
      } else {
        fileRefs.current.delete(uploadId)
      }
    },
    [],
  )

  if (pending.length === 0) return null

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
          <UploadCloudIcon className="size-4" />
          Interrupted video uploads
        </div>
      </div>
      <p className="mb-3 text-xs text-amber-600">
        Some video uploads were interrupted. Select the original files to resume.
      </p>
      <div className="space-y-2">
        {pending.map((p) => (
          <div
            key={p.uploadId}
            className="flex items-center justify-between rounded bg-white px-3 py-2 text-sm"
          >
            <span className="max-w-48 truncate text-slate-700">
              {p.fileName}
            </span>
            <span className="text-xs text-slate-400">
              {Math.round((p.bytesUploaded / p.totalBytes) * 100)}% uploaded
            </span>
            <div className="flex items-center gap-2">
              <input
                ref={(el) => setFileRef(p.uploadId, el)}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) resumeUpload(p.uploadId, file)
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  fileRefs.current.get(p.uploadId)?.click()
                }
                className="h-7 text-xs"
              >
                Select file
              </Button>
              <button
                type="button"
                onClick={() => dismiss(p.uploadId)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XIcon className="size-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

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
    [courses, search, filter],
  )

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <ResumeUploadBanner />

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
