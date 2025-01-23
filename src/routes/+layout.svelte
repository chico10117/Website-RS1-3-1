<script lang="ts">
  import "../app.css";
  import Header from '$lib/components/Header.svelte';
  import { browser } from '$app/environment';
  import { goto } from '$app/navigation';
  import { user } from '$lib/stores/user';
  import { page } from '$app/stores';

  // Initialize user store with server data
  $: if (browser && $page.data.user) {
    user.set($page.data.user);
  }

  // Lógica de protección de ruta
  $: if (browser) {
    const isProtectedRoute = $page.url.pathname === '/';
    const isLoginRoute = $page.url.pathname === '/login';
    
    if (isProtectedRoute && !$user.name) {
      goto('/login');
    }

    if (isLoginRoute && $user.name) {
      goto('/');
    }
  }
</script>

<Header />
<slot /> 