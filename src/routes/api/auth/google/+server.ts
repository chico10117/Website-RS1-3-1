import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { credential } = await request.json();
    
    if (!credential) {
      return json({ error: 'No credential provided' }, { status: 400 });
    }

    // Decode the JWT token
    const [, payloadBase64] = credential.split('.');
    const payload = JSON.parse(atob(payloadBase64));

    // Find or create user
    const existingUsers = await db.select().from(users).where(eq(users.email, payload.email)).limit(1);
    
    let dbUser;
    if (!existingUsers.length) {
      // Create new user
      const newUsers = await db.insert(users)
        .values({
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      dbUser = newUsers[0];
    } else {
      // Update existing user
      const updatedUsers = await db.update(users)
        .set({
          name: payload.name,
          picture: payload.picture,
          updatedAt: new Date()
        })
        .where(eq(users.email, payload.email))
        .returning();
      dbUser = updatedUsers[0];
    }

    // Store user info in session cookie
    cookies.set('auth_token', credential, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return json({ 
      success: true,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.picture
      }
    });
  } catch (error) {
    console.error('Error processing Google login:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 