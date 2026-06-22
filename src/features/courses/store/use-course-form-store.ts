import { create } from "zustand"
import type { Module } from "@/features/courses/types"

let nextModuleId = 1
let nextTopicId = 1

export interface CourseFormStore {
  activeTab: string
  setActiveTab: (tab: string) => void

  title: string
  categoryId: string
  description: string
  categoryName: string
  syncFormValues: (
    values: { title: string; categoryId: string; description?: string },
    categories: { id: string; name: string }[],
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
  thumbnail: File | null
  thumbnailPreview: string | null
  setLevel: (v: string) => void
  setThumbnail: (file: File | null) => void
}

export const useCourseFormStore = create<CourseFormStore>((set) => ({
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
      categoryName: categories.find((c) => c.id === values.categoryId)?.name ?? "",
    }),

  modules: [],
  activeModuleId: null,
  activeTopicId: null,
  addModule: () =>
    set((state) => ({
      modules: [
        ...state.modules,
        { id: `module_${nextModuleId++}`, title: "", topics: [], order: state.modules.length },
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
  thumbnail: null,
  thumbnailPreview: null,
  setLevel: (v) => set({ level: v }),
  setThumbnail: (file) =>
    set((state) => {
      if (state.thumbnailPreview) URL.revokeObjectURL(state.thumbnailPreview)
      return { thumbnail: file, thumbnailPreview: file ? URL.createObjectURL(file) : null }
    }),
}))
