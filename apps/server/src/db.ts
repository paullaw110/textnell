import { eq, and, like, desc, sql, lte, gte } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db, schema } from './lib/db';
const { users, contacts, interests, occasions, reminders, messages, giftHistory, giftCatalog } = schema;

// ============================================
// Users
// ============================================

export async function getOrCreateUser(phone: string) {
  const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  if (existing.length > 0) return existing[0];
  
  const id = nanoid();
  const result = await db.insert(users).values({ id, phone }).returning();
  return result[0];
}

export async function updateUserPreferences(userId: string, data: { name?: string; email?: string; timezone?: string; reminderDaysDefault?: number }) {
  const result = await db.update(users)
    .set(data)
    .where(eq(users.id, userId))
    .returning();
  return result[0];
}

// ============================================
// Contacts
// ============================================

export async function getContacts(userId: string) {
  const rows = await db.select().from(contacts).where(eq(contacts.userId, userId)).orderBy(contacts.name);
  const result = [];
  for (const c of rows) {
    const ints = await db.select().from(interests).where(eq(interests.contactId, c.id));
    result.push({ ...c, interests: ints });
  }
  return result;
}

export async function getContact(userId: string, name: string) {
  const rows = await db.select().from(contacts)
    .where(and(eq(contacts.userId, userId), like(contacts.name, `%${name}%`)))
    .limit(1);
  if (rows.length === 0) return null;
  const c = rows[0];
  const ints = await db.select().from(interests).where(eq(interests.contactId, c.id));
  return { ...c, interests: ints };
}

export async function createContact(userId: string, data: { name: string; birthday?: string; birthYear?: number; relationship?: string; phone?: string; email?: string }) {
  const id = nanoid();
  const result = await db.insert(contacts).values({ id, userId, ...data }).returning();
  const contact = result[0];

  // Auto-create birthday occasion + reminder
  if (data.birthday) {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const reminderDays = user[0]?.reminderDaysDefault || 3;
    await addOccasion(id, userId, 'birthday', data.birthday, `${data.name}'s Birthday`, reminderDays);
  }

  return contact;
}

export async function updateContact(contactId: string, data: { name?: string; birthday?: string; birthYear?: number; relationship?: string; phone?: string; email?: string }) {
  const result = await db.update(contacts)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(contacts.id, contactId))
    .returning();
  return result[0];
}

export async function deleteContact(contactId: string, userId: string) {
  // Delete related data
  await db.delete(reminders).where(eq(reminders.contactId, contactId));
  await db.delete(occasions).where(eq(occasions.contactId, contactId));
  await db.delete(interests).where(eq(interests.contactId, contactId));
  await db.delete(giftHistory).where(eq(giftHistory.contactId, contactId));
  await db.delete(contacts).where(and(eq(contacts.id, contactId), eq(contacts.userId, userId)));
}

export async function getAllContacts(userId: string) {
  const rows = await db.select().from(contacts).where(eq(contacts.userId, userId)).orderBy(contacts.name);
  const result = [];
  for (const c of rows) {
    const ints = await db.select().from(interests).where(eq(interests.contactId, c.id));
    const occs = await db.select().from(occasions).where(eq(occasions.contactId, c.id));
    result.push({ ...c, interests: ints, occasions: occs });
  }
  return result;
}

// ============================================
// Interests
// ============================================

export async function addInterest(contactId: string, category: string, specifics: string, source: string = 'user_stated') {
  const id = nanoid();
  const result = await db.insert(interests).values({ id, contactId, category, specifics, source }).returning();
  return result[0];
}

export async function getInterests(contactId: string) {
  return db.select().from(interests).where(eq(interests.contactId, contactId));
}

// ============================================
// Occasions
// ============================================

export async function addOccasion(contactId: string, userId: string, type: string, date: string, label?: string, reminderDays: number = 3) {
  const id = nanoid();
  const result = await db.insert(occasions).values({
    id, contactId, userId, type, date, label, reminderDaysBefore: reminderDays,
  }).returning();
  const occasion = result[0];

  // Auto-create reminders for this year and next
  await generateRemindersForOccasion(occasion.id, userId, contactId, date, reminderDays);
  return occasion;
}

