"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { SaveIcon, XIcon, Loader2 } from "lucide-react"

const formSchema = z.object({
  title: z.string({ message: "Title is required" }).min(1, { message: "Title is required" }),
  categoryId: z.string({ message: "Category is required" }).min(1, { message: "Category is required" }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>
type Category = { id: string; name: string }

const steps = ["Basic Info", "Course Content", "Pricing", "Publish"]

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const activeTab = useCourseFormStore((s) => s.activeTab)
  const setActiveTab = useCourseFormStore((s) => s.setActiveTab)
  const syncFormValues = useCourseFormStore((s) => s.syncFormValues)
  const loadFromCourse = useCourseFormStore((s) => s.loadFromCourse)
  const modules = useCourseFormStore((s) => s.modules)
  const setCourseId = useCourseFormStore((s) => s.setCourseId)

  const [loaded, setLoaded] = useState(false)
  const [saving, setSaving] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", categoryId: "", description: "" },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  const { data: course, isLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => fetch(`/api/courses/${courseId}`).then((r) => r.json()),
    enabled: !!courseId,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (course && !loaded && !isLoading) {
      form.reset({
        title: course.title ?? "",
        categoryId: course.categoryId ?? "",
        description: course.description ?? "",
      })
      loadFromCourse(course)
      setLoaded(true)
    }
  }, [course, loaded, isLoading, form, loadFromCourse])

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

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = {
        title: useCourseFormStore.getState().title,
        description: useCourseFormStore.getState().description,
        categoryId: useCourseFormStore.getState().categoryId,
        level: useCourseFormStore.getState().level,
        price: parseFloat(useCourseFormStore.getState().price) || 0,
        discountedPrice: useCourseFormStore.getState().isFree
          ? null
          : useCourseFormStore.getState().discount > 0
            ? (parseFloat(useCourseFormStore.getState().price) || 0) * (1 - useCourseFormStore.getState().discount / 100)
            : null,
        isFree: useCourseFormStore.getState().isFree,
        status: "draft",
        modules: useCourseFormStore.getState().modules.map((mod, mi) => ({
          id: mod.id,
          title: mod.title,
          order: mod.order || mi,
          topics: mod.topics.map((topic, ti) => ({
            id: topic.id,
            title: topic.title,
            type: topic.type,
            description: topic.description,
            order: topic.order || ti,
          })),
        })),
      }

      const res = await fetch(`/api/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to save course")
      }

      router.push("/admin/courses")
    } catch (error) {
      console.error("Failed to save:", error)
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
        <p className="text-muted-foreground">Course not found</p>
        <Button asChild variant="outline">
          <Link href="/admin/courses">Back to courses</Link>
        </Button>
      </div>
    )
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
            <Button onClick={handleSaveAndContinue} disabled={saving}>
              <SaveIcon className="size-4" />
              Save and Continue
            </Button>
          )}
          {activeTab === "Publish" && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
              {saving ? "Saving..." : "Save Changes"}
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
