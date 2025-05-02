<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import LanguageSwitch from './LanguageSwitch.svelte';
  import { user } from '$lib/stores/user';
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/i18n/translations';

  // $: {
  //   console.log('User store value:', $user);
  //   console.log('User picture value:', $user.picture);
  // }

  $: userName = $user.name;
  $: userPicture = $user.picture;
  $: isMenuEditor = $page.url.pathname === '/';
  let isDropdownOpen = false;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    if (!translations || !translations[key] || !translations[key][currentLanguage]) {
      // Fallback to key or a default language like 'es' if needed
      return translations[key]?.['es'] || key;
    }
    return translations[key][currentLanguage];
  };

  function handleImageError(e: Event) {
    console.error('Error loading image:', e);
    const img = e.target as HTMLImageElement;
    console.log('Failed URL:', img.src);
  }

  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
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

<header class="fixed top-0 right-0 p-1 sm:p-4 flex items-center gap-2 sm:gap-4 z-50">
  {#if userName && isMenuEditor}
    <div class="relative user-menu">
      <button
        class="p-1.5 bg-black/30 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors flex items-center gap-2"
        on:click={() => isDropdownOpen = !isDropdownOpen}
      >
        {#if userPicture}
          <img
            src={userPicture}
            alt="Profile"
            class="w-8 h-8 rounded-full object-cover"
            on:error={handleImageError}
          />
        {:else}
          <div class="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <span class="text-white text-sm font-medium">{userName?.[0]?.toUpperCase()}</span>
          </div>
        {/if}
      </button>

      {#if isDropdownOpen}
        <div class="absolute right-0 mt-2 w-64 rounded-lg shadow-lg bg-white/90 backdrop-blur-md border border-black/10 z-50 overflow-hidden text-gray-800">
          <div class="p-4 flex items-center gap-3 border-b border-black/10">
            {#if userPicture}
              <img
                src={userPicture}
                alt="Profile"
                class="w-10 h-10 rounded-full object-cover"
                on:error={handleImageError}
              />
            {:else}
              <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span class="text-gray-600 text-lg font-medium">{userName?.[0]?.toUpperCase()}</span>
              </div>
            {/if}
            <div>
              <div class="font-medium text-gray-900">{userName}</div>
              <div class="text-sm text-gray-500">{$user.email || 'No email'}</div>
            </div>
          </div>

          <div class="py-2">
            <button
              class="w-full px-4 py-2 text-sm flex items-center gap-3 hover:bg-black/5 text-left transition-colors"
              on:click={handleLogout}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2.5a.5.5 0 0 0 1 0v-2.5a1.5 1.5 0 0 0-1.5-1.5h-8A1.5 1.5 0 0 0 0 4.5v9A1.5 1.5 0 0 0 1.5 15h8a1.5 1.5 0 0 0 1.5-1.5v-2.5a.5.5 0 0 0-1 0z"/>
                <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
              </svg>
              {t('logout')}
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