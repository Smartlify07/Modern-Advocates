"use client"

import { useRef, useState } from "react"
import { useParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { SendHorizonal, Star } from "lucide-react"
import { apiFetch } from "@/shared/lib/api-fetch"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/shared/ui/dialog"
import { Field, FieldLabel } from "@/shared/ui/field"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/utils/index"
import { useSession } from "@/shared/hooks/use-session"
import { queryKeys } from "@/shared/lib/query-keys"

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Below Average",
  3: "Average",
  4: "Good",
  5: "Amazing",
}

interface ReviewDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ReviewDialog({
  open: openProp,
  onOpenChange,
}: ReviewDialogProps) {
  const params = useParams()
  const courseId = params.courseId as string
  const queryClient = useQueryClient()
  const { data: session } = useSession()

  const [internalOpen, setInternalOpen] = useState(false)
  const open = openProp ?? internalOpen
  const setOpen = onOpenChange ?? setInternalOpen
  const [rating, setRating] = useState(4)
  const feedbackRef = useRef<HTMLTextAreaElement>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      apiFetch(`/api/reviews`, {
        method: "POST",
        body: {
          courseId,
          rating,
          body: feedbackRef.current?.value.trim() || undefined,
        },
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.course.detail(courseId) })
      const prev = queryClient.getQueryData(queryKeys.course.detail(courseId))

      queryClient.setQueryData(queryKeys.course.detail(courseId), (old: any) => {
        if (!old) return old
        const optimisticReview = {
          id: crypto.randomUUID(),
          body: feedbackRef.current?.value.trim() || null,
          rating,
          studentName: session?.user?.name ?? "You",
          studentImage: null,
        }
        const newCount = old.reviewCount + 1
        const newAvg = (old.avgRating * old.reviewCount + rating) / newCount
        return {
          ...old,
          reviews: [...old.reviews, optimisticReview],
          reviewCount: newCount,
          avgRating: Math.round(newAvg * 100) / 100,
        }
      })

      setOpen(false)
      return { prev }
    },
    onSuccess: () => {
      toast.success("Review submitted")
    },
    onError: (err, _vars, context) => {
      if (context?.prev) {
        queryClient.setQueryData(queryKeys.course.detail(courseId), context.prev)
      }
      toast.error(err.message)
      setOpen(true)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.course.detail(courseId) })
    },
  })

  function handleCancel() {
    setOpen(false)
    setRating(4)
    if (feedbackRef.current) feedbackRef.current.value = ""
  }

  function handleSubmit() {
    mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 py-0 sm:max-w-xl">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="font-sans">Write a review</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-5 py-2">
          <div className="mx-auto flex flex-col items-center gap-3 self-center">
            <span className="text-sm text-muted-foreground">
              {rating} ({ratingLabels[rating]})
            </span>
            <div className="flex flex-row-reverse justify-center gap-1">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="cursor-pointer [&:hover_svg]:fill-ma-star [&:hover_svg]:text-ma-star [&:hover~button_svg]:fill-ma-star [&:hover~button_svg]:text-ma-star"
                >
                  <Star
                    className={cn(
                      "size-12 transition-[fill,color]",
                      rating >= star
                        ? "fill-ma-star text-ma-star"
                        : "text-muted-foreground"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <Field>
            <FieldLabel
              htmlFor="feedback"
              className="text-sm font-normal tracking-[-1%] text-primary"
            >
              Feedback
            </FieldLabel>
            <textarea
              ref={feedbackRef}
              id="feedback"
              placeholder="Share your thoughts"
              defaultValue=""
              rows={4}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm ring-0 outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </Field>
        </div>

        <DialogFooter
          className="-mx-0 -mb-0 sm:justify-between"
          showCloseButton={false}
        >
          <DialogClose asChild>
            <Button
              variant="outline"
              className="h-11 lg:w-25"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="h-11 gap-3"
          >
            {isPending ? "Submitting..." : "Submit Review"} <SendHorizonal />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
