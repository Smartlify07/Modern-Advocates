import { create } from "zustand"
import type { Module, Topic } from "@/features/courses/types"

let nextModuleId = 1

export interface CourseFormStore {
  activeTab: string
  setActiveTab: (tab: string) => void

  title: string
  categoryId: string
  description: string
  categoryName: string
  syncFormValues: (
    values: { title: string; categoryId: string; description?: string },
    categories: { id: string; name: string }[]
  ) => void

  modules: Module[]
  activeModuleId: string | null
  activeTopicId: string | null
  addModule: () => void
  updateModule: (id: string, updated: Module) => void
  selectModule: (id: string | null) => void
  setActiveTopicId: (id: string | null) => void

  price: string
  discount: number
  isFree: boolean
  saleStart: Date | undefined
  saleEnd: Date | undefined
  setPrice: (v: string) => void
  setDiscount: (v: number) => void
  setIsFree: (v: boolean) => void
  setSaleStart: (v: Date | undefined) => void
  setSaleEnd: (v: Date | undefined) => void

  level: string
  duration: string
  durationUnit: string
  thumbnail: File | null
  thumbnailPreview: string | null
  setLevel: (v: string) => void
  setDuration: (v: string) => void
  setDurationUnit: (v: string) => void
  setThumbnail: (file: File | null) => void

  courseId: string | null
  isPublishing: boolean
  publishError: string | null
  isSaving: boolean
  setCourseId: (id: string | null) => void
  setPublishing: (v: boolean) => void
  setPublishError: (v: string | null) => void
  saveAsDraft: () => Promise<{
    courseId: string
    moduleId: string
    topicId: string
  } | null>
  loadFromCourse: (course: {
    id: string
    title: string
    description: string | null
    categoryId: string
    level: string
    duration?: number | null
    durationUnit?: string | null
    price: number
    discountedPrice: number | null
    thumbnailUrl: string | null
    modules: {
      id: string
      title: string
      order: number
      topics: {
        id: string
        title: string
        type: string
        description: unknown
        order: number
        videoId: string | null
      }[]
    }[]
  }) => void
  resetForm: () => void
}

