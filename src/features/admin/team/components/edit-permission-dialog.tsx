"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
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
  const [managerChecked, setManagerChecked] = useState(false)
  const [editorChecked, setEditorChecked] = useState(false)
  const [removeChecked, setRemoveChecked] = useState(false)
  const isRemove = removeChecked

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                checked={managerChecked}
                onCheckedChange={(c) => !isRemove && setManagerChecked(c)}
                id="edit-manager"
                label="Manager"
                disabled={isRemove}
              />
              <TeamCheckbox
                checked={editorChecked}
                onCheckedChange={(c) => !isRemove && setEditorChecked(c)}
                id="edit-editor"
                label="Editor"
                disabled={isRemove}
              />
              <TeamCheckbox
                checked={removeChecked}
                onCheckedChange={(c) => {
                  setRemoveChecked(c)
                  if (c) {
                    setManagerChecked(false)
                    setEditorChecked(false)
                  }
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
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          {isRemove ? (
            <Button
              variant="destructive"
              className="h-[53px] flex-1 rounded-button-medium px-6 py-4"
              onClick={() => onOpenChange(false)}
            >
              Remove
            </Button>
          ) : (
            <Button
              className="h-[53px] flex-1 rounded-button-medium bg-ma-admin-primary px-6 py-4 text-white hover:bg-ma-admin-primary/80"
              onClick={() => onOpenChange(false)}
            >
              Update
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
