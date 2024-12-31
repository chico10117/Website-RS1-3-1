import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';
import * as schema from './schema';
import { eq } from 'drizzle-orm';

// Cargar variables de entorno
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Configuración de la conexión usando el cliente HTTP de Neon
const sql = neon(DATABASE_URL);

// Crear la instancia de Drizzle con el schema
export const db = drizzle(sql, { schema });

// Función para verificar la conexión
export async function connectDB() {
  try {
    // Verificar la conexión realizando una consulta simple
    const result = await sql`SELECT NOW()`;
    console.log('Connected to Neon PostgreSQL database!');
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

// Funciones helper para consultas relacionadas
export async function getRestaurantWithRelations(restaurantId: string) {
  const restaurant = await db.select().from(schema.restaurants)
    .where(eq(schema.restaurants.id, restaurantId))
    .execute();

  if (!restaurant.length) return null;

  const categories = await db.select().from(schema.categories)
    .where(eq(schema.categories.restaurantId, restaurantId))
    .execute();

  const categoryIds = categories.map(cat => cat.id);
  
  const dishes = await db.select().from(schema.dishes)
    .where(
      eq(schema.dishes.categoryId, categoryIds[0]) // TODO: Implement IN operator
    )
    .execute();

  return {
    ...restaurant[0],
    categories: categories.map(category => ({
      ...category,
      dishes: dishes.filter(dish => dish.categoryId === category.id)
    }))
  };
}

// Función para crear un restaurante con sus relaciones
export async function createRestaurantWithRelations(data: {
  name: string;
  logo?: string;
  categories: Array<{
    name: string;
    dishes?: Array<{
      title: string;
      imageUrl?: string;
      price?: string;
      description?: string;
    }>;
  }>;
}) {
  const [restaurant] = await db.insert(schema.restaurants)
    .values({
      name: data.name,
      logo: data.logo
    })
    .returning();

  const categoriesPromises = data.categories.map(async (category) => {
    const [newCategory] = await db.insert(schema.categories)
      .values({
        name: category.name,
        restaurantId: restaurant.id
      })
      .returning();

    if (category.dishes?.length) {
      await db.insert(schema.dishes)
        .values(
          category.dishes.map(dish => ({
            ...dish,
            categoryId: newCategory.id
          }))
        );
    }

    return newCategory;
  });

  const categories = await Promise.all(categoriesPromises);

  return {
    ...restaurant,
    categories
  };
} 