import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { name } = await request.json();
        
        if (!name?.trim()) {
            return json({ error: 'Valid name parameter is required' }, { status: 400 });
        }

        // Get the current user ID from session
        const userId = locals.user?.id;
        if (!userId) {
            return json({ error: 'Authentication required' }, { status: 401 });
        }

        // Generate base slug - moved to separate function for clarity
        const baseSlug = generateBaseSlug(name);
        
        // Try simple slug first
        const existingRestaurants = await db.select()
            .from(restaurants)
            .where(eq(restaurants.slug, baseSlug));

        // If slug doesn't exist, use it directly
        if (existingRestaurants.length === 0) {
            return json({ slug: baseSlug });
        }

        // If slug exists but only for current user, add counter
        if (existingRestaurants.every(r => r.userId === userId)) {
            const slug = await generateCounterSlug(baseSlug, userId);
            return json({ slug });
        }

        // If slug exists for another user, add random suffix
        const slug = generateRandomSlug(baseSlug);
        return json({ slug });

    } catch (error) {
        console.error('Error generating slug:', error);
        return json({ error: 'Failed to generate slug' }, { status: 500 });
    }
};

// Helper functions
function generateBaseSlug(name: string): string {
    return name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

async function generateCounterSlug(baseSlug: string, userId: string): Promise<string> {
    let counter = 1;
    let slug: string;
    
    do {
        slug = `${baseSlug}-${counter}`;
        const exists = await db.select()
            .from(restaurants)
            .where(eq(restaurants.slug, slug))
            .then(results => results.length > 0);
            
        if (!exists) break;
        counter++;
    } while (counter < 100); // Safeguard against infinite loops
    
    return slug;
}

function generateRandomSlug(baseSlug: string): string {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${baseSlug}-${randomSuffix}`;
} 