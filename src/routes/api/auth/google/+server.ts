import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { credential } = await request.json();
    
    if (!credential) {
      return json({ error: 'No credential provided' }, { status: 400 });
    }

    // Decode the JWT token
    const [, payloadBase64] = credential.split('.');
    const payload = JSON.parse(atob(payloadBase64));

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
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      }
    });
  } catch (error) {
    console.error('Error processing Google login:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 