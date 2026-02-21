import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  phone: text('phone').unique().notNull(),
  name: text('name'),
  email: text('email'),
  timezone: text('timezone').default('America/Los_Angeles'),
  reminderDaysDefault: integer('reminder_days_default').default(3),
  onboardedAt: integer('onboarded_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const contacts = sqliteTable('contacts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  birthday: text('birthday'), // MM-DD
  birthYear: integer('birth_year'),
  relationship: text('relationship'),
  phone: text('phone'),
  email: text('email'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const interests = sqliteTable('interests', {
  id: text('id').primaryKey(),
  contactId: text('contact_id').notNull().references(() => contacts.id),
  category: text('category').notNull(),
  specifics: text('specifics').notNull(),
  source: text('source').default('user_stated'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const occasions = sqliteTable('occasions', {
  id: text('id').primaryKey(),
  contactId: text('contact_id').notNull().references(() => contacts.id),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(), // birthday, anniversary, custom
  date: text('date').notNull(), // MM-DD
  year: integer('year'),
  label: text('label'),
  reminderDaysBefore: integer('reminder_days_before').default(3),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const reminders = sqliteTable('reminders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  contactId: text('contact_id').notNull().references(() => contacts.id),
  occasionId: text('occasion_id').notNull().references(() => occasions.id),
  remindAt: text('remind_at').notNull(), // YYYY-MM-DD
  sent: integer('sent').default(0),
  sentAt: integer('sent_at', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  role: text('role').notNull(),
  content: text('content').notNull(),
  channel: text('channel').default('sms'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

export const giftHistory = sqliteTable('gift_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  contactId: text('contact_id').notNull().references(() => contacts.id),
  occasionId: text('occasion_id').references(() => occasions.id),
  description: text('description').notNull(),
  amount: real('amount'),
  dateGiven: text('date_given').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

// ============================================
// Gift Catalog (curated product database)
// ============================================

export const giftCatalog = sqliteTable('gift_catalog', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),        // matches interest categories: spirits, hiking, yoga, etc.
  subcategory: text('subcategory'),             // bourbon, scotch, tequila, etc.
  name: text('name').notNull(),                 // "Woodford Reserve Double Oaked"
  description: text('description').notNull(),   // Nell-voice description
  priceRange: text('price_range').notNull(),    // "budget" | "mid" | "premium"
  priceEstimate: real('price_estimate'),        // ~55.00
  affiliateUrl: text('affiliate_url'),          // Amazon affiliate link
  purchaseUrl: text('purchase_url'),            // Direct product URL (fallback)
  source: text('source').notNull(),             // "wirecutter" | "strategist" | "reddit" | "amazon_bestseller" | "manual"
  giftability: integer('giftability'),          // 1-5 score (packaging, presentation)
  tags: text('tags'),                           // JSON array: ["crowd-pleaser", "unique", "personalized"]
  imageUrl: text('image_url'),
  inStock: integer('in_stock').default(1),      // 0 = out of stock
  lastVerified: integer('last_verified', { mode: 'timestamp_ms' }),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' }).notNull().$defaultFn(() => new Date()),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  contacts: many(contacts),
  occasions: many(occasions),
  reminders: many(reminders),
  messages: many(messages),
  giftHistory: many(giftHistory),
}));

export const contactsRelations = relations(contacts, ({ one, many }) => ({
  user: one(users, { fields: [contacts.userId], references: [users.id] }),
  interests: many(interests),
  occasions: many(occasions),
  reminders: many(reminders),
  giftHistory: many(giftHistory),
}));

export const interestsRelations = relations(interests, ({ one }) => ({
  contact: one(contacts, { fields: [interests.contactId], references: [contacts.id] }),
}));

export const occasionsRelations = relations(occasions, ({ one, many }) => ({
  contact: one(contacts, { fields: [occasions.contactId], references: [contacts.id] }),
  user: one(users, { fields: [occasions.userId], references: [users.id] }),
  reminders: many(reminders),
}));

export const remindersRelations = relations(reminders, ({ one }) => ({
  user: one(users, { fields: [reminders.userId], references: [users.id] }),
  contact: one(contacts, { fields: [reminders.contactId], references: [contacts.id] }),
  occasion: one(occasions, { fields: [reminders.occasionId], references: [occasions.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.userId], references: [users.id] }),
}));

export const giftHistoryRelations = relations(giftHistory, ({ one }) => ({
  user: one(users, { fields: [giftHistory.userId], references: [users.id] }),
  contact: one(contacts, { fields: [giftHistory.contactId], references: [contacts.id] }),
  occasion: one(occasions, { fields: [giftHistory.occasionId], references: [occasions.id] }),
}));
