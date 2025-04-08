import { drizzle } from 'drizzle-orm/node-postgres';
// import { Pool } from 'pg'; // Original import
import pg from 'pg'; // Use default import for CommonJS module
const { Pool } = pg; // Destructure Pool from the default import
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { DATABASE_URL } from '$lib/config/env';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Configuración de la conexión usando el Pool de node-postgres
const pool = new Pool({
  connectionString: DATABASE_URL,
  // Opcional: añadir configuración SSL si es necesaria para Neon
  // ssl: {
  //   rejectUnauthorized: false, // O ajusta según la configuración de Neon
  // }
});

// Crear la instancia de Drizzle con el schema
export const db = drizzle(pool, { schema });

// Función para verificar la conexión (opcional, el pool gestiona las conexiones)
export async function connectDB() {
  try {
    // Verificar la conexión obteniendo un cliente del pool
    const client = await pool.connect();
    console.log('Connected to PostgreSQL database via Pool!');
    // Realizar una consulta simple para asegurar que todo funciona
    await client.query('SELECT NOW()');
    client.release(); // Devolver el cliente al pool
    return db; // Devolver la instancia de Drizzle
  } catch (error) {
    console.error('Error connecting to database via Pool:', error);
    throw error;
  }
}

// Funciones helper para consultas relacionadas
export async function getRestaurantWithRelations(restaurantId: string) {
  const restaurant = await db.query.restaurants.findFirst({
    where: eq(schema.restaurants.id, restaurantId),
    with: {
      categories: {
        with: {
          dishes: true
        }
      }
    }
  });

  if (!restaurant) return null;

  // Ensure categories and dishes arrays exist
  restaurant.categories = restaurant.categories || [];
  restaurant.categories.forEach(cat => cat.dishes = cat.dishes || []);

  return restaurant;
}

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