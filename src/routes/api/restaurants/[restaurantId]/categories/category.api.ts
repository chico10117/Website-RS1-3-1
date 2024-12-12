import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';

export const GET = async ({ params }) => {
  // ... existing GET logic
};

export const POST = async ({ params, request }) => {
  // ... existing POST logic
}; 