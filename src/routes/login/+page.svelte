<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { authConfig } from '$lib/config/auth';
  import { user } from '$lib/stores/user';
  
  let googleButton: HTMLElement;
  
  onMount(() => {
    if (!browser) return;

    // Log the current origin for debugging
    console.log('Current origin:', window.location.origin);
    console.log('Google client ID:', authConfig.google.clientId);

    // Initialize Google Sign-In
    const initializeGoogleSignIn = () => {
      try {
        console.log('Initializing Google Sign-In...');
        window.google.accounts.id.initialize({
          client_id: authConfig.google.clientId,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          error_callback: (error: any) => {
            console.error('Google Sign-In error:', error);
          }
        });

        console.log('Rendering Google Sign-In button...');
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
        console.log('Google Sign-In initialized successfully');
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
      console.log('Google auth response received:', response);
      
      // Decode the JWT token to get user info
      const token = response.credential;
      console.log('Token received:', token ? 'Token present' : 'No token');
      
      if (!token) {
        console.error('No credential token received from Google');
        return;
      }
      
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      console.log('Token payload:', payload);
      
      // Update user store with persistence
      console.log('Sending token to backend...');
      const result = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ credential: token }),
        credentials: 'include'
      });

      console.log('Backend response status:', result.status);
      
      if (result.ok) {
        const data = await result.json();
        console.log('Login successful, user data:', data);
        
        if (data.user) {
          user.set({
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            picture: data.user.picture
          });
          goto('/');
        } else {
          console.error('Login response missing user data');
        }
      } else {
        const errorText = await result.text();
        console.error('Login failed:', result.status, errorText);
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
      
      <!-- Manual fallback button -->
      <div class="mt-4 text-center">
        <p class="text-sm text-gray-500 mb-2">If the Google button doesn't work:</p>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          on:click={() => {
            console.log('Manual login attempt');
            if (window.google && window.google.accounts && window.google.accounts.id) {
              window.google.accounts.id.prompt();
            } else {
              console.error('Google Sign-In not initialized');
              alert('Google Sign-In not initialized. Please check console for errors.');
            }
          }}
        >
          Try Manual Login
        </button>
      </div>
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