/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Locals {
    userid: string;
  }
}

interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        renderButton: (element: HTMLElement, options: any) => void;
        prompt: () => void;
      };
    };
  }
} 