import { pgTable, uuid, text, varchar, timestamp } from 'drizzle-orm/pg-core';

export const authors = pgTable('authors', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  bio: text('bio'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(null),
  deletedAt: timestamp('deleted_at', { withTimezone: true }).default(null),
});

export const books = pgTable('books', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  shortSummary: text('short_summary'),
  imagePreview: text('image_preview'),
  authorId: uuid('author_id').references(() => authors.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).default(null),
  deletedAt: timestamp('deleted_at', { withTimezone: true }).default(null),
});
