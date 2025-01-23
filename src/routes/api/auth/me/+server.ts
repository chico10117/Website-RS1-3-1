import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function GET({ cookies }: RequestEvent) {
  try {
    const token = cookies.get('auth_token');
    
    if (!token) {
      return json({ user: null });
    }

    // Decode the JWT token
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));

    // Get user from database
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (!user) {
      return json({ user: null });
    }

    return json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Error getting user session:', error);
    return json({ user: null });
  }
} 