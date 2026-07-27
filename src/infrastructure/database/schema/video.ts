import { relations } from "drizzle-orm"
import {
  pgTable,
  uuid,
  text,
  integer,
  boolean,
  timestamp,
  index,
  unique,
} from "drizzle-orm/pg-core"
import { user } from "./auth"
import { courses, courseModules, courseTopics } from "./course"

export const courseVideos = pgTable(
  "course_videos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => courseModules.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .unique()
      .references(() => courseTopics.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    storageKey: text("storage_key"),
    playbackUrl: text("playback_url"),
    thumbnailUrl: text("thumbnail_url"),
    duration: integer("duration"),
    status: text("status").notNull().default("uploading"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    courseIdIdx: index("course_videos_course_id_idx").on(table.courseId),
    moduleIdIdx: index("course_videos_module_id_idx").on(table.moduleId),
    topicIdIdx: index("course_videos_topic_id_idx").on(table.topicId),
    statusIdx: index("course_videos_status_idx").on(table.status),
  }),
)

export const videoProgress = pgTable(
  "video_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    videoId: uuid("video_id")
      .notNull()
      .references(() => courseVideos.id, { onDelete: "cascade" }),
    watchedSeconds: integer("watched_seconds").notNull().default(0),
    completed: boolean("completed").notNull().default(false),
    lastWatchedAt: timestamp("last_watched_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    userIdVideoIdIdx: unique("video_progress_user_video_idx").on(
      table.userId,
      table.videoId,
    ),
    videoIdIdx: index("video_progress_video_id_idx").on(table.videoId),
  }),
)

export const courseVideosRelations = relations(courseVideos, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseVideos.courseId],
    references: [courses.id],
  }),
  module: one(courseModules, {
    fields: [courseVideos.moduleId],
    references: [courseModules.id],
  }),
  topic: one(courseTopics, {
    fields: [courseVideos.topicId],
    references: [courseTopics.id],
  }),
  progress: many(videoProgress),
}))

export const videoProgressRelations = relations(videoProgress, ({ one }) => ({
  user: one(user, {
    fields: [videoProgress.userId],
    references: [user.id],
  }),
  video: one(courseVideos, {
    fields: [videoProgress.videoId],
    references: [courseVideos.id],
  }),
}))

export type InsertCourseVideo = typeof courseVideos.$inferInsert
export type SelectCourseVideo = typeof courseVideos.$inferSelect
export type InsertVideoProgress = typeof videoProgress.$inferInsert
export type SelectVideoProgress = typeof videoProgress.$inferSelect
