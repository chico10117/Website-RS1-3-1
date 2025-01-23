import { redirect, type Handle } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
  const authToken = event.cookies.get('auth_token');
  
  // Add user data to event.locals if authenticated
  if (authToken) {
    try {
      // Decode the JWT token
      const [, payloadBase64] = authToken.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      
      // Get user from database
      const [user] = await db.select()
        .from(users)
        .where(eq(users.email, payload.email))
        .limit(1);

      if (user) {
        event.locals.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture
        };
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      // Invalid token, remove it
      event.cookies.delete('auth_token', { path: '/' });
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/', '/restaurants', '/menu-editor'];
  const isProtectedRoute = protectedRoutes.some(route => 
    event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
  );
  const isLoginRoute = event.url.pathname === '/login';

  if (isProtectedRoute && !event.locals.user) {
    throw redirect(303, '/login');
  }

  if (isLoginRoute && event.locals.user) {
    throw redirect(303, '/restaurants');
  }

  return resolve(event);
}; 