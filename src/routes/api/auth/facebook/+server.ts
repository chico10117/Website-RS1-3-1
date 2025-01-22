import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { accessToken, userID } = await request.json();
    
    if (!accessToken || !userID) {
      return json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Verify the access token with Facebook
    const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${accessToken}&fields=id,name,email`);
    const userData = await response.json();

    if (userData.id !== userID) {
      return json({ error: 'Invalid user ID' }, { status: 401 });
    }

    // Set authentication cookie
    cookies.set('auth_token', accessToken, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error processing Facebook login:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 