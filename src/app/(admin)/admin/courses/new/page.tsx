"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/shared/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { BasicInfoSection } from "@/features/courses/components/basic-info-section"
import { CourseContentSection } from "@/features/courses/components/course-content-section"
import { PricingSection } from "@/features/courses/components/pricing-section"
import { PublishSection } from "@/features/courses/components/publish-section"
import { useCourseFormStore } from "@/features/courses/store/use-course-form-store"
import { SaveIcon, XIcon } from "lucide-react"

const formSchema = z.object({
  title: z.string({ message: "Title is required" }).min(1, { message: "Title is required" }),
  categoryId: z.string({ message: "Category is required" }).min(1, { message: "Category is required" }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>
type Category = { id: string; name: string }

const steps = ["Basic Info", "Course Content", "Pricing", "Publish"]

export default function CreateCoursePage() {
  const activeTab = useCourseFormStore((s) => s.activeTab)
  const setActiveTab = useCourseFormStore((s) => s.setActiveTab)
  const syncFormValues = useCourseFormStore((s) => s.syncFormValues)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", categoryId: "", description: "" },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  const formValues = form.watch()
  useEffect(() => {
    syncFormValues(formValues, categories ?? [])
  }, [formValues, categories, syncFormValues])

  const onSubmit = () => {
    const currentIndex = steps.indexOf(activeTab)
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1])
    }
  }

  const handleSaveAndContinue = async () => {
    const currentIndex = steps.indexOf(activeTab)
    if (activeTab === "Basic Info") {
      const valid = await form.trigger()
      if (!valid) return
    }
    if (currentIndex < steps.length - 1) {
      setActiveTab(steps[currentIndex + 1])
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-8">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {steps.map((step) => (
              <TabsTrigger key={step} value={step}>{step}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/courses"><XIcon className="size-4" />Cancel</Link>
          </Button>
          {activeTab !== "Publish" && (
            <Button onClick={handleSaveAndContinue}>
              <SaveIcon className="size-4" />
              Save and Continue
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsContent value="Basic Info" className="flex flex-col gap-4">
          <BasicInfoSection form={form} categories={categories} onSubmit={onSubmit} />
        </TabsContent>

        <TabsContent value="Course Content" className="flex flex-col gap-4">
          <CourseContentSection />
        </TabsContent>

        <TabsContent value="Pricing">
          <PricingSection />
        </TabsContent>

        <TabsContent value="Publish">
          <PublishSection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
