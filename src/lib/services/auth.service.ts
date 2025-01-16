import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export class AuthService {
  private googleAuth: any;

  constructor() {
    // Initialize Google OAuth client
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: PUBLIC_GOOGLE_CLIENT_ID
      });
    });
  }

  async signInWithGoogle() {
    try {
      const googleAuth = await window.gapi.auth2.getAuthInstance();
      const user = await googleAuth.signIn();
      return {
        token: user.getAuthResponse().id_token,
        user: {
          name: user.getBasicProfile().getName(),
          email: user.getBasicProfile().getEmail(),
          picture: user.getBasicProfile().getImageUrl()
        }
      };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut() {
    const googleAuth = await window.gapi.auth2.getAuthInstance();
    await googleAuth.signOut();
  }
} 