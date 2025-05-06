<script lang="ts">
  import "../app.css";
  import Header from '$lib/components/Header.svelte';
  import { browser } from '$app/environment';
  import { user } from '$lib/stores/user';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { uploaderStore } from '$lib/stores/uploaderStore';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  // Initialize user store with server data
  $: if (browser && $page.data.user) {
    user.set($page.data.user);
  }

  onMount(async () => {
    console.log('Layout onMount: Checking authentication');
    
    // Check if user is already in the store
    let currentUser;
    user.subscribe(value => {
      currentUser = value;
    })();
    
    if (!currentUser) {
      try {
        console.log('No user in store, fetching from API');
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        
        console.log('Auth check response:', response);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('User data received:', userData);
          
          if (userData.success && userData.data) {
            user.set(userData.data);
          } else {
            // If we're on a protected route, redirect to login
            const protectedRoutes = ['/', '/restaurants', '/menu-editor'];
            const currentPath = window.location.pathname;
            
            if (protectedRoutes.includes(currentPath)) {
              console.log('Not authenticated, redirecting to login');
              goto('/login');
            }
          }
        } else {
          console.log('Auth check failed:', response.status);
          // If we're on a protected route, redirect to login
          const protectedRoutes = ['/', '/restaurants', '/menu-editor'];
          const currentPath = window.location.pathname;
          
          if (protectedRoutes.includes(currentPath)) {
            console.log('Not authenticated, redirecting to login');
            goto('/login');
          }
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      }
    } else {
      console.log('User already in store:', currentUser);
    }
  });

  // Reactive translations for the overlay
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key]?.[currentLanguage] || translations[key]?.['es'] || key;
</script>

<!-- FULL SCREEN OVERLAY controlled by store -->
{#if $uploaderStore.isLoading}
  <div class="fixed inset-0 bg-black/50 z-[9999] flex flex-col items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-xl text-center space-y-4 w-full max-w-md">
      <svg class="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-lg font-medium text-gray-700">{$uploaderStore.currentStep}</p>
      <div class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style="width: {$uploaderStore.progress}%"
        ></div>
      </div>
      <!-- Make sure you have 'processingPleaseWait' in translations.ts -->
      <p class="text-sm text-gray-500">{t('processingPleaseWait')}</p> 
    </div>
  </div>
{/if}

<Header />
<main class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-12 sm:pt-14">
  <div class="container mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
    <slot />
  </div>
</main>

<style>
  :global(body) {
    background: linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 50%, #faf5ff 100%);
    min-height: 100vh;
    margin: 0;
    position: relative;
  }

  main {
    position: relative;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  /* Glass effect for cards and containers */
  :global(.glass) {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  }

  :global(.glass-hover) {
    transition: all 0.3s ease;
  }

  :global(.glass-hover:hover) {
    background: rgba(255, 255, 255, 0.8);
    transform: translateY(-2px);
    box-shadow: 0 10px 40px 0 rgba(31, 38, 135, 0.1);
  }
</style> 