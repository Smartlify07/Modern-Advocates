import { relations } from "drizzle-orm/relations";
import { user, teamMembers, teamInvites, orders, courses, videoProgress, courseVideos, courseModules, reviews, session, account, enrollments, topicCompletions, courseTopics } from "./schema";

export const teamMembersRelations = relations(teamMembers, ({one}) => ({
	user_userId: one(user, {
		fields: [teamMembers.userId],
		references: [user.id],
		relationName: "teamMembers_userId_user_id"
	}),
	user_invitedById: one(user, {
		fields: [teamMembers.invitedById],
		references: [user.id],
		relationName: "teamMembers_invitedById_user_id"
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	teamMembers_userId: many(teamMembers, {
		relationName: "teamMembers_userId_user_id"
	}),
	teamMembers_invitedById: many(teamMembers, {
		relationName: "teamMembers_invitedById_user_id"
	}),
	teamInvites: many(teamInvites),
	orders: many(orders),
	videoProgresses: many(videoProgress),
	reviews: many(reviews),
	courses: many(courses),
	sessions: many(session),
	accounts: many(account),
	enrollments: many(enrollments),
}));

export const teamInvitesRelations = relations(teamInvites, ({one}) => ({
	user: one(user, {
		fields: [teamInvites.invitedById],
		references: [user.id]
	}),
}));

export const ordersRelations = relations(orders, ({one, many}) => ({
	user: one(user, {
		fields: [orders.studentId],
		references: [user.id]
	}),
	course: one(courses, {
		fields: [orders.courseId],
		references: [courses.id]
	}),
	enrollments: many(enrollments),
}));

export const coursesRelations = relations(courses, ({one, many}) => ({
	orders: many(orders),
	courseModules: many(courseModules),
	reviews: many(reviews),
	user: one(user, {
		fields: [courses.tutorId],
		references: [user.id]
	}),
	enrollments: many(enrollments),
	courseVideos: many(courseVideos),
}));

export const videoProgressRelations = relations(videoProgress, ({one}) => ({
	user: one(user, {
		fields: [videoProgress.userId],
		references: [user.id]
	}),
	courseVideo: one(courseVideos, {
		fields: [videoProgress.videoId],
		references: [courseVideos.id]
	}),
}));

export const courseVideosRelations = relations(courseVideos, ({one, many}) => ({
	videoProgresses: many(videoProgress),
	course: one(courses, {
		fields: [courseVideos.courseId],
		references: [courses.id]
	}),
	courseModule: one(courseModules, {
		fields: [courseVideos.moduleId],
		references: [courseModules.id]
	}),
	courseTopic: one(courseTopics, {
		fields: [courseVideos.topicId],
		references: [courseTopics.id]
	}),
}));

export const courseModulesRelations = relations(courseModules, ({one, many}) => ({
	course: one(courses, {
		fields: [courseModules.courseId],
		references: [courses.id]
	}),
	courseTopics: many(courseTopics),
	courseVideos: many(courseVideos),
}));

export const reviewsRelations = relations(reviews, ({one}) => ({
	course: one(courses, {
		fields: [reviews.courseId],
		references: [courses.id]
	}),
	user: one(user, {
		fields: [reviews.studentId],
		references: [user.id]
	}),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const enrollmentsRelations = relations(enrollments, ({one, many}) => ({
	course: one(courses, {
		fields: [enrollments.courseId],
		references: [courses.id]
	}),
	user: one(user, {
		fields: [enrollments.studentId],
		references: [user.id]
	}),
	order: one(orders, {
		fields: [enrollments.orderId],
		references: [orders.id]
	}),
	topicCompletions: many(topicCompletions),
}));

export const topicCompletionsRelations = relations(topicCompletions, ({one}) => ({
	enrollment: one(enrollments, {
		fields: [topicCompletions.enrollmentId],
		references: [enrollments.id]
	}),
	courseTopic: one(courseTopics, {
		fields: [topicCompletions.topicId],
		references: [courseTopics.id]
	}),
}));

export const courseTopicsRelations = relations(courseTopics, ({one, many}) => ({
	topicCompletions: many(topicCompletions),
	courseModule: one(courseModules, {
		fields: [courseTopics.moduleId],
		references: [courseModules.id]
	}),
	courseVideos: many(courseVideos),
}));