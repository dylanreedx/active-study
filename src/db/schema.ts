import {sqliteTable, text, integer} from 'drizzle-orm/sqlite-core';

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  messages: text('messages'),
  responses: text('responses'),
  onboarding: integer('onboarding'),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
