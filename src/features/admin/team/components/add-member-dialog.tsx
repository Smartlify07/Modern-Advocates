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
import { Loader2Icon } from "lucide-react"
import { TeamCheckbox } from "./team-checkbox"

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [managerChecked, setManagerChecked] = useState(false)
  const [editorChecked, setEditorChecked] = useState(true)

  const handleSubmit = () => {
    if (!fullName.trim() || !email.trim()) return
    onOpenChange(false)
    setFullName("")
    setEmail("")
    setManagerChecked(false)
    setEditorChecked(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5 [&>button]:top-4 [&>button]:rounded-[8px]">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Add Team Member</DialogTitle>
        </DialogHeader>
        <div className="space-y-7.5">
          <p className="text-sm text-muted-foreground">
            Category:{" "}
            <span className="align-middle text-xl font-medium tracking-[-1.5%] text-ma-admin-primary">
              Team
            </span>
          </p>
          <Input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="h-[53px] p-5"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[53px] p-5"
          />
          <div className="flex flex-col gap-7.5">
            <span className="text-lg font-medium">Assign Role</span>
            <div className="flex items-center gap-6">
              <TeamCheckbox
                checked={managerChecked}
                onCheckedChange={setManagerChecked}
                id="add-manager"
                label="Manager"
              />
              <TeamCheckbox
                checked={editorChecked}
                onCheckedChange={setEditorChecked}
                id="add-editor"
                label="Editor"
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
          <Button
            className="h-[53px] flex-1 rounded-button-medium bg-ma-admin-primary px-6 py-4 text-white hover:bg-ma-admin-primary/80"
            onClick={handleSubmit}
          >
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
