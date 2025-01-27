<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import LanguageSwitch from './LanguageSwitch.svelte';
  import { user } from '$lib/stores/user';

  // $: {
  //   console.log('User store value:', $user);
  //   console.log('User picture value:', $user.picture);
  // }

  $: userName = $user.name;
  $: userPicture = $user.picture;
  $: isMenuEditor = $page.url.pathname === '/';
  let isDropdownOpen = false;

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST'
      });

      if (response.ok) {
        user.logout();
        goto('/login', { replaceState: true });
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  // Cerrar el dropdown cuando se hace clic fuera
  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      isDropdownOpen = false;
    }
  }
</script>

<svelte:window on:click={handleClickOutside} />

<header class="fixed top-0 right-0 p-4 flex items-center gap-4 z-50">
  {#if userName && isMenuEditor}
    <div class="relative user-menu">
      <button
        class="px-4 py-2 bg-black/30 backdrop-blur-md rounded-lg border border-white/10 hover:bg-black/40 transition-colors flex items-center gap-2"
        on:click={() => isDropdownOpen = !isDropdownOpen}
      >
        {#if userPicture}
          <img 
            src={userPicture} 
            alt="Profile" 
            class="w-10 h-10 rounded-full object-cover"
            on:error={(e) => {
              console.error('Error loading image:', e);
              const img = e.currentTarget;
              console.log('Failed URL:', img.src);
            }}
          />
        {:else}
          <div class="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <span class="text-white text-sm">{userName?.[0]?.toUpperCase()}</span>
          </div>
        {/if}
        <span class="text-sm font-medium text-white whitespace-nowrap">
          {userName}
        </span>
      </button>

      {#if isDropdownOpen}
        <div class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#25262b] border border-[#2f3136] z-50">
          <div class="py-1">
            <button
              class="w-full px-4 py-2 text-sm text-white hover:bg-black/20 text-left transition-colors"
              on:click={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      {/if}
    </div>
  {/if}
  <LanguageSwitch />
</header>

<style>
  span {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>