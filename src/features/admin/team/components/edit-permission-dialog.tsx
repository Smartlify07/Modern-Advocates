"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Loader2Icon } from "lucide-react"
import { TeamCheckbox } from "./team-checkbox"
import type { TeamMember } from "../types"

interface EditPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: TeamMember | null
}

export function EditPermissionDialog({
  open,
  onOpenChange,
  member,
}: EditPermissionDialogProps) {
  const [role, setRole] = useState<"Manager" | "Editor">(
    member?.role === "Admin" ? "Manager" : (member?.role ?? "Editor")
  )
  const [removeChecked, setRemoveChecked] = useState(false)
  const queryClient = useQueryClient()

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setRemoveChecked(false)
      setRole(member?.role === "Admin" ? "Manager" : (member?.role ?? "Editor"))
    }
    onOpenChange(nextOpen)
  }

  const updateMutation = useMutation({
    mutationFn: async () => {
      const r = await fetch(`/api/admin/team/${member!.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })
      if (!r.ok) {
        const { error } = await r.json()
        throw new Error(error ?? "Failed to update role")
      }
      return r.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] })
      handleOpenChange(false)
      toast.success("Role updated")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const removeMutation = useMutation({
    mutationFn: async () => {
      const r = await fetch(`/api/admin/team/${member!.id}`, {
        method: "DELETE",
      })
      if (!r.ok) {
        const { error } = await r.json()
        throw new Error(error ?? "Failed to remove member")
      }
      return r.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] })
      handleOpenChange(false)
      toast.success("Team member removed")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

  const isRemove = removeChecked
  const isPending = updateMutation.isPending || removeMutation.isPending

  return (
    <Dialog key={member?.id} open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Edit Permission</DialogTitle>
        </DialogHeader>
        <div className="space-y-7.5">
          <Input
            value={member?.name ?? ""}
            readOnly
            className="h-[53px] bg-muted/50 p-5"
          />
          <Input
            value={member?.email ?? ""}
            readOnly
            className="h-[53px] bg-muted/50 p-5"
          />
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold">Assign Role</span>
            <div className="flex items-center gap-6">
              <TeamCheckbox
                checked={role === "Manager"}
                onCheckedChange={(c) => {
                  if (!isRemove && c) setRole("Manager")
                }}
                id="edit-manager"
                label="Manager"
                disabled={isRemove}
              />
              <TeamCheckbox
                checked={role === "Editor"}
                onCheckedChange={(c) => {
                  if (!isRemove && c) setRole("Editor")
                }}
                id="edit-editor"
                label="Editor"
                disabled={isRemove}
              />
              <TeamCheckbox
                checked={removeChecked}
                onCheckedChange={(c) => {
                  setRemoveChecked(c)
                }}
                id="remove-member"
                label="Remove member"
                destructive
              />
            </div>
          </div>
        </div>
        <DialogFooter className="-mx-7.5 border-t-0 bg-white px-7.5 pb-4 sm:justify-start">
          <Button
            variant="outline"
            className="h-[53px] flex-1 rounded-button-medium px-6 py-4"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          {isRemove ? (
            <Button
              variant="destructive"
              className="h-[53px] flex-1 rounded-button-medium px-6 py-4"
              onClick={() => removeMutation.mutate()}
              disabled={isPending}
            >
              {removeMutation.isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
              Remove
            </Button>
          ) : (
            <Button
              className="h-[53px] flex-1 rounded-button-medium bg-ma-admin-primary px-6 py-4 text-white hover:bg-ma-admin-primary/80"
              onClick={() => updateMutation.mutate()}
              disabled={isPending}
            >
              {updateMutation.isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
              Update
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
