<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  
  let googleButton: HTMLElement;
  
  onMount(() => {
    if (!browser) return;

    const initializeGoogleSignIn = () => {
      try {
        window.google.accounts.id.initialize({
          client_id: '679214507415-iqnk4vg720qs4m07aaot8vi4hmbp8t1e.apps.googleusercontent.com',
          callback: handleCredentialResponse,
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

    // Esperar a que el script de Google se cargue
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      window.addEventListener('load', initializeGoogleSignIn);
    }
  });

  async function handleCredentialResponse(response: any) {
    if (!browser) return;
    
    try {
      console.log('Google response:', response);
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
        goto('/');
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
  <div class="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/50">
    <h1 class="text-2xl font-bold text-center mb-8 text-gray-800">Welcome back</h1>
    
    <div class="flex flex-col items-center space-y-4">
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
  }
</style> 