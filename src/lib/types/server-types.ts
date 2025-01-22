export interface AuthRequest {
  credential?: string;
  accessToken?: string;
  userID?: string;
  authorization?: {
    id_token: string;
  };
  user?: {
    name?: string;
    email?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    name?: string;
    email?: string;
    picture?: string;
  };
}

export interface EmailConfig {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
    FB: {
      init: (params: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (callback: (response: {
        authResponse?: {
          accessToken: string;
          userID: string;
        };
        status?: string;
      }) => void, options?: { scope: string }) => void;
    };
    AppleID: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup?: boolean;
        }) => void;
        signIn: () => Promise<{
          authorization: {
            id_token: string;
            code: string;
            state: string;
          };
          user?: {
            name?: {
              firstName: string;
              lastName: string;
            };
            email?: string;
          };
        }>;
      };
    };
  }
} 