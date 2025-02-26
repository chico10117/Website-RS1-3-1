import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
    const slug = url.searchParams.get('slug');
    
    if (!slug) {
        return json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    // Get the current user ID from session
    const userId = locals.user?.id;
    
    if (!userId) {
        return json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        // Check if slug exists in the database
        const existingRestaurants = await db.select()
            .from(restaurants)
            .where(eq(restaurants.slug, slug));

        // Check if the slug is used by the current user or another user
        const ownedByCurrentUser = existingRestaurants.some(r => r.userId === userId);
        const ownedByOtherUser = existingRestaurants.some(r => r.userId !== userId);

        return json({ 
            exists: existingRestaurants.length > 0,
            ownedByCurrentUser,
            ownedByOtherUser,
            available: existingRestaurants.length === 0,
            slug
        });
    } catch (error) {
        console.error('Error checking slug:', error);
        return json({ error: 'Failed to check slug' }, { status: 500 });
    }
}; 