import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ url }: RequestEvent) {
  try {
    const name = url.searchParams.get('name');
    
    if (!name) {
      return json({ 
        success: false, 
        error: 'Name parameter is required' 
      }, { status: 400 });
    }

    const baseSlug = name
      .toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^\w\s]/g, '') // Remove special characters except whitespace
      .replace(/\s+/g, ''); // Remove all whitespace

    // Check if the base slug exists
    const existingRestaurants = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.slug, baseSlug));

    // If no collision, return base slug
    if (existingRestaurants.length === 0) {
      return json({ success: true, data: baseSlug });
    }

    // If collision exists, find the next available number
    let counter = 1;
    let newSlug = `${baseSlug}${counter}`;

    while (true) {
      const exists = await db
        .select()
        .from(restaurants)
        .where(eq(restaurants.slug, newSlug));

      if (exists.length === 0) {
        return json({ success: true, data: newSlug });
      }

      counter++;
      newSlug = `${baseSlug}${counter}`;
    }
  } catch (error) {
    console.error('Error generating slug:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to generate slug' 
    }, { status: 500 });
  }
} 