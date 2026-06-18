import {
  pgEnum,
  pgTable,
  primaryKey,
  unique,
  index,
  uuid,
  text,
  timestamp,
  integer,
  numeric,
} from "drizzle-orm/pg-core"
import { user } from "./auth"

// ─── Enums ───────────────────────────────────────────────────────────────────

export const level = pgEnum("level", ["beginner", "intermediate", "advanced"])
export const topicFormat = pgEnum("topic_format", ["text", "video"])
export const courseStatus = pgEnum("course_status", ["draft", "published", "archived"])
export const enrollmentStatus = pgEnum("enrollment_status", ["active", "completed", "cancelled"])

// ─── Category ────────────────────────────────────────────────────────────────

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
})

// ─── Course ──────────────────────────────────────────────────────────────────

export const courses = pgTable(
  "courses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: text("title").notNull(),
    content: text("content"),
    overview: text("overview"),
    thumbnailUrl: text("thumbnail_url"),
    language: text("language").notNull().default("en"),
    level: level("level").notNull(),
    price: numeric("price", { precision: 10, scale: 2, mode: "number" }).notNull().default(0),
    discountedPrice: numeric("discounted_price", { precision: 10, scale: 2, mode: "number" }),
    duration: integer("duration"),
    status: courseStatus("status").notNull().default("draft"),
    tutorId: text("tutor_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    tutorIdIdx: index("courses_tutor_id_idx").on(table.tutorId),
    statusIdx: index("courses_status_idx").on(table.status),
    levelIdx: index("courses_level_idx").on(table.level),
  }),
)

// ─── Course Module ───────────────────────────────────────────────────────────

export const courseModules = pgTable(
  "course_modules",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    courseIdIdx: index("course_modules_course_id_idx").on(table.courseId),
    sortOrderIdx: index("course_modules_sort_order_idx").on(table.sortOrder),
  }),
)

// ─── Course Topic ────────────────────────────────────────────────────────────

export const courseTopics = pgTable(
  "course_topics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => courseModules.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    format: topicFormat("format").notNull(),
    content: text("content"),
    estimatedDuration: integer("estimated_duration"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    moduleIdIdx: index("course_topics_module_id_idx").on(table.moduleId),
    sortOrderIdx: index("course_topics_sort_order_idx").on(table.sortOrder),
  }),
)

// ─── Review ──────────────────────────────────────────────────────────────────

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    body: text("body"),
    rating: integer("rating").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    courseIdIdx: index("reviews_course_id_idx").on(table.courseId),
    studentIdIdx: index("reviews_student_id_idx").on(table.studentId),
    uniqueReview: unique("unique_review").on(table.courseId, table.studentId),
  }),
)

// ─── Enrollment ──────────────────────────────────────────────────────────────

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    studentId: text("student_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    status: enrollmentStatus("status").notNull().default("active"),
    enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
    completedAt: timestamp("completed_at"),
  },
  (table) => ({
    courseIdIdx: index("enrollments_course_id_idx").on(table.courseId),
    studentIdIdx: index("enrollments_student_id_idx").on(table.studentId),
    uniqueEnrollment: unique("unique_enrollment").on(table.courseId, table.studentId),
  }),
)

// ─── Course <-> Category (many-to-many) ──────────────────────────────────────

export const courseCategories = pgTable(
  "course_categories",
  {
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.courseId, table.categoryId] }),
  }),
)

// ─── Topic Completion (progress tracking) ────────────────────────────────────

export const topicCompletions = pgTable(
  "topic_completions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    enrollmentId: uuid("enrollment_id")
      .notNull()
      .references(() => enrollments.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => courseTopics.id, { onDelete: "cascade" }),
    completedAt: timestamp("completed_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueCompletion: unique("unique_completion").on(table.enrollmentId, table.topicId),
    enrollmentIdx: index("topic_completions_enrollment_idx").on(table.enrollmentId),
    topicIdx: index("topic_completions_topic_idx").on(table.topicId),
  }),
)

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type InsertUser = typeof user.$inferInsert
export type SelectUser = typeof user.$inferSelect

export type InsertCategory = typeof categories.$inferInsert
export type SelectCategory = typeof categories.$inferSelect

export type InsertCourse = typeof courses.$inferInsert
export type SelectCourse = typeof courses.$inferSelect

export type InsertCourseModule = typeof courseModules.$inferInsert
export type SelectCourseModule = typeof courseModules.$inferSelect

export type InsertCourseTopic = typeof courseTopics.$inferInsert
export type SelectCourseTopic = typeof courseTopics.$inferSelect

export type InsertReview = typeof reviews.$inferInsert
export type SelectReview = typeof reviews.$inferSelect

export type InsertEnrollment = typeof enrollments.$inferInsert
export type SelectEnrollment = typeof enrollments.$inferSelect

export type InsertCourseCategory = typeof courseCategories.$inferInsert
export type SelectCourseCategory = typeof courseCategories.$inferSelect

export type InsertTopicCompletion = typeof topicCompletions.$inferInsert
export type SelectTopicCompletion = typeof topicCompletions.$inferSelect
