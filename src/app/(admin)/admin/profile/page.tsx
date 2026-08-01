"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { toast } from "sonner"

import { authClient } from "@/infrastructure/auth/client"
import { UserAvatar } from "@/shared/ui/user-avatar"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
import { Skeleton } from "@/shared/ui/skeleton"

export default function AdminProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession()
  const user = session?.user

  const [editedName, setEditedName] = useState<string | null>(null)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayImage = previewUrl ?? user?.image ?? null
  const hasChanges =
    (editedName !== null && editedName !== user?.name) || pendingFile !== null

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
  }

  const handleSave = async () => {
    if (!hasChanges) return

    setSaving(true)
    try {
      let imageUrl: string | undefined

      if (pendingFile) {
        const formData = new FormData()
        formData.append("file", pendingFile)

        const res = await fetch("/api/user/avatar", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error ?? "Upload failed")
        }

        const { url } = await res.json()
        imageUrl = url
      }

      await authClient.updateUser({
        name: editedName ?? user?.name ?? undefined,
        image: imageUrl,
      })

      await refetch()

      setPendingFile(null)
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

  return (
    <div className="mx-auto flex flex-col gap-10 p-7.5 lg:max-w-7xl 2xl:max-w-360">
      <h1 className="text-4xl/[100%] font-semibold tracking-[-3%]">Account</h1>

      {isPending ? (
        <div className="flex w-full flex-col gap-12 rounded-xl bg-white">
          <div className="flex items-center gap-4">
            <Skeleton className="size-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-[150px] rounded-lg" />
              <Skeleton className="h-4 w-[120px]" />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-11 w-full rounded-[8px]" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-11 w-full rounded-[8px]" />
            </div>
          </div>
          <Skeleton className="h-11 w-40 rounded-[8px]" />
        </div>
      ) : (
        <div className="flex w-full flex-col gap-12 rounded-xl bg-white">
          <div className="flex items-center gap-4">
            <UserAvatar
              user={{ name: user?.name, image: displayImage }}
              className="size-20 bg-ma-admin-primary"
              fallbackClassName="bg-ma-admin-primary text-4xl"
            />
            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={saving}
                className="flex items-center gap-2 rounded-[8px] border border-input bg-background px-3.5 py-2 text-sm font-medium text-ma-text transition-colors hover:bg-muted disabled:opacity-50"
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
                className="h-11 rounded-[8px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="h-11 rounded-[8px] bg-muted/50"
              />
            </div>
          </div>

          <div>
            <Button
              onClick={handleSave}
              className="h-11 w-full rounded-[8px] bg-ma-admin-primary text-white hover:bg-ma-admin-primary/90 lg:w-40"
              disabled={!hasChanges || saving}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
