import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ cookies }: RequestEvent) {
  try {
    // Eliminar la cookie de sesión
    cookies.delete('auth_token', { path: '/' });
    
    return json({ success: true });
  } catch (error) {
    console.error('Error during logout:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 