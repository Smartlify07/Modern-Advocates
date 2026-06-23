"use client"

import { useState, useRef, useCallback } from "react"
import { Upload, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

type UploadState = "idle" | "uploading" | "processing" | "success" | "error"

interface UploadConfig {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
  videoId: string
}

interface VideoUploaderProps {
  courseId: string
  moduleId: string
  topicId: string
  onSuccess?: (videoId: string) => void
  onError?: (error: string) => void
}

export function VideoUploader({
  courseId,
  moduleId,
  topicId,
  onSuccess,
  onError,
}: VideoUploaderProps) {
  const [state, setState] = useState<UploadState>("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async () => {
    const file = fileRef.current?.files?.[0]
    if (!file || !title.trim()) return

    setState("uploading")
    setProgress(0)
    setErrorMessage(null)

    try {
      const res = await fetch("/api/videos/sign-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, moduleId, topicId, title, description }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to get upload signature")
      }

      const config: UploadConfig = await res.json()

      const formData = new FormData()
      formData.append("file", file)
      formData.append("api_key", config.apiKey)
      formData.append("timestamp", String(config.timestamp))
      formData.append("signature", config.signature)
      formData.append("folder", config.folder)
      formData.append("public_id", config.videoId)
      formData.append("resource_type", "video")
      formData.append("eager", "sp_hd")
      formData.append("eager_async", "1")

      const xhr = new XMLHttpRequest()

      await new Promise<void>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            setProgress(Math.round((e.loaded / e.total) * 100))
          }
        })

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve()
          } else {
            try {
              const err = JSON.parse(xhr.responseText)
              reject(new Error(err.error?.message ?? "Upload failed"))
            } catch {
              reject(new Error("Upload failed"))
            }
          }
        })

        xhr.addEventListener("error", () => reject(new Error("Upload failed")))
        xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")))

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${config.cloudName}/video/upload`,
        )
        xhr.send(formData)
      })

      setState("processing")
      onSuccess?.(config.videoId)
    } catch (error) {
      setState("error")
      const msg = error instanceof Error ? error.message : "Upload failed"
      setErrorMessage(msg)
      onError?.(msg)
    }
  }, [courseId, moduleId, title, description, onSuccess, onError])

  const handleCancel = useCallback(() => {
    setState("idle")
    setProgress(0)
    setErrorMessage(null)
    if (fileRef.current) fileRef.current.value = ""
  }, [])

  const selectedFile = fileRef.current?.files?.[0]

  return (
    <div className="space-y-4 rounded-lg border p-6">
      <div className="space-y-2">
        <Label htmlFor="video-title">Video Title</Label>
        <Input
          id="video-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          disabled={state === "uploading" || state === "processing"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-description">Description (optional)</Label>
        <Input
          id="video-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description"
          disabled={state === "uploading" || state === "processing"}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="video-file">Video File</Label>
        <Input
          ref={fileRef}
          id="video-file"
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          disabled={state === "uploading" || state === "processing"}
        />
      </div>

      {state === "uploading" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Uploading...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {state === "processing" && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Processing video...
        </div>
      )}

      {state === "success" && (
        <div className="flex items-center gap-2 text-sm text-green-600">
          <CheckCircle className="h-4 w-4" />
          Upload complete
        </div>
      )}

      {state === "error" && (
        <div className="flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          {errorMessage ?? "Upload failed"}
        </div>
      )}

      <div className="flex gap-2">
        {state === "idle" && (
          <Button
            onClick={handleUpload}
            disabled={!title.trim() || !selectedFile}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
        )}
        {(state === "uploading" || state === "processing") && (
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        )}
        {state === "success" && (
          <Button variant="outline" onClick={handleCancel}>
            Upload Another
          </Button>
        )}
        {state === "error" && (
          <Button onClick={handleUpload}>
            Retry
          </Button>
        )}
      </div>
    </div>
  )
}
