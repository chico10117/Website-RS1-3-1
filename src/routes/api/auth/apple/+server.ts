import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { authorization, user } = await request.json();
    
    if (!authorization || !authorization.id_token) {
      return json({ error: 'Missing credentials' }, { status: 400 });
    }

    // Verify the identity token
    const decodedToken = jwt.decode(authorization.id_token) as jwt.JwtPayload;
    
    if (!decodedToken || !decodedToken.sub) {
      return json({ error: 'Invalid token' }, { status: 401 });
    }

    // Set authentication cookie
    cookies.set('auth_token', authorization.id_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return json({ success: true });
  } catch (error) {
    console.error('Error processing Apple login:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle Apple's OAuth callback
export async function GET({ url, cookies }: RequestEvent) {
  try {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code) {
      return json({ error: 'Missing authorization code' }, { status: 400 });
    }

    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        client_id: 'YOUR_APPLE_CLIENT_ID', // Replace with your Apple Client ID
        client_secret: 'YOUR_APPLE_CLIENT_SECRET', // Generate this using your private key
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${url.origin}/api/auth/apple/callback`
      })
    });

    const tokens = await tokenResponse.json();

    if (!tokens.id_token) {
      return json({ error: 'Failed to obtain tokens' }, { status: 401 });
    }

    // Set authentication cookie
    cookies.set('auth_token', tokens.id_token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    // Redirect to home page
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  } catch (error) {
    console.error('Error processing Apple callback:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 