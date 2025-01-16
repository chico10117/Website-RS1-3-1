import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('auth_token');
  
  // Add auth check for protected routes
  if (!token && !event.url.pathname.startsWith('/login')) {
    return Response.redirect(`${event.url.origin}/login`);
  }

  const response = await resolve(event);
  return response;
}; 