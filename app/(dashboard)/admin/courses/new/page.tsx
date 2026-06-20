"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModuleEditor } from "@/components/course-editor/module-editor"
import type { Module } from "@/components/course-editor/types"
import {
  PlusIcon,
  SaveIcon,
  XIcon,
  BookOpenIcon,
  FolderKanbanIcon,
} from "lucide-react"

const formSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .min(1, { message: "Title is required" }),
  categoryId: z
    .string({ message: "Category is required" })
    .min(1, { message: "Category is required" }),
  description: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

type Category = {
  id: string
  name: string
}

const steps = ["Basic Info", "Course Content", "Pricing", "Publish"]

export default function CreateCoursePage() {
  const router = useRouter()
  const [modules, setModules] = useState<Module[]>([])
  const [activeTab, setActiveTab] = useState("Basic Info")
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null)

  const nextModuleId = useRef(1)
  const addModule = () => {
    const id = `module_${nextModuleId.current++}`
    setModules((prev) => [
      ...prev,
      {
        id,
        title: "",
        topics: [],
        order: prev.length,
      },
    ])
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      categoryId: "",
      description: "",
    },
  })

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: () => fetch("/api/categories").then((r) => r.json()),
    refetchOnWindowFocus: false,
  })

  const onSubmit = async (data: FormValues) => {
    console.log(data)
  }

  const handleSaveAndContinue = async () => {
    const valid = await form.trigger()
    if (!valid) return

    const data = form.getValues()
    await onSubmit(data)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-8">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            {steps.map((step) => (
              <TabsTrigger key={step} value={step}>
                {step}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/courses">
              <XIcon className="size-4" />
              Cancel
            </Link>
          </Button>
          <Button onClick={handleSaveAndContinue}>
            <SaveIcon className="size-4" />
            Save and Continue
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsContent value="Basic Info" className="flex flex-col gap-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-6">
                <Card className="ring-0">
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FieldGroup>
                      <Controller
                        control={form.control}
                        name="title"
                        render={({ fieldState, field }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              Course Title
                            </FieldLabel>
                            <Input
                              {...field}
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="e.g. Introduction to Criminal Law"
                            />
                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error?.message}
                              </FieldError>
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="categoryId"
                        render={({ fieldState, field }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              Category
                            </FieldLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                className="w-full"
                              >
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                              <SelectContent>
                                {(categories ?? []).map((cat) => (
                                  <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error?.message}
                              </FieldError>
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        control={form.control}
                        name="description"
                        render={({ fieldState, field }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor={field.name}>
                              Description
                            </FieldLabel>
                            <textarea
                              {...field}
                              id={field.name}
                              aria-invalid={fieldState.invalid}
                              placeholder="Describe what students will learn..."
                              className="h-32 w-full min-w-0 resize-y rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80"
                            />
                            <FieldDescription>
                              A brief overview of the course content and
                              objectives.
                            </FieldDescription>

                            {fieldState.error && (
                              <FieldError>
                                {fieldState.error?.message}
                              </FieldError>
                            )}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  </CardContent>
                </Card>
              </div>

              <div className="flex flex-col gap-6">
                <Card className="ring-0">
                  <CardHeader>
                    <CardTitle>Thumbnail</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex aspect-video cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50">
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <PlusIcon className="size-8" />
                        <span className="text-sm font-medium">
                          Upload Image
                        </span>
                        <span className="text-xs">16:9 ratio recommended</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="Course Content" className="flex flex-col gap-4">
          {activeModuleId ? (
            (() => {
              const mod = modules.find((m) => m.id === activeModuleId)
              if (!mod) return null
              return (
                <ModuleEditor
                  module={mod}
                  onChange={(updated) => {
                    setModules((prev) =>
                      prev.map((m) => (m.id === mod.id ? updated : m))
                    )
                    if (
                      activeTopicId &&
                      !updated.topics.find((t) => t.id === activeTopicId)
                    ) {
                      setActiveTopicId(null)
                    }
                  }}
                  activeTopicId={activeTopicId}
                  onActiveTopicChange={setActiveTopicId}
                  onBack={() => {
                    setActiveModuleId(null)
                    setActiveTopicId(null)
                  }}
                />
              )
            })()
          ) : modules.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-muted-foreground/25 py-20">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted">
                <BookOpenIcon className="size-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">Start building your course</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  Modules help organize your course content. Create your first module to
                  start adding topics, videos, and text lessons.
                </p>
              </div>
              <Button onClick={addModule}>
                <PlusIcon className="size-4" />
                Add your first module
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Modules ({modules.length})
                </h3>
                <Button variant="outline" size="sm" onClick={addModule}>
                  <PlusIcon className="size-3.5" />
                  Add module
                </Button>
              </div>
              {modules.map((mod) => (
                <button
                  key={mod.id}
                  type="button"
                  onClick={() => {
                    setActiveModuleId(mod.id)
                    setActiveTopicId(mod.topics[0]?.id ?? null)
                  }}
                  className="flex items-center gap-3 rounded-lg border bg-card p-4 text-start transition-colors hover:bg-muted/50"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FolderKanbanIcon className="size-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {mod.title || (
                        <span className="text-muted-foreground italic">
                          Untitled module
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mod.topics.length} topic{mod.topics.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="Pricing">
          <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
            <p className="text-muted-foreground">Pricing — Coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="Publish">
          <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/50">
            <p className="text-muted-foreground">Publish — Coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
