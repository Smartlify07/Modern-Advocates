"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"
import { Loader2Icon } from "lucide-react"
import { CreateUserForm, CREATE_USER_FORM_ID } from "@/features/admin/users/components/create-user-form"
import type { CreateUserParams } from "@/features/admin/users/services/user-service"

interface AddUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateUserParams) => void
  isPending: boolean
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: AddUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="px-7.5 py-4 sm:max-w-xl [&>button]:end-7.5">
        <DialogHeader className="-mx-7.5 border-b px-7.5 pb-4">
          <DialogTitle className="text-base">Add New User</DialogTitle>
        </DialogHeader>
        <div className="space-y-7.5">
          <p className="text-sm text-muted-foreground">
            Category:{" "}
            <span className="align-middle text-xl font-medium tracking-tight-md text-ma-admin-primary">
              User
            </span>
          </p>
          <CreateUserForm onSubmit={onSubmit} isPending={isPending} />
        </div>
        <DialogFooter className="-mx-7.5 border-t-0 px-7.5 pb-4 sm:justify-start">
          <Button
            variant="outline"
            className="h-pill flex-1 rounded-button-medium px-6 py-4"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form={CREATE_USER_FORM_ID}
            className="h-pill flex-1 rounded-button-medium bg-ma-admin-primary px-6 py-4 text-white hover:bg-ma-admin-primary/80"
            disabled={isPending}
          >
            {isPending ? <Loader2Icon className="size-5 animate-spin" /> : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
