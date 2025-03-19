import { pgTable, text, timestamp, uuid, unique, decimal, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  customPrompt: text('custom_prompt'),
  currency: text('currency').notNull().default('€'),
  color: text('color').notNull().default('1'),
  phoneNumber: text('phoneNumber'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  // Add unique constraint for name within a restaurant
  nameRestaurantUnique: unique().on(table.name, table.restaurantId)
}));

export const dishes = pgTable('dishes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  imageUrl: text('image_url'),
  price: decimal('price', { precision: 10, scale: 2 }),
  description: text('description'),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}); 