export async function getUpcomingOccasions(userId: string, daysAhead: number = 30) {
  const today = new Date();
  const allOccasions = await db.select({
    occasion: occasions,
    contactName: contacts.name,
  }).from(occasions)
    .innerJoin(contacts, eq(occasions.contactId, contacts.id))
    .where(eq(occasions.userId, userId));

  // Filter by upcoming MM-DD within daysAhead
  const upcoming = allOccasions.filter(row => {
    const [month, day] = row.occasion.date.split('-').map(Number);
    const currentYear = today.getFullYear();
    let occDate = new Date(currentYear, month - 1, day);
    if (occDate < today) occDate = new Date(currentYear + 1, month - 1, day);
    const diffDays = Math.ceil((occDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= daysAhead;
  });

  return upcoming.map(r => ({ ...r.occasion, contactName: r.contactName }));
}

// ============================================
// Reminders
// ============================================

async function generateRemindersForOccasion(occasionId: string, userId: string, contactId: string, dateMMDD: string, reminderDays: number) {
  const [month, day] = dateMMDD.split('-').map(Number);
  const today = new Date();
  const currentYear = today.getFullYear();

  for (const year of [currentYear, currentYear + 1]) {
    const occDate = new Date(year, month - 1, day);
    const remindDate = new Date(occDate);
    remindDate.setDate(remindDate.getDate() - reminderDays);

    if (remindDate > today) {
      const id = nanoid();
      await db.insert(reminders).values({
        id, userId, contactId, occasionId,
        remindAt: remindDate.toISOString().split('T')[0],
      });
    }
  }
}

export async function getUpcomingReminders(date: string) {
  return db.select({
    id: reminders.id,
    userId: reminders.userId,
    contactId: reminders.contactId,
    occasionId: reminders.occasionId,
    remindAt: reminders.remindAt,
    sent: reminders.sent,
    contactName: contacts.name,
    contactBirthday: contacts.birthday,
    userPhone: users.phone,
    occasionType: occasions.type,
    occasionDate: occasions.date,
    occasionLabel: occasions.label,
  }).from(reminders)
    .innerJoin(contacts, eq(reminders.contactId, contacts.id))
    .innerJoin(users, eq(reminders.userId, users.id))
    .innerJoin(occasions, eq(reminders.occasionId, occasions.id))
    .where(and(eq(reminders.remindAt, date), eq(reminders.sent, 0)));
}

export async function markReminderSent(reminderId: string) {
  await db.update(reminders)
    .set({ sent: 1, sentAt: new Date() })
    .where(eq(reminders.id, reminderId));
}

// ============================================
// Messages
// ============================================

export async function addMessage(userId: string, role: string, content: string, channel: string = 'sms') {
  const id = nanoid();
  return db.insert(messages).values({ id, userId, role, content, channel }).returning();
}

export async function getRecentMessages(userId: string, limit: number = 20) {
  return db.select({ role: messages.role, content: messages.content })
    .from(messages)
    .where(eq(messages.userId, userId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}

// ============================================
// Gift History
// ============================================

export async function addGiftRecord(userId: string, contactId: string, data: { description: string; amount?: number; dateGiven: string; occasionId?: string; notes?: string }) {
  const id = nanoid();
  return db.insert(giftHistory).values({ id, userId, contactId, ...data }).returning();
}

export async function getGiftHistory(contactId: string) {
  return db.select().from(giftHistory).where(eq(giftHistory.contactId, contactId)).orderBy(desc(giftHistory.createdAt));
}

// ============================================
// Gift Catalog
// ============================================

export async function searchGifts(category: string, options?: { subcategory?: string; priceRange?: string; limit?: number }) {
  const conditions = [eq(giftCatalog.category, category.toLowerCase()), eq(giftCatalog.inStock, 1)];
  if (options?.subcategory) {
    conditions.push(like(giftCatalog.subcategory, `%${options.subcategory.toLowerCase()}%`));
  }
  if (options?.priceRange) {
    conditions.push(eq(giftCatalog.priceRange, options.priceRange));
  }
  return db.select().from(giftCatalog)
    .where(and(...conditions))
    .orderBy(desc(giftCatalog.giftability))
    .limit(options?.limit || 5);
}

export async function addGiftCatalogItem(item: {
  category: string; subcategory?: string; name: string; description: string;
  priceRange: string; priceEstimate?: number; affiliateUrl?: string; purchaseUrl?: string;
  source: string; giftability?: number; tags?: string[]; imageUrl?: string;
}) {
  const id = nanoid();
  return db.insert(giftCatalog).values({
    id,
    category: item.category.toLowerCase(),
    subcategory: item.subcategory?.toLowerCase(),
    name: item.name,
    description: item.description,
    priceRange: item.priceRange,
    priceEstimate: item.priceEstimate,
    affiliateUrl: item.affiliateUrl,
    purchaseUrl: item.purchaseUrl,
    source: item.source,
    giftability: item.giftability || 3,
    tags: item.tags ? JSON.stringify(item.tags) : null,
    imageUrl: item.imageUrl,
    inStock: 1,
    lastVerified: new Date(),
  }).returning();
}

export async function updateGiftCatalogItem(id: string, updates: Partial<{
  priceEstimate: number; affiliateUrl: string; inStock: number; lastVerified: Date; description: string;
}>) {
  return db.update(giftCatalog)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(giftCatalog.id, id))
    .returning();
}

export async function getGiftCatalogStats() {
  const all = await db.select({
    category: giftCatalog.category,
    count: sql<number>`count(*)`,
  }).from(giftCatalog)
    .where(eq(giftCatalog.inStock, 1))
    .groupBy(giftCatalog.category);
  return all;
}

export async function getStaleGifts(daysOld: number = 90) {
  const cutoff = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  return db.select().from(giftCatalog)
    .where(and(
      eq(giftCatalog.inStock, 1),
      lte(giftCatalog.lastVerified, cutoff)
    ));
}

export async function getAllGiftCategories() {
  const rows = await db.select({ category: giftCatalog.category })
    .from(giftCatalog)
    .where(eq(giftCatalog.inStock, 1))
    .groupBy(giftCatalog.category);
  return rows.map(r => r.category);
}

export async function getAllInterestCategories() {
  const rows = await db.select({ category: interests.category })
    .from(interests)
    .groupBy(interests.category);
  return rows.map(r => r.category);
}
