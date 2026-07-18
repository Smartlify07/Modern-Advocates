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

interface AddMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMemberDialog({ open, onOpenChange }: AddMemberDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<"Manager" | "Editor">("Editor")
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const r = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      })
      if (!r.ok) {
        const { error } = await r.json()
        throw new Error(error ?? "Failed to add team member")
      }
      return r.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] })
      onOpenChange(false)
      setEmail("")
      setRole("Editor")
      toast.success("Team member added")
    },
    onError: (err) => {
      toast.error(err.message)
    },
  })

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
                checked={role === "Manager"}
                onCheckedChange={(c) => c && setRole("Manager")}
                id="add-manager"
                label="Manager"
              />
              <TeamCheckbox
                checked={role === "Editor"}
                onCheckedChange={(c) => c && setRole("Editor")}
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
            onClick={() => mutate()}
            disabled={isPending || !email.trim()}
          >
            {isPending ? <Loader2Icon className="size-4 animate-spin" /> : null}
            Add Member
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
