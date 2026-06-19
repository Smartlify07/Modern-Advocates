import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function AdminCoursesPage() {
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
      <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
        <p className="text-muted-foreground">No courses yet</p>
      </div>
    </div>
  )
}
