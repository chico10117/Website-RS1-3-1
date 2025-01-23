declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        email: string;
        name: string | null;
        picture: string | null;
      };
    }
  }
}

export {}; 