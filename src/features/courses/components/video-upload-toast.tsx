"use client"

import { useVideoUploadStore } from "@/features/courses/store/use-video-upload-store"
import { Loader2, CheckCircle, AlertCircle, XIcon } from "lucide-react"

export function VideoUploadToast() {
  const tasks = useVideoUploadStore((s) => s.tasks)
  const clearCompleted = useVideoUploadStore((s) => s.clearCompleted)
  const removeTask = useVideoUploadStore((s) => s.removeTask)

  if (tasks.length === 0) return null

  const activeCount = tasks.filter((t) => t.status === "uploading").length
  const completedCount = tasks.filter(
    (t) => t.status === "completed" || t.status === "processing",
  ).length
  const failedCount = tasks.filter((t) => t.status === "failed").length

  return (
    <div className="w-80 rounded-lg border bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-900">
          {activeCount > 0
            ? `Uploading ${activeCount} video${activeCount > 1 ? "s" : ""}...`
            : failedCount > 0
              ? `${completedCount} uploaded, ${failedCount} failed`
              : "All videos uploaded"}
        </h4>
        <button
          type="button"
          onClick={clearCompleted}
          className="text-slate-400 hover:text-slate-600"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const pct =
            task.totalBytes > 0
              ? Math.round((task.bytesUploaded / task.totalBytes) * 100)
              : 0

          return (
            <div key={task.uploadId} className="space-y-0.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="max-w-44 truncate">{task.fileName}</span>
                <span className="shrink-0">
                  {task.status === "uploading" && `${pct}%`}
                  {task.status === "processing" && "Processing..."}
                  {task.status === "completed" && "Done"}
                  {task.status === "failed" && "Failed"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      task.status === "failed"
                        ? "bg-red-500"
                        : task.status === "completed" || task.status === "processing"
                          ? "bg-green-500"
                          : "bg-blue-500"
                    }`}
                    style={{
                      width:
                        task.status === "completed" || task.status === "processing"
                          ? "100%"
                          : `${pct}%`,
                    }}
                  />
                </div>
                {task.status === "uploading" && (
                  <Loader2 className="size-3.5 shrink-0 animate-spin text-blue-500" />
                )}
                {(task.status === "completed" || task.status === "processing") && (
                  <CheckCircle className="size-3.5 shrink-0 text-green-500" />
                )}
                {task.status === "failed" && (
                  <AlertCircle className="size-3.5 shrink-0 text-red-500" />
                )}
              </div>

              {task.status === "failed" && task.error && (
                <p className="text-xs text-red-500">{task.error}</p>
              )}

              {task.status === "failed" && (
                <button
                  type="button"
                  onClick={() => removeTask(task.uploadId)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Dismiss
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
