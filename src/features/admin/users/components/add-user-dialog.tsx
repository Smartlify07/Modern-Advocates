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

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: { name: string; email: string }) => void
  isPending: boolean
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: AddUserDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || isPending) return
    onSubmit({ name: name.trim(), email: email.trim() })
    setName("")
    setEmail("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-7.5">
          <p className="text-sm text-muted-foreground">
            Category:{" "}
            <span className="align-middle text-xl font-medium tracking-[-1.5%] text-ma-admin-primary">
              User
            </span>
          </p>
          <Input
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-[53px] p-5"
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[53px] p-5"
          />
        </div>
        <DialogFooter className="-mx-7.5 border-t-0 px-7.5 pb-4 sm:justify-start">
          <Button
            variant="outline"
            className="h-[53px] flex-1 rounded-button-medium px-6 py-4"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            className="h-[53px] flex-1 rounded-button-medium bg-ma-admin-primary px-6 py-4 text-white hover:bg-ma-admin-primary/80"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? <Loader2Icon className="size-5 animate-spin" /> : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
