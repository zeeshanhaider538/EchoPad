import { pgTable, serial, text, varchar, timestamp,integer } from "drizzle-orm/pg-core";

// Notes table
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").notNull(), // NEW: foreign key to users
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),

  created_at: timestamp("created_at").defaultNow().notNull(),
  // `updated_at` starts as NULL, updated manually
  updated_at: timestamp("updated_at"),
});
