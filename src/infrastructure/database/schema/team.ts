import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { user } from "./auth"

export const teamRole = pgEnum("team_role", ["Admin", "Manager", "Editor"])

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
