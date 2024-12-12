import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';

export const GET = async () => {
  try {
    await connectDB();
    const restaurants = await Restaurant.find({}).lean();
    return json({ success: true, data: restaurants });
  } catch (error) {
    return json({ success: false, error: error.message }, { status: 500 });
  }
};

export const POST = async ({ request }) => {
  // ... existing POST logic
}; 