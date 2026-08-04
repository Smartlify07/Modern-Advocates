"use client"

import { create } from "zustand"
import type { JSONContent } from "@tiptap/react"
import { minutesToDuration } from "@/features/courses/lib/duration"
import type { TopicType } from "@/features/courses/types"
import type { CourseApiResponse } from "@/features/courses/dto"

export interface Topic {
  id: string
  title: string
  type: TopicType
  videoId: string | null
  videoTitle: string | null
  description: string
  order: number
  videoFile: File | null
}

export interface Module {
  id: string
  title: string
  order: number
  topics: Topic[]
}

export interface CourseWizardStore {
  currentStep: number
  completedSteps: number[]

  title: string
  thumbnail: File | null
  thumbnailPreview: string | null
  originalPrice: string
  salePrice: string
  showStrikedOriginal: boolean

  overview: JSONContent | null
  language: string
  level: string
  duration: string
  durationUnit: string
  instructorName: string
  instructorSpecialty: string
  aboutInstructor: string
  instructorPhoto: File | null
  instructorPhotoPreview: string | null

  modules: Module[]

  courseId: string | null
  isSaving: boolean
  isPublishing: boolean
  publishError: string | null

  setCurrentStep: (step: number) => void
  setTitle: (v: string) => void
  setThumbnail: (file: File | null) => void
  setOriginalPrice: (v: string) => void
  setSalePrice: (v: string) => void
  setShowStrikedOriginal: (v: boolean) => void
  setOverview: (v: JSONContent | null) => void
  setLanguage: (v: string) => void
  setLevel: (v: string) => void
  setDuration: (v: string) => void
  setDurationUnit: (v: string) => void
  setInstructorName: (v: string) => void
  setInstructorSpecialty: (v: string) => void
  setAboutInstructor: (v: string) => void
  setInstructorPhoto: (file: File | null) => void

  addModule: () => void
  updateModule: (id: string, title: string) => void
  removeModule: (id: string) => void

  addTopic: (moduleId: string) => void
  updateTopic: (moduleId: string, topicId: string, updates: Partial<Topic>) => void
  removeTopic: (moduleId: string, topicId: string) => void

  setCourseId: (id: string | null) => void
  setSaving: (v: boolean) => void
  setPublishing: (v: boolean) => void
  setPublishError: (v: string | null) => void
  setCompletedSteps: (steps: number[]) => void
  resetForm: () => void
  initialize: (course: CourseApiResponse) => void
}

let nextModuleId = 1
let nextTopicId = 1

