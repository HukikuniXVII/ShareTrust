import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  avatar: text('avatar').notNull(),
  trustScore: integer('trust_score').notNull(),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull(),
  location: text('location').notNull(),
  joinDate: text('join_date').notNull(),
  bio: text('bio').notNull(),
  badges: text('badges', { mode: 'json' }).$type<string[]>().notNull(),
});

export const gearItems = sqliteTable('gear_items', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  pricePerDay: real('price_per_day').notNull(),
  images: text('images', { mode: 'json' }).$type<string[]>().notNull(),
  status: text('status').notNull(),
  location: text('location').notNull(),
  neighborhood: text('neighborhood'),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull(),
  rating: real('rating').notNull(),
  reviewCount: integer('review_count').notNull(),
});

export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  userName: text('user_name').notNull(),
  userAvatar: text('user_avatar').notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment').notNull(),
  date: text('date').notNull(),
});

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  senderId: text('sender_id').notNull().references(() => users.id),
  receiverId: text('receiver_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  timestamp: text('timestamp').notNull(),
  isRead: integer('is_read', { mode: 'boolean' }).notNull(),
});

export const rentalRequests = sqliteTable('rental_requests', {
  id: text('id').primaryKey(),
  itemId: text('item_id').notNull().references(() => gearItems.id),
  requesterId: text('requester_id').notNull().references(() => users.id),
  startDate: text('start_date').notNull(),
  endDate: text('end_date').notNull(),
  totalPrice: real('total_price').notNull(),
  status: text('status').notNull(),
});
