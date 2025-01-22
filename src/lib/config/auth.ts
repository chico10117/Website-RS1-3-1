import { PUBLIC_FACEBOOK_APP_ID, PUBLIC_APPLE_CLIENT_ID } from '$env/static/public';

export const authConfig = {
  google: {
    clientId: '679214507415-iqnk4vg720qs4m07aaot8vi4hmbp8t1e.apps.googleusercontent.com'
  },
  facebook: {
    appId: PUBLIC_FACEBOOK_APP_ID || '',
    version: 'v18.0'
  },
  apple: {
    clientId: PUBLIC_APPLE_CLIENT_ID || '',
    scope: 'name email',
    redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/apple/callback` : ''
  }
}; 