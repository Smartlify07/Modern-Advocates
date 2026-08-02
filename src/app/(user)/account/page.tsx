"use client"

import { useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/infrastructure/auth/client"
import { UserAvatar } from "@/shared/ui/user-avatar"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"
import { apiFetch } from "@/shared/lib/api-fetch"
import { useSession } from "@/shared/hooks/use-session"

export default function AccountPage() {
  const { user, isPending, refetch } = useSession()

  const [editedName, setEditedName] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayImage = removeImage
    ? null
    : previewUrl ?? user?.image ?? null
  const hasChanges =
    (editedName !== null && editedName !== user?.name) ||
    pendingFile !== null ||
    (removeImage && !!user?.image)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be less than 2MB")
      return
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPendingFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setRemoveImage(false)
  }

  const handleRemoveImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    setPendingFile(null)
    setRemoveImage(true)
  }

  const handleSave = async () => {
    if (!hasChanges) return

    setSaving(true)
    try {
      let imageUrl: string | undefined

      if (pendingFile) {
        const formData = new FormData()
        formData.append("file", pendingFile)

        const { url } = await apiFetch<{ url: string }>("/api/user/avatar", {
          method: "POST",
          body: formData,
        })
        imageUrl = url
      }

      await authClient.updateUser({
        name: editedName ?? user?.name ?? undefined,
        image: removeImage ? null : imageUrl,
      })

      await refetch()

      setPendingFile(null)
      setRemoveImage(false)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
        setPreviewUrl(null)
      }

      toast.success("Profile updated")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update profile"
      )
    } finally {
      setSaving(false)
    }
  }

  if (isPending) {
    return (
      <div className="flex flex-1 flex-col gap-12">
        <div className="flex items-center gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div>
            <Skeleton className="h-9 w-[130px] rounded-lg" />
            <Skeleton className="mt-1 h-4 w-[140px]" />
          </div>
        </div>
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-11 w-full rounded-8" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-14" />
            <Skeleton className="h-11 w-full rounded-8" />
          </div>
        </div>
        <Skeleton className="h-8 w-[70px] rounded-lg" />
      </div>
    )
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-12 lg:max-w-xl">
      <div className="flex items-center gap-4">
        <div className="relative">
          <UserAvatar
            user={{ name: user?.name, image: displayImage }}
            className="size-20"
            fallbackClassName="text-4xl"
          />
          {displayImage && (
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={saving}
              aria-label="Remove photo"
              className="absolute -bottom-1.5 -end-1.5 flex size-6 items-center justify-center rounded-full border border-input bg-white text-ma-text transition-colors hover:bg-muted disabled:opacity-50"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-input bg-background px-3.5 py-2 text-sm font-medium text-ma-text transition-colors hover:bg-muted disabled:opacity-50"
          >
            <Upload className="size-4" />
            Upload Photo
          </button>
          <p className="mt-1 text-xs text-muted-foreground">
            300x300 and 2MB max.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="space-y-2">
          <Label htmlFor="full-name">Full Name</Label>
          <Input
            id="full-name"
            value={editedName ?? user?.name ?? ""}
            onChange={(e) => setEditedName(e.target.value)}
            placeholder="Your full name"
            className="h-11 rounded-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={user?.email ?? ""}
            disabled
            className="h-11 rounded-full bg-muted/50"
          />
        </div>
      </div>

      <div>
        <Button
          onClick={handleSave}
          className="h-11 w-full rounded-full lg:w-60"
          disabled={!hasChanges || saving}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}
