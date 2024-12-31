import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  logo: text('logo'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const dishes = pgTable('dishes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  imageUrl: text('image_url'),
  price: text('price'),
  description: text('description'),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}); 