<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { authConfig } from '$lib/config/auth';
  import { user } from '$lib/stores/user';
  
  let googleButton: HTMLElement;
  let facebookButton: HTMLElement;
  let appleButton: HTMLElement;
  
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

    // Initialize Facebook SDK
    const initializeFacebookSDK = () => {
      try {
        window.fbAsyncInit = function() {
          FB.init({
            appId: authConfig.facebook.appId,
            cookie: true,
            xfbml: true,
            version: authConfig.facebook.version
          });
        };

        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s) as HTMLScriptElement;
          js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode?.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
      } catch (error) {
        console.error('Error initializing Facebook SDK:', error);
      }
    };

    // Initialize Apple Sign-In
    const initializeAppleSignIn = () => {
      try {
        const script = document.createElement('script');
        script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
        script.async = true;
        script.onload = () => {
          window.AppleID.auth.init({
            clientId: authConfig.apple.clientId,
            scope: authConfig.apple.scope,
            redirectURI: authConfig.apple.redirectUri,
            usePopup: true
          });
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error initializing Apple Sign-In:', error);
      }
    };

    // Wait for Google script to load
    if (window.google && window.google.accounts) {
      initializeGoogleSignIn();
    } else {
      window.addEventListener('load', initializeGoogleSignIn);
    }

    // Initialize Facebook and Apple
    initializeFacebookSDK();
    initializeAppleSignIn();
  });

  async function handleGoogleCredentialResponse(response: any) {
    if (!browser) return;
    
    try {
      // Decode the JWT token to get user info
      const token = response.credential;
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      
      // Update user store with persistence
      user.set({
        name: payload.name,
        email: payload.email,
        picture: payload.picture
      });

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

  async function handleFacebookLogin() {
    try {
      FB.login(async function(response) {
        if (response.authResponse) {
          const result = await fetch('/api/auth/facebook', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              accessToken: response.authResponse.accessToken,
              userID: response.authResponse.userID
            })
          });

          if (result.ok) {
            goto('/');
          } else {
            console.error('Facebook login failed');
          }
        } else {
          console.error('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'public_profile,email'});
    } catch (error) {
      console.error('Error during Facebook login:', error);
    }
  }

  async function handleAppleLogin() {
    try {
      const response = await window.AppleID.auth.signIn();
      const result = await fetch('/api/auth/apple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(response)
      });

      if (result.ok) {
        goto('/');
      } else {
        console.error('Apple login failed');
      }
    } catch (error) {
      console.error('Error during Apple login:', error);
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
  <div class="w-full max-w-md p-8 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/50">
    <h1 class="text-2xl font-bold text-center mb-8 text-gray-800">Welcome back</h1>
    
    <div class="flex flex-col items-center space-y-4">
      <!-- Google Sign-In Button -->
      <div 
        bind:this={googleButton} 
        class="w-full flex justify-center"
      ></div>

      <!-- Facebook Sign-In Button -->
      <button
        bind:this={facebookButton}
        on:click={handleFacebookLogin}
        class="w-[250px] h-[40px] flex items-center justify-center border border-gray-300 rounded-[4px] bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium text-[14px]"
      >
        <img src="/facebook-icon.svg" alt="Facebook" class="w-[18px] h-[18px] mr-2" />
        <span>Acceder con Facebook</span>
      </button>

      <!-- Apple Sign-In Button -->
      <button
        bind:this={appleButton}
        on:click={handleAppleLogin}
        class="w-[250px] h-[40px] flex items-center justify-center border border-gray-300 rounded-[4px] bg-black hover:bg-gray-900 text-white font-medium text-[14px]"
      >
        <img src="/apple-icon.svg" alt="Apple" class="w-[18px] h-[18px] mr-2" />
        <span>Acceder con Apple</span>
      </button>
    </div>
  </div>
</div>

<style>
  /* Asegurarse de que el botón de Google tenga el tamaño correcto */
  :global(#googleButton > div) {
    width: 100% !important;
  }
  :global(#googleButton > div > div) {
    width: 250px !important;
  }
  :global(#googleButton > div > iframe) {
    width: 250px !important;
  }
</style> 