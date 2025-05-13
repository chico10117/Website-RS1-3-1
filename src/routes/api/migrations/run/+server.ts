import { json, type RequestEvent } from '@sveltejs/kit';
import { runMigrations } from '$lib/db/migrations/run-migrations';

export async function POST({ request }: RequestEvent) {
  try {
    // This would normally require admin authentication
    // but we'll keep it simple for demonstration
    const result = await runMigrations();
    
    return json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error running migrations:', error);
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 