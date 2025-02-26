import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
    const { name } = await request.json();
    
    if (!name) {
        return json({ error: 'Name parameter is required' }, { status: 400 });
    }

    // Get the current user ID from session
    const userId = locals.user?.id;
    
    if (!userId) {
        return json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        // Generate base slug
        let baseSlug = name.toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-')     // Replace spaces with hyphens
            .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
            .trim();                  // Trim hyphens from start and end

        // Check if slug exists for this user
        let slug = baseSlug;
        let counter = 1;
        let slugExists = true;

        while (slugExists) {
            const existingRestaurant = await db.select()
                .from(restaurants)
                .where(eq(restaurants.slug, slug));

            if (existingRestaurant.length === 0) {
                // Slug doesn't exist at all
                slugExists = false;
            } else {
                // Check if the slug belongs to another user
                const conflictingRestaurant = existingRestaurant.find(r => r.userId !== userId);
                
                if (!conflictingRestaurant) {
                    // Slug exists but only for the current user, so we can use a counter
                    slug = `${baseSlug}-${counter}`;
                    counter++;
                } else {
                    // Slug exists for another user, we need to make it unique
                    // Add a short random string to make it globally unique
                    const randomSuffix = Math.random().toString(36).substring(2, 7);
                    slug = `${baseSlug}-${randomSuffix}`;
                    slugExists = false; // Exit the loop as we've created a globally unique slug
                }
            }
        }

        return json({ slug });
    } catch (error) {
        console.error('Error generating slug:', error);
        return json({ error: 'Failed to generate slug' }, { status: 500 });
    }
}; 