export const useCourseWizardStore = create<CourseWizardStore>((set, get) => ({
  currentStep: 0,
  completedSteps: [],

  title: "",
  thumbnail: null,
  thumbnailPreview: null,
  originalPrice: "",
  salePrice: "",
  showStrikedOriginal: true,

  overview: null,
  language: "English",
  level: "",
  duration: "",
  durationUnit: "Days",
  instructorName: "",
  instructorSpecialty: "",
  aboutInstructor: "",
  instructorPhoto: null,
  instructorPhotoPreview: null,

  modules: [],

  courseId: null,
  isSaving: false,
  isPublishing: false,
  publishError: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  setTitle: (v) => set({ title: v }),
  setThumbnail: (file) =>
    set((state) => {
      if (state.thumbnailPreview && !state.thumbnailPreview.startsWith("http")) {
        URL.revokeObjectURL(state.thumbnailPreview)
      }
      return {
        thumbnail: file,
        thumbnailPreview: file ? URL.createObjectURL(file) : null,
      }
    }),
  setOriginalPrice: (v) => set({ originalPrice: v }),
  setSalePrice: (v) => set({ salePrice: v }),
  setShowStrikedOriginal: (v) => set({ showStrikedOriginal: v }),
  setOverview: (v) => set({ overview: v }),
  setLanguage: (v) => set({ language: v }),
  setLevel: (v) => set({ level: v }),
  setDuration: (v) => set({ duration: v }),
  setDurationUnit: (v) => set({ durationUnit: v }),
  setInstructorName: (v) => set({ instructorName: v }),
  setInstructorSpecialty: (v) => set({ instructorSpecialty: v }),
  setAboutInstructor: (v) => set({ aboutInstructor: v }),
  setInstructorPhoto: (file) =>
    set((state) => {
      if (state.instructorPhotoPreview && !state.instructorPhotoPreview.startsWith("http")) {
        URL.revokeObjectURL(state.instructorPhotoPreview)
      }
      return {
        instructorPhoto: file,
        instructorPhotoPreview: file ? URL.createObjectURL(file) : null,
      }
    }),

  addModule: () =>
    set((state) => ({
      modules: [
        ...state.modules,
        {
          id: `module_${nextModuleId++}`,
          title: "",
          order: state.modules.reduce((max, s) => Math.max(max, s.order), -1) + 1,
          topics: [],
        },
      ],
    })),
  updateModule: (id, title) =>
    set((state) => ({
      modules: state.modules.map((m) => (m.id === id ? { ...m, title } : m)),
    })),
  removeModule: (id) =>
    set((state) => ({
      modules: state.modules.filter((m) => m.id !== id),
    })),

  addTopic: (moduleId) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              topics: [
                ...m.topics,
                {
                  id: `topic_${nextTopicId++}`,
                  title: "",
                  type: "text" as const,
                  videoId: null,
                  videoTitle: null,
                  description: "",
                  order: m.topics.length,
                  videoFile: null,
                },
              ],
            }
          : m
      ),
    })),
  updateTopic: (moduleId, topicId, updates) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              topics: m.topics.map((t) =>
                t.id === topicId ? { ...t, ...updates } : t
              ),
            }
          : m
      ),
    })),
  removeTopic: (moduleId, topicId) =>
    set((state) => ({
      modules: state.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              topics: m.topics.filter((t) => t.id !== topicId),
            }
          : m
      ),
    })),

  setCourseId: (id) => set({ courseId: id }),
  setSaving: (v) => set({ isSaving: v }),
  setPublishing: (v) => set({ isPublishing: v }),
  setPublishError: (v) => set({ publishError: v }),
  setCompletedSteps: (steps) => set({ completedSteps: steps }),

  initialize: (course) => {
    const languageMap: Record<string, string> = {
      en: "English", es: "Spanish", fr: "French", de: "German",
      zh: "Chinese", ja: "Japanese", ar: "Arabic", pt: "Portuguese",
    }
    set({
      currentStep: 0,
      completedSteps: [],
      thumbnail: null,
      courseId: course.id,
      title: course.title ?? "",
      thumbnailPreview: course.thumbnailUrl ?? null,
      originalPrice: String(course.price ?? ""),
      salePrice: course.discountedPrice ? String(course.discountedPrice) : "",
      showStrikedOriginal: !!course.discountedPrice,
      overview: course.overview
        ? (() => {
            if (typeof course.overview === "string") {
              try { return JSON.parse(course.overview) } catch {
                return { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: course.overview }] }] } as JSONContent
              }
            }
            return course.overview
          })()
        : null,
      language: languageMap[course.language] ?? course.language ?? "English",
      level: course.level ?? "",
      duration: course.duration ? String(minutesToDuration(course.duration, (course.durationUnit ?? "Hours") as "Minutes" | "Hours" | "Days" | "Weeks").value) : "",
      durationUnit: course.durationUnit ?? "Hours",
      instructorName: course.instructorName ?? "",
      instructorSpecialty: course.instructorSpecialty ?? "",
      aboutInstructor: course.aboutInstructor ?? "",
      instructorPhoto: null,
      instructorPhotoPreview: course.instructorImage ?? null,
      modules: (course.modules ?? []).map((mod) => ({
        id: mod.id,
        title: mod.title ?? "",
        order: mod.order,
        topics: (mod.topics ?? []).map((topic) => ({
          id: topic.id,
          title: topic.title ?? "",
          type: topic.type === "video" || topic.type === "video_and_text" ? "video" : "text",
          videoId: topic.videoId ?? null,
          videoTitle: topic.videoTitle ?? null,
          description: typeof topic.description === "string" ? topic.description : "",
          order: topic.order,
          videoFile: null,
        })),
      })),
    })
  },

  resetForm: () => {
    const { thumbnailPreview, instructorPhotoPreview } = get()
    if (thumbnailPreview && !thumbnailPreview.startsWith("http")) {
      URL.revokeObjectURL(thumbnailPreview)
    }
    if (instructorPhotoPreview && !instructorPhotoPreview.startsWith("http")) {
      URL.revokeObjectURL(instructorPhotoPreview)
    }
    set({
      currentStep: 0,
      completedSteps: [],
      title: "",
      thumbnail: null,
      thumbnailPreview: null,
      originalPrice: "",
      salePrice: "",
      showStrikedOriginal: true,
      overview: null,
      language: "English",
      level: "",
      duration: "",
      durationUnit: "Hours",
      instructorName: "",
      instructorSpecialty: "",
      aboutInstructor: "",
      instructorPhoto: null,
      instructorPhotoPreview: null,
      modules: [],
      courseId: null,
      isSaving: false,
      isPublishing: false,
      publishError: null,
    })
  },
}))
