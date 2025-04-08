// src/lib/server/database.ts - CORRECT VERSION FOR VERCEL
import { drizzle } from 'drizzle-orm/postgres-js'; // Use postgres-js adapter
import postgres from 'postgres'; // Use postgres client library
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { DATABASE_URL } from '$lib/config/env'; // Ensure this is correctly loaded

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Use the postgres client
// Options for serverless:
// - max: 1 (recommended for Vercel Serverless Functions)
// - idle_timeout: Optional, e.g., 5 seconds
// - connect_timeout: Optional, e.g., 10 seconds
const client = postgres(DATABASE_URL, {
    max: 1, // Use a single connection for serverless environments
    ssl: 'require' // Neon requires SSL
});

// Create the Drizzle instance with the postgres-js adapter and schema
export const db = drizzle(client, { schema });

// Optional connection verification (less critical, postgres client handles connections)
export async function connectDB() {
  try {
    // Test the connection using the Drizzle instance with a plain string
    await db.execute('SELECT NOW()');
    console.log('Connected to Neon PostgreSQL database via postgres-js!');
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

// --- Helper functions remain the same, but use the correct `db` instance ---
export async function getRestaurantWithRelations(restaurantId: string) {
    const restaurant = await db.query.restaurants.findFirst({
        where: eq(schema.restaurants.id, restaurantId),
        with: {
        categories: {
            with: {
            dishes: {
                orderBy: (dishes, { asc }) => [asc(dishes.createdAt)],
            }
            },
            orderBy: (categories, { asc }) => [asc(categories.createdAt)],
        }
        }
    });

    if (!restaurant) return null;

    restaurant.categories = restaurant.categories || [];
    restaurant.categories.forEach(cat => cat.dishes = cat.dishes || []);

    return restaurant; // Type casting might be needed depending on strictness
}
// ... other helper functions ...

// Función para crear un restaurante con sus relaciones
export async function createRestaurantWithRelations(data: {
  userId: string;
  name: string;
  slug: string;
  logo?: string | null;
  currency?: string | null;
  color?: string | null;
  customPrompt?: string | null;
  phoneNumber?: number | null;
  reservas?: string | null;
  redes_sociales?: string | null;
  categories: Array<{
    name: string;
    dishes?: Array<{
      title: string;
      imageUrl?: string | null;
      price?: string;
      description?: string | null;
    }>;
  }>;
}) {
  return await db.transaction(async (tx) => {
    const [restaurant] = await tx.insert(schema.restaurants)
      .values({
        userId: data.userId,
        name: data.name,
        slug: data.slug,
        logo: data.logo,
        currency: data.currency ?? '€',
        color: data.color ?? '#85A3FA',
        customPrompt: data.customPrompt,
        phoneNumber: data.phoneNumber,
        reservas: data.reservas,
        redes_sociales: data.redes_sociales,
      })
      .returning();

    const categoriesPromises = data.categories.map(async (category) => {
      const [newCategory] = await tx.insert(schema.categories)
        .values({
          name: category.name,
          restaurantId: restaurant.id
        })
        .returning();

      if (category.dishes?.length) {
        await tx.insert(schema.dishes)
          .values(
            category.dishes.map(dish => ({
              title: dish.title,
              imageUrl: dish.imageUrl,
              price: dish.price,
              description: dish.description,
              categoryId: newCategory.id
            }))
          );
      }
      // Return category with potentially empty dishes array for consistency
      return { ...newCategory, dishes: [] }; 
    });

    const categories = await Promise.all(categoriesPromises);

    return {
      ...restaurant,
      categories
    };
  });
} 