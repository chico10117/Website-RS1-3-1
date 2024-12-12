import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const POST = async ({ request }: RequestEvent) => {
  // ... existing upload logic
}; 