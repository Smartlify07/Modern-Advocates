import { pgTable, foreignKey, unique, uuid, text, timestamp, uniqueIndex, index, numeric, integer, boolean, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const courseStatus = pgEnum("course_status", ['draft', 'published', 'archived'])
export const donationType = pgEnum("donation_type", ['fixed', 'tier', 'monthly'])
export const enrollmentStatus = pgEnum("enrollment_status", ['pending', 'active', 'revoked', 'failed'])
export const level = pgEnum("level", ['beginner', 'intermediate', 'advanced'])
export const orderSource = pgEnum("order_source", ['purchase', 'admin', 'scholarship', 'coupon', 'gift'])
export const paymentStatus = pgEnum("payment_status", ['pending', 'paid', 'failed', 'refunded'])
export const teamInviteStatus = pgEnum("team_invite_status", ['pending', 'accepted', 'cancelled', 'declined'])
export const teamRole = pgEnum("team_role", ['Admin', 'Manager', 'Editor'])
export const ticketStatus = pgEnum("ticket_status", ['open', 'pending', 'resolved'])
export const topicFormat = pgEnum("topic_format", ['text', 'video'])


export const teamMembers = pgTable("team_members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	role: teamRole().default('Editor').notNull(),
	invitedById: text("invited_by_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "team_members_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.invitedById],
			foreignColumns: [user.id],
			name: "team_members_invited_by_id_user_id_fk"
		}).onDelete("set null"),
	unique("team_members_user_id_unique").on(table.userId),
]);

export const teamInvites = pgTable("team_invites", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	role: teamRole().default('Editor').notNull(),
	token: text().notNull(),
	invitedById: text("invited_by_id"),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	status: teamInviteStatus().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("pending_invite_email_idx").using("btree", table.email.asc().nullsLast().op("text_ops")).where(sql`(status = 'pending'::team_invite_status)`),
	foreignKey({
			columns: [table.invitedById],
			foreignColumns: [user.id],
			name: "team_invites_invited_by_id_user_id_fk"
		}).onDelete("set null"),
	unique("team_invites_token_unique").on(table.token),
]);

export const donations = pgTable("donations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	donorName: text("donor_name").notNull(),
	donorEmail: text("donor_email").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	donationType: donationType("donation_type").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	currency: text().default('USD').notNull(),
	stripeCheckoutSessionId: text("stripe_checkout_session_id"),
	paymentStatus: paymentStatus("payment_status").default('pending').notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("donations_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
]);

export const orders = pgTable("orders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	studentId: text("student_id").notNull(),
	courseId: uuid("course_id").notNull(),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: text().default('USD').notNull(),
	paymentProvider: text("payment_provider"),
	paymentReference: text("payment_reference"),
	paymentStatus: paymentStatus("payment_status").default('pending').notNull(),
	source: orderSource().default('purchase').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	stripePaymentIntentId: text("stripe_payment_intent_id"),
}, (table) => [
	index("orders_course_id_idx").using("btree", table.courseId.asc().nullsLast().op("uuid_ops")),
	index("orders_student_id_idx").using("btree", table.studentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [user.id],
			name: "orders_student_id_user_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "orders_course_id_courses_id_fk"
		}).onDelete("restrict"),
	unique("unique_order").on(table.studentId, table.courseId),
]);

export const contacts = pgTable("contacts", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	phone: text(),
	message: text().notNull(),
	status: ticketStatus().default('open').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("contacts_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamp_ops")),
	index("contacts_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
]);

export const videoProgress = pgTable("video_progress", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: text("user_id").notNull(),
	videoId: uuid("video_id").notNull(),
	watchedSeconds: integer("watched_seconds").default(0).notNull(),
	completed: boolean().default(false).notNull(),
	lastWatchedAt: timestamp("last_watched_at", { mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("video_progress_video_id_idx").using("btree", table.videoId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "video_progress_user_id_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.videoId],
			foreignColumns: [courseVideos.id],
			name: "video_progress_video_id_course_videos_id_fk"
		}).onDelete("cascade"),
	unique("video_progress_user_video_idx").on(table.userId, table.videoId),
]);

export const courseModules = pgTable("course_modules", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	courseId: uuid("course_id").notNull(),
	title: text().notNull(),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("course_modules_course_id_idx").using("btree", table.courseId.asc().nullsLast().op("uuid_ops")),
	index("course_modules_sort_order_idx").using("btree", table.sortOrder.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "course_modules_course_id_courses_id_fk"
		}).onDelete("cascade"),
]);

export const reviews = pgTable("reviews", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	courseId: uuid("course_id").notNull(),
	studentId: text("student_id").notNull(),
	body: text(),
	rating: integer().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("reviews_course_id_idx").using("btree", table.courseId.asc().nullsLast().op("uuid_ops")),
	index("reviews_student_id_idx").using("btree", table.studentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "reviews_course_id_courses_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [user.id],
			name: "reviews_student_id_user_id_fk"
		}).onDelete("restrict"),
	unique("unique_review").on(table.courseId, table.studentId),
]);

