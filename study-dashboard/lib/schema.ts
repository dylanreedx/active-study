import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

export const usersTable = sqliteTable("users", {
  id: text("id").primaryKey(), // This will be the phone number
  messages: text("messages"),
  responses: text("responses"),
  studyActive: integer("study_active").default(0),
  verificationCode: text("verification_code"),
  verified: integer("verified").default(0), // New field
})

export type InsertUser = typeof usersTable.$inferInsert
export type SelectUser = typeof usersTable.$inferSelect

