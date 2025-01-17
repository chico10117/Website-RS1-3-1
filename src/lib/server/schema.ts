import { pgTable, text, timestamp, uuid, unique, decimal } from 'drizzle-orm/pg-core';

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
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