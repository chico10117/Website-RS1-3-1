<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { authConfig } from '$lib/config/auth';
  import { user } from '$lib/stores/user';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  
  let googleButton: HTMLElement;
  let loadIframe = false;
  let iframeLoading = true;
  
  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  function handleIframeLoad() {
    iframeLoading = false;
  }

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
            text: t('googleButtonText'),
            shape: 'pill',
            logo_alignment: 'left',
            width: 200
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
    
    // Delay iframe loading to improve initial page performance
    setTimeout(() => {
      loadIframe = true;
    }, 10);
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
        <p class="text-gray-600 text-lg mb-8">{t('loginSubtitle')}</p>
      </div>
      
      <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/50 p-8">
        <div class="flex flex-col items-center space-y-4">
          <!-- Google Sign-In Button -->
          <div 
            bind:this={googleButton} 
            class="w-full flex justify-center"
          ></div>
          
          <!-- Contact Information Section -->
          <div class="mt-6 text-center w-full">
            <p class="text-gray-700 font-medium text-lg mb-4">¿Tienes dudas o preguntas?</p>
            <div class="flex flex-col sm:flex-row justify-center gap-3">
              <a 
                href="https://calendly.com/fernando-lqrb/30min" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2 border border-black-500 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </a>
              <a 
                href="https://api.whatsapp.com/send?phone=34603114264&text=Hola%20Fernando,%20me%20voy%20a%20crear%20una%20cuenta%20en%20Reco%20pero%20tengo%20algunas%20dudas.%20" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="px-4 py-2 text-green-500 hover:text-green-600 transition-colors flex items-center justify-center gap-2 border border-black-500 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                
              </a>
            </div>
          </div>
          
          <!-- Manual fallback button -->
          <!-- <div class="mt-4 text-center">
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
          </div> -->
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
        <div class="relative w-full h-full">
          {#if iframeLoading}
            <div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[38px] z-10">
              <div class="text-center">
                <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mb-3"></div>
                <p class="text-gray-600">Loading...</p>
              </div>
            </div>
          {/if}
          <iframe
            src={loadIframe ? "https://santocdmx.reco.restaurant" : ""}
            title="Demo Preview"
            class="w-full h-full rounded-[40px]"
            on:load={handleIframeLoad}
            loading="lazy"
          ></iframe>
        </div>
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

  /* Google button styling */
  :global(#googleButton > div) {
    width: 100% !important;
    border-radius: 9999px !important;
  }
  :global(#googleButton > div > div) {
    width: 300px !important;
    border-radius: 9999px !important;
  }
  :global(#googleButton > div > iframe) {
    width: 300px !important;
    border-radius: 9999px !important;
  }
</style>

<!-- Add preconnect for the iframe domain but remove preload -->
<svelte:head>
  <link rel="preconnect" href="https://santocdmx.reco.restaurant" crossorigin="anonymous">
  <link rel="dns-prefetch" href="https://santocdmx.reco.restaurant">
</svelte:head> 