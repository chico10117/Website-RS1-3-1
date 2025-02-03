import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
    const { name } = await request.json();
    
    if (!name) {
        return json({ error: 'Name parameter is required' }, { status: 400 });
    }

    try {
        // Generate base slug
        let baseSlug = name.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
            .trim();                  // Trim hyphens from start and end

        // Check if slug exists
        let slug = baseSlug;
        let counter = 1;
        let slugExists = true;

        while (slugExists) {
            const existingRestaurant = await db.select()
                .from(restaurants)
                .where(eq(restaurants.slug, slug));

            if (existingRestaurant.length === 0) {
                slugExists = false;
            } else {
                // If slug exists, append counter
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        }

        return json({ slug });
    } catch (error) {
        console.error('Error generating slug:', error);
        return json({ error: 'Failed to generate slug' }, { status: 500 });
    }
}; 