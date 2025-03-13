<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { authConfig } from '$lib/config/auth';
  import { user } from '$lib/stores/user';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  
  let googleButton: HTMLElement;
  
  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

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

<div class="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 rounded-3xl">
  <!-- Left side - Login Form -->
  <div class="w-full md:w-1/2 p-8 flex flex-col items-center justify-center">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <img src="/recologo.svg" alt="Reco Logo" class="h-12 w-auto mx-auto mb-6" />
        <p class="text-gray-600 text-base mb-8">{t('loginSubtitle')}</p>
      </div>
      
      <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-8">
        <div class="flex flex-col items-center space-y-4">
          <!-- Google Sign-In Button -->
          <div 
            bind:this={googleButton} 
            class="w-full flex justify-center"
          ></div>
          
          <!-- Manual fallback button -->
          <div class="mt-4 text-center">
            <p class="text-sm text-gray-500 mb-2 text-base">{t('manualLoginPrompt')}</p>
            <button
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-base"
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
              {t('tryManualLogin')}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right side - iPhone Preview (shows at bottom on mobile) -->
  <div class="w-full md:w-1/2 p-8 relative order-last md:order-none flex justify-center">
    <div class="relative">
      <!-- Demo text over the iPhone -->
      <div class="absolute -top-12 left-1/2 -translate-x-1/2 text-center z-10">
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">{t('demo')}</h2>
      </div>
      
      <div class="iphone-frame scale-[0.8] md:scale-100 -mt-16 md:mt-0">
        <iframe
          src="https://santocdmx.reco.restaurant"
          title="Demo Preview"
          class="w-full h-full rounded-[38px]"
        ></iframe>
      </div>
      <!-- QR Code (only visible on desktop) -->
      <img 
        src="/santo_qr.png" 
        alt="Demo QR Code" 
        class="hidden md:block absolute bottom-0 -right-40 w-32 h-32 shadow-lg rounded-xl bg-white/80 p-2"
      />
    </div>
  </div>
</div>

<!-- Footer -->
<div class="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-600 text-sm">
  <p class="mb-1">{t('increaseSales')}</p>
  <p class="mb-1">{t('copyright')}</p>
  <p><a href="https://reco.chat" target="_blank" rel="noopener noreferrer" class="text-gray-600 hover:text-blue-500 underline transition-colors">{t('recoWebsite')}</a></p>
</div>

<style>
  /* iPhone 14 Pro frame styling */
  .iphone-frame {
    position: relative;
    width: 375px;
    height: 812px;
    background: #1a1a1a;
    border-radius: 40px;
    padding: 4px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  .iphone-frame::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40%;
    height: 25px;
    background: #1a1a1a;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    z-index: 2;
  }

  /* Google button styling */
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