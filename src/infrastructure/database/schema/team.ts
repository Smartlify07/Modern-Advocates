import { relations, sql } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const teamRole = pgEnum("team_role", ["Admin", "Manager", "Editor"])

export const teamInviteStatus = pgEnum("team_invite_status", [
  "pending",
  "accepted",
  "cancelled",
  "declined",
])

export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  role: teamRole("role").notNull().default("Editor"),
  invitedById: text("invited_by_id").references(() => user.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const teamInvites = pgTable(
  "team_invites",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    role: teamRole("role").notNull().default("Editor"),
    token: text("token").notNull().unique(),
    invitedById: text("invited_by_id").references(() => user.id, { onDelete: "set null" }),
    expiresAt: timestamp("expires_at"),
    status: teamInviteStatus("status").notNull().default("pending"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    uniqueIndex("pending_invite_email_idx").on(table.email).where(
      // @ts-ignore - drizzle type limitation for partial indexes
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sql`status = 'pending'`,
    ),
  ],
)

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(user, {
    fields: [teamMembers.userId],
    references: [user.id],
  }),
  invitedBy: one(user, {
    fields: [teamMembers.invitedById],
    references: [user.id],
  }),
}))

export const teamInvitesRelations = relations(teamInvites, ({ one }) => ({
  invitedBy: one(user, {
    fields: [teamInvites.invitedById],
    references: [user.id],
  }),
}))