export const courses = pgTable("courses", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	title: text(),
	content: text(),
	overview: text(),
	thumbnailUrl: text("thumbnail_url"),
	language: text().default('en').notNull(),
	level: level(),
	price: numeric({ precision: 10, scale:  2 }).default('0').notNull(),
	discountedPrice: numeric("discounted_price", { precision: 10, scale:  2 }),
	duration: integer(),
	status: courseStatus().default('draft').notNull(),
	tutorId: text("tutor_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	isFree: boolean("is_free").default(false).notNull(),
	durationUnit: text("duration_unit").default('Hours'),
	instructorName: text("instructor_name"),
	instructorSpecialty: text("instructor_specialty"),
	aboutInstructor: text("about_instructor"),
	instructorImage: text("instructor_image"),
}, (table) => [
	index("courses_level_idx").using("btree", table.level.asc().nullsLast().op("enum_ops")),
	index("courses_status_idx").using("btree", table.status.asc().nullsLast().op("enum_ops")),
	index("courses_tutor_id_idx").using("btree", table.tutorId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.tutorId],
			foreignColumns: [user.id],
			name: "courses_tutor_id_user_id_fk"
		}).onDelete("restrict"),
]);

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text(),
	role: text().default('user').notNull(),
	banned: boolean().default(false).notNull(),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),
	userId: text("user_id").notNull(),
}, (table) => [
	index("session_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_user_id_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	userId: text("user_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	idToken: text("id_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", { mode: 'string' }),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).notNull(),
}, (table) => [
	index("account_userId_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	slug: text().notNull(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("categories_name_unique").on(table.name),
	unique("categories_slug_unique").on(table.slug),
]);

export const enrollments = pgTable("enrollments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	courseId: uuid("course_id").notNull(),
	studentId: text("student_id").notNull(),
	status: enrollmentStatus().default('pending').notNull(),
	enrolledAt: timestamp("enrolled_at", { mode: 'string' }).defaultNow().notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }),
	orderId: uuid("order_id"),
	expiresAt: timestamp("expires_at", { mode: 'string' }),
	progress: integer().default(0).notNull(),
}, (table) => [
	index("enrollments_course_id_idx").using("btree", table.courseId.asc().nullsLast().op("uuid_ops")),
	index("enrollments_student_id_idx").using("btree", table.studentId.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "enrollments_course_id_courses_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.studentId],
			foreignColumns: [user.id],
			name: "enrollments_student_id_user_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.id],
			name: "enrollments_order_id_orders_id_fk"
		}).onDelete("set null"),
	unique("unique_enrollment").on(table.courseId, table.studentId),
]);

export const topicCompletions = pgTable("topic_completions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	enrollmentId: uuid("enrollment_id").notNull(),
	topicId: uuid("topic_id").notNull(),
	completedAt: timestamp("completed_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("topic_completions_enrollment_idx").using("btree", table.enrollmentId.asc().nullsLast().op("uuid_ops")),
	index("topic_completions_topic_idx").using("btree", table.topicId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.enrollmentId],
			foreignColumns: [enrollments.id],
			name: "topic_completions_enrollment_id_enrollments_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.topicId],
			foreignColumns: [courseTopics.id],
			name: "topic_completions_topic_id_course_topics_id_fk"
		}).onDelete("cascade"),
	unique("unique_completion").on(table.enrollmentId, table.topicId),
]);

export const courseTopics = pgTable("course_topics", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	moduleId: uuid("module_id").notNull(),
	title: text().notNull(),
	format: topicFormat().notNull(),
	content: text(),
	estimatedDuration: integer("estimated_duration"),
	sortOrder: integer("sort_order").default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("course_topics_module_id_idx").using("btree", table.moduleId.asc().nullsLast().op("uuid_ops")),
	index("course_topics_sort_order_idx").using("btree", table.sortOrder.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.moduleId],
			foreignColumns: [courseModules.id],
			name: "course_topics_module_id_course_modules_id_fk"
		}).onDelete("cascade"),
]);

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("verification_identifier_idx").using("btree", table.identifier.asc().nullsLast().op("text_ops")),
]);

export const courseVideos = pgTable("course_videos", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	courseId: uuid("course_id").notNull(),
	moduleId: uuid("module_id").notNull(),
	topicId: uuid("topic_id").notNull(),
	title: text().notNull(),
	description: text(),
	storageKey: text("storage_key"),
	playbackUrl: text("playback_url"),
	thumbnailUrl: text("thumbnail_url"),
	duration: integer(),
	status: text().default('uploading').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("course_videos_course_id_idx").using("btree", table.courseId.asc().nullsLast().op("uuid_ops")),
	index("course_videos_module_id_idx").using("btree", table.moduleId.asc().nullsLast().op("uuid_ops")),
	index("course_videos_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("course_videos_topic_id_idx").using("btree", table.topicId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.courseId],
			foreignColumns: [courses.id],
			name: "course_videos_course_id_courses_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.moduleId],
			foreignColumns: [courseModules.id],
			name: "course_videos_module_id_course_modules_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.topicId],
			foreignColumns: [courseTopics.id],
			name: "course_videos_topic_id_course_topics_id_fk"
		}).onDelete("cascade"),
	unique("course_videos_topic_id_unique").on(table.topicId),
]);
