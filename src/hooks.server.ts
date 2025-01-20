import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('auth_token');
  const isProtectedRoute = event.url.pathname === '/';
  const isLoginRoute = event.url.pathname === '/login';

  if (isProtectedRoute && !session) {
    throw redirect(303, '/login');
  }

  if (isLoginRoute && session) {
    throw redirect(303, '/');
  }

  return resolve(event);
}; 