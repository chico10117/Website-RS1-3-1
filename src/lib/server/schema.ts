// src/lib/server/schema.ts
import { pgTable, text, timestamp, uuid, unique, decimal, integer, bigint } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm'; // <-- Import relations

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
  phoneNumber: bigint('phoneNumber', { mode: 'number' }),
  reservas: text('reservas'),
  redes_sociales: text('redes_sociales'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  // Ensure restaurantId is not nullable and references restaurants.id
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }).notNull(),
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
  // Ensure categoryId is not nullable and references categories.id
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

// --- Define Relations ---

export const usersRelations = relations(users, ({ many }) => ({
  restaurants: many(restaurants),
}));

export const restaurantsRelations = relations(restaurants, ({ one, many }) => ({
  user: one(users, { fields: [restaurants.userId], references: [users.id] }),
  categories: many(categories),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  restaurant: one(restaurants, { fields: [categories.restaurantId], references: [restaurants.id] }),
  dishes: many(dishes),
}));

export const dishesRelations = relations(dishes, ({ one }) => ({
  category: one(categories, { fields: [dishes.categoryId], references: [categories.id] }),
}));
// --- End Relations ---