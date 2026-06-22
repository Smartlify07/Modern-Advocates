"use client"

import { Button } from "@/shared/ui/button"
import { ModuleEditor } from "@/features/courses/components/module-editor"
import {
  PlusIcon,
  BookOpenIcon,
  FolderKanbanIcon,
} from "lucide-react"
import { useCourseFormStore } from "@/features/courses/store/use-course-form-store"

export function CourseContentSection() {
  const modules = useCourseFormStore((s) => s.modules)
  const activeModuleId = useCourseFormStore((s) => s.activeModuleId)
  const addModule = useCourseFormStore((s) => s.addModule)
  const selectModule = useCourseFormStore((s) => s.selectModule)

  if (activeModuleId) {
    const mod = modules.find((m) => m.id === activeModuleId)
    if (!mod) return null
    return <ModuleEditor />
  }

  if (modules.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 py-20">
        <div className="flex size-16 items-center justify-center rounded-full bg-muted">
          <BookOpenIcon className="size-8 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium">Start building your course</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-sm">
            Modules help organize your course content. Create your first module to
            start adding topics, videos, and text lessons.
          </p>
        </div>
        <Button onClick={addModule}>
          <PlusIcon className="size-4" />
          Add your first module
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">
          Modules ({modules.length})
        </h3>
        <Button variant="outline" size="sm" onClick={addModule}>
          <PlusIcon className="size-3.5" />
          Add module
        </Button>
      </div>
      {modules.map((mod) => (
        <button
          key={mod.id}
          type="button"
          onClick={() => selectModule(mod.id)}
          className="flex items-center gap-3 rounded-lg border bg-card p-4 text-start transition-colors hover:bg-muted/50"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <FolderKanbanIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {mod.title || (
                <span className="text-muted-foreground italic">Untitled module</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {mod.topics.length} topic{mod.topics.length !== 1 ? "s" : ""}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}