export const useCourseFormStore = create<CourseFormStore>((set, get) => ({
  activeTab: "Basic Info",
  setActiveTab: (tab) => set({ activeTab: tab }),

  title: "",
  categoryId: "",
  description: "",
  categoryName: "",
  syncFormValues: (values, categories) =>
    set({
      title: values.title,
      categoryId: values.categoryId,
      description: values.description ?? "",
      categoryName: "",
    }),

  modules: [],
  activeModuleId: null,
  activeTopicId: null,
  addModule: () =>
    set((state) => ({
      modules: [
        ...state.modules,
        {
          id: `module_${nextModuleId++}`,
          title: "",
          topics: [],
          order: state.modules.length,
        },
      ],
    })),
  updateModule: (id, updated) =>
    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? updated : m)),
    })),
  selectModule: (id) => set({ activeModuleId: id, activeTopicId: null }),
  setActiveTopicId: (id) => set({ activeTopicId: id }),

  price: "",
  discount: 0,
  isFree: false,
  saleStart: undefined,
  saleEnd: undefined,
  setPrice: (v) => set({ price: v }),
  setDiscount: (v) => set({ discount: v }),
  setIsFree: (v) => set({ isFree: v }),
  setSaleStart: (v) => set({ saleStart: v }),
  setSaleEnd: (v) => set({ saleEnd: v }),

  level: "",
  duration: "",
  durationUnit: "Hours",
  thumbnail: null,
  thumbnailPreview: null,
  setLevel: (v) => set({ level: v }),
  setDuration: (v) => set({ duration: v }),
  setDurationUnit: (v) => set({ durationUnit: v }),
  setThumbnail: (file) =>
    set((state) => {
      if (state.thumbnailPreview) URL.revokeObjectURL(state.thumbnailPreview)
      return {
        thumbnail: file,
        thumbnailPreview: file ? URL.createObjectURL(file) : null,
      }
    }),

  courseId: null,
  isPublishing: false,
  publishError: null,
  isSaving: false,
  setCourseId: (id) => set({ courseId: id }),
  setPublishing: (v) => set({ isPublishing: v }),
  setPublishError: (v) => set({ publishError: v }),

  saveAsDraft: async (): Promise<{
    courseId: string
    moduleId: string
    topicId: string
  } | null> => {
    const state = get()
    if (state.courseId) {
      const firstModule = state.modules[0]
      return {
        courseId: state.courseId,
        moduleId: firstModule?.id ?? "",
        topicId: firstModule?.topics[0]?.id ?? "",
      }
    }

    set({ isSaving: true })
    try {
      const body: Record<string, unknown> = {
        title: state.title || "Untitled Course",
        description: state.description,
        level: state.level || "beginner",
        duration: state.duration ? Number(state.duration) : null,
        durationUnit: state.durationUnit || "Hours",
        price: parseFloat(state.price) || 0,
        discountedPrice: state.isFree
          ? null
          : state.discount > 0
            ? (parseFloat(state.price) || 0) * (1 - state.discount / 100)
            : null,
        isFree: state.isFree,
        status: "draft",
        modules: state.modules.map((mod, mi) => ({
          id: mod.id,
          title: mod.title || "Untitled Module",
          order: mod.order || mi,
          topics: mod.topics.map((topic, ti) => ({
            id: topic.id,
            title: topic.title || "Untitled Topic",
            type: topic.type,
            description: topic.description,
            order: topic.order || ti,
          })),
        })),
      }

      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Failed to save course")
      }

      const course: {
        id: string
        modules: Array<{
          id: string
          clientId: string
          topics: Array<{ id: string; clientId: string }>
        }>
      } = await res.json()

      const idMap = new Map<string, string>()
      const moduleIdMap = new Map<string, string>()

      for (const mod of course.modules) {
        moduleIdMap.set(mod.clientId, mod.id)
        for (const topic of mod.topics) {
          idMap.set(topic.clientId, topic.id)
        }
      }

      const updateId = (id: string) => idMap.get(id) ?? id
      const updateModuleId = (id: string) => moduleIdMap.get(id) ?? id

      set((current) => ({
        courseId: course.id,
        modules: current.modules.map((mod) => ({
          ...mod,
          id: updateModuleId(mod.id),
          topics: mod.topics.map((topic) => ({
            ...topic,
            id: updateId(topic.id),
          })),
        })),
        activeModuleId: current.activeModuleId
          ? updateModuleId(current.activeModuleId)
          : null,
        activeTopicId: current.activeTopicId
          ? updateId(current.activeTopicId)
          : null,
        isSaving: false,
      }))

      const updated = get()
      const firstModule = updated.modules[0]
      return {
        courseId: updated.courseId!,
        moduleId: firstModule?.id ?? "",
        topicId: firstModule?.topics[0]?.id ?? "",
      }
    } catch (error) {
      set({ isSaving: false })
      console.error("Auto-save failed:", error)
      return null
    }
  },

  loadFromCourse: (course) =>
    set({
      courseId: course.id,
      activeTab: "Basic Info",
      title: course.title,
      description: course.description ?? "",
      categoryId: course.categoryId,
      level: course.level,
      duration: String(course.duration ?? ""),
      durationUnit: course.durationUnit ?? "Hours",
      price: String(course.price),
      discount: course.discountedPrice
        ? Math.round((1 - course.discountedPrice / course.price) * 100)
        : 0,
      isFree: course.price === 0 && !course.discountedPrice,
      thumbnailPreview: course.thumbnailUrl,
      modules: course.modules.map((mod) => ({
        id: mod.id,
        title: mod.title,
        order: mod.order,
        topics: mod.topics.map((topic) => ({
          id: topic.id,
          title: topic.title,
          type: topic.type as "video" | "text" | "video_and_text",
          videoUrl: topic.videoId ?? null,
          videoId: topic.videoId ?? null,
          description: topic.description as Topic["description"],
          order: topic.order,
        })),
      })),
      activeModuleId: course.modules[0]?.id ?? null,
      activeTopicId: course.modules[0]?.topics[0]?.id ?? null,
    }),

  resetForm: () =>
    set({
      activeTab: "Basic Info",
      title: "",
      categoryId: "",
      description: "",
      categoryName: "",
      modules: [],
      activeModuleId: null,
      activeTopicId: null,
      price: "",
      discount: 0,
      isFree: false,
      saleStart: undefined,
      saleEnd: undefined,
      level: "",
      duration: "",
      durationUnit: "Hours",
      thumbnail: null,
      thumbnailPreview: null,
      courseId: null,
      isPublishing: false,
      publishError: null,
      isSaving: false,
    }),
}))
