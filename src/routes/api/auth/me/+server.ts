import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ cookies }: RequestEvent) {
  try {
    const token = cookies.get('auth_token');
    
    if (!token) {
      return json({ user: null });
    }

    // Decodificar el token JWT
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));

    return json({
      user: {
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      }
    });
  } catch (error) {
    console.error('Error getting user session:', error);
    return json({ user: null });
  }
} 