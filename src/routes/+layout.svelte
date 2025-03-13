<script lang="ts">
  import "../app.css";
  import Header from '$lib/components/Header.svelte';
  import { browser } from '$app/environment';
  import { user } from '$lib/stores/user';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

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
</script>

<Header />
<main class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
    <slot />
  </div>
</main>

<style>
  :global(body) {
    background: linear-gradient(135deg, #e0f2fe 0%, #e0e7ff 50%, #faf5ff 100%);
    min-height: 100vh;
    margin: 0;
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