import { PUBLIC_FACEBOOK_APP_ID, PUBLIC_APPLE_CLIENT_ID, PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export const authConfig = {
  google: {
    clientId: PUBLIC_GOOGLE_CLIENT_ID
  },
  // Temporarily disabled - Only using Google auth for now
  // facebook: {
  //   appId: PUBLIC_FACEBOOK_APP_ID || '',
  //   version: 'v18.0'
  // },
  // apple: {
  //   clientId: PUBLIC_APPLE_CLIENT_ID || '',
  //   scope: 'name email',
  //   redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/apple/callback` : ''
  // }
}; 