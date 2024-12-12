// Move dish operations here
import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';

export const POST = async ({ params, request }) => {
  // ... existing POST logic
};

export const PUT = async ({ params, request }) => {
  // ... existing PUT logic
};

export const DELETE = async ({ params }) => {
  // ... existing DELETE logic
}; 