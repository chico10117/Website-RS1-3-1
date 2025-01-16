import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { credential } = await request.json();
    
    if (!credential) {
      return json({ error: 'No credential provided' }, { status: 400 });
    }

    // Aquí deberías verificar el token con Google
    // y crear una sesión para el usuario

    // Por ahora, simplemente guardamos el token en una cookie
    cookies.set('auth_token', credential, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 semana
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error processing Google login:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 