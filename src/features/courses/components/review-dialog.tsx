"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { SendHorizonal, Star } from "lucide-react"

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
import { authClient } from "@/infrastructure/auth/client"

const ratingLabels: Record<number, string> = {
  1: "Poor",
  2: "Below Average",
  3: "Average",
  4: "Good",
  5: "Amazing",
}

export function ReviewDialog() {
  const params = useParams()
  const courseId = params.courseId as string
  const queryClient = useQueryClient()
  const { data: session } = authClient.useSession()

  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(4)
  const [feedback, setFeedback] = useState("")

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const r = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          rating,
          body: feedback.trim() || undefined,
        }),
      })
      if (!r.ok) {
        const { error } = await r.json()
        throw new Error(error ?? "Failed to submit review")
      }
      return r.json()
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["course", courseId] })
      const prev = queryClient.getQueryData(["course", courseId])

      queryClient.setQueryData(["course", courseId], (old: any) => {
        if (!old) return old
        const optimisticReview = {
          id: crypto.randomUUID(),
          body: feedback.trim() || null,
          rating,
          studentName: session?.user?.name ?? "You",
          studentImage: null,
        }
        const newCount = old.reviewCount + 1
        const newAvg = ((old.avgRating * old.reviewCount) + rating) / newCount
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
        queryClient.setQueryData(["course", courseId], context.prev)
      }
      toast.error(err.message)
      setOpen(true)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] })
    },
  })

  function handleCancel() {
    setOpen(false)
    setRating(4)
    setFeedback("")
  }

  function handleSubmit() {
    mutate()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden bg-[#E7EBEF] px-3 py-1.5 text-sm text-[#448AFF] md:block"
      >
        Leave review
      </button>
      <DialogContent className="px-0 py-0 sm:max-w-md">
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
                  className="cursor-pointer
                    [&:hover_svg]:fill-[#FFA62F] [&:hover_svg]:text-[#FFA62F]
                    [&:hover~button_svg]:fill-[#FFA62F] [&:hover~button_svg]:text-[#FFA62F]"
                >
                  <Star
                    className={cn(
                      "size-12 transition-[fill,color]",
                      rating >= star
                        ? "fill-[#FFA62F] text-[#FFA62F]"
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
              id="feedback"
              placeholder="Share your thoughts"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm ring-0 outline-none placeholder:text-[#6B7280] focus:ring-2 focus:ring-ring"
            />
          </Field>
        </div>

        <DialogFooter
          className="-mx-0 -mb-0 sm:justify-between"
          showCloseButton={false}
        >
          <DialogClose asChild>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isPending} className="gap-3">
            {isPending ? "Submitting..." : "Submit Review"} <SendHorizonal />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
