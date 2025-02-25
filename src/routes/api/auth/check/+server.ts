import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function GET({ cookies }: RequestEvent) {
  try {
    console.log('GET /api/auth/check - Checking authentication status');
    
    const token = cookies.get('auth_token');
    if (!token) {
      console.log('GET /api/auth/check - No auth token found');
      return json({ 
        authenticated: false,
        message: 'No authentication token found'
      });
    }
    
    console.log('GET /api/auth/check - Auth token found');
    
    // Decode the JWT token
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    
    // Get user from database
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);
    
    if (!user) {
      console.log('GET /api/auth/check - User not found for token');
      return json({ 
        authenticated: false,
        message: 'User not found for token'
      });
    }
    
    console.log(`GET /api/auth/check - User authenticated: ${user.email} (${user.id})`);
    
    return json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return json({ 
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 