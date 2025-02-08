<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { authConfig } from '$lib/config/auth';
  import { user } from '$lib/stores/user';
  
  let googleButton: HTMLElement;
  
  onMount(() => {
    if (!browser) return;

    // Initialize Google Sign-In
    const initializeGoogleSignIn = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: authConfig.google.clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.renderButton(
          googleButton,
          { 
            type: 'standard',
            theme: 'outline', 
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 250
          }
        );
      } catch (error) {
        console.error('Error initializing Google Sign-In:', error);
      }
    };

    // Wait for Google script to load
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      window.addEventListener('load', initializeGoogleSignIn);
    }
  });

  async function handleGoogleCredentialResponse(response: any) {
    if (!browser) return;
    
    try {
      // Decode the JWT token to get user info
      const token = response.credential;
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      
      // Update user store with persistence
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          credential: response.credential 
        })
      });

      if (result.ok) {
        const data = await result.json();
        if (data.user) {
          user.set({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            picture: data.user.picture
          });
        }
        goto('/');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-xl">
  <div class="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/50">
    <h1 class="text-2xl font-bold text-center mb-8 text-gray-800">Welcome back</h1>
    
    <div class="flex flex-col items-center space-y-4">
      <!-- Google Sign-In Button -->
      <div 
        bind:this={googleButton} 
        class="w-full flex justify-center"
      ></div>
    </div>
  </div>
</div>

<style>
  /* Asegurarse de que el botón de Google tenga el tamaño correcto */
  :global(#googleButton > div) {
    width: 100% !important;
    border-radius: 9999px !important;
  }
  :global(#googleButton > div > div) {
    width: 250px !important;
    border-radius: 9999px !important;
  }
  :global(#googleButton > div > iframe) {
    width: 250px !important;
    border-radius: 9999px !important;
  }
</style> 