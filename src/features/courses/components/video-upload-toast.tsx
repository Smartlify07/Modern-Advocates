"use client"

import { useEffect, useRef, useState } from "react"
import { useVideoUploadStore, type UploadTask } from "@/features/courses/store/use-video-upload-store"
import {
  VideoIcon,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  XIcon,
  Loader2,
} from "lucide-react"

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B"
  const units = ["B", "KB", "MB", "GB"]
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  const digits = value >= 10 || index === 0 ? 0 : 1
  return `${value.toFixed(digits)} ${units[index]}`
}

function playChime() {
  try {
    const AudioContextClass =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioContextClass) return

    const ctx = new AudioContextClass()
    const notes = [880, 1318.51]

    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.type = "sine"
      oscillator.frequency.value = freq
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.1)
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.start(ctx.currentTime + index * 0.18)
      oscillator.stop(ctx.currentTime + 1.3)
    })

    window.setTimeout(() => {
      void ctx.close()
    }, 1600)
  } catch {
    // ignore audio errors
  }
}

function useCountUp(target: number, duration = 500): number {
  const [display, setDisplay] = useState(target)
  const currentRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = currentRef.current
    if (from === target) {
      setDisplay(target)
      return
    }

    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(from + (target - from) * eased)
      currentRef.current = value
      setDisplay(value)
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  return display
}

function TaskRow({
  task,
  retrying,
  onRetry,
}: {
  task: UploadTask
  retrying: boolean
  onRetry: () => void
}) {
  const pct =
    task.totalBytes > 0
      ? Math.round((task.bytesUploaded / task.totalBytes) * 100)
      : 0
  const animatedPct = useCountUp(task.status === "completed" ? 100 : pct)

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex min-w-0 items-center gap-2.5">
        <VideoIcon className="size-4 shrink-0 text-slate-400" />
        <div className="min-w-0">
          <p className="max-w-40 truncate text-xs font-medium text-slate-700">
            {task.fileName}
          </p>
          <p className="text-[11px] text-slate-400 tabular-nums">
            {formatBytes(task.totalBytes)}
          </p>
          {task.status === "failed" && task.error && (
            <p
              className="max-w-40 truncate text-[11px] text-red-500"
              title={task.error}
            >
              {task.error}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {task.status === "uploading" && (
          <span className="text-xs font-semibold text-slate-700 tabular-nums">
            {animatedPct}%
          </span>
        )}
        {task.status === "processing" && (
          <>
            <Loader2 className="size-3.5 shrink-0 animate-spin text-slate-400" />
            <span className="text-xs text-slate-500">Processing</span>
          </>
        )}
        {task.status === "completed" && (
          <>
            <CheckCircle className="size-4 shrink-0 text-green-500" />
            <span className="text-xs font-medium text-green-600 tabular-nums">
              100%
            </span>
          </>
        )}
        {task.status === "failed" && (
          <>
            <AlertCircle className="size-4 shrink-0 text-red-500" />
            <span className="text-xs font-medium text-red-600">Failed</span>
            <button
              type="button"
              onClick={onRetry}
              disabled={retrying}
              className="flex items-center gap-1 text-xs font-medium text-blue-500 hover:text-blue-700 disabled:opacity-50"
            >
              {retrying ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <RotateCcw className="size-3" />
              )}
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export function VideoUploadToast({
  onClose,
}: {
  onClose?: () => void
}) {
  const tasks = useVideoUploadStore((s) => s.tasks)
  const clearAll = useVideoUploadStore((s) => s.clearAll)
  const retryUpload = useVideoUploadStore((s) => s.retryUpload)
  const [retrying, setRetrying] = useState<Set<string>>(new Set())
  const hadActiveRef = useRef(false)

  const activeCount = tasks.filter((t) => t.status === "uploading").length
  const processingCount = tasks.filter((t) => t.status === "processing").length
  const doneCount = tasks.filter((t) => t.status === "completed").length
  const failedCount = tasks.filter((t) => t.status === "failed").length

  const totalBytes = tasks.reduce((sum, t) => sum + t.totalBytes, 0)
  const uploadedBytes = tasks.reduce((sum, t) => sum + t.bytesUploaded, 0)
  const overallPct =
    totalBytes > 0 ? Math.round((uploadedBytes / totalBytes) * 100) : 0
  const overallCount = useCountUp(overallPct)

  useEffect(() => {
    const hasActive = tasks.some(
      (t) => t.status === "uploading" || t.status === "processing"
    )
    const allFinished =
      tasks.length > 0 &&
      tasks.every((t) => t.status === "completed" || t.status === "failed")
    const anyFailed = tasks.some((t) => t.status === "failed")

    if (hadActiveRef.current && allFinished && !anyFailed) {
      playChime()
    }

    hadActiveRef.current = hasActive
  }, [tasks])

  if (tasks.length === 0) return null

  const title =
    activeCount + processingCount > 0
      ? `Uploading ${activeCount + processingCount} video${
          activeCount + processingCount > 1 ? "s" : ""
        }...`
      : failedCount > 0
        ? `${doneCount} uploaded, ${failedCount} failed`
        : "All videos uploaded"

  const handleClose = () => {
    clearAll()
    onClose?.()
  }

  const handleRetry = async (uploadId: string) => {
    setRetrying((prev) => new Set(prev).add(uploadId))
    try {
      await retryUpload(uploadId)
    } catch {
      // store already sets failed state on error
    } finally {
      setRetrying((prev) => {
        const next = new Set(prev)
        next.delete(uploadId)
        return next
      })
    }
  }

  return (
    <div className="w-80 rounded-lg border bg-white p-4 shadow-lg">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close upload progress"
          className="text-slate-400 transition-colors hover:text-slate-600"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      {totalBytes > 0 && (
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span className="tabular-nums">
            {formatBytes(uploadedBytes)} / {formatBytes(totalBytes)}
          </span>
          <span className="font-semibold text-slate-700 tabular-nums">
            {overallCount}%
          </span>
        </div>
      )}

      <div className="space-y-2.5">
        {tasks.map((task) => (
          <TaskRow
            key={task.uploadId}
            task={task}
            retrying={retrying.has(task.uploadId)}
            onRetry={() => handleRetry(task.uploadId)}
          />
        ))}
      </div>
    </div>
  )
}
