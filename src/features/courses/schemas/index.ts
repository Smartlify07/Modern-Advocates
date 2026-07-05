import { z } from "zod"

const topicSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(255),
  type: z.enum(["text", "video", "video_and_text"]),
  description: z.any().optional(),
  order: z.number().int().min(0),
})

const moduleSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1).max(255),
  order: z.number().int().min(0),
  topics: z.array(topicSchema).optional(),
})

export const createCourseSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  overview: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.number().min(0).default(0),
  discountedPrice: z.number().min(0).optional().nullable(),
  isFree: z.boolean().optional(),
  language: z.string().min(1).max(10).default("en"),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  thumbnailUrl: z.string().url().optional().nullable(),
  modules: z.array(moduleSchema).default([]),
})

export const updateCourseSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  overview: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  price: z.number().min(0).optional(),
  discountedPrice: z.number().min(0).optional().nullable(),
  isFree: z.boolean().optional(),
  language: z.string().min(1).max(10).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  thumbnailUrl: z.string().url().optional().nullable(),
  modules: z.array(moduleSchema).optional(),
})
