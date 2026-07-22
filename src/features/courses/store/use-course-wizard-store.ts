"use client"

import { create } from "zustand"
import type { JSONContent } from "@tiptap/react"

export interface Lecture {
  id: string
  title: string
  mediaType: "none" | "video" | "lecture_notes"
  mediaName: string | null
  mediaUrl: string | null
  videoFile: File | null
  notesContent: string
}

export interface Section {
  id: string
  title: string
  order: number
  lectures: Lecture[]
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

  sections: Section[]

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

  addSection: () => void
  updateSection: (id: string, title: string) => void
  removeSection: (id: string) => void

  addLecture: (sectionId: string) => void
  updateLecture: (sectionId: string, lectureId: string, updates: Partial<Lecture>) => void
  removeLecture: (sectionId: string, lectureId: string) => void

  setCourseId: (id: string | null) => void
  setSaving: (v: boolean) => void
  setPublishing: (v: boolean) => void
  setPublishError: (v: string | null) => void
  setCompletedSteps: (steps: number[]) => void
  resetForm: () => void
  initialize: (course: any) => void
}

const LANG_CODE_TO_LABEL: Record<string, string> = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  zh: "Chinese",
  ja: "Japanese",
  ar: "Arabic",
  pt: "Portuguese",
}

let nextSectionId = 1
let nextLectureId = 1

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

  sections: [],

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

  addSection: () =>
    set((state) => ({
      sections: [
        ...state.sections,
        {
          id: `section_${nextSectionId++}`,
          title: "",
          order: state.sections.reduce((max, s) => Math.max(max, s.order), -1) + 1,
          lectures: [],
        },
      ],
    })),
  updateSection: (id, title) =>
    set((state) => ({
      sections: state.sections.map((s) => (s.id === id ? { ...s, title } : s)),
    })),
  removeSection: (id) =>
    set((state) => ({
      sections: state.sections.filter((s) => s.id !== id),
    })),

  addLecture: (sectionId) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: [
                ...s.lectures,
                {
                  id: `lecture_${nextLectureId++}`,
                  title: "",
                  mediaType: "none" as const,
                  mediaName: null,
                  mediaUrl: null,
                  videoFile: null,
                  notesContent: "",
                },
              ],
            }
          : s
      ),
    })),
  updateLecture: (sectionId, lectureId, updates) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: s.lectures.map((l) =>
                l.id === lectureId ? { ...l, ...updates } : l
              ),
            }
          : s
      ),
    })),
  removeLecture: (sectionId, lectureId) =>
    set((state) => ({
      sections: state.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lectures: s.lectures.filter((l) => l.id !== lectureId),
            }
          : s
      ),
    })),

  setCourseId: (id) => set({ courseId: id }),
  setSaving: (v) => set({ isSaving: v }),
  setPublishing: (v) => set({ isPublishing: v }),
  setPublishError: (v) => set({ publishError: v }),
  setCompletedSteps: (steps) => set({ completedSteps: steps }),

  initialize: (course) => {
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
      overview: typeof course.overview === "string" ? (() => { try { return JSON.parse(course.overview) } catch { return null } })() : course.overview,
      language: LANG_CODE_TO_LABEL[course.language] ?? course.language ?? "English",
      level: course.level ?? "",
      duration: course.duration != null ? String(course.duration) : "",
      durationUnit: "Days",
      instructorName: course.instructorName ?? "",
      instructorSpecialty: course.instructorSpecialty ?? "",
      aboutInstructor: course.aboutInstructor ?? "",
      sections: (course.modules ?? []).map((mod: any, mi: number) => ({
        id: mod.id,
        title: mod.title ?? "",
        order: mod.order ?? mi,
        lectures: (mod.topics ?? []).map((topic: any) => ({
          id: topic.id,
          title: topic.title ?? "",
          mediaType: topic.videoId ? "video" : topic.description ? "lecture_notes" : "none",
          mediaName: topic.videoName ?? null,
          mediaUrl: topic.videoId ?? null,
          videoFile: null,
          notesContent: topic.description ?? "",
        })),
      })),
    })
  },

  resetForm: () => {
    const { thumbnailPreview } = get()
    if (thumbnailPreview && !thumbnailPreview.startsWith("http")) {
      URL.revokeObjectURL(thumbnailPreview)
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
      durationUnit: "Days",
      instructorName: "",
      instructorSpecialty: "",
      aboutInstructor: "",
      sections: [],
      courseId: null,
      isSaving: false,
      isPublishing: false,
      publishError: null,
    })
  },
}))
