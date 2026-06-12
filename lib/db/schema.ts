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

// ─── Enums ───────────────────────────────────────────────────────────────────

export const level = pgEnum("level", ["beginner", "intermediate", "advanced"])
export const topicFormat = pgEnum("topic_format", ["text", "video"])
export const profileType = pgEnum("profile_type", ["student", "tutor", "admin"])
export const courseStatus = pgEnum("course_status", ["draft", "published", "archived"])
export const enrollmentStatus = pgEnum("enrollment_status", ["active", "completed", "cancelled"])

// ─── Users (auth) ────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

// ─── Profile ─────────────────────────────────────────────────────────────────

export const profiles = pgTable(
  "profiles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "restrict" }),
    type: profileType("type").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    typeIdx: index("profiles_type_idx").on(table.type),
  }),
)

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
    tutorId: uuid("tutor_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
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
    studentId: uuid("student_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
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
    studentId: uuid("student_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "restrict" }),
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

// ─── Inferred Types ──────────────────────────────────────────────────────────

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect

export type InsertProfile = typeof profiles.$inferInsert
export type SelectProfile = typeof profiles.$inferSelect

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
