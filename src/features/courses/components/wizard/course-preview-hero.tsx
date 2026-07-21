"use client"

import { useCourseWizardStore } from "@/features/courses/store/use-course-wizard-store"
import { Star, Users } from "lucide-react"
import Image from "next/image"

export function CoursePreviewHero() {
  const title = useCourseWizardStore((s) => s.title)
  const thumbnailPreview = useCourseWizardStore((s) => s.thumbnailPreview)
  const originalPrice = useCourseWizardStore((s) => s.originalPrice)
  const salePrice = useCourseWizardStore((s) => s.salePrice)
  const showStrikedOriginal = useCourseWizardStore((s) => s.showStrikedOriginal)
  const instructorName = useCourseWizardStore((s) => s.instructorName)

  const numericPrice = parseFloat(originalPrice) || 0
  const numericSale = parseFloat(salePrice) || 0
  const displayPrice = numericSale > 0 ? numericSale : numericPrice

  return (
    <section className="py-8 text-ma-text">
      <div className="mx-auto grid gap-5 lg:grid-cols-2">
        <div className="relative min-h-[250px] overflow-hidden rounded-[24px] sm:min-h-[250px] lg:h-[250px]">
          {thumbnailPreview ? (
            <Image
              src={thumbnailPreview}
              alt="thumbnail"
              className="size-full object-cover"
              width={550}
              height={250}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 text-sm text-slate-400">
              No thumbnail
            </div>
          )}
        </div>

        <div className="flex flex-col py-2">
          <div className="flex flex-col gap-5">
            <h1 className="text-[28px]/[100%] font-bold text-ma-text lg:text-[40px]/[100%]">
              {title || "Untitled Course"}
            </h1>
            <p className="text-lg text-ma-text">
              {instructorName || "Instructor"}
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] p-[5px] text-sm font-medium text-[#6b7280]">
                <Users className="size-5 text-[#6b7280]" />0 Students Enrolled
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-[#e5e7eb] p-[5px] text-sm font-medium text-[#6b7280]">
                <Star className="size-5 fill-[#ff9d00] text-[#ff9d00]" />
                0.0
              </span>
              <span className="inline-flex items-center rounded-md border border-[#e5e7eb] px-[5px] py-1.5 text-sm font-medium text-[#6b7280]">
                0 ratings
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-2.5 font-medium">
              <p className="text-2xl text-ma-text">
                $ {displayPrice.toFixed(2)} USD
              </p>
              {showStrikedOriginal && numericSale > 0 && numericPrice > 0 && (
                <p className="text-base text-[#6b7280] line-through">
                  $ {numericPrice.toFixed(2)} USD
                </p>
              )}
            </div>

            <span className="w-fit text-base text-ma-text underline underline-offset-2">
              Enable Grant
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
