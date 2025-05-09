Project Path: src

Source Tree:

```txt
src
├── app.css
├── app.d.ts
├── app.html
├── hooks.server.ts
├── lib
│   ├── components
│   │   ├── Header.svelte
│   │   ├── LanguageSwitch.svelte
│   │   ├── menu-editor
│   │   │   ├── MenuEditor.svelte
│   │   │   ├── RestaurantSelector.svelte
│   │   │   ├── SaveButton.svelte
│   │   │   ├── categories
│   │   │   │   ├── AddCategory.svelte
│   │   │   │   ├── CategoryItem.svelte
│   │   │   │   └── CategoryList.svelte
│   │   │   ├── dishes
│   │   │   │   ├── DishForm.svelte
│   │   │   │   ├── DishItem.svelte
│   │   │   │   └── DishList.svelte
│   │   │   ├── preview
│   │   │   │   └── MenuPreview.svelte
│   │   │   └── restaurant
│   │   │       ├── ColorPicker.svelte
│   │   │       ├── CurrencyPicker.svelte
│   │   │       ├── CustomPromptInput.svelte
│   │   │       ├── LogoUploader.svelte
│   │   │       ├── MenuUploader.svelte
│   │   │       ├── PhoneInput.svelte
│   │   │       ├── QRCode.svelte
│   │   │       ├── RestaurantInfo.svelte
│   │   │       ├── RestaurantNameInput.svelte
│   │   │       ├── ThemeColorSection.svelte
│   │   │       ├── UrlInput.svelte
│   │   │       └── UrlInputSection.svelte
│   │   └── ui
│   │       ├── ConfirmDialog.svelte
│   │       ├── LanguageSwitch.svelte
│   │       ├── Toast.svelte
│   │       ├── button
│   │       │   ├── button.svelte
│   │       │   ├── index.ts
│   │       │   └── variants.ts
│   │       ├── card
│   │       │   ├── card-content.svelte
│   │       │   ├── card.svelte
│   │       │   └── index.ts
│   │       ├── checkbox
│   │       │   ├── checkbox.svelte
│   │       │   └── index.ts
│   │       ├── input
│   │       │   ├── index.ts
│   │       │   └── input.svelte
│   │       └── modal
│   │           └── modal.svelte
│   ├── config
│   │   ├── auth.ts
│   │   └── env.ts
│   ├── data
│   │   └── restaurants
│   │       ├── README.md
│   │       ├── restaurant-data-prueba-reco-1739808527066.ts
│   │       ├── restaurant-data-prueba-reco-1739808730896.ts
│   │       ├── restaurant-data-prueba-reco-1739808887868.ts
│   │       ├── restaurant-data-prueba-reco-1739809055675.ts
│   │       ├── restaurant-data-prueba-reco-1739809230507.ts
│   │       ├── restaurant-data-prueba-reco-1739809258645.ts
│   │       ├── restaurant-data-prueba-reco-1739809332833.ts
│   │       └── restaurant-data-restaurante-prueba-reco-1739809361774.ts
│   ├── env.d.ts
│   ├── i18n
│   │   └── translations.ts
│   ├── server
│   │   ├── auth
│   │   │   └── auth-server.ts
│   │   ├── database.ts
│   │   ├── email
│   │   │   └── email-server.ts
│   │   ├── migrate.ts
│   │   └── schema.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   ├── category.service.ts
│   │   ├── dish.service.ts
│   │   ├── menu.service.ts
│   │   └── restaurant.service.ts
│   ├── stores
│   │   ├── iframe-refresh.ts
│   │   ├── language.ts
│   │   ├── menu-store.ts
│   │   ├── restaurant.ts
│   │   ├── toast.ts
│   │   ├── uploaderStore.ts
│   │   └── user.ts
│   ├── types
│   │   ├── menu.types.ts
│   │   └── server-types.ts
│   ├── types.ts
│   ├── utils
│   │   ├── RestaurantInfo.helpers.ts
│   │   ├── color.helpers.ts
│   │   ├── formatters.ts
│   │   └── slug.ts
│   └── utils.ts
└── routes
    ├── +layout.js
    ├── +layout.server.ts
    ├── +layout.svelte
    ├── +page.server.ts
    ├── +page.svelte
    ├── api
    │   ├── auth
    │   │   ├── apple
    │   │   │   └── +server.ts
    │   │   ├── auth.server.ts
    │   │   ├── check
    │   │   │   └── +server.ts
    │   │   ├── facebook
    │   │   │   └── +server.ts
    │   │   ├── google
    │   │   │   └── +server.ts
    │   │   ├── logout
    │   │   │   └── +server.ts
    │   │   └── me
    │   │       └── +server.ts
    │   ├── categories
    │   │   └── [categoryId]
    │   │       └── dishes
    │   │           ├── +server.ts
    │   │           └── [dishId]
    │   │               └── +server.ts
    │   ├── process-images
    │   │   └── +server.ts
    │   ├── restaurants
    │   │   ├── +server.ts
    │   │   ├── [restaurantId]
    │   │   │   ├── +server.ts
    │   │   │   └── categories
    │   │   │       ├── +server.ts
    │   │   │       ├── [categoryId]
    │   │   │       │   ├── +server.ts
    │   │   │       │   └── dishes
    │   │   │       │       ├── +server.ts
    │   │   │       │       ├── [dishId]
    │   │   │       │       │   └── +server.ts
    │   │   │       │       ├── dish.api.ts
    │   │   │       │       └── order
    │   │   │       │           └── +server.ts
    │   │   │       ├── category.api.ts
    │   │   │       └── order
    │   │   │           └── +server.ts
    │   │   └── restaurant.api.ts
    │   ├── seed
    │   │   └── +server.ts
    │   ├── slug
    │   │   ├── +server.ts
    │   │   └── check
    │   │       └── +server.ts
    │   └── upload
    │       ├── +server.ts
    │       └── upload.api.ts
    ├── login
    │   └── +page.svelte
    └── pdftoimages
        └── +page.svelte

```

`src/app.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 225 93% 75%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }
} 
```

`src/app.d.ts`:

```ts
declare global {
  namespace App {
    interface Locals {
      user?: {
        id: string;
        email: string;
        name: string | null;
        picture: string | null;
      };
    }
  }
}

export {}; 
```

`src/app.html`:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<!-- Favicon configuration -->
		<link rel="icon" type="image/x-icon" href="%sveltekit.assets%/favicon.ico">
		<link rel="icon" type="image/svg+xml" href="%sveltekit.assets%/favicon.svg">
		<link rel="apple-touch-icon" href="%sveltekit.assets%/apple-touch-icon.png">
		<link rel="manifest" href="%sveltekit.assets%/site.webmanifest">
		<!-- WhatsApp meta tags -->
		<meta property="og:title" content="Your Smart Menu">
		<!-- Primary image (PNG for better compatibility) -->
		<meta property="og:image" content="%sveltekit.assets%/apple-touch-icon.png">
		<meta property="og:image:type" content="image/png">
		<!-- SVG version as fallback -->
		<meta property="og:image" content="%sveltekit.assets%/recologo.svg">
		<meta property="og:image:type" content="image/svg+xml">
		<meta property="og:image:width" content="180">
		<meta property="og:image:height" content="180">
		<meta name="viewport" content="width=device-width" />
		<script src="https://accounts.google.com/gsi/client" async defer></script>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html> 
```

`src/hooks.server.ts`:

```ts
import { redirect, type Handle } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const handle: Handle = async ({ event, resolve }) => {
  const authToken = event.cookies.get('auth_token');
  
  // Add user data to event.locals if authenticated
  if (authToken) {
    try {
      // Decode the JWT token
      const [, payloadBase64] = authToken.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      
      // Get user from database
      const [user] = await db.select()
        .from(users)
        .where(eq(users.email, payload.email))
        .limit(1);

      if (user) {
        event.locals.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          picture: user.picture
        };
      }
    } catch (error) {
      console.error('Error getting user data:', error);
      // Invalid token, remove it
      event.cookies.delete('auth_token', { path: '/' });
    }
  }

  // Protected routes that require authentication
  const protectedRoutes = ['/', '/restaurants', '/menu-editor'];
  const isProtectedRoute = protectedRoutes.some(route => 
    event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
  );
  const isLoginRoute = event.url.pathname === '/login';

  if (isProtectedRoute && !event.locals.user) {
    throw redirect(303, '/login');
  }

  if (isLoginRoute && event.locals.user) {
    throw redirect(303, '/restaurants');
  }

  return resolve(event);
}; 
```

`src/lib/components/Header.svelte`:

```svelte
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

<header class="fixed top-0 left-0 right-0 p-1 sm:p-4 flex justify-between items-center gap-2 sm:gap-4 z-50 bg-white/30 backdrop-blur-md border-b border-black/10">
  <!-- Logo/Title Area -->
  <div class="sm:absolute sm:left-1/2 sm:-translate-x-1/2"> 
    <a href="/" class="flex items-center gap-3 pl-2 sm:pl-0">
      <img src="/recologo.svg" alt="Reco Logo" class="h-6 sm:h-8 w-auto" />
      <h1 class="text-lg sm:text-xl font-bold text-gray-900 tracking-tight hidden sm:block">{t('appTitle')}</h1>
    </a>
  </div>

  <!-- Left placeholder only needed for centered layout on sm+ -->
  <div class="w-0 sm:hidden"></div> 
  <div class="hidden sm:block w-0"></div> <!-- Keep placeholder structure for sm+ --> 

  <!-- Right side: User Menu and Language Switch -->
  <div class="flex items-center gap-2 sm:gap-4 pr-2 sm:pr-0">
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
  </div>
</header>

<style>
  span {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
</style>
```

`src/lib/components/LanguageSwitch.svelte`:

```svelte
<script lang="ts">
  import { language } from '$lib/stores/language';

  const languages = {
    es: {
      name: 'Español',
      flag: '🇪🇸'
    },
    en: {
      name: 'English',
      flag: '🇬🇧'
    }
  };

  function toggleLanguage() {
    $language = $language === 'es' ? 'en' : 'es';
  }
</script>

<button
  class="relative inline-flex h-12 w-[96px] items-center rounded-full bg-gray-200 backdrop-blur-md border-2 p-1 hover:border-blue-400 transition-all shadow-md hover:shadow-lg"
  on:click={toggleLanguage}
>
  <span 
    class="absolute left-1.5 flex items-center justify-center w-10 h-10 rounded-full text-3xl transition-colors duration-200"
    class:bg-transparent={$language === 'en'}
  >{languages.es.flag}</span>
  <span 
    class="pointer-events-none block w-11 h-11 rounded-full bg-white transition-transform duration-200"
    class:translate-x-[42px]={$language === 'en'}
  />
  <span 
    class="absolute right-1.5 flex items-center justify-center w-10 h-10 rounded-full text-3xl transition-colors duration-200"
    class:bg-transparent={$language === 'es'}
  >{languages.en.flag}</span>
</button>

<style>
  button {
    transform-style: preserve-3d;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  button:hover {
    transform: translateY(-1px);
  }
  
  button:active {
    transform: translateY(0px);
  }
</style> 
```

`src/lib/components/menu-editor/MenuEditor.svelte`:

```svelte
<script lang="ts">
  import { menuStore } from '$lib/stores/menu-store';
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/i18n/translations';
  import { onMount } from 'svelte';
  import RestaurantInfo from './restaurant/RestaurantInfo.svelte';
  import MenuPreview from './preview/MenuPreview.svelte';
  import { toasts } from '$lib/stores/toast';
  import Toast from '$lib/components/ui/Toast.svelte';
  import CategoryList from './categories/CategoryList.svelte';
  import type { Category, Restaurant } from '$lib/types/menu.types';
  import { page } from '$app/stores';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import RestaurantSelector from './RestaurantSelector.svelte';
  import { user } from '$lib/stores/user';
  import { writable, derived, get } from 'svelte/store';
  import { generateSlug } from '$lib/utils/slug';
  import { goto } from '$app/navigation';
  import SaveButton from './SaveButton.svelte';
  import { type UpdateEvent } from '$lib/utils/RestaurantInfo.helpers';
  import { iframeRefreshTrigger } from '$lib/stores/iframe-refresh';

  const isRestaurantSelectorMinimized = writable(false);

  // Make translations reactive - ensure default values to prevent undefined errors
  $: currentLanguage = $language || 'en';
  $: t = (key: string): string => {
    if (!translations || !translations[key] || !translations[key][currentLanguage]) {
      return key; // Return the key itself as fallback
    }
    return translations[key][currentLanguage];
  };

  // Create derived stores for UI state
  const hasUnsavedChanges = derived(menuStore, $state => {
    return $state.changedItems.restaurant || 
           $state.changedItems.categories.size > 0 || 
           $state.changedItems.dishes.size > 0 ||
           $state.changedItems.deletedCategories.size > 0 ||
           $state.changedItems.deletedDishes.size > 0;
  });
  
  const isSaving = derived(menuStore, $state => $state.isSaving);

  // Debug store changes
  $: console.log('Has unsaved changes:', $hasUnsavedChanges);

  let loading = true;
  let error: string | null = null;

  onMount(async () => {
    try {
      loading = true;

      // Check if user is authenticated
      if (!$user || !$user.id) {
        console.log('User not authenticated, redirecting to login');
        error = 'User not authenticated. Please log in.';
        // Redirect to login page
        goto('/login?redirect=' + encodeURIComponent($page.url.pathname));
        return;
      }
      
      // Clear all state on page load
      menuStore.reset();
      currentRestaurant.set(null);
      
      // Check for restaurant ID in URL
      const restaurantId = $page.url.searchParams.get('restaurant');
      if (restaurantId) {
        try {
          // Load the restaurant data using the store
          await menuStore.selectRestaurant(restaurantId);
          await currentRestaurant.loadRestaurant(restaurantId);
        } catch (err) {
          console.error('Error loading restaurant data:', err);
          error = err instanceof Error ? err.message : 'Failed to load menu data';
          
          // Remove URL parameter if loading fails
          const url = new URL(window.location.href);
          url.searchParams.delete('restaurant');
          window.history.replaceState({}, '', url.toString());
        }
      } else {
        // Remove any URL parameters
        const url = new URL(window.location.href);
        url.searchParams.delete('restaurant');
        window.history.replaceState({}, '', url.toString());
      }
      
      // Load restaurants
      await refreshRestaurants();
      
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load restaurant';
    } finally {
      loading = false;
    }
  });

  // Event handlers
  async function handleRestaurantUpdate(event: CustomEvent<UpdateEvent>) {
    const updatePayload = event.detail;
    console.log('MenuEditor: handleRestaurantUpdate received:', updatePayload);

    const currentStoreState = get(menuStore);

    // Determine if it's an update or creation based on ID in payload or selectedRestaurant
    const restaurantId = updatePayload.id || currentStoreState.selectedRestaurant;
    const isUpdate = !!restaurantId && !restaurantId.startsWith('temp_');

    // Get the base data (current store state for updates, default for creation)
    const baseData = isUpdate 
      ? {
          name: currentStoreState.restaurantName,
          logo: currentStoreState.menuLogo,
          customPrompt: currentStoreState.customPrompt,
          phoneNumber: currentStoreState.phoneNumber,
          currency: currentStoreState.currency,
          color: currentStoreState.color,
          reservas: currentStoreState.reservas,
          redes_sociales: currentStoreState.redes_sociales,
          slug: currentStoreState.restaurants.find(r => r.id === restaurantId)?.slug || null
        }
      : { // Defaults for creation
          name: '',
          logo: null,
          customPrompt: null,
          phoneNumber: null,
          currency: '€',
          color: '#85A3FA',
          reservas: null,
          redes_sociales: null,
          slug: null
        };

    // Merge the incoming payload onto the base data
    // Filter out 'id' from the payload before merging
    const { id: payloadId, ...payloadWithoutId } = updatePayload;
    const mergedData = { ...baseData, ...payloadWithoutId };

    // Validate name
    if (!mergedData.name || typeof mergedData.name !== 'string' || !mergedData.name.trim()) {
      console.error('Invalid or missing restaurant name in merged data');
      // Only show error if we're saving or if the name field was directly modified
      if ((updatePayload.id || currentStoreState.selectedRestaurant) && 'name' in updatePayload) {
        toasts.error(t('error') + ': Restaurant name cannot be empty');
      }
      return;
    }

    // Validate color (ensure hex string)
    let validatedColorString = String(mergedData.color || ''); // Ensure it's a string
    if (validatedColorString && !validatedColorString.startsWith('#')) {
      console.warn('Invalid color format in merged data, defaulting to light theme.', validatedColorString);
      validatedColorString = '#85A3FA';
    }
    // Use the validated string color going forward
    mergedData.color = validatedColorString;

    // Ensure user ID exists (although create/update service might handle this)
    const userId = $user?.id;
    if (!userId) {
      console.error('Authentication error: No user ID available');
      toasts.error(t('error') + ': ' + 'User not authenticated');
      return;
    }

    try {
      if (isUpdate && restaurantId) {
        // Update existing restaurant in the store
        console.log('MenuEditor: Updating store for existing restaurant:', restaurantId, mergedData);
        menuStore.updateRestaurantInfo(
          mergedData.name,
          mergedData.logo,
          mergedData.customPrompt,
          mergedData.slug, // Pass slug from base/current data
          mergedData.phoneNumber,
          mergedData.reservas,
          mergedData.redes_sociales,
          mergedData.color, // Already validated as string
          mergedData.currency
        );
      } else {
        // Create new restaurant in the store
        console.log('MenuEditor: Calling createRestaurant in store:', mergedData);
        menuStore.createRestaurant(
          mergedData.name,
          mergedData.logo,
          mergedData.customPrompt,
          mergedData.phoneNumber,
          mergedData.reservas,
          mergedData.redes_sociales,
          mergedData.currency
          // Note: Color is handled internally by createRestaurant based on current store state
        );
        // Post-creation sync with currentRestaurant might need review
        const newState = get(menuStore);
        const newRestaurant = newState.restaurants.find(r => r.id === newState.selectedRestaurant);
        if (newRestaurant) {
          currentRestaurant.set(newRestaurant); // Sync currentRestaurant store
        }
      }
    } catch (error) {
       console.error("Error processing restaurant update in store:", error);
       toasts.error(t('error') + ': ' + (error instanceof Error ? error.message : 'Failed to update restaurant'));
    }
  }

  function handleCategoriesUpdate(event: CustomEvent<Category[]>) {
    // This will be handled differently with the new store
    // Each category will be updated individually through the store methods
    console.log('Categories updated:', event.detail);
  }

  async function handleRestaurantSelect(event: CustomEvent<string>) {
    try {
      // Load the restaurant data
      const restaurantId = event.detail;
      await menuStore.selectRestaurant(restaurantId);
      await currentRestaurant.loadRestaurant(restaurantId);
    } catch (error) {
      console.error('Error selecting restaurant:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  async function saveAllChanges() {
    try {
      console.log('Starting save operation...');
      
      const result = await menuStore.saveChanges();
      
      // Reload the current restaurant data to ensure frontend is in sync with database
      if (result && result.restaurant.id) {
        await menuStore.selectRestaurant(result.restaurant.id);
        await refreshRestaurants();
      }
      
      toasts.success(t('saveSuccess'));
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  // Add this function to refresh restaurants
  async function refreshRestaurants() {
    try {
      // Check if user is authenticated
      if (!$user || !$user.id) {
        console.error('User not authenticated, cannot refresh restaurants');
        error = 'User not authenticated. Please log in.';
        return;
      }
      
      const restaurants = await currentRestaurant.loadRestaurants();
      if (restaurants) {
        // Update the restaurants in the store
        await menuStore.loadRestaurants();
        console.log(`Loaded ${restaurants.length} restaurants`);
      } else {
        console.log('No restaurants found or error loading restaurants');
      }
    } catch (error) {
      console.error('Error refreshing restaurants:', error);
    }
  }
</script>

<div class="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
  {#if loading}
    <div class="text-center text-gray-600">
      Loading restaurants...
    </div>
  {:else if error}
    <div class="text-center text-red-500">
      {error}
    </div>
  {:else}
    <div class="glass rounded-3xl p-3 sm:p-8">
      <!-- Restaurant selector -->
      <div class="mb-4 sm:mb-8">
        <RestaurantSelector 
          on:select={handleRestaurantSelect}
          on:toggleMinimized={() => isRestaurantSelectorMinimized.set(false)}
        />
      </div>

      <!-- Main content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        <!-- Left column: Restaurant info and categories -->
        <div>
          <div class="bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-4 sm:p-6">
            <RestaurantInfo 
              restaurantName={$menuStore.restaurantName}
              menuLogo={$menuStore.menuLogo}
              customPrompt={$menuStore.customPrompt}
              selectedRestaurant={$menuStore.selectedRestaurant}
              restaurants={$menuStore.restaurants}
              currency={$menuStore.currency || '€'}
              color={$menuStore.color || '#85A3FA'}
              phoneNumber={$menuStore.phoneNumber || null}
              reservas={$menuStore.reservas || null}
              redes_sociales={$menuStore.redes_sociales || null}
              on:update={handleRestaurantUpdate}
            />
          
            <div class="mt-4 sm:mt-8">
              <CategoryList 
                categories={$menuStore.categories}
                selectedRestaurant={$menuStore.selectedRestaurant}
                restaurantName={$menuStore.restaurantName}
                currency={$menuStore.currency || '€'}
                on:update={handleCategoriesUpdate}
              />
            </div>
          </div>
        </div>
        
        <!-- Right column: Menu preview -->
        <div>
          <div class="bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-4 sm:p-6">
            <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 tracking-tight">{t('menuPreview')}</h2>
            <div class="flex justify-center">
              <div class="iphone-frame scale-[0.8] md:scale-100 -mt-16 md:mt-0">
                <div class="relative w-full h-full flex justify-center">
                  {#if $currentRestaurant?.slug}
                    <iframe
                      src={`https://${$currentRestaurant.slug}.reco.restaurant?v=${$iframeRefreshTrigger}`}
                      title="Menu Preview"
                      class="w-full h-full rounded-[40px]"
                      loading="lazy"
                    ></iframe>
                  {:else}
                    <div class="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[40px]">
                      <p class="text-gray-500">{t('noRestaurantSelected')}</p>
                    </div>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<!-- Sticky save button that moves with scroll -->
<div class="sticky bottom-4 sm:bottom-8 float-right mr-2 sm:mr-8 z-50">
  <SaveButton />
</div>

<style>
  :global(input[type="text"]) {
    @apply border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm;
  }
  
  :global(input[type="text"]::placeholder) {
    @apply text-gray-400;
  }

  span {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

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

  /* Removed the notch styling */
</style> 
```

`src/lib/components/menu-editor/RestaurantSelector.svelte`:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import type { Restaurant } from '$lib/types/menu.types';
  import { Button } from '$lib/components/ui/button';
  import { menuStore } from '$lib/stores/menu-store';
  import * as restaurantService from '$lib/services/restaurant.service';
  import { toasts } from '$lib/stores/toast';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import ConfirmDialog from '$lib/components/ui/ConfirmDialog.svelte';

  let restaurants: Restaurant[] = [];
  let loading = true;
  let error: string | null = null;
  let switchingRestaurant: string | null = null;
  let editingRestaurant: string | null = null;
  let deletingRestaurant: string | null = null;
  let showDeleteConfirm = false;
  let restaurantToDelete: Restaurant | null = null;
  let isCollapsed = false;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Add subscription to menuStore to detect saves
  $: if ($menuStore.lastSaveTime) {
    // Refresh the restaurants list after successful save
    refreshRestaurants();
  }

  // Add this helper function to sort restaurants by creation date
  function sortRestaurantsByDate(restaurants: Restaurant[]) {
    return [...restaurants].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  }

  onMount(async () => {
    try {
      loading = true;
      // Clear all state on page load
      menuStore.reset();
      currentRestaurant.set(null);
      
      // Load and sort restaurants
      const loadedRestaurants = await currentRestaurant.loadRestaurants();
      restaurants = sortRestaurantsByDate(loadedRestaurants);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load restaurants';
    } finally {
      loading = false;
    }
  });

  async function handleRestaurantSelect(restaurant: Restaurant) {
    try {
      switchingRestaurant = restaurant.id;
      
      // Clear previous state
      menuStore.reset();
      
      // Load the restaurant data
      await currentRestaurant.loadRestaurant(restaurant.id);
      
      // If this is a new restaurant that hasn't been saved yet, update the local array
      if (!restaurants.find(r => r.id === restaurant.id)) {
        restaurants = [...restaurants, restaurant];
      }
      
      // Update URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.set('restaurant', restaurant.id);
      window.history.replaceState({}, '', url.toString());
      
      console.log('Selecting restaurant in menuStore:', restaurant.id, restaurant.name);
      
      // Load the restaurant data using the store
      await menuStore.selectRestaurant(restaurant.id);
      
      console.log('Restaurant selected successfully:', {
        restaurantId: restaurant.id,
        menuStoreSelectedRestaurant: menuStore.subscribe(state => state.selectedRestaurant)
      });
      
    } catch (err) {
      console.error('Error switching restaurant:', err);
      error = err instanceof Error ? err.message : 'Failed to switch restaurant';
    } finally {
      switchingRestaurant = null;
    }
  }

  async function handleAddRestaurant() {
    // Clear current restaurant and URL parameter
    menuStore.reset();
    currentRestaurant.set(null);
    
    // Remove restaurant parameter from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('restaurant');
    window.history.replaceState({}, '', url.toString());
  }

  async function handleEditRestaurant(restaurant: Restaurant, event: Event) {
    event.stopPropagation(); // Prevent restaurant selection
    editingRestaurant = restaurant.id;
    // Load the restaurant for editing
    await handleRestaurantSelect(restaurant);
  }

  async function handleDeleteRestaurant(restaurant: Restaurant, event: Event) {
    event.stopPropagation(); // Prevent restaurant selection
    restaurantToDelete = restaurant;
    showDeleteConfirm = true;
  }

  async function confirmDelete() {
    if (!restaurantToDelete) return;
    
    try {
      deletingRestaurant = restaurantToDelete.id;
      await restaurantService.deleteRestaurant(restaurantToDelete.id);
      
      // Refresh restaurants list
      restaurants = await currentRestaurant.loadRestaurants();
      
      // Clear state if the deleted restaurant was selected
      if ($currentRestaurant?.id === restaurantToDelete.id) {
        menuStore.reset();
        currentRestaurant.set(null);
      }
      
      toasts.success(t('restaurantDeleteSuccess'));
    } catch (err) {
      console.error('Error deleting restaurant:', err);
      toasts.error(t('error') + ': ' + (err instanceof Error ? err.message : 'Failed to delete restaurant'));
    } finally {
      deletingRestaurant = null;
      restaurantToDelete = null;
      showDeleteConfirm = false;
    }
  }

  function cancelDelete() {
    restaurantToDelete = null;
    showDeleteConfirm = false;
  }

  function toggleCollapse() {
    isCollapsed = !isCollapsed;
  }

  async function refreshRestaurants() {
    try {
      // Load fresh data and sort
      const loadedRestaurants = await currentRestaurant.loadRestaurants();
      restaurants = sortRestaurantsByDate(loadedRestaurants);
    } catch (err) {
      console.error('Error refreshing restaurants:', err);
      error = err instanceof Error ? err.message : 'Failed to refresh restaurants';
    }
  }
</script>

<div class="w-full max-w-[1200px] mx-auto">
  <div class="p-3 sm:p-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center">
        <p class="text-gray-500 text-base mr-2">{t('selectRestaurantManage')}</p>
        {#if restaurants.length > 0}
          <Button variant="ghost" size="icon" on:click={toggleCollapse} class="h-6 w-6 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transform transition-transform duration-200 {isCollapsed ? 'rotate-180' : ''}" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </Button>
        {/if}
      </div>
      <Button
        variant="outline"
        class="bg-white/90 text-gray-900 hover:bg-blue-500 hover:text-white border-gray-200 hover:border-blue-500 transition-all duration-200 rounded-full px-4 py-1.5 text-xs"
        on:click={handleAddRestaurant}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        {t('addRestaurant')}
      </Button>
    </div>
    
    {#if loading}
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
        <span class="ml-3 text-gray-500">{t('loading')}</span>
      </div>
    {:else if error}
      <div class="bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
        <p class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          {error}
        </p>
      </div>
    {:else if restaurants.length === 0}
      <div class="flex flex-col items-center justify-center py-8 sm:py-12 text-center">
        <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-50 flex items-center justify-center mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-gray-700 text-base sm:text-lg font-medium">{t('noRestaurantsFound')}</p>
        <p class="text-gray-500 text-sm mt-1">{t('addFirstRestaurant')}</p>
      </div>
    {:else}
      {#if !isCollapsed}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        {#each restaurants as restaurant (restaurant.id)}
          <button
            class="group relative flex flex-col items-center justify-center p-4 rounded-xl border
                   {$currentRestaurant?.id === restaurant.id ? 
                     'bg-blue-500/90 text-white border-blue-400 shadow-sm' : 
                     'bg-white/80 text-gray-900 border-gray-100 hover:border-blue-200 hover:bg-white/90'}
                   transition-all duration-200"
            on:click={() => handleRestaurantSelect(restaurant)}
            disabled={switchingRestaurant === restaurant.id || deletingRestaurant === restaurant.id}
          >
            {#if restaurant.logo}
              <img 
                src={restaurant.logo} 
                alt={restaurant.name} 
                class="w-16 h-16 rounded-lg object-contain mb-2"
              />
            {:else}
              <div class="w-16 h-16 rounded-lg bg-gray-50 flex items-center justify-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              </div>
            {/if}
            
            <span class="text-sm font-medium truncate max-w-full px-1">
              {restaurant.name}
            </span>
            
            {#if switchingRestaurant === restaurant.id}
              <span class="text-xs text-gray-500 mt-1">{t('loading')}</span>
            {/if}

            <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1">
              <button
                class="p-1 rounded-full transition-colors
                {$currentRestaurant?.id === restaurant.id ? 'bg-white/40 hover:bg-white/60' : 'hover:bg-black/5'}"
                on:click={(e) => handleEditRestaurant(restaurant, e)}
                disabled={editingRestaurant === restaurant.id}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 {$currentRestaurant?.id === restaurant.id ? 'text-white' : 'text-gray-600'}" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              <button
                class="p-1 rounded-full transition-colors
                {$currentRestaurant?.id === restaurant.id ? 'bg-white/40 hover:bg-white/60' : 'hover:bg-red-50'}"
                on:click={(e) => handleDeleteRestaurant(restaurant, e)}
                disabled={deletingRestaurant === restaurant.id}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 {$currentRestaurant?.id === restaurant.id ? 'text-red-300' : 'text-red-600'}" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </button>
        {/each}
      </div>
      {/if}
    {/if}
  </div>
</div>

<ConfirmDialog
  message={t('confirmDeleteRestaurant')}
  show={showDeleteConfirm}
  on:confirm={confirmDelete}
  on:cancel={cancelDelete}
/> 
```

`src/lib/components/menu-editor/SaveButton.svelte`:

```svelte
<script lang="ts">
  import { menuStore } from '$lib/stores/menu-store';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import * as menuService from '$lib/services/menu.service';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { generateSlug } from '$lib/utils/slug';
  import { io } from 'socket.io-client';
  import {onMount} from "svelte";
  import { triggerIframeRefresh } from '$lib/stores/iframe-refresh';
  //console.log("SERVER IO",process.env.SMART_SERVER_HOST )
  // Initialize the socket connection with user id as namespace
  const socket = io(process.env.SMART_SERVER_HOST || 'https://reco.ucontext.live');

  // Function to clean phone number - ensure it's a valid number without spaces
  function cleanPhoneNumber(phone: number | null | undefined): number | null {
    if (phone === null || phone === undefined) return null;
    
    // Convert to string, remove all spaces and non-digit characters
    const cleaned = phone.toString().replace(/\s+/g, '').replace(/\D/g, '');
    
    // Convert back to number if we have digits
    if (cleaned.length > 0) {
      const numericValue = Number(cleaned);
      if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
        return numericValue;
      }
    }
    return null;
  }

  // Make translations reactive with fallbacks to prevent errors
  $: currentLanguage = $language || 'en';
  $: t = (key: string): string => {
    if (!translations || !translations[key] || !translations[key][currentLanguage]) {
      return key; // Return the key itself as fallback
    }
    return translations[key][currentLanguage];
  };

  onMount(()=> {

    socket.on('connect', () => {
      console.log('Connected to server', $menuStore);
    })
    socket.emit('check', 'Hello from the client');

    socket.on('images-generating', () => {
      console.log('Procesando imagenes');
    });
    socket.on('image-generated', () => {
      console.log('Imagen Generada');
    });
    socket.on('queue-finished', () => {
      console.log('Queue finished');
      toasts.success(t('completedProcessingImages') || 'Images created');
    });
  })




  // Reactive variables for UI state
  $: hasUnsavedChanges = $menuStore.changedItems.restaurant || 
                         $menuStore.changedItems.categories.size > 0 || 
                         $menuStore.changedItems.dishes.size > 0 ||
                         $menuStore.changedItems.deletedCategories.size > 0 ||
                         $menuStore.changedItems.deletedDishes.size > 0;
  
  $: isSaving = $menuStore.isSaving;
  $: lastSaveTime = $menuStore.lastSaveTime;
  $: selectedRestaurant = $menuStore.selectedRestaurant;
  $: restaurantName = $menuStore.restaurantName;

  // For debugging
  $: console.log('Save button state:', {
    selectedRestaurant,
    restaurantName,
    restaurantChanged: $menuStore.changedItems.restaurant,
    categoriesChanged: $menuStore.changedItems.categories.size,
    dishesChanged: $menuStore.changedItems.dishes.size,
    deletedCategories: $menuStore.changedItems.deletedCategories.size,
    deletedDishes: $menuStore.changedItems.deletedDishes.size,
    hasUnsavedChanges,
    currentLanguage,
    reservas: $menuStore.reservas,
    redes_sociales: $menuStore.redes_sociales
  });

  // Format the last save time
  function formatLastSaveTime(date: Date | null): string {
    if (!date) return '';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // If less than a minute ago
    if (diff < 60000) {
      return t('justNow') || 'Just now';
    }
    
    // If less than an hour ago
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} ${minutes === 1 ? (t('minuteAgo') || 'minute ago') : (t('minutesAgo') || 'minutes ago')}`;
    }
    
    // Otherwise format as time
    return date.toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  async function saveChanges() {
    if (!selectedRestaurant && !restaurantName) {
      toasts.error(t('noRestaurantSelected') || 'No restaurant selected');
      return;
    }

    // Clean the phone number before saving
    const cleanedPhoneNumber = cleanPhoneNumber($menuStore.phoneNumber);
    console.log('Cleaned phone number before save:', cleanedPhoneNumber);

    // Debug URLs and entire menuStore state to see where the issue is
    console.log('Before saving - Complete state:', {
      entireMenuStore: $menuStore,
      colorValue: $menuStore.color,
      reservas: $menuStore.reservas,
      redes_sociales: $menuStore.redes_sociales,
      phoneNumber: cleanedPhoneNumber
    });

    // Ensure color is a hex value, not 'light' or '1'
    const colorValue = $menuStore.color === 'light' || $menuStore.color === '1' 
      ? '#85A3FA' 
      : $menuStore.color;
    
    console.log('Starting save with color:', colorValue);

    try {
      // If we have a restaurant name but no selected restaurant, we need to create a new one
      if (restaurantName && !selectedRestaurant) {
        // Generate a slug for the new restaurant
        const newSlug = await generateSlug(restaurantName);
        
        console.log('Creating restaurant with color:', colorValue, 'and URLs:', {
          reservas: $menuStore.reservas,
          redes_sociales: $menuStore.redes_sociales,
          phoneNumber: cleanedPhoneNumber
        });
        
        // Create the restaurant in the store with cleaned phone number
        menuStore.createRestaurant(
          restaurantName,
          $menuStore.menuLogo,
          $menuStore.customPrompt,
          cleanedPhoneNumber,
          $menuStore.reservas,
          $menuStore.redes_sociales
        );
        
        // Get the newly created restaurant ID
        const storeState = $menuStore;
        const newId = storeState.selectedRestaurant;
        
        if (!newId) {
          throw new Error('Failed to create restaurant');
        }
        
        console.log('Updating restaurant with color:', colorValue);
        
        // Update with the proper slug and cleaned phone number
        menuStore.updateRestaurantInfo(
          restaurantName,
          $menuStore.menuLogo,
          $menuStore.customPrompt,
          newSlug,
          cleanedPhoneNumber,
          $menuStore.reservas,
          $menuStore.redes_sociales,
          colorValue
        );
        
        // Update the current restaurant store
        if ($currentRestaurant === null) {
          const newRestaurant = storeState.restaurants.find(r => r.id === newId);
          if (newRestaurant) {
            currentRestaurant.set({
              ...newRestaurant,
              slug: newSlug,
              color: colorValue,
              reservas: $menuStore.reservas,
              redes_sociales: $menuStore.redes_sociales
            });
          }
        }
      }
      
      // CRITICAL: Make absolutely sure the URL values are set before saving
      // This should not be necessary, but we're adding it as a failsafe
      let currentReservas = $menuStore.reservas; 
      let currentRedesSociales = $menuStore.redes_sociales;
      
      console.log('CRITICAL CHECK - RIGHT BEFORE SAVE:', {
        reservas: currentReservas,
        redes_sociales: currentRedesSociales
      });
      
      console.log('Calling saveChanges with color in store:', colorValue, 
        'reservas:', $menuStore.reservas, 
        'redes_sociales:', $menuStore.redes_sociales
      );
      
      // Use the menuStore's saveChanges method to save all changes
      const result = await menuStore.saveChanges();
      
      // Debug the result
      console.log('*******Save result:', {
        //logo: result.restaurant.logo,
        customPrompt: result.restaurant.customPrompt,
        color: result.restaurant.color,
        currency: result.restaurant.currency,
        phoneNumber: result.restaurant.phoneNumber,
        reservas: result.restaurant.reservas,
        redes_sociales: result.restaurant.redes_sociales,
      });
      
      const restId = $menuStore.selectedRestaurant;
      if (restId && restId !== 'a5f22abe-cc7d-465a-9ac6-90ba946ef28b'){
        socket.emit('request-images', restId);
      }

      // Show success message
      toasts.success(t('changesSaved') || 'Changes saved');
      
      // Trigger iframe refresh
      triggerIframeRefresh();
      
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        toasts.error((t('error') || 'Error') + ': ' + error.message);
      } else {
        toasts.error((t('error') || 'Error') + ': ' + (t('unknownError') || 'Unknown error'));
      }
    }
  }
</script>

<div class="flex items-center gap-4">
  <button
    class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
    on:click={saveChanges}
    disabled={(!selectedRestaurant && !restaurantName) || (!hasUnsavedChanges && !$menuStore.changedItems.restaurant) || isSaving}
  >
    {#if isSaving}
      <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      {t('saving') || 'Saving...'}
    {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      {t('save') || 'Save'}
    {/if}
  </button>
  
  <!-- {#if lastSaveTime}
    <span class="text-sm text-gray-500">
      {(t('lastSaved') || 'Last saved')}: {formatLastSaveTime(lastSaveTime)}
    </span>
  {/if} -->
</div>

<style>
  button {
    min-width: 100px;
  }
</style> 
```

`src/lib/components/menu-editor/categories/AddCategory.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import { menuStore } from '$lib/stores/menu-store';

  export let selectedRestaurant: string | null;
  export let restaurantName: string = '';

  const dispatch = createEventDispatcher<{
    add: Category;
  }>();

  let newCategory = '';

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  async function addCategory() {
    // Allow adding category if we have either a selectedRestaurant ID or a restaurant name
    if (newCategory.trim() && (selectedRestaurant || restaurantName)) {
      try {
        // Create a temporary ID for the new category
        const tempId = `temp_${Math.random().toString(36).substring(2, 11)}`;
        
        // Dispatch the event with the new category
        const category: Category = {
          id: tempId,
          name: newCategory.trim(),
          dishes: [],
          restaurantId: selectedRestaurant || tempId // Use temporary ID if no restaurant ID yet
        };
        dispatch('add', category);
        
        // Clear the input field
        newCategory = '';
        
        // Show success toast
        toasts.success(t('categoryAddSuccess') || 'Category added successfully');
      } catch (error) {
        console.error('Error adding category:', error);
        if (error instanceof Error) {
          toasts.error(t('error') + ': ' + error.message);
        }
      }
    } else if (!newCategory.trim()) {
      // Show error if category name is empty
      toasts.error(t('error') + ': ' + (t('categoryNameRequired') || 'Category name is required'));
    } else {
      // Show error if no restaurant selected
      toasts.error(t('pleaseEnterRestaurantNameFirst'));
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addCategory();
    }
  }
</script>

<div class="flex items-center space-x-2">
  <input
    type="text"
    class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
    placeholder={t('categoryName')}
    bind:value={newCategory}
    on:keydown={handleKeyPress}
  />
  <button 
    class="px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
    on:click={addCategory}
    disabled={!selectedRestaurant && !restaurantName}
  >
    {t('add')}
  </button>
</div> 
```

`src/lib/components/menu-editor/categories/CategoryItem.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category, Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import DishList from '../dishes/DishList.svelte';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let category: Category;
  export let index: number;
  export let isSelected: boolean;
  export let currency: string = '€';

  const dispatch = createEventDispatcher<{
    update: { index: number; category: Category };
    delete: number;
    toggle: void;
  }>();

  let isEditing = false;
  let editingName = '';

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Use the currency from currentRestaurant if available
  $: if ($currentRestaurant && $currentRestaurant.currency) {
    currency = $currentRestaurant.currency;
  }

  function startEditing() {
    isEditing = true;
    editingName = category.name;
    // Expand the category if it's not already selected
    if (!isSelected) {
      dispatch('toggle');
    }
  }

  function cancelEditing() {
    isEditing = false;
    editingName = '';
    // Note: We are not collapsing on cancel, as per the thought process.
    // If the user expanded it manually before editing, collapsing might be unexpected.
  }

  async function updateCategoryName() {
    if (!editingName.trim()) return;

    try {
      // Update the category in menuStore directly
      menuStore.updateCategory(category.id, editingName.trim());
      
      // Create updated category object for the parent component
      const updatedCategory = {
        ...category,
        name: editingName.trim(),
        dishes: category.dishes || [] // Preserve dishes
      };

      // Dispatch update event for backward compatibility
      dispatch('update', {
        index,
        category: updatedCategory
      });
      
      isEditing = false;
      // Collapse the category after successful update if it was selected
      if (isSelected) {
        dispatch('toggle');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  function requestDeleteConfirmation() {
    const confirmationMessage = t('confirmDeleteCategory') || 'Are you sure you want to delete this category and all its dishes?';
    if (window.confirm(confirmationMessage)) {
      deleteCategory();
    }
  }

  async function deleteCategory() {
    // Remove the confirmation dialog and directly delete the category
    try {
      // Delete the category in menuStore directly
      menuStore.deleteCategory(category.id);
      
      // Dispatch delete event for backward compatibility
      dispatch('delete', index);
      
      // Show success toast
      toasts.success(t('categoryDeleteSuccess') || t('deleteSuccess'));
    } catch (error) {
      console.error('Error deleting category:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  async function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await updateCategoryName();
    } else if (event.key === 'Escape') {
      cancelEditing();
    }
  }

  function handleDishesUpdate(event: CustomEvent<Dish[]>) {
    const updatedDishes = event.detail;
    
    // Create a new category object with the updated dishes
    const updatedCategory = {
      ...category,
      dishes: updatedDishes
    };

    // Dispatch the update event
    dispatch('update', {
      index,
      category: updatedCategory
    });
  }
</script>

<div class="flex flex-col p-2">
  <!-- Category Header -->
  <div 
    class="flex items-center justify-between bg-white/30 backdrop-blur-sm p-2 rounded hover:bg-white/40 transition-colors"
  >
    <!-- Drag Handle (draggable by default via parent) -->
    <div class="category-drag-handle mr-2 cursor-grab text-gray-500 hover:text-gray-700 p-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>

    <!-- Toggle Button (prevent drag) -->
    <button 
      class="mr-2 p-1 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center h-6 w-6"
      on:click|stopPropagation={() => dispatch('toggle')}
      draggable="false"
    >
      {#if isSelected}
        <!-- Minus icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
        </svg>
      {:else}
        <!-- Plus icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      {/if}
    </button>

    {#if isEditing}
      <!-- Editing View (prevent drag) -->
      <div class="flex-1 flex items-center space-x-2" draggable="false">
        <input
          type="text"
          class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
          bind:value={editingName}
          on:keydown={handleKeyPress}
          autofocus
        />
        <button 
          class="p-2 text-green-500 hover:text-green-600"
          on:click|stopPropagation={updateCategoryName}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          class="p-2 text-gray-500 hover:text-gray-600"
          on:click|stopPropagation={cancelEditing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    {:else}
      <!-- Display View (prevent drag on name and actions) -->
      <div 
        class="flex-1 font-medium text-gray-800 cursor-pointer" 
        draggable="false" 
        on:click={() => { console.log('CategoryItem: Name clicked, dispatching toggle for ID:', category.id); dispatch('toggle'); }}
        on:keypress={() => { console.log('CategoryItem: Name keypress, dispatching toggle for ID:', category.id); dispatch('toggle'); }}
        role="button"
        tabindex="0"
      >{category.name}</div>
      <div class="flex space-x-1" draggable="false">
        <button 
          class="p-1 text-gray-500 hover:text-blue-500"
          on:click|stopPropagation={startEditing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button 
          class="p-1 text-gray-500 hover:text-red-500"
          on:click|stopPropagation={requestDeleteConfirmation}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    {/if}
  </div>

  <!-- Dishes List -->
  {#if isSelected}
    <div class="mt-2 pl-4">
      <DishList
        dishes={category.dishes || []}
        categoryId={category.id}
        {currency}
        on:update={handleDishesUpdate}
      />
    </div>
  {/if}
</div> 
```

`src/lib/components/menu-editor/categories/CategoryList.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category, Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import CategoryItem from './CategoryItem.svelte';
  import AddCategory from './AddCategory.svelte';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';

  export let selectedRestaurant: string | null;
  export let restaurantName: string = '';
  export let currency: string = '€';

  const dispatch = createEventDispatcher<{
    update: Category[];
  }>();

  let selectedCategoryId: string | null = null;
  const flipDurationMs = 300;

  let localCategories: Category[] = $menuStore.categories;
  let isDragging = false;

  $: if (!isDragging) {
    if (JSON.stringify(localCategories) !== JSON.stringify($menuStore.categories)) {
      localCategories = $menuStore.categories;
    }
  }

  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  $: if ($currentRestaurant && $currentRestaurant.currency) {
    currency = $currentRestaurant.currency;
  }

  $: categoryNameMap = new Map(localCategories.map((cat: Category) => [cat.name.toLowerCase(), cat.id]));

  function isCategoryNameDuplicate(name: string, excludeId?: string): boolean {
    const existingId = categoryNameMap.get(name.toLowerCase());
    return existingId !== undefined && existingId !== excludeId;
  }

  async function handleCategoryAdd(event: CustomEvent<Category>) {
    const category = event.detail;
    if (isCategoryNameDuplicate(category.name)) {
      toasts.error(t('error') + ': ' + t('categoryNameExists'));
      return;
    }
    const newCategoryId = menuStore.addCategory(category.name);
    selectedCategoryId = newCategoryId;
    dispatch('update', $menuStore.categories);
  }

  async function handleCategoryUpdate(event: CustomEvent<{ index: number; category: Category }>) {
    const { category } = event.detail;
    const existingCategory = localCategories.find((c: Category) => c.id === category.id);
    if (existingCategory && category.name !== existingCategory.name) {
      if (isCategoryNameDuplicate(category.name, category.id)) {
        toasts.error(t('error') + ': ' + t('categoryNameExists'));
        return;
      }
    }
    menuStore.updateCategory(category.id, category.name);
    dispatch('update', $menuStore.categories);
  }

  async function handleCategoryDelete(index: number) {
    const categoryToDelete = localCategories[index];
    if (!categoryToDelete) return;

    menuStore.deleteCategory(categoryToDelete.id);
    if (selectedCategoryId === categoryToDelete.id) {
      selectedCategoryId = null;
    }
    dispatch('update', $menuStore.categories);
  }

  function toggleCategory(categoryId: string) {
    console.log('CategoryList: toggleCategory called for ID:', categoryId, ' | Current selectedCategoryId:', selectedCategoryId);
    selectedCategoryId = selectedCategoryId === categoryId ? null : categoryId;
    console.log('CategoryList: NEW selectedCategoryId:', selectedCategoryId);
  }

  function handleDndConsider(e: CustomEvent<DndEvent<Category>>) {
    isDragging = true;
    localCategories = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<Category>>) {
    isDragging = false;
    localCategories = e.detail.items;
    menuStore.reorderCategories(localCategories);
    dispatch('update', localCategories);
  }
</script>

<div class="space-y-3">
  <h2 class="text-lg font-semibold mb-3 text-gray-800">{t('categories')}</h2>
  
  <AddCategory
    {selectedRestaurant}
    {restaurantName}
    on:add={handleCategoryAdd}
  />

  <div 
    class="bg-white/20 backdrop-blur-md rounded-lg border border-white/50 overflow-hidden" 
    use:dndzone={{ items: localCategories, flipDurationMs }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
  >
    {#each localCategories as category, index (category.id)} 
      <div animate:flip={{duration: flipDurationMs}}>
        <CategoryItem
          {category}
          {index}
          {currency}
          isSelected={selectedCategoryId === category.id}
          on:update={handleCategoryUpdate} 
          on:delete={() => handleCategoryDelete(index)} 
          on:toggle={() => toggleCategory(category.id)}
        />
      </div>
    {/each}
  </div>
</div> 
```

`src/lib/components/menu-editor/dishes/DishForm.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dish } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let categoryId: string;
  export let currency: string = '€';

  const dispatch = createEventDispatcher<{
    add: Dish;
  }>();

  interface NewDish {
    id: string;
    title: string;
    price: string;  // Keep as string for form input
    description: string;
    imageUrl: string | null;
    categoryId: string;
  }

  let newDish: NewDish = {
    id: '',
    title: '',
    price: '',
    description: '',
    imageUrl: null,
    categoryId: ''
  };

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][currentLanguage] || key;
  };

  // Use the currency from currentRestaurant if available
  $: if ($currentRestaurant && $currentRestaurant.currency) {
    currency = $currentRestaurant.currency;
  }

  async function handleImageUpload(event: Event) {
    try {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const errorDiv = document.getElementById('dish-form-error');
        const errorText = errorDiv?.querySelector('span');
        if (errorDiv && errorText) {
          errorText.textContent = t('invalidFileType') + ' (JPEG, PNG, WebP)';
          errorDiv.classList.remove('hidden');
          setTimeout(() => {
            errorDiv.classList.add('hidden');
          }, 3000);
        }
        return;
      }

      // Validate file size (max 4MB)
      const maxSize = 4 * 1024 * 1024; // 4MB in bytes
      if (file.size > maxSize) {
        const errorDiv = document.getElementById('dish-form-error');
        const errorText = errorDiv?.querySelector('span');
        if (errorDiv && errorText) {
          errorText.textContent = t('fileTooLarge') + ' (max 4MB)';
          errorDiv.classList.remove('hidden');
          setTimeout(() => {
            errorDiv.classList.add('hidden');
          }, 3000);
        }
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing upload response:', parseError);
        throw new Error(t('invalidServerResponse'));
      }
      
      if (!data.success) {
        throw new Error(data.error || t('fileUploadError'));
      }

      newDish = { ...newDish, imageUrl: data.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorDiv = document.getElementById('dish-form-error');
      const errorText = errorDiv?.querySelector('span');
      if (errorDiv && errorText) {
        errorText.textContent = error instanceof Error ? error.message : t('fileUploadError');
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
          errorDiv.classList.add('hidden');
        }, 3000);
      }
    } finally {
      // Reset the file input
      const input = event.target as HTMLInputElement;
      input.value = '';
    }
  }

  async function addDish() {
    if (!newDish.title.trim() || !newDish.price) {
      toasts.error(t('error') + ': ' + t('titleAndPriceRequired'));
      return;
    }

    try {
      // Add the dish directly to the menuStore
      menuStore.addDish(categoryId, {
        title: newDish.title.trim(),
        price: newDish.price,
        description: newDish.description.trim(),
        imageUrl: newDish.imageUrl
      });
      
      // Also dispatch the event for backward compatibility
      const dish: Dish = {
        id: crypto.randomUUID(),
        categoryId,
        title: newDish.title.trim(),
        price: newDish.price,
        description: newDish.description.trim(),
        imageUrl: newDish.imageUrl
      };
      
      // Dispatch the event
      dispatch('add', dish);
      
      // Reset form
      newDish = {
        id: '',
        title: '',
        price: '',
        description: '',
        imageUrl: null,
        categoryId: ''
      };
    } catch (error) {
      console.error('Error adding dish:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      addDish();
    }
  }
</script>

<div class="bg-white/60 backdrop-blur-md rounded-lg border border-white/50 p-4 shadow-lg transition-all duration-200 hover:shadow-xl">
  <div class="space-y-3">
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="text-xs font-semibold text-gray-700 mb-1 block w-[50px] whitespace-nowrap">{t('title')}*</label>
        <input
          type="text"
          class="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-normal transition-all duration-200"
          bind:value={newDish.title}
          on:keydown={handleKeyPress}
          required
        />
      </div>
      <div>
        <label class="text-xs font-semibold text-gray-700 mb-1 block w-[25px]">{t('price')}*</label>
        <div class="relative">
          <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">{currency}</span>
          <input
            type="text"
            class="w-[120px] pl-7 pr-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent font-normal transition-all duration-200"
            bind:value={newDish.price}
            on:keydown={handleKeyPress}
            required
          />
        </div>
      </div>
    </div>
    <div>
      <label class="text-xs font-semibold text-gray-700 mb-1 block">{t('description')}</label>
      <textarea
        class="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent h-16 resize-none font-normal transition-all duration-200"
        bind:value={newDish.description}
        on:keydown={handleKeyPress}
      />
    </div>
    <div>
      <label class="text-xs font-semibold text-gray-700 mb-1 block">{t('image')}</label>
      <div class="flex flex-col space-y-3">
        {#if newDish.imageUrl}
          <div class="relative inline-block">
            <img 
              src={newDish.imageUrl} 
              alt="New dish"
              class="w-20 h-20 object-cover rounded-lg shadow-sm transition-transform duration-200 hover:scale-105"
            />
            <button
              type="button"
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
              on:click={() => newDish = { ...newDish, imageUrl: null }}
              title={t('removeImage') || 'Remove image'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        {/if}
        <div class="relative">
          <form
            class="inline-block"
            on:submit|preventDefault={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/jpeg,image/png,image/webp';
              input.onchange = (e) => handleImageUpload(e);
              input.click();
            }}
          >
            <button
              type="submit"
              class="px-4 py-2 bg-white/90 text-gray-700 rounded-md border border-gray-200 hover:bg-white hover:border-gray-300 transition-all duration-200 text-sm font-medium flex items-center gap-2 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {t('uploadImage')}
            </button>
          </form>
        </div>
        <div id="dish-form-error" class="text-sm text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg hidden w-fit">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end pt-2">
      <button
        class="px-4 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 font-medium transition-colors duration-200 shadow-sm hover:shadow"
        on:click={addDish}
      >
        {t('addDish')}
      </button>
    </div>
  </div>
</div> 
```

`src/lib/components/menu-editor/dishes/DishItem.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dish } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let dish: Dish;
  export let isEditing: boolean;
  export let categoryId: string;
  export let currency: string = '€';

  const dispatch = createEventDispatcher<{
    edit: void;
    update: Dish;
    delete: string;
  }>();

  let editingDish: Dish = { ...dish };

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][currentLanguage] || key;
  };

  // Use the currency from currentRestaurant if available
  $: if ($currentRestaurant && $currentRestaurant.currency) {
    currency = $currentRestaurant.currency;
  }

  async function handleImageUpload(event: Event) {
    try {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) return;

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        const errorDiv = document.getElementById('dish-item-error');
        const errorText = errorDiv?.querySelector('span');
        if (errorDiv && errorText) {
          errorText.textContent = t('invalidFileType') + ' (JPEG, PNG, WebP)';
          errorDiv.classList.remove('hidden');
          setTimeout(() => {
            errorDiv.classList.add('hidden');
          }, 3000);
        }
        return;
      }

      // Validate file size (max 4MB)
      const maxSize = 4 * 1024 * 1024; // 4MB in bytes
      if (file.size > maxSize) {
        const errorDiv = document.getElementById('dish-item-error');
        const errorText = errorDiv?.querySelector('span');
        if (errorDiv && errorText) {
          errorText.textContent = t('fileTooLarge') + ' (max 4MB)';
          errorDiv.classList.remove('hidden');
          setTimeout(() => {
            errorDiv.classList.add('hidden');
          }, 3000);
        }
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('Error parsing upload response:', parseError);
        throw new Error(t('invalidServerResponse'));
      }
      
      if (!data.success) {
        throw new Error(data.error || t('fileUploadError'));
      }

      editingDish = { ...editingDish, imageUrl: data.url };
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorDiv = document.getElementById('dish-item-error');
      const errorText = errorDiv?.querySelector('span');
      if (errorDiv && errorText) {
        errorText.textContent = error instanceof Error ? error.message : t('fileUploadError');
        errorDiv.classList.remove('hidden');
        setTimeout(() => {
          errorDiv.classList.add('hidden');
        }, 3000);
      }
    } finally {
      // Reset the file input
      const input = event.target as HTMLInputElement;
      input.value = '';
    }
  }

  async function saveDishChanges() {
    try {
      // Update dish in menuStore
      menuStore.updateDish(dish.id, {
        title: editingDish.title,
        price: editingDish.price,
        description: editingDish.description,
        imageUrl: editingDish.imageUrl
      });
      
      // Also dispatch update event for backward compatibility
      dispatch('update', editingDish);
    } catch (error) {
      console.error('Error updating dish:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }

  function requestDeleteConfirmation() {
    const confirmationMessage = t('confirmDeleteDish') || 'Are you sure you want to delete this dish?';
    if (window.confirm(confirmationMessage)) {
      deleteDish();
    }
  }

  async function deleteDish() {
    try {
      // Delete the dish in menuStore directly
      menuStore.deleteDish(dish.id);
      
      // Dispatch delete event for backward compatibility
      dispatch('delete', dish.id);
      
      // Show success toast
      toasts.success(t('dishDeleteSuccess') || t('deleteSuccess'));
    } catch (error) {
      console.error('Error deleting dish:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
      }
    }
  }
</script>

<div class="space-y-2 dish-item-container" data-dish-id={dish.id}>
  <!-- Dish Display -->
  <div class="bg-gray-900/80 backdrop-blur-sm text-white p-4 rounded-lg border border-gray-800/50 flex items-center">
    <!-- Drag Handle -->
    <div class="dish-drag-handle mr-3 cursor-grab text-gray-400 hover:text-gray-200 p-1">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </div>

    <div class="flex-1">
      <div class="flex items-center justify-between">
        <span class="text-lg font-medium" draggable="false">{dish.title}</span>
        <div class="flex items-center space-x-1">
          <button 
            class="p-1 text-white hover:text-blue-300"
            on:click={() => dispatch('edit')}
            draggable="false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            class="p-1 text-white hover:text-red-300"
            on:click={requestDeleteConfirmation}
            draggable="false"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      {#if dish.price}
        <span class="text-sm font-medium">{currency}{dish.price}</span>
      {/if}
      {#if dish.description}
        <p class="text-sm font-normal text-gray-300 mt-1">{dish.description}</p>
      {/if}
    </div>
  </div>

  <!-- Edit Form -->
  {#if isEditing}
    <div class="bg-white/40 backdrop-blur-md rounded-lg border border-white/50 p-3" draggable="false">
      <div class="space-y-2">
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="text-xs font-semibold text-gray-600">{t('title')} *</label>
            <input
              type="text"
              class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
              bind:value={editingDish.title}
              required
            />
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600">{t('price')} *</label>
            <input
              type="text"
              class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
              bind:value={editingDish.price}
              required
            />
          </div>
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600">{t('description')}</label>
          <textarea
            class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none font-normal"
            bind:value={editingDish.description}
          />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-600">{t('image')}</label>
          <div class="flex items-center space-x-2">
            {#if editingDish.imageUrl}
              <div class="relative">
                <img 
                  src={editingDish.imageUrl} 
                  alt={editingDish.title}
                  class="w-16 h-16 object-cover rounded"
                />
                <button
                  type="button"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                  on:click={() => editingDish = { ...editingDish, imageUrl: null }}
                  title={t('removeImage') || 'Remove image'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            {/if}
            <div class="relative">
              <form
                class="inline-block"
                on:submit|preventDefault={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/jpeg,image/png,image/webp';
                  input.onchange = (e) => handleImageUpload(e);
                  input.click();
                }}
              >
                <button
                  type="submit"
                  class="px-4 py-2 bg-white/80 text-gray-700 rounded border border-gray-300 hover:bg-white/90 transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  {t('uploadImage')}
                </button>
              </form>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 pt-2">
          <button
            class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 font-medium"
            on:click={() => dispatch('edit')}
          >
            {t('cancel')}
          </button>
          <button
            class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
            on:click={saveDishChanges}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Error Message -->
  <div id="dish-item-error" class="hidden absolute top-full left-0 mt-2 pt-2 text-sm text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300 ease-in-out min-w-[200px] whitespace-nowrap">
    <div class="flex items-center space-x-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <span></span>
    </div>
  </div>
</div> 
```

`src/lib/components/menu-editor/dishes/DishList.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import DishItem from './DishItem.svelte';
  import DishForm from './DishForm.svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { dndzone, type DndEvent } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';
  import { toasts } from '$lib/stores/toast';
  import { get } from 'svelte/store';

  export let dishes: Dish[] = [];
  export let categoryId: string;
  export let currency: string = '€';

  const dispatch = createEventDispatcher<{
    update: Dish[];
  }>();

  let editingDish: Dish | null = null;
  let localDishes: Dish[] = [];
  let isDragging = false;
  const flipDurationMs = 300;

  $: if (!isDragging && JSON.stringify(dishes) !== JSON.stringify(localDishes)) {
    localDishes = [...dishes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  $: currentLanguage = $language;
  $: t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[currentLanguage]?.[key] ?? key;
  };

  $: if ($currentRestaurant && $currentRestaurant.currency) {
    currency = $currentRestaurant.currency;
  }

  async function handleDishAdd(event: CustomEvent<Dish>) {
    const newDish = event.detail;
    
    const maxOrder = localDishes.reduce((max, d) => Math.max(max, d.order ?? 0), -1);
    newDish.order = maxOrder + 1;
    localDishes = [...localDishes, newDish];
    
    dispatch('update', localDishes);
  }

  async function handleDishUpdate(event: CustomEvent<Dish>) {
    const updatedDish = event.detail;
    
    localDishes = localDishes.map(d => d.id === updatedDish.id ? updatedDish : d);
    
    dispatch('update', localDishes);
    editingDish = null;
  }

  async function handleDishDelete(event: CustomEvent<string>) {
    const dishId = event.detail;
    
    localDishes = localDishes.filter(d => d.id !== dishId);
    
    dispatch('update', localDishes);
  }

  function startEditing(dish: Dish) {
    editingDish = dish;
  }

  function cancelEditing() {
    editingDish = null;
  }

  function handleDndConsider(e: CustomEvent<DndEvent<Dish>>) {
    isDragging = true;
    localDishes = e.detail.items;
  }

  async function handleDndFinalize(e: CustomEvent<DndEvent<Dish>>) {
    isDragging = false;
    localDishes = e.detail.items;

    const orderedLocalDishes = localDishes.map((dish, index) => ({ ...dish, order: index }));
    localDishes = orderedLocalDishes;

    menuStore.reorderDishes(categoryId, localDishes);
    dispatch('update', localDishes);

    const orderedDishIds = localDishes.map(dish => dish.id);
    const restaurantId = get(currentRestaurant)?.id;

    if (!restaurantId) {
      console.error("Cannot reorder dishes: Restaurant ID not found.");
      toasts.error(t('error') + ': ' + t('restaurant_not_selected'));
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/categories/${categoryId}/dishes/order`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedDishIds }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ error: t('failed_update_dish_order') }));
        console.error('API Error Response:', errorResult);
        throw new Error(errorResult.error || t('unknown_api_error'));
      }

      const result = await response.json();
      if (result.success) {
      } else {
        throw new Error(result.error || t('api_returned_error'));
      }

    } catch (error) {
      console.error('Error updating dish order:', error);
      toasts.error(t('error') + ': ' + (error instanceof Error ? error.message : t('failed_save_dish_order')));
      localDishes = [...dishes].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      menuStore.reorderDishes(categoryId, localDishes);
      dispatch('update', localDishes);
    }
  }
</script>

<div class="space-y-4">
  <div
    use:dndzone={{ items: localDishes, flipDurationMs, dragHandle: '.dish-drag-handle' }}
    on:consider={handleDndConsider}
    on:finalize={handleDndFinalize}
    class="space-y-2"
  >
    {#each localDishes as dish (dish.id)}
      <div animate:flip={{ duration: flipDurationMs }}>
        <DishItem
          {dish}
          isEditing={editingDish?.id === dish.id}
          {categoryId}
          {currency}
          on:edit={() => {
            if (editingDish?.id === dish.id) {
              editingDish = null;
            } else {
              editingDish = dish;
            }
          }}
          on:update={handleDishUpdate}
          on:delete={handleDishDelete}
        />
      </div>
    {/each}
  </div>

  <DishForm
    {categoryId}
    {currency}
    on:add={handleDishAdd}
  />
</div> 
```

`src/lib/components/menu-editor/preview/MenuPreview.svelte`:

```svelte
<script lang="ts">
  import type { Category } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { onMount } from 'svelte';
  // import { menuCache } from '$lib/stores/menu-cache'; // Removed if menu-cache was deleted
  // import { menuState } from '$lib/stores/menu-state'; // <--- REMOVED THIS LINE
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { menuStore } from '$lib/stores/menu-store';
  // import { getCurrencySymbol } from '$lib/utils/currency';
  // import { formatPrice } from '$lib/utils/formatters';

  export let restaurantName: string = '';
  export let menuLogo: string | null = null;
  export let categories: Category[] = [];
  export let currency: string = '€';

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key]?.[currentLanguage] || translations[key]?.['es'] || key;

  // Update restaurant data when currentRestaurant changes
  $: if ($currentRestaurant) {
    restaurantName = $currentRestaurant.name || restaurantName;
    menuLogo = $currentRestaurant.logo || menuLogo;
    currency = $currentRestaurant.currency || currency;
  }

  // Subscribe to menu store changes to get categories
  $: if ($menuStore.categories && $menuStore.categories.length > 0) {
    // Ensure each category has a dishes array
    categories = $menuStore.categories.map(category => ({
      ...category,
      dishes: category.dishes || []
    }));
  }

  // REMOVED THE REACTIVE BLOCK THAT USED menuState
  // $: {
  //   const state = $menuState;
  //   if (state) {
  //     if (state.restaurantName) restaurantName = state.restaurantName;
  //     if (state.menuLogo) menuLogo = state.menuLogo;
  //     if (state.categories) categories = state.categories;
  //   }
  // }

  // Keep the locally defined formatPrice function
  function formatPrice(price: number | string): string {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
  }

  // We don't need to reset state on mount anymore
  // This was causing the preview to clear when navigating
  onMount(() => {
    // Only initialize if no restaurant is selected
    // if (!$currentRestaurant && !$menuStore.categories.length) {
    //   menuState.reset(); // menuState is removed, so this line is also removed
    // }
  });
</script>

<div class="bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-3 sm:p-6">
  <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 tracking-tight">{t('menuPreview')}</h2>

  <!-- Restaurant Info -->
  {#if restaurantName || menuLogo}
    <div class="flex items-center space-x-3 sm:space-x-4 mb-6 sm:mb-8">
      {#if menuLogo}
        <img
          src={menuLogo}
          alt="Restaurant logo"
          class="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg shadow-md"
        />
      {/if}
      {#if restaurantName}
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">{restaurantName}</h1>
      {/if}
    </div>
  {/if}

  <!-- Categories and Dishes -->
  {#if categories.length > 0}
    {#each categories as category}
      <div class="mb-6 sm:mb-8">
        <h3 class="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 tracking-tight">{category.name}</h3>
        {#if category.dishes && category.dishes.length > 0}
          <div class="space-y-3 sm:space-y-4">
            {#each category.dishes as dish}
              <div class="flex flex-col sm:flex-row items-start space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50 hover:bg-white/50 transition-colors">
                {#if dish.imageUrl}
                  <img
                    src={dish.imageUrl}
                    alt={dish.title}
                    class="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg shadow-md"
                  />
                {/if}
                <div class="flex-1 w-full">
                  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-2">
                    <h4 class="text-base sm:text-lg font-semibold text-gray-800">{dish.title}</h4>
                    <p class="text-base sm:text-lg font-bold text-gray-800">{currency}{formatPrice(dish.price)}</p>
                  </div>
                  {#if dish.description}
                    <p class="text-sm sm:text-base text-gray-600 mt-1 font-normal">{dish.description}</p>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {:else}
          <p class="text-gray-500 italic">No dishes in this category</p>
        {/if}
      </div>
    {/each}
  {:else}
    <p class="text-gray-500 italic">No categories available</p>
  {/if}
</div>
```

`src/lib/components/menu-editor/restaurant/ColorPicker.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { get } from 'svelte/store';
  import {
    handleCustomColorSelect,
    handleCustomColorInputValidation as handleCustomColorInputChange,
    saveCustomColorToStorage
  } from '$lib/utils/color.helpers';
  
  // Props
  export let value: string = '';
  export let showCustomColorPicker: boolean = false;
  export let colorOptions: { value: string | number, label: string }[] = [];
  export let selectedRestaurant: string | null = null;
  export let t: (key: string) => string;
  export let customHexColor: string = '';
  
  // Component state
  let customColorValue = '';
  let customColorInput = '';
  let tempColorValue = '';
  
  // Simplified color palette with just 10 vibrant colors in 2 rows
  const colorPalette = [
    // Row 1 - Primary colors
    '#FF0000', '#FF9900', '#FFFF00', '#33CC33', '#3399FF',
    // Row 2 - Secondary and neutral colors
    '#9933CC', '#FF3399', '#663300', '#333333', '#FFFFFF'
  ];
  
  // Event dispatcher
  const dispatch = createEventDispatcher<{
    change: string;
    accept: string;
    cancel: void;
  }>();
  
  // Reset values when value changes to a standard color
  $: if (value && value === '#85A3FA') {
    // If the value is the light theme color, reset custom color values
    customColorValue = '';
    tempColorValue = '';
    customColorInput = '';
  }
  
  // If customHexColor is provided, use it
  $: {
    if (customHexColor && typeof customHexColor === 'string' && customHexColor.startsWith('#')) {
      if (customHexColor !== '#85A3FA') {
        customColorValue = customHexColor.toUpperCase();
        tempColorValue = customColorValue;
        customColorInput = customColorValue;
      }
    }
  }
  
  // If the 'value' prop is a hex, assume it's custom
  $: {
    if (value && typeof value === 'string' && value.startsWith('#')) {
      if (value !== '#85A3FA') {
        customColorValue = value.toUpperCase();
        tempColorValue = customColorValue;
        customColorInput = customColorValue;
        // For custom colors, dispatch a change event to set the color to 'custom'
        dispatch('change', 'custom');
      }
    }
  }
  
  // Whenever customColorValue changes, store it
  $: saveCustomColorToStorage(customColorValue, selectedRestaurant);

  onMount(() => {
    // Check if there's a color in the currentRestaurant store
    const cRest = get(currentRestaurant);
    if (cRest && cRest.color) {
      if (typeof cRest.color === 'string' && cRest.color.startsWith('#')) {
        // Use the color from the database (hex value)
        const dbColor = cRest.color.toUpperCase();
        if (dbColor === '#85A3FA') {
          // If it's the light theme color, dispatch 'light'
          dispatch('change', 'light');
        } else {
          customColorValue = dbColor;
          tempColorValue = dbColor;
          customColorInput = dbColor;
          // For custom hex colors, dispatch 'custom'
          dispatch('change', 'custom');
          showCustomColorPicker = true;
        }
        console.log('ColorPicker: Loaded hex color from database:', dbColor);
      }
    } else {
      // No color in store, use default light theme
      dispatch('change', 'light');
    }
  });
  
  // Event handlers
  function onColorChange(newValue: string | number) {
    dispatch('change', String(newValue));
  }
  
  function onPaletteSelect(hexColor: string) {
    // Use the helper to update temp value
    handleCustomColorSelect(
      hexColor,
      (v) => tempColorValue = v // Call with 2 arguments
    );
    // Set the input directly here
    customColorInput = hexColor.toUpperCase();
  }
  
  function onHexInputChange() {
    handleCustomColorInputChange(
      customColorInput,
      (v) => tempColorValue = v // Pass the setTempColorValue callback
    );
  }
  
  function onAcceptCustomColor() {
    if (tempColorValue) {
      dispatch('accept', tempColorValue);
    }
  }
  
  function onCancelCustomColor() {
    dispatch('cancel');
  }
  
  // Check if the current color is a hex color (for radio button selection)
  $: isHexColor = value && typeof value === 'string' && value.startsWith('#') ? true : false;
</script>

<div class="space-y-4">
  <div class="space-y-2">
    <div class="flex gap-4 flex-wrap">
      {#each colorOptions as option}
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="color"
            value={option.value}
            checked={value === String(option.value) || (isHexColor && String(option.value) === '5')}
            on:change={() => onColorChange(option.value)}
            class="form-radio text-blue-600"
          />
          <span class="text-sm text-gray-700">{option.label}</span>
        </label>
      {/each}
    </div>

    {#if showCustomColorPicker}
      <div class="mt-4 space-y-4">
        <!-- Simple 10-color palette in 2 rows -->
        <div class="grid grid-cols-5 gap-3 max-w-[300px]">
          {#each colorPalette as hexColor}
            <button
              class="w-12 h-12 rounded-lg transition-transform hover:scale-110 shadow-sm border border-gray-200 active:scale-95 touch-manipulation"
              style="background-color: {hexColor}"
              on:click={() => onPaletteSelect(hexColor)}
              aria-label="Color swatch"
            />
          {/each}
        </div>

        <!-- Color input and preview -->
        <div class="flex items-center gap-2 mt-4">
          <input
            type="text"
            bind:value={customColorInput}
            placeholder="#000000"
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            on:input={onHexInputChange}
            aria-label="Enter hex color code"
          />
          <div
            class="w-12 h-12 rounded-lg border border-gray-300 shadow-sm"
            style="background-color: {tempColorValue}"
            aria-label="Color preview"
          />
        </div>

        <!-- Action buttons -->
        <div class="flex justify-end gap-3 mt-4">
          <button
            class="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors touch-manipulation active:scale-95"
            on:click={onCancelCustomColor}
          >
            {t('cancel')}
          </button>
          <button
            class="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors touch-manipulation active:scale-95"
            on:click={onAcceptCustomColor}
          >
            {t('save')}
          </button>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.form-radio) {
    @apply h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500;
  }
</style> 
```

`src/lib/components/menu-editor/restaurant/CurrencyPicker.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { language } from '$lib/stores/language';
  import { translations } from '$lib/i18n/translations';

  // Props
  export let value: string = 'EUR'; // Default to ISO code
  export let t: (key: string) => string;

  // Currency options
  const currencyOptions = [
    { value: '€', label: 'EUR (€)' },
    { value: '$', label: 'USD ($)' },
    { value: '£', label: 'GBP (£)' },
    { value: '₡', label: 'CRC (₡)' }, // Added Costa Rican Colón
    { value: '$MXN', label: 'MXN ($)' }, // Added Mexican Peso
  ];

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    change: string;
  }>();

  // Propagate changes
  function onChange(newValue: string) {
    dispatch('change', newValue);
  }

</script>

<div class="space-y-2 mb-12">
  <label class="block text-sm font-medium text-gray-700">
    {t('currency')}
  </label>
  <div class="flex gap-4 flex-wrap"> <!-- Added flex-wrap -->
    {#each currencyOptions as option (option.value)} 
      <label class="flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="currency"
          class="form-radio text-blue-600"
          value={option.value}
          bind:group={value} 
          on:change={() => onChange(option.value)}
        />
        <span class="text-sm text-gray-700">{option.label}</span>
      </label>
    {/each}
  </div>
</div>

<style>
  :global(.form-radio) {
    @apply h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500;
  }
</style> 
```

`src/lib/components/menu-editor/restaurant/CustomPromptInput.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { 
    handleCustomPromptInput,
    ensureString
  } from '$lib/utils/RestaurantInfo.helpers';

  export let restaurantName = '';
  export let selectedRestaurant: string | null = null;
  export let menuLogo: string | null = null;
  export let customPrompt: string | null = null;
  export let phoneNumber: number | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  // Svelte event dispatcher
  const dispatch = createEventDispatcher();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // Called on customPrompt <textarea> input
  function onCustomPromptInput(event: Event) {
    // Call the helper to dispatch the partial update
    const newVal = handleCustomPromptInput(
      event,
      selectedRestaurant,
      t,
      dispatch
    );
    // DO NOT update local state here. Rely on the prop passed down.
    // if (newVal !== null) {
    //   customPrompt = newVal; 
    // }
  }

  // No longer need displayCustomPrompt derived from local state
  // $: displayCustomPrompt = ensureString(customPrompt);
</script>

<div class="space-y-2">
  <label for="customPrompt" class="block text-sm font-medium text-gray-700">
    {t('customPromptLabel')}
  </label>
  <div class="relative">
    <textarea
      id="customPrompt"
      value={ensureString(customPrompt)}
      on:input={onCustomPromptInput}
      placeholder={t('customPromptPlaceholder')}
      class="w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2
             focus:ring-blue-500 focus:border-transparent transition-all
             duration-200 ease-in-out bg-white/80 backdrop-blur-sm resize-none"
    ></textarea>
    <div class="absolute bottom-2 right-2 text-sm text-gray-500">
      {ensureString(customPrompt).length}/10000
    </div>
  </div>
</div> 
```

`src/lib/components/menu-editor/restaurant/LogoUploader.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { get } from 'svelte/store';
  import { 
    handleDrag,
    handleDrop,
    handleFileUpload,
    handleLogoDelete,
    ensureString,
    type UpdateEvent
  } from '$lib/utils/RestaurantInfo.helpers';

  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let customPrompt: string | null = null;
  export let phoneNumber: number | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  let isUploading = false;
  let isDragging = false;
  let uploadError: string | null = null;

  // Properly typed event dispatcher
  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
  }>();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => {
    // Default to 'es' if language or translation is not available
    if (!translations[key] || !currentLanguage || !translations[key][currentLanguage]) {
      return translations[key]?.['es'] || key;
    }
    return translations[key][currentLanguage];
  };

  // Called on dragenter
  function handleDragEnter(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, true);
  }

  // Called on dragleave
  function handleDragLeave(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, false);
  }

  // Called on dragover
  function handleDragOver(e: DragEvent) {
    const canEdit = !!selectedRestaurant || !!restaurantName;
    isDragging = handleDrag(e, canEdit, true);
  }

  // Direct upload function
  async function uploadFile(file: File): Promise<string | null> {
    console.log('Starting file upload process', { fileName: file.name, fileSize: file.size });
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('Sending upload request to /api/upload');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      console.log('Upload response received', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }
      
      const result = await response.json();
      console.log('Upload successful', { resultUrl: result.url });
      return result.url || null;
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof Error) {
        uploadError = error.message;
        toasts.error(t('error') + ': ' + error.message);
      }
      return null;
    }
  }

  // Called on drop
  async function handleLogoDrop(e: DragEvent) {
    console.log('File dropped', { hasRestaurantName: !!restaurantName, hasSelectedRestaurant: !!selectedRestaurant });
    const canEdit = !!selectedRestaurant || !!restaurantName;
    await handleDrop(e, canEdit, t, async (file) => {
      console.log('Processing dropped file', { fileName: file.name, fileType: file.type });
      isUploading = true;
      uploadError = null;
      
      try {
        // First upload the file directly to get the URL
        const logoUrl = await uploadFile(file);
        console.log('Logo URL received from upload', { logoUrl });
        
        if (logoUrl) {
          // Update our local state
          menuLogo = logoUrl;
          console.log('Local state updated with new logo URL');
          
          // Then use the helper to dispatch the event with the correct signature
          const updatedUrl = await handleFileUpload(
            file,
            selectedRestaurant,
            t,
            dispatch
          );
          
          // Optional: Update local menuLogo again if handleFileUpload modified the URL (it shouldn't now)
          // if (updatedUrl && updatedUrl !== logoUrl) { 
          //   menuLogo = updatedUrl;
          // }
        }
      } finally {
        isUploading = false;
      }
    }, (val) => isDragging = val);
  }

  // Called on logo <input> change
  async function handleLogoUploadInput(event: Event) {
    console.log('Logo input change triggered', { hasRestaurantName: !!restaurantName, hasSelectedRestaurant: !!selectedRestaurant });
    if (!selectedRestaurant && !restaurantName) {
      console.warn('Upload attempted without restaurant name');
      toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      console.warn('No file selected');
      return;
    }

    console.log('Processing selected file', { fileName: file.name, fileType: file.type });
    isUploading = true;
    uploadError = null;
    
    try {
      // First upload the file directly to get the URL
      const logoUrl = await uploadFile(file);
      console.log('Logo URL received from upload', { logoUrl });
      
      if (logoUrl) {
        // Update our local state
        menuLogo = logoUrl;
        console.log('Local state updated with new logo URL');
        
        // Then use the helper to dispatch the event with the correct signature
        const updatedUrl = await handleFileUpload(
          file,
          selectedRestaurant,
          t,
          dispatch
        );

        // Optional: Update local menuLogo again if handleFileUpload modified the URL (it shouldn't now)
        // if (updatedUrl && updatedUrl !== logoUrl) { 
        //   menuLogo = updatedUrl;
        // }
      }
    } finally {
      isUploading = false;
    }
  }

  // Called on "delete logo" button
  function onDeleteLogo(event: MouseEvent) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
    
    // Call helper with updated signature
    const result = handleLogoDelete(
      selectedRestaurant,
      dispatch
    );
    
    // Update local state
    menuLogo = result;
    
    // No need to manually dispatch here anymore, handleLogoDelete does it.
  }
</script>

<div class="mb-8">
  <label class="block text-lg font-semibold mb-3 text-gray-800">
    {t('menuLogo')}
  </label>
  <div class="flex items-start gap-4">
    <div class="relative group">
      <form
        class="border border-gray-200 rounded-lg flex flex-col items-center justify-center transition-all duration-200 bg-white {!restaurantName ? 'opacity-50 cursor-not-allowed' : isDragging ? 'border-blue-400 bg-blue-50' : menuLogo ? 'shadow-md hover:shadow-lg' : 'hover:border-blue-300'} {!menuLogo ? 'w-24 h-24' : 'max-w-32 max-h-24'}"
        on:submit|preventDefault={() => {
          if (!restaurantName) {
            const errorMessage = document.getElementById('logo-error');
            if (errorMessage) {
              errorMessage.textContent = t('pleaseEnterRestaurantNameFirst');
              errorMessage.classList.remove('hidden');
              setTimeout(() => {
                errorMessage.classList.add('hidden');
              }, 3000);
            }
            return;
          }
          const logoInput = document.getElementById('logo-input');
          if (logoInput) {
            logoInput.click();
          }
        }}
        on:dragenter={handleDragEnter}
        on:dragleave={handleDragLeave}
        on:dragover={handleDragOver}
        on:drop={handleLogoDrop}
      >
        <button type="submit" class="w-full h-full flex flex-col items-center justify-center p-2">
          {#if menuLogo}
            <div class="relative">
              <img
                src={ensureString(menuLogo)}
                alt="Menu logo"
                class="block max-w-full max-h-full object-contain rounded-lg"
              />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/10
                       rounded-lg transition-colors duration-200"
              />
              <!-- Delete button overlay -->
              <button
                type="button"
                class="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg opacity-0
                       group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                on:click|stopPropagation={onDeleteLogo}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          {:else if isUploading}
            <div class="flex flex-col items-center justify-center">
              <svg
                class="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span class="text-xs text-blue-600 mt-1 font-medium">
                {t('uploading')}
              </span>
            </div>
          {:else if uploadError}
            <div class="flex flex-col items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="text-xs text-red-600 mt-1 font-medium">
                {t('error')}
              </span>
              <span class="text-[10px] text-gray-500">
                {t('tryAgain')}
              </span>
            </div>
          {:else}
            <div class="flex flex-col items-center justify-center text-center">
              <div class="w-8 h-8 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-full h-full text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span class="text-xs font-medium text-gray-900">
                {t('addLogo')}
              </span>
              <span class="text-[10px] text-gray-500">
                {isDragging ? t('dropToUpload') : t('dragAndDrop')}
              </span>
            </div>
          {/if}
        </button>
        <input
          id="logo-input"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/svg+xml"
          class="hidden"
          on:change={handleLogoUploadInput}
        />
      </form>
    </div>
    <div
      id="logo-error"
      class="hidden text-sm text-white bg-red-500 px-4 py-2 rounded-lg shadow-lg z-50
             transition-all duration-300 ease-in-out min-w-[200px] whitespace-nowrap"
    >
      <div class="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16
               0 8 8 0 0116 0zm-7
               4a1 1 0 11-2 0 1
               1 0 012 0zm-1-9a1
               1 0 00-1 1v4a1 1
               0 102 0V6a1 1
               0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="flex-1"></span>
      </div>
    </div>
  </div>
</div> 
```

`src/lib/components/menu-editor/restaurant/MenuUploader.svelte`:

```svelte
<script lang="ts">
  import * as pdfjsLib from 'pdfjs-dist';
  import { createEventDispatcher, onMount } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { toasts } from '$lib/stores/toast';
  import { uploaderStore } from '$lib/stores/uploaderStore';

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

  export let restaurantName: string;
  export let customPrompt: string | null = null;
  export let restaurantId: string | null = null;

  // Configuration constants (optimizations)
  const MAX_FILE_SIZE_MB = 20; // Maximum file size in MB
  const MAX_PDF_PAGES = 10; // Maximum number of PDF pages to process
  const IMAGE_QUALITY = 1; // PNG quality (0-1)
  const MAX_IMAGE_DIMENSION = 1800; // Maximum width/height for images
  const PDF_SCALE_FACTOR = 1.5; // Scale factor for PDF rendering (lower = smaller)

  const dispatch = createEventDispatcher<{
    success: { restaurantData: any;};
    error: string;
  }>();

  let images: { page: number; dataURL: string }[] = [];
  let isDragging = false;
  let totalUploadSizeMB = 0; // Track the total upload size
  let isMobile = false; // Mobile detection

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    // Safely access translations with a fallback for missing keys
    if (!translations[key]) {
      console.warn(`Missing translation key: ${key}`);
      return key; // Return the key itself as fallback
    }
    return translations[key][currentLanguage];
  }

  onMount(() => {
    // Check if device is mobile
    isMobile = window.innerWidth < 768;
    
    // Listen for resize events to update mobile status
    const handleResize = () => {
      isMobile = window.innerWidth < 768;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  // Reset component state when restaurantId changes to null (new restaurant)
  $: if (restaurantId === null) {
    console.log('Resetting MenuUploader state - new restaurant');
    images = [];
    uploaderStore.reset();
    isDragging = false;
    totalUploadSizeMB = 0;
  }

  // Reset component state when restaurantId changes
  $: if (restaurantId) {
    console.log('Resetting MenuUploader state - changing restaurant');
    images = [];
    uploaderStore.reset();
    isDragging = false;
    totalUploadSizeMB = 0;
  }

  // Validate restaurant name
  $: if (restaurantName === undefined || restaurantName === null) {
    console.error('Restaurant name is undefined or null');
  }

  // Check if we have a valid restaurant name (either from manual input or from upload)
  $: hasValidRestaurantName = restaurantName && restaurantName.trim() !== '';

  async function handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files?.length) return;

    await processFiles(files);
    // No reseteamos el input aquí para permitir subir el mismo archivo nuevamente si es necesario
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (!files?.length) return;

    await processFiles(files);
  }

  // Check file size limit
  function validateFileSize(file: File): boolean {
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      toasts.error(`${t('error')}: ${file.name} ${t('fileTooLarge')} (${fileSizeMB.toFixed(1)}MB > ${MAX_FILE_SIZE_MB}MB)`);
      return false;
    }
    
    totalUploadSizeMB += fileSizeMB;
    console.log(`File size: ${fileSizeMB.toFixed(1)}MB, Total: ${totalUploadSizeMB.toFixed(1)}MB`);
    return true;
  }

  // Compress an image to a reasonable size
  async function compressImage(imageDataURL: string, quality: number = IMAGE_QUALITY): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // Resize if either dimension exceeds MAX_IMAGE_DIMENSION
        if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
          if (width > height) {
            height = Math.round(height * (MAX_IMAGE_DIMENSION / width));
            width = MAX_IMAGE_DIMENSION;
          } else {
            width = Math.round(width * (MAX_IMAGE_DIMENSION / height));
            height = MAX_IMAGE_DIMENSION;
          }
        }
        
        // Create canvas and draw resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Always use PNG for better text quality
        resolve(canvas.toDataURL('image/png', quality));
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageDataURL;
    });
  }

  async function processFiles(files: FileList) {
    try {
      images = [];
      totalUploadSizeMB = 0;
      uploaderStore.setLoading(true, t('processingFiles'), 0);

      // Count total files to process
      let validFiles = 0;
      for (const file of files) {
        if ((file.type === 'application/pdf' || file.type.startsWith('image/')) && validateFileSize(file)) {
          validFiles++;
        }
      }

      if (validFiles === 0) {
        uploaderStore.reset();
        return;
      }

      let processedFiles = 0;
      for (const file of files) {
        if (!validateFileSize(file)) continue;

        if (file.type === 'application/pdf') {
          await processPDF(file);
        } else if (file.type.startsWith('image/')) {
          const progress = Math.round((processedFiles / validFiles) * 40);
          uploaderStore.updateProgress(`${t('processingImage')} ${file.name}`, progress);
          await processImage(file);
        } else {
          toasts.error(t('error') + ': ' + t('invalidFileType'));
          continue;
        }
        processedFiles++;
      }

      if (images.length > 0) {
        console.log('Images ready for upload:', images.length);
        uploaderStore.updateProgress(t('preparingToUpload'), 50);
        await generateRestaurantData();
      } else {
        uploaderStore.reset();
      }
    } catch (error) {
      console.error('Error processing files:', error);
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
        dispatch('error', error.message);
      }
      uploaderStore.reset();
    }
  }

  async function processPDF(file: File) {
    try {
      console.log(`Processing PDF: ${file.name}, Size: ${file.size} bytes`);
      const arrayBuffer = await file.arrayBuffer();
      uploaderStore.updateProgress(t('loadingPdf'), 10);
      
      const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;
      console.log(`PDF loaded: ${pdf.numPages} pages`);
      
      // Limit the number of pages to process
      const pagesToProcess = Math.min(pdf.numPages, MAX_PDF_PAGES);
      if (pdf.numPages > MAX_PDF_PAGES) {
        toasts.warning(`${t('warning')}: ${t('processingFirstPages')} ${MAX_PDF_PAGES} ${t('of')} ${pdf.numPages}`);
      }

      for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
        const step = t('processingPage') + ` ${pageNum}/${pagesToProcess}`;
        const progress = 10 + ((pageNum / pagesToProcess) * 30); // 10-40% of the overall process
        uploaderStore.updateProgress(step, progress);
        console.log(`Rendering page ${pageNum}`);

        try {
          const page = await pdf.getPage(pageNum);
          
          // Optimize viewport scale based on target dimensions
          const viewport = page.getViewport({ scale: 1 });
          const scaleFactor = Math.min(
            MAX_IMAGE_DIMENSION / viewport.width,
            MAX_IMAGE_DIMENSION / viewport.height,
            PDF_SCALE_FACTOR // Cap at the maximum scale factor (quality vs. size tradeoff)
          );
          
          const scaledViewport = page.getViewport({ scale: scaleFactor });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error(`Could not get canvas context for page ${pageNum}`);
          }

          canvas.width = scaledViewport.width;
          canvas.height = scaledViewport.height;
          await page.render({ canvasContext: context, viewport: scaledViewport }).promise;

          // Use PNG for better text quality
          const dataURL = canvas.toDataURL('image/png', IMAGE_QUALITY);
          const compressedDataURL = await compressImage(dataURL);
          
          console.log(`Page ${pageNum}: Original size: ${dataURL.length}, Compressed: ${compressedDataURL.length}`);
          images.push({ page: pageNum, dataURL: compressedDataURL });
        } catch (pageError) {
          console.error(`Error rendering page ${pageNum}:`, pageError);
          toasts.error(t('errorProcessingPage') + ` ${pageNum}`);
        }
      }
    } catch (pdfError) {
      console.error('Error processing PDF file:', pdfError);
      if (pdfError instanceof Error) {
         toasts.error(t('error') + ': ' + pdfError.message);
         dispatch('error', pdfError.message);
      } else {
         toasts.error(t('errorProcessingPdf'));
         dispatch('error', t('errorProcessingPdf'));
      }
      uploaderStore.reset();
      throw pdfError;
    }
  }

  async function processImage(file: File) {
    try {
      const dataURL = await convertToBase64(file);
      const compressedDataURL = await compressImage(dataURL);
      console.log(`Image ${file.name}: Original size: ${dataURL.length}, Compressed: ${compressedDataURL.length}`);
      images.push({ page: images.length + 1, dataURL: compressedDataURL });
    } catch (error) {
      console.error(`Error processing image ${file.name}:`, error);
      toasts.error(`${t('error')}: ${t('errorProcessingImage')} ${file.name}`);
    }
  }

  async function convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function generateRestaurantData() {
    try {
      uploaderStore.updateProgress(t('uploadingImages'), 60);

      // Calculate and log total upload size
      let totalBase64Length = 0;
      for (const img of images) {
        totalBase64Length += img.dataURL.length;
      }
      console.log(`Uploading ${images.length} images, total size: ${(totalBase64Length / (1024 * 1024)).toFixed(2)}MB`);

      // Prepare the images for the API
      const payload = {
        prompt: customPrompt,
        images: images.map(img => ({
          page: img.page,
          base64: img.dataURL.split(',')[1]
        }))
      };

      uploaderStore.updateProgress(t('waitingForAI'), 70);
      
      const aiStartTime = Date.now();
      let lastProgressUpdate = Date.now();
      let isWaitingLong = false;
      
      // Set up a timer to show incremental progress during long waits
      const progressTimer = setInterval(() => {
        const elapsedSecs = (Date.now() - aiStartTime) / 1000;
        
        // After 5 seconds of waiting, start showing incremental progress
        if (elapsedSecs > 5 && !isWaitingLong) {
          isWaitingLong = true;
          uploaderStore.updateProgress(t('stillAnalyzing'), 75);
        }
        
        // Every 8 seconds, update the progress message if no backend updates
        if (Date.now() - lastProgressUpdate > 8000) {
          lastProgressUpdate = Date.now();
          
          // Increase progress by a small amount each update, max at 85%
          // (leaving room for backend progress messages to take us to 95%)
          const currentProgress = $uploaderStore.progress;
          const newProgress = Math.min(85, currentProgress + (currentProgress < 80 ? 3 : 1));
          
          if (elapsedSecs > 30) {
            uploaderStore.updateProgress(t('processingLargeMenu'), newProgress);
          } else if (elapsedSecs > 15) {
            uploaderStore.updateProgress(t('analyzingMenuItems'), newProgress);
          } else {
            uploaderStore.updateProgress(t('extractingData'), newProgress);
          }
        }
      }, 1000);

      const response = await fetch('/api/process-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      if (!response.body) {
        clearInterval(progressTimer);
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        // Process different message types from the backend
        if (chunk.includes('[START]')) {
          console.log("AI processing started");
          lastProgressUpdate = Date.now();
          uploaderStore.updateProgress(t('aiProcessingStarted'), 75);
        } 
        else if (chunk.includes('[PROGRESS]')) {
          lastProgressUpdate = Date.now();
          try {
            const progressMessage = chunk.split('[PROGRESS]')[1].trim();
            console.log(`Progress update: ${progressMessage}`);
            // No translation needed - just use the message directly
            const currentProgress = $uploaderStore.progress;
            // Increment progress slowly, up to 90%
            const newProgress = Math.min(90, currentProgress + 1);
            uploaderStore.updateProgress(progressMessage, newProgress);
          } catch (error) {
            console.error('Error parsing progress message:', error);
            // Keep the process going, don't throw
          }
        }
        else if (chunk.includes('[ERROR]')) {
          clearInterval(progressTimer);
          const errorData = chunk.split('[ERROR]')[1].trim();
          console.error("Error from backend:", errorData);
          toasts.error(t('error') + ': ' + t('aiProcessingError'));
          uploaderStore.reset();
          return;
        }
        else if (chunk.includes('[DONE]')) {
          console.log("Stream finalizado. Procesando la respuesta...");
          const totalTime = ((Date.now() - aiStartTime) / 1000).toFixed(1);
          console.log(`Total OpenAI API processing time: ${totalTime} seconds`);
          console.log(`AI processing took ${((Date.now() - aiStartTime) / 1000).toFixed(1)} seconds`);
          clearInterval(progressTimer);

          // Extract the JSON data after the [DONE] marker
          const jsonData = fullResponse.split('[DONE]')[1].trim();

          try {
            const parsedData = JSON.parse(jsonData);
            console.log('Parsed data:', parsedData);

            // Ensure parsedData.restaurant is an object
            let restaurantFromAI: { name?: string, [key: string]: any } = {};
            if (parsedData && typeof parsedData.restaurant === 'object' && parsedData.restaurant !== null) {
              restaurantFromAI = parsedData.restaurant;
            } else if (parsedData && typeof parsedData.restaurant === 'string') {
              // If AI returned just a string, use it as the name
              restaurantFromAI = { name: parsedData.restaurant };
            }
            // Ensure we have a base restaurant object in parsedData
            parsedData.restaurant = restaurantFromAI;
            
            // Prioritize existing restaurantName prop if available
            if (restaurantName && restaurantName.trim() !== '') {
              console.log(`Preserving existing frontend restaurant name: ${restaurantName}`);
              parsedData.restaurant.name = restaurantName;
            } else if (!parsedData.restaurant.name) {
              // If no name from prop and no name from AI, use a placeholder
              const placeholderName = currentLanguage === 'es' ? 'Restaurante sin nombre' : 'Untitled Restaurant';
              console.warn('No restaurant name found, using placeholder:', placeholderName);
              parsedData.restaurant.name = placeholderName;
            }
            
            saveRestaurantData(parsedData);
          } catch (error) {
            console.error("Error al procesar la respuesta del stream:", error);
            toasts.error(t('error') + ': Error procesando la respuesta del chatbot');
            uploaderStore.reset();
          }

          break;
        }
      }
    } catch (error) {
      console.error('Error en la carga del menú:', error);
      uploaderStore.reset();
      if (error instanceof Error) {
        toasts.error(t('error') + ': ' + error.message);
        dispatch('error', error.message);
      }
    }
  }

  // ✅ Función para guardar la respuesta final y actualizar el estado del menú
  async function saveRestaurantData(result: any) {
    try {
      console.log('saveRestaurantData received result:', result);
      
      // Validate the structure of the response
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format');
      }

      // --- Start Restructured Extraction ---
      const extractedCategories: any[] = []; // Initialize empty array

      if (result.menu && typeof result.menu === 'object') {
        // Case 1: AI returned { menu: { CategoryName: { DishName: Price } } }
        console.log('Found menu object from AI, processing object structure...');
        console.log('Inspecting result.menu object:', JSON.stringify(result.menu, null, 2));
        for (const categoryName in result.menu) {
          if (Object.prototype.hasOwnProperty.call(result.menu, categoryName)) {
            const categoryContent = result.menu[categoryName];
            const dishes: any[] = [];
            if (typeof categoryContent === 'object' && categoryContent !== null && !Array.isArray(categoryContent)) {
              for (const dishName in categoryContent) {
                if (Object.prototype.hasOwnProperty.call(categoryContent, dishName)) {
                  const priceValue = categoryContent[dishName];
                  const priceString = priceValue?.toString() || '0';
                  const cleanedPriceString = priceString.replace(/[€$£]/g, '').trim();
                  const priceAsNumber = parseFloat(cleanedPriceString);
                  const finalPriceString = !isNaN(priceAsNumber) ? priceAsNumber.toString() : '0';
                  dishes.push({
                    title: dishName,
                    description: '',
                    price: finalPriceString
                  });
                }
              }
            }
            // Only add category if it has dishes
            if (dishes.length > 0) {
              extractedCategories.push({
                name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
                dishes: dishes
              });
            }
          }
        }
      } else if (result.categories && Array.isArray(result.categories)) {
        // Case 2: AI returned { categories: [ { name: ..., dishes: [...] } ] }
        console.log('Found categories array from AI, processing array structure...');
        result.categories.forEach((category: any) => {
          if (!category || typeof category !== 'object') return; // Skip invalid category entries
          const dishes: any[] = [];
          if (Array.isArray(category.dishes)) {
            category.dishes.forEach((dish: any) => {
              if (!dish || typeof dish !== 'object') return; // Skip invalid dish entries
              console.log('AI Dish Object structure (from categories array):', dish);
              const priceString = dish.precio?.toString() || dish.price?.toString() || '0';
              const cleanedPriceString = priceString.replace(/[€$£]/g, '').trim();
              const priceAsNumber = parseFloat(cleanedPriceString);
              const finalPriceString = !isNaN(priceAsNumber) ? priceAsNumber.toString() : '0';
              dishes.push({
                title: dish.name || dish.nombre || dish.title || 'Untitled Dish',
                description: dish.descripcion || dish.description || '',
                price: finalPriceString
              });
            });
          }
          // Only add category if it has dishes
           if (dishes.length > 0) {
             extractedCategories.push({
               name: category.name || 'Untitled Category',
               dishes: dishes
             });
           }
        });
      } else {
        // Case 3: No menu data found
        console.log('No menu object or categories array found in AI response.');
        // extractedCategories remains empty
      }

      // IMPORTANT: Overwrite result.categories with the processed data
      result.categories = extractedCategories;
      console.log('Final extracted categories after processing:', result.categories);
      // --- End Restructured Extraction ---

      // Get placeholder name based on language
      const placeholderName = currentLanguage === 'es' ? 'Restaurante desconocido' : 'Unknown restaurant';
      
      console.log('Current restaurant name:', restaurantName);
      console.log('Using placeholder name if needed:', placeholderName);

      // Ensure restaurant data exists and has a name
      if (!result.restaurant || typeof result.restaurant !== 'object') {
        console.log('No restaurant object found, creating one');
        result.restaurant = { name: restaurantName || placeholderName };
      } else if (!result.restaurant.name) {
        console.log('Restaurant object found but no name, setting name');
        result.restaurant.name = restaurantName || placeholderName;
      } else if (!restaurantName) {
        // If we have a name from the upload but no manual name, use the uploaded name
        console.log('Using uploaded restaurant name');
        result.restaurant.name = result.restaurant.name;
      }

      // Ensure userEmail is present
      if (!result.userEmail) {
        console.warn('User email not found in response, this might cause issues with data association');
      }

      // Ensure categories array exists
      if (!result.categories || !Array.isArray(result.categories)) {
        console.log('No categories array found, initializing empty array');
        result.categories = [];
      }

      // Process categories and dishes to ensure they have the required fields
      result.categories = result.categories.map((category: any, index: number) => {
        // Ensure category has an id (temporary)
        if (!category.id) {
          category.id = `temp_category_${index}`;
        }

        // Ensure dishes array exists
        if (!category.dishes || !Array.isArray(category.dishes)) {
          category.dishes = [];
        }

        // Process dishes to ensure they have the required fields
        category.dishes = category.dishes.map((dish: any, dishIndex: number) => {
          return {
            id: dish.id || `temp_dish_${index}_${dishIndex}`,
            title: dish.title || 'Untitled Dish',
            description: dish.description || '',
            price: dish.price?.toString() || '0',
            imageUrl: dish.imageUrl || null,
            categoryId: category.id
          };
        });

        return category;
      });

      console.log('Final processed data before dispatch:', {
        restaurant: result.restaurant,
        categoriesCount: result.categories.length,
        userEmail: result.userEmail
      });

      // Dispatch the success event with the processed data
      dispatch('success', { restaurantData: result });
      toasts.success(t('menuUploadSuccess'));
      uploaderStore.setLoading(false, t('completed'), 100);
      setTimeout(() => uploaderStore.reset(), 1000);

    } catch (error) {
      console.error('Error guardando datos del restaurante:', error);
      toasts.error(t('error') + ': No se pudo guardar la información');
      uploaderStore.reset();
    }
  }

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
  }
</script>

<div class="space-y-4">
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="w-full h-36 border-2 border-dashed rounded-xl transition-all duration-200 relative {isDragging ? 'border-blue-400 bg-blue-50' : 'border-blue-200 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-400'}"
    on:dragenter={handleDragEnter}
    on:dragleave={handleDragLeave}
    on:dragover={handleDragOver}
    on:drop={handleDrop}
  >
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      {#if !$uploaderStore.isLoading}  <!-- Only show dropzone content when NOT loading -->
        <div class="text-center space-y-4">
          {#if isMobile}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-12 w-12 text-blue-400 mx-auto" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-blue-400 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          {/if}
          <div class="space-y-1">
            <p class="text-base font-medium text-gray-900">{t('uploadMenuFiles')}</p>
            <p class="text-sm text-gray-500">
              {#if isMobile}
                {t('takePhotoOnMobile')}
              {:else}
                {isDragging ? t('dropToUpload') : t('dragAndDropOrClick')}
              {/if}
            </p>
            <p class="text-xs text-gray-400">
              {`${t('maxFileSize')}: ${MAX_FILE_SIZE_MB}MB, ${t('maxPdfPages')}: ${MAX_PDF_PAGES}`}
            </p>
          </div>
        </div>
      {/if} <!-- End of !loading block -->
    </div>
    <input
      type="file"
      id="menu-file-input"
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      accept="application/pdf,image/*"
      multiple
      on:change={handleFileChange}
      disabled={$uploaderStore.isLoading}
    />
  </div>

  {#if $uploaderStore.isLoading}
    <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div class="bg-blue-600 h-2.5 rounded-full" style="width: {$uploaderStore.progress}%"></div>
    </div>
    <p class="text-sm text-gray-600 text-center">{$uploaderStore.currentStep}</p>
  {/if}

  {#if images.length > 0}
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each images as img, index}
        <div class="relative group">
          <img
            src={img.dataURL}
            alt={`Page ${img.page}`}
            class="w-full aspect-[3/4] object-cover rounded-lg border border-gray-200"
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors duration-200">
            <button
              class="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
              on:click={() => {
                 if (!$uploaderStore.isLoading) {
                   images.splice(index, 1);
                   images = [...images];
                 }
              }}
            >
              <!-- SVG icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div> 
```

`src/lib/components/menu-editor/restaurant/PhoneInput.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  export let phoneNumber: number | null = null;

  const dispatch = createEventDispatcher<{
    change: { phoneNumber: number | null };
  }>();

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => {
    // Safety check to prevent errors with missing translation keys
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][currentLanguage] || key;
  };

  let localPhoneNumber = phoneNumber?.toString() || '';

  // Initialize from prop AND REACT TO CHANGES
  $: {
    // This needs to handle the case where phoneNumber becomes null
    if (phoneNumber !== undefined && phoneNumber !== null) {
      localPhoneNumber = phoneNumber.toString();
    } else {
      // Explicitly clear localPhoneNumber if the prop is null/undefined
      localPhoneNumber = '';
    }
  }

  function handlePhoneNumberInput(event: Event) {
    const input = event.target as HTMLInputElement;
    localPhoneNumber = input.value;
    
    // Process phone number: remove ALL spaces and non-digit characters and convert to number
    let processed: number | null = null;
    if (localPhoneNumber.trim()) {
      // First remove all spaces, then remove any remaining non-digit characters
      const noSpaces = localPhoneNumber.replace(/\s+/g, '');
      const digitsOnly = noSpaces.replace(/\D/g, '');
      
      // Only set the phone number if it's a valid number
      if (digitsOnly.length > 0) {
        try {
          // Convert to number to validate it's a valid integer
          const numericValue = Number(digitsOnly);
          if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
            processed = numericValue;  // Store as number instead of string
          }
        } catch (e) {
          console.error('Error converting phone number to integer:', e);
        }
      }
    }
    
    // Only dispatch the phone number change
    dispatch('change', { phoneNumber: processed });
  }
</script>

<div class="space-y-2">
  <label class="block text-sm font-medium text-gray-700">
    {t('phoneNumber')}
  </label>
  <div class="flex gap-2">
    <input
      type="tel"
      value={localPhoneNumber}
      on:input={handlePhoneNumberInput}
      placeholder={t('enterPhoneNumber')}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out bg-white/80 backdrop-blur-sm"
    />
  </div>

</div>

<style>
  /* Add smooth scrollbar for the dropdown */
  div :global(.overflow-auto) {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
  
  div :global(.overflow-auto::-webkit-scrollbar) {
    width: 6px;
  }
  
  div :global(.overflow-auto::-webkit-scrollbar-track) {
    background: transparent;
  }
  
  div :global(.overflow-auto::-webkit-scrollbar-thumb) {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 3px;
  }
</style> 
```

`src/lib/components/menu-editor/restaurant/QRCode.svelte`:

```svelte
<script lang="ts">
  import QRCode from 'qrcode';
  import { onMount } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';

  export let url: string;
  let canvas: HTMLCanvasElement;
  let container: HTMLDivElement;
  let qrError: string | null = null;
  let displaySize: number;
  let pixelRatio: number = 1;
  let containerWidth: number;

  const QR_SIZE = 200; // Logical size
  const LOGO_SIZE = 50; // Used for CSS styling of the overlay
  const LOGO_MARGIN = 0; /// Used for CSS styling of the overlay

  // Add a mobile-specific size
  const MOBILE_QR_SIZE = 100; // Smaller size for mobile

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  onMount(() => {
    if (!url) return;
    
    // Get container width for responsive sizing
    const updateSize = () => {
      if (!container) return;
      containerWidth = container.clientWidth;
      
      // Use smaller size on mobile devices
      const isMobile = window.innerWidth < 768;
      const maxSize = isMobile ? MOBILE_QR_SIZE : QR_SIZE;
      
      // Calculate appropriate size - consider parent container constraints
      displaySize = Math.min(containerWidth, maxSize);
      
      // Update canvas with new size
      pixelRatio = window.devicePixelRatio || 1;
      const scaledSize = displaySize * pixelRatio;
      
      canvas.width = scaledSize;
      canvas.height = scaledSize;
      canvas.style.width = `${displaySize}px`;
      canvas.style.height = `${displaySize}px`;
      
      generateQR();
    };
    
    // Generate QR with current size settings
    const generateQR = () => {
      QRCode.toCanvas(canvas, url, {
        width: canvas.width,
        margin: 0,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }).catch((err: Error) => {
        console.error('Error generating QR code:', err);
        qrError = err.message;
      });
    };
    
    updateSize();
    
    // Handle window resize
    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(container);
    
    return () => resizeObserver.disconnect();
  });
</script>

<div 
  bind:this={container}
  class="qr-code-container"
  style="--logo-size: {LOGO_SIZE * (displaySize / QR_SIZE)}px; --logo-margin: {LOGO_MARGIN}px;"
>
  <canvas
    bind:this={canvas}
    class="qr-code"
    aria-label={t('qrCodeFor').replace('{url}', url)}
  />
  <!-- Logo Overlay -->
  <img 
    src="/favicon_simplified_4QR.svg" 
    alt="Logo Overlay"
    class="qr-logo-overlay"
  />
  {#if qrError}
    <p class="text-red-500 text-sm">{t('qrCodeError')}: {qrError}</p>
  {/if}
</div>

<style>
  .qr-code-container {
    display: inline-flex;
    flex-direction: column;
    align-items: center; /* Center horizontally instead of flex-end */
    position: relative;
    max-width: 100%; /* Ensure it never exceeds parent width */
  }
  
  .qr-code {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem;
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .qr-logo-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    
    /* Size controlled by CSS variables */
    width: var(--logo-size);
    height: var(--logo-size);
    
    /* Background and margin via padding */
    padding: var(--logo-margin);
    background-color: white;
    border-radius: 4px; /* Match previous roundRect radius */
    box-sizing: border-box; /* Include padding in width/height */

    /* Optional: prevent interaction if needed */
    pointer-events: none; 
  }
</style> 
```

`src/lib/components/menu-editor/restaurant/RestaurantInfo.svelte`:

```svelte
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { menuStore } from '$lib/stores/menu-store';
  import { get } from 'svelte/store';
  import type { Restaurant } from '$lib/types/menu.types';
  
  // Import extracted components
  import MenuUploader from './MenuUploader.svelte';
  import RestaurantNameInput from './RestaurantNameInput.svelte';
  import LogoUploader from './LogoUploader.svelte';
  import CustomPromptInput from './CustomPromptInput.svelte';
  import ThemeColorSection from './ThemeColorSection.svelte';
  import PhoneInput from './PhoneInput.svelte';
  import CurrencyPicker from './CurrencyPicker.svelte';
  import UrlInputSection from './UrlInputSection.svelte';

  // Import our helpers
  import {
    type UpdateEvent,
    handleRestaurantSelect,
    handleCurrencyChange,
    handleMenuUploadSuccess,
    handleMenuUploadError,
    handlePhoneNumberChange
  } from '$lib/utils/RestaurantInfo.helpers';

  /******************
   *   PROPERTIES   *
   ******************/
  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let restaurants: Restaurant[] = [];
  export let customPrompt: string | null = null;
  export let currency: string = '€';
  export let color: string = '#85A3FA';
  export let phoneNumber: number | null = null;
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  /***************************
   *   COMPONENT STATE / FLAGS
   ***************************/
  let isCreatingRestaurant = false;

  // Reset state when adding a new restaurant
  $: if (selectedRestaurant === null) {
    console.log('Resetting RestaurantInfo state - new restaurant');
    restaurantName = '';
    menuLogo = null;
    customPrompt = null;
    phoneNumber = null;
    color = '#85A3FA';
    currency = '€';
    reservas = null;
    redes_sociales = null;
    isCreatingRestaurant = false;
  }

  // Svelte event dispatcher
  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
    select: string;
  }>();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key]?.[currentLanguage] || translations[key]?.['es'] || key;

  // Called on <select> for restaurant
  function onRestaurantSelect(event: Event) {
    handleRestaurantSelect(event, (evt, val) => {
      // Reset state before dispatching select event
      if (val === 'new') {
        console.log('Resetting state for new restaurant');
        restaurantName = '';
        menuLogo = null;
        customPrompt = null;
        phoneNumber = null;
        color = '#85A3FA';
        currency = '€';
        reservas = null;
        redes_sociales = null;
        isCreatingRestaurant = false;
      }
      dispatch(evt, val);
    });
  }

  // Called on currency <input> change
  function onCurrencyChange(e: CustomEvent<string>) {
    const value = e.detail;
    console.log('RestaurantInfo: onCurrencyChange triggered. New value:', value);
    handleCurrencyChange(
      value,
      restaurantName,
      menuLogo,
      customPrompt,
      phoneNumber,
      color,
      reservas,
      redes_sociales,
      dispatch
    );
  }

  // Helper to dispatch a full update event
  function dispatchFullUpdate() {
    dispatch('update', {
      id: selectedRestaurant || undefined,
      name: restaurantName,
      logo: menuLogo,
      customPrompt: customPrompt,
      phoneNumber: phoneNumber,
      currency: currency,
      color: color,
      reservas: reservas,
      redes_sociales: redes_sociales,
    });
  }

  onMount(() => {
    // Add detailed debugging of component mount
    console.log('RestaurantInfo component mounted with initial values:', {
      reservas,
      redes_sociales,
      color
    });

    // Load restaurant data from the currentRestaurant store if available
    const cRest = get(currentRestaurant);
    if (cRest) {
      console.log('Loading restaurant data from store:', cRest);
      
      // Load the color value from the restaurant record
      if (cRest.color) {
        console.log('Setting color from database:', cRest.color);
      }
    }
  });
</script>

<div class="space-y-4">
  <!-- Menu Uploader -->
  <div class="space-y-2 mb-12">
    <label class="block text-lg font-semibold mb-3 text-gray-800">
      {t('uploadMenu')}
    </label>
    <MenuUploader
      {restaurantName}
      {customPrompt}
      restaurantId={selectedRestaurant || get(currentRestaurant)?.id || null}
      on:success={async (event) => {
        const currentState = { restaurantName, menuLogo, customPrompt, phoneNumber, currency, color, reservas, redes_sociales };
        await handleMenuUploadSuccess(event, dispatch, currentState, t);
      }}
      on:error={(event) => {
        handleMenuUploadError(event, t);
      }}
    />
  </div>

  <!-- Restaurant Name Input -->
  <RestaurantNameInput
    bind:restaurantName
    bind:menuLogo
    bind:selectedRestaurant
    bind:isCreatingRestaurant
    bind:customPrompt
    bind:phoneNumber
    bind:color
    bind:currency
    bind:reservas
    bind:redes_sociales
    on:update={(event) => dispatch('update', event.detail)}
  />

  <!-- Logo Upload -->
  <LogoUploader
    bind:restaurantName
    bind:menuLogo
    bind:selectedRestaurant
    bind:customPrompt
    bind:phoneNumber
    bind:color
    bind:currency
    bind:reservas
    bind:redes_sociales
    on:update={(event) => dispatch('update', event.detail)}
  />

  <!-- Custom Prompt -->
  <CustomPromptInput
    bind:restaurantName
    bind:selectedRestaurant
    bind:menuLogo
    bind:customPrompt
    bind:phoneNumber
    bind:color
    bind:currency
    bind:reservas
    bind:redes_sociales
    on:update={(event) => dispatch('update', event.detail)}
  />

  <!-- Color and Settings Sections -->
  <div class="space-y-4 mt-6 mb-12">
    <ThemeColorSection
      bind:restaurantName
      bind:selectedRestaurant
      bind:menuLogo
      bind:customPrompt
      bind:phoneNumber
      bind:color
      bind:currency
      bind:reservas
      bind:redes_sociales
      {t}
      on:update={(event) => dispatch('update', event.detail)}
    />

    <!-- Currency Selection -->
    <CurrencyPicker 
      value={currency}
      {t} 
      on:change={(event) => {
        const newCurrency = event.detail;
        dispatch('update', {
          id: selectedRestaurant || undefined,
          name: restaurantName,
          logo: menuLogo,
          customPrompt,
          phoneNumber,
          currency: newCurrency,
          color,
          reservas,
          redes_sociales,
        });
      }}
    />

    <!-- Phone Number -->
    <div class="space-y-2 mb-12">
      <PhoneInput
        bind:phoneNumber
        on:change={(event) => {
          phoneNumber = event.detail.phoneNumber;
          dispatch('update', {
            id: selectedRestaurant || undefined,
            name: restaurantName,
            logo: menuLogo,
            customPrompt,
            phoneNumber: event.detail.phoneNumber,
            currency,
            color,
            reservas,
            redes_sociales,
          });
        }}
      />
    </div>

    <!-- URL Inputs. -->
    <UrlInputSection
      bind:restaurantName
      bind:selectedRestaurant
      bind:menuLogo
      bind:customPrompt
      bind:phoneNumber
      bind:color
      bind:currency
      bind:reservas
      bind:redes_sociales
      on:update={(event) => {
        dispatchFullUpdate();
      }}
    />
  </div>
</div>

<style>
  :global(input[type="text"]) {
    @apply border border-gray-300 rounded-md px-3 py-2 w-full focus:ring-2
      focus:ring-blue-500 focus:border-transparent transition-all
      duration-200 ease-in-out bg-white/80 backdrop-blur-sm;
  }

  :global(input[type="text"]::placeholder) {
    @apply text-gray-400;
  }

  span {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(.form-radio) {
    @apply h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500;
  }
</style>
```

`src/lib/components/menu-editor/restaurant/RestaurantNameInput.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import { 
    startEditingRestaurant,
    cancelEditingRestaurant,
    handleRestaurantEditKeyPress,
    updateRestaurantName,
    handleRestaurantNameInput
  } from '$lib/utils/RestaurantInfo.helpers';
  import QRCode from './QRCode.svelte';

  export let restaurantName = '';
  export let menuLogo: string | null = null;
  export let selectedRestaurant: string | null = null;
  export let isCreatingRestaurant = false;
  export let customPrompt: string | null = null;
  export let phoneNumber: number | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;
  
  let isEditingRestaurant = false;
  let editingRestaurantName = '';

  // Svelte event dispatcher
  const dispatch = createEventDispatcher();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // Called on "Edit" button
  function onEditRestaurantClick() {
    startEditingRestaurant(
      (val) => editingRestaurantName = val,
      (val) => isEditingRestaurant = val,
      restaurantName
    );
  }

  // Called on "Cancel" button while editing
  function onCancelEdit() {
    cancelEditingRestaurant(
      (val) => editingRestaurantName = val,
      (val) => isEditingRestaurant = val,
      restaurantName
    );
  }

  // Actually update the restaurant name
  async function onUpdateRestaurantName() {
    await updateRestaurantName(
      editingRestaurantName,
      selectedRestaurant,
      dispatch,
      t,
      (val: string) => restaurantName = val,
      (val: boolean) => isEditingRestaurant = val
    );
  }

  // On "Enter" or "Escape"
  function onRestaurantEditKeyPress(event: KeyboardEvent) {
    handleRestaurantEditKeyPress(
      event,
      onUpdateRestaurantName,
      onCancelEdit
    );
  }

  // Called on <input> blur for restaurantName
  function onRestaurantNameBlur() {
    handleRestaurantNameInput(
      restaurantName,
      selectedRestaurant,
      isCreatingRestaurant,
      menuLogo,
      customPrompt,
      phoneNumber?.toString() || null,
      color,
      currency,
      dispatch,
      t
    );
  }
</script>

<div class="space-y-2">
  {#if isEditingRestaurant}
    <div class="flex items-center gap-2 w-full">
      <input
        type="text"
        bind:value={editingRestaurantName}
        on:keydown={onRestaurantEditKeyPress}
        placeholder={t('enterRestaurantName')}
        class="flex-1"
      />
      <button
        class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        on:click={onUpdateRestaurantName}
      >
        {t('save')}
      </button>
      <button
        class="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
        on:click={onCancelEdit}
      >
        {t('cancel')}
      </button>
    </div>
  {:else}
    <div class="w-full">
      <div class="flex items-center gap-2">
        <input
          type="text"
          bind:value={restaurantName}
          on:blur={onRestaurantNameBlur}
          placeholder={t('enterRestaurantName')}
          class="flex-1"
          readonly={!!selectedRestaurant}
        />
        {#if selectedRestaurant}
          <button
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            on:click={onEditRestaurantClick}
          >
            {t('edit')}
          </button>
        {/if}
      </div>
      {#if selectedRestaurant}
        {#if isCreatingRestaurant}
          <div class="flex items-center gap-1 px-3 py-1 mt-2 text-sm text-gray-600">
            <svg
              class="animate-spin h-4 w-4 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373
                   0 0 5.373 0 12h4zm2 5.291A7.962
                   7.962 0 014 12H0c0 3.042 1.135
                   5.824 3 7.938l3-2.647z"
              />
            </svg>
            {t('generatingPreview')}
          </div>
        {:else if $currentRestaurant?.slug}
          <div class="flex flex-col items-start w-full mt-2">
            <a
              href={`https://${$currentRestaurant.slug}.reco.restaurant`}
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1 px-3 py-1 text-lg text-blue-600 hover:text-blue-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11 3a1 1 0 100 2h2.586l-6.293
                         6.293a1 1 0 101.414 1.414L15
                         6.414V9a1 1 0 102 0V4a1 1
                         0 00-1-1h-5z" />
                <path
                  d="M5 5a2 2 0 00-2
                     2v8a2 2 0 002 2h8a2
                     2 0 002-2v-3a1 1
                     0 10-2 0v3H5V7h3a1
                     1 0 000-2H5z"
                />
              </svg>
              {$currentRestaurant.slug}.reco.restaurant
            </a>
            <div class="mt-2 flex justify-center w-full">
              <QRCode url={`https://${$currentRestaurant.slug}.reco.restaurant`} />
            </div>
          </div>
        {/if}
      {/if}
    </div>
  {/if}
</div> 
```

`src/lib/components/menu-editor/restaurant/ThemeColorSection.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import ColorPicker from './ColorPicker.svelte';
  import type { UpdateEvent } from '$lib/utils/RestaurantInfo.helpers';
  
  export let restaurantName: string;
  export let selectedRestaurant: string | null;
  export let menuLogo: string | null;
  export let customPrompt: string | null;
  export let phoneNumber: number | null;
  export let color: string = '#85A3FA';
  export let currency: string;
  export let reservas: string | null;
  export let redes_sociales: string | null;
  export let t: (key: string) => string;

  // Local state
  let showCustomColorPicker = false;
  let customColorValue = '';
  let displayColor = 'light';

  const dispatch = createEventDispatcher<{
    update: UpdateEvent;
  }>();

  $: currentLanguage = $language;
  $: t = (key: string) => translations[key]?.[currentLanguage] || translations[key]?.['es'] || key;

  $: colorOptions = [
    { value: 'light', label: t('colorLight') },
    { value: 'custom', label: t('colorCustom') }
  ];

  // Handle initial and subsequent color changes
  $: {
    if (color && typeof color === 'string') {
      if (color === '#85A3FA') {
        displayColor = 'light';
        customColorValue = '';
        showCustomColorPicker = false;
      } else if (color.startsWith('#')) {
        displayColor = 'custom';
        customColorValue = color;
        showCustomColorPicker = true;
      }
    }
  }

  function onColorAccept(event: CustomEvent<string>) {
    const newColor = event.detail;
    if (newColor) {
      displayColor = 'custom';
      customColorValue = newColor;
      showCustomColorPicker = false;
      
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber,
        color: newColor,
        currency,
        reservas,
        redes_sociales,
      });
    }
  }

  function onRadioChange(value: string) {
    if (value === 'light') {
      showCustomColorPicker = false;
      customColorValue = '';
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber,
        color: '#85A3FA',
        currency,
        reservas,
        redes_sociales,
      });
    } else if (value === 'custom') {
      showCustomColorPicker = true;
    }
  }

  function onColorCancel() {
    if (customColorValue && customColorValue !== '#85A3FA') {
      // Return to previous custom color
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber,
        color: customColorValue,
        currency,
        reservas,
        redes_sociales,
      });
    } else {
      // Return to light theme
      showCustomColorPicker = false;
      displayColor = 'light';
      customColorValue = '';
      dispatch('update', {
        id: selectedRestaurant || undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt,
        phoneNumber,
        color: '#85A3FA',
        currency,
        reservas,
        redes_sociales,
      });
    }
  }
</script>

<div class="space-y-4">
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">
      {t('themeColor')}
    </label>
    
    <div class="flex gap-4 flex-wrap mb-4">
      {#each colorOptions as option}
        <label class="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="color-theme-selector"
            value={option.value}
            checked={displayColor === option.value}
            on:change={() => onRadioChange(option.value)}
            on:click={() => {
              if (option.value === 'custom') {
                showCustomColorPicker = true;
              }
            }}
            class="form-radio text-blue-600"
          />
          <span class="text-sm text-gray-700" on:click={() => {
            if (option.value === 'custom') {
              showCustomColorPicker = true;
            }
            onRadioChange(option.value);
          }}>
            {option.label}
          </span>
        </label>
      {/each}
    </div>

    {#if showCustomColorPicker}
      <div class="mt-4 space-y-4 border-t pt-4 border-gray-200">
        <ColorPicker
          value={color}
          customHexColor={customColorValue}
          {showCustomColorPicker}
          colorOptions={[]}
          {selectedRestaurant}
          {t}
          on:accept={onColorAccept}
          on:cancel={onColorCancel}
        />
      </div>
    {/if}
  </div>
</div> 
```

`src/lib/components/menu-editor/restaurant/UrlInput.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  
  export let value: string | null = null;
  export let label: string = '';
  export let placeholder: string = '';
  export let id: string = '';

  const dispatch = createEventDispatcher<{
    change: string | null;
  }>();

  let inputValue = value || '';

  // Debug logging
  onMount(() => {
    console.log(`UrlInput ${id} initial value:`, value);
  });

  // Also log when value changes
  $: {
    console.log(`UrlInput ${id} value prop changed to:`, value);
    // Handle prop changes, including becoming null
    if (value === null || value === undefined) {
      if (inputValue !== '') { // Only update if it's actually different
        inputValue = '';
        console.log(`UrlInput ${id} cleared inputValue because prop is null/undefined`);
      }
    } else if (value !== inputValue) {
      inputValue = value;
      console.log(`UrlInput ${id} updated inputValue from prop`);
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;
    
    // Explicitly handle empty strings
    const valueToDispatch = inputValue.trim() === '' ? null : inputValue;
    
    console.log(`UrlInput ${id} input changed to:`, {
      raw: inputValue,
      trimmed: inputValue.trim(),
      isEmpty: inputValue.trim() === '', 
      dispatching: valueToDispatch,
      typeof: typeof valueToDispatch
    });
    
    dispatch('change', valueToDispatch);
  }
</script>

<div class="space-y-2">
  <label for={id} class="block text-sm font-medium text-gray-700">
    {label}
  </label>
  <div class="relative">
    <input
      {id}
      type="text"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2
             focus:ring-blue-500 focus:border-transparent transition-all
             duration-200 ease-in-out bg-white/80 backdrop-blur-sm"
      value={inputValue}
      on:input={handleInput}
      {placeholder}
    />
  </div>
</div>

<style>
  input::placeholder {
    @apply text-gray-400;
  }
</style> 
```

`src/lib/components/menu-editor/restaurant/UrlInputSection.svelte`:

```svelte
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores/menu-store';
  import UrlInput from './UrlInput.svelte';

  export let restaurantName = '';
  export let selectedRestaurant: string | null = null;
  export let menuLogo: string | null = null;
  export let customPrompt: string | null = null;
  export let phoneNumber: number | null = null;
  export let color: string = '#85A3FA';
  export let currency: string = '€';
  export let reservas: string | null = null;
  export let redes_sociales: string | null = null;

  // Svelte event dispatcher
  const dispatch = createEventDispatcher();

  // Reactive translations
  $: currentLanguage = $language;
  $: t = (key: string) => translations[key][currentLanguage];

  // Function to handle reservas URL input
  function handleReservasChange(event: CustomEvent<string | null>) {
    console.trace('handleReservasChange called');
    
    // Convert empty string to null
    reservas = event.detail === "" ? null : event.detail;
    
    // Log the value being set
    console.log('Setting reservas value:', {
      value: reservas,
      type: typeof reservas,
      eventDetail: event.detail,
      eventDetailType: typeof event.detail
    });
    
    // Force a store update to mark data as changed
    menuStore.updateReservasAndSocials(reservas, redes_sociales);
    
    // Update restaurant info
    dispatch('update', {
      id: selectedRestaurant,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      reservas,
      redes_sociales
    });
  }

  // Function to handle redes_sociales URL input
  function handleRedesSocialesChange(event: CustomEvent<string | null>) {
    console.trace('handleRedesSocialesChange called');
    
    // Convert empty string to null
    redes_sociales = event.detail === "" ? null : event.detail;
    
    // Log the value being set
    console.log('Setting redes_sociales value:', {
      value: redes_sociales,
      type: typeof redes_sociales,
      eventDetail: event.detail,
      eventDetailType: typeof event.detail
    });
    
    // Force a store update to mark data as changed
    menuStore.updateReservasAndSocials(reservas, redes_sociales);
    
    // Update restaurant info
    dispatch('update', {
      id: selectedRestaurant,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber,
      currency,
      reservas,
      redes_sociales
    });
  }
</script>

<div class="space-y-4">
  <!-- Reservas URL -->
  <UrlInput
    id="reservas"
    label={t('reservasLabel') || "Reservations URL"}
    placeholder={t('reservasPlaceholder') || "https://reservations.example.com"}
    value={reservas}
    on:change={handleReservasChange}
  />

  <!-- Redes Sociales URL -->
  <UrlInput
    id="redes_sociales"
    label={t('redesSocialesLabel') || "Social Media URL"}
    placeholder={t('redesSocialesPlaceholder') || "https://instagram.com/yourrestaurant"}
    value={redes_sociales}
    on:change={handleRedesSocialesChange}
  />
</div> 
```

`src/lib/components/ui/ConfirmDialog.svelte`:

```svelte
<!-- ConfirmDialog.svelte -->
<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { fly } from 'svelte/transition';
  import { Button } from './button';

  export let message: string;
  export let show = false;

  // Variables to track viewport position
  let viewportTop = 0;
  let viewportHeight = 0;

  const dispatch = createEventDispatcher<{
    confirm: void;
    cancel: void;
  }>();

  function handleConfirm() {
    dispatch('confirm');
    show = false;
  }

  function handleCancel() {
    dispatch('cancel');
    show = false;
  }

  // Update viewport position when dialog is shown
  $: if (show) {
    updateViewportPosition();
  }

  // Function to update the viewport position
  function updateViewportPosition() {
    viewportTop = window.scrollY;
    viewportHeight = window.innerHeight;
  }

  // Listen for scroll events when dialog is shown
  onMount(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        if (show) {
          updateViewportPosition();
        }
      };

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  });
</script>

{#if show}
  <!-- Fixed overlay that follows the viewport -->
  <div 
    class="fixed z-50"
    style="top: {viewportTop}px; left: 0; right: 0; height: {viewportHeight}px;"
  >
    <!-- Semi-transparent backdrop with rounded corners -->
    <div class="absolute inset-0 bg-black/50 rounded-xl"></div>
    
    <!-- Centered dialog -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div 
        class="bg-white rounded-md shadow-lg max-w-md w-[400px] overflow-hidden"
        transition:fly={{ y: 20, duration: 200 }}
      >
        <!-- Dialog content -->
        <div class="p-5">
          <p class="text-center text-gray-800 mb-5">{message}</p>
          <div class="flex justify-end gap-2">
            <button 
              class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              on:click={handleCancel}
            >
              Cancel
            </button>
            <button 
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              on:click={handleConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 
```

`src/lib/components/ui/LanguageSwitch.svelte`:

```svelte
<script lang="ts">
  import { language } from '$lib/stores/language';

  function toggleLanguage() {
    $language = $language === 'en' ? 'es' : 'en';
  }
</script>

<button
  on:click={toggleLanguage}
  class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white dark:text-gray-800 dark:bg-gray-200/50 dark:hover:bg-gray-200/70 transition-colors"
>
  <span class="text-lg">
    {#if $language === 'en'}
      🇬🇧
    {:else}
      🇪🇸
    {/if}
  </span>
  <span class="font-medium">
    {$language.toUpperCase()}
  </span>
</button> 
```

`src/lib/components/ui/Toast.svelte`:

```svelte
<!-- Toast.svelte -->
<script lang="ts">
  import { toasts } from '$lib/stores/toast';
  import { fly } from 'svelte/transition';
</script>

<div class="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
  <div class="space-y-2 pointer-events-auto">
    {#each $toasts as toast (toast.id)}
      <div
        transition:fly={{ y: 20, duration: 300 }}
        class="p-4 rounded-lg shadow-lg backdrop-blur-md border max-w-md w-full text-center {toast.type === 'success' 
          ? 'bg-green-500/90 text-white border-green-400' 
          : toast.type === 'error' 
          ? 'bg-red-500/90 text-white border-red-400' 
          : 'bg-blue-500/90 text-white border-blue-400'}"
      >
        {toast.message}
      </div>
    {/each}
  </div>
</div> 
```

`src/lib/components/ui/button/button.svelte`:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLButtonAttributes } from "svelte/elements";
  import { buttonVariants, type ButtonVariants } from "./variants";
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  interface $$Props extends HTMLButtonAttributes {
    variant?: ButtonVariants["variant"];
    size?: ButtonVariants["size"];
    class?: string;
  }

  let className: string | undefined = undefined;
  export let variant: $$Props["variant"] = "default";
  export let size: $$Props["size"] = "default";
  export { className as class };

  function handleClick(event: MouseEvent) {
    console.log('Button clicked');
    dispatch('click', event);
  }
</script>

<button
  class={cn(buttonVariants({ variant, size, className }))}
  on:click={handleClick}
  {...$$restProps}
>
  <slot />
</button> 
```

`src/lib/components/ui/button/index.ts`:

```ts
export { default as Button } from "./button.svelte";
export { buttonVariants } from "./variants"; 
```

`src/lib/components/ui/button/variants.ts`:

```ts
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: "inline-flex items-center justify-center rounded-md text-sm font-medium whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export type ButtonVariants = VariantProps<typeof buttonVariants>; 
```

`src/lib/components/ui/card/card-content.svelte`:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<div class={cn("p-6 pt-0", className)} {...$$restProps}>
  <slot />
</div> 
```

`src/lib/components/ui/card/card.svelte`:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils";

  let className: string | undefined = undefined;
  export { className as class };
</script>

<div
  class={cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    className
  )}
  {...$$restProps}
>
  <slot />
</div> 
```

`src/lib/components/ui/card/index.ts`:

```ts
export { default as Card } from "./card.svelte";
export { default as CardContent } from "./card-content.svelte"; 
```

`src/lib/components/ui/checkbox/checkbox.svelte`:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils";
  import { Check } from "lucide-svelte";

  interface $$Props {
    checked?: boolean;
    class?: string;
    id?: string;
  }

  let className: string | undefined = undefined;
  export let checked = false;
  export { className as class };
</script>

<div
  class={cn(
    "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
    className
  )}
  data-state={checked ? "checked" : "unchecked"}
>
  {#if checked}
    <div class="flex items-center justify-center text-current">
      <Check class="h-4 w-4" />
    </div>
  {/if}
  <input
    type="checkbox"
    bind:checked
    class="absolute h-4 w-4 opacity-0"
    {...$$restProps}
  />
</div> 
```

`src/lib/components/ui/checkbox/index.ts`:

```ts
export { default as Checkbox } from "./checkbox.svelte"; 
```

`src/lib/components/ui/input/index.ts`:

```ts
export { default as Input } from "./input.svelte"; 
```

`src/lib/components/ui/input/input.svelte`:

```svelte
<script lang="ts">
  import { cn } from "$lib/utils";
  import type { HTMLInputAttributes } from "svelte/elements";

  interface $$Props extends HTMLInputAttributes {
    class?: string;
  }

  let className: string | undefined = undefined;
  export { className as class };
</script>

<input
  class={cn(
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  {...$$restProps}
/> 
```

`src/lib/components/ui/modal/modal.svelte`:

```svelte
<script lang="ts">
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  
  export let showModal: boolean;
  
  const dispatch = createEventDispatcher();
  
  $: {
    console.log('Modal showModal value changed:', showModal);
  }
  
  function closeModal() {
    console.log('Closing modal...');
    showModal = false;
    dispatch('close');
  }
</script>

{#if showModal}
  <div 
    class="fixed inset-0 bg-black/50 z-[100]"
    transition:fade
    on:click={closeModal}
  >
    <div 
      class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg w-full max-w-lg"
      on:click|stopPropagation
    >
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Únete a la Lista de Espera</h2>
        <button 
          class="text-gray-500 hover:text-gray-700"
          on:click={closeModal}
        >
          ✕
        </button>
      </div>
      <slot />
    </div>
  </div>
{:else}
  <div class="hidden">Modal is closed</div>
{/if} 
```

`src/lib/config/auth.ts`:

```ts
import { PUBLIC_FACEBOOK_APP_ID, PUBLIC_APPLE_CLIENT_ID, PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export const authConfig = {
  google: {
    clientId: PUBLIC_GOOGLE_CLIENT_ID
  },
  // Temporarily disabled - Only using Google auth for now
  // facebook: {
  //   appId: PUBLIC_FACEBOOK_APP_ID || '',
  //   version: 'v18.0'
  // },
  // apple: {
  //   clientId: PUBLIC_APPLE_CLIENT_ID || '',
  //   scope: 'name email',
  //   redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/api/auth/apple/callback` : ''
  // }
}; 
```

`src/lib/config/env.ts`:

```ts
import { z } from 'zod';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { DATABASE_URL } from '$env/static/private';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BLOB_READ_WRITE_TOKEN: z.string().min(1),
  PUBLIC_GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  PUBLIC_FACEBOOK_APP_ID: z.string().min(1),
  PUBLIC_APPLE_CLIENT_ID: z.string().min(1),
  APPLE_CLIENT_SECRET: z.string().min(1),
});

// This will throw if the environment variables are not set correctly
const env = envSchema.parse({
  DATABASE_URL: DATABASE_URL,
  BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
  PUBLIC_GOOGLE_CLIENT_ID: PUBLIC_GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  PUBLIC_FACEBOOK_APP_ID: process.env.PUBLIC_FACEBOOK_APP_ID,
  PUBLIC_APPLE_CLIENT_ID: process.env.PUBLIC_APPLE_CLIENT_ID,
  APPLE_CLIENT_SECRET: process.env.APPLE_CLIENT_SECRET,
});

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

if (!PUBLIC_GOOGLE_CLIENT_ID) {
  throw new Error('PUBLIC_GOOGLE_CLIENT_ID is not defined');
}

export default env;
export { DATABASE_URL, PUBLIC_GOOGLE_CLIENT_ID }; 
```

`src/lib/data/restaurants/README.md`:

```md
# Restaurant Data Directory

This directory contains generated restaurant data files used for seeding the database.
Files are automatically generated when users upload menu files through the menu editor. 
```

`src/lib/data/restaurants/restaurant-data-prueba-reco-1739808527066.ts`:

```ts
export const seedData = 
  {
  "userEmail": "chico10117@gmail.com",
  "restaurant": {
    "name": "PRUEBA RECO",
    "logo": "",
    "customPrompt": "RESTAURANT INFO\nDirección: Calle Ficticia 123, Madrid\nTeléfono: 900 123 456\n¡Te esperamos en Fast Bite para una experiencia rápida, deliciosa y llena de sabor! 🚀🔥"
  },
  "categories": [
    {
      "name": "COMIDAS",
      "dishes": [
        {
          "title": "Big Bite Burger",
          "description": "Jugosa hamburguesa de ternera con queso cheddar, lechuga, tomate, cebolla caramelizada y salsa especial en un pan brioche.",
          "price": 7.99
        },
        {
          "title": "Crispy Chicken Deluxe",
          "description": "Pechuga de pollo crujiente con mayonesa de ajo, lechuga fresca y pepinillos en un pan artesanal.",
          "price": 6.99
        },
        {
          "title": "BBQ Ribs Wrap",
          "description": "Tortilla de trigo rellena de costillas deshuesadas a la barbacoa, mezcla de quesos y cebolla frita.",
          "price": 7.49
        },
        {
          "title": "Veggie Supreme",
          "description": "Hamburguesa de garbanzos y espinacas con aguacate, rúcula y salsa de yogur en pan multicereal.",
          "price": 6.49
        }
      ]
    },
    {
      "name": "BEBIDAS",
      "dishes": [
        {
          "title": "Refresco Clásico (Coca-Cola, Fanta, Sprite)",
          "description": "",
          "price": 2.50
        },
        {
          "title": "Limonada Natural",
          "description": "",
          "price": 3.00
        },
        {
          "title": "Batido de Chocolate o Vainilla",
          "description": "",
          "price": 3.50
        },
        {
          "title": "Café Americano o Cappuccino",
          "description": "",
          "price": 2.80
        }
      ]
    }
  ]
};

```

`src/lib/data/restaurants/restaurant-data-prueba-reco-1739808730896.ts`:

```ts
export const seedData = 
  {
    "userEmail": "chico10117@gmail.com",
    "restaurant": {
      "name": "PRUEBA RECO",
      "logo": "",
      "customPrompt": "RESTAURANT INFO\nDirección: Calle Ficticia 123, Madrid\nTeléfono: 900 123 456\n¡Te esperamos en Fast Bite para una experiencia rápida, deliciosa y llena de sabor! 🚀🔥"
    },
    "categories": [
      {
        "name": "COMIDAS",
        "dishes": [
          {
            "title": "Big Bite Burger",
            "description": "Jugosa hamburguesa de ternera con queso cheddar, lechuga, tomate, cebolla caramelizada y salsa especial en un pan brioche.",
            "price": 7.99
          },
          {
            "title": "Crispy Chicken Deluxe",
            "description": "Pechuga de pollo crujiente con mayonesa de ajo, lechuga fresca y pepinillos en un pan artesanal.",
            "price": 6.99
          },
          {
            "title": "BBQ Ribs Wrap",
            "description": "Tortilla de trigo rellena de costillas deshuesadas a la barbacoa, mezcla de quesos y cebolla frita.",
            "price": 7.49
          },
          {
            "title": "Veggie Supreme",
            "description": "Hamburguesa de garbanzos y espinacas con aguacate, rúcula y salsa de yogur en pan multicereal.",
            "price": 6.49
          }
        ]
      },
      {
        "name": "BEBIDAS",
        "dishes": [
          {
            "title": "Refresco Clásico (Coca-Cola, Fanta, Sprite)",
            "description": "",
            "price": 2.50
          },
          {
            "title": "Limonada Natural",
            "description": "",
            "price": 3.00
          },
          {
            "title": "Batido de Chocolate o Vainilla",
            "description": "",
            "price": 3.50
          },
          {
            "title": "Café Americano o Cappuccino",
            "description": "",
            "price": 2.80
          }
        ]
      }
    ]
  }
;

```

`src/lib/data/restaurants/restaurant-data-prueba-reco-1739808887868.ts`:

```ts
export const seedData = 
  {
    "userEmail": "chico10117@gmail.com",
    "restaurant": {
      "name": "PRUEBA RECO",
      "logo": "",
      "customPrompt": "RESTAURANT INFO\nDirección: Calle Ficticia 123, Madrid\nTeléfono: 900 123 456\n¡Te esperamos en Fast Bite para una experiencia rápida, deliciosa y llena de sabor! 🚀🔥"
    },
    "categories": [
      {
        "name": "COMIDAS",
        "dishes": [
          {
            "title": "Big Bite Burger",
            "description": "Jugosa hamburguesa de ternera con queso cheddar, lechuga, tomate, cebolla caramelizada y salsa especial en un pan brioche.",
            "price": 7.99
          },
          {
            "title": "Crispy Chicken Deluxe",
            "description": "Pechuga de pollo crujiente con mayonesa de ajo, lechuga fresca y pepinillos en un pan artesanal.",
            "price": 6.99
          },
          {
            "title": "BBQ Ribs Wrap",
            "description": "Tortilla de trigo rellena de costillas deshuesadas a la barbacoa, mezcla de quesos y cebolla frita.",
            "price": 7.49
          },
          {
            "title": "Veggie Supreme",
            "description": "Hamburguesa de garbanzos y espinacas con aguacate, rúcula y salsa de yogur en pan multicereal.",
            "price": 6.49
          }
        ]
      },
      {
        "name": "BEBIDAS",
        "dishes": [
          {
            "title": "Refresco Clásico (Coca-Cola, Fanta, Sprite)",
            "description": "",
            "price": 2.50
          },
          {
            "title": "Limonada Natural",
            "description": "",
            "price": 3.00
          },
          {
            "title": "Batido de Chocolate o Vainilla",
            "description": "",
            "price": 3.50
          },
          {
            "title": "Café Americano o Cappuccino",
            "description": "",
            "price": 2.80
          }
        ]
      }
    ]
  }
;

```

`src/lib/data/restaurants/restaurant-data-prueba-reco-1739809055675.ts`:

```ts
export const seedData =  	{
  "userEmail": "chico10117@gmail.com",
  "restaurant": {
    "name": "PRUEBA RECO",
    "logo": "",
    "customPrompt": "RESTAURANT INFO\nDirección: Calle Ficticia 123, Madrid\nTeléfono: 900 123 456\n¡Te esperamos en Fast Bite para una experiencia rápida, deliciosa y llena de sabor! 🚀🔥"
  },
  "categories": [
    {
      "name": "COMIDAS",
      "dishes": [
        {
          "title": "Big Bite Burger",
          "description": "Jugosa hamburguesa de ternera con queso cheddar, lechuga, tomate, cebolla caramelizada y salsa especial en un pan brioche.",
          "price": 7.99
        },
        {
          "title": "Crispy Chicken Deluxe",
          "description": "Pechuga de pollo crujiente con mayonesa de ajo, lechuga fresca y pepinillos en un pan artesanal.",
          "price": 6.99
        },
        {
          "title": "BBQ Ribs Wrap",
          "description": "Tortilla de trigo rellena de costillas deshuesadas a la barbacoa, mezcla de quesos y cebolla frita.",
          "price": 7.49
        },
        {
          "title": "Veggie Supreme",
          "description": "Hamburguesa de garbanzos y espinacas con aguacate, rúcula y salsa de yogur en pan multicereal.",
          "price": 6.49
        }
      ]
    },
    {
      "name": "BEBIDAS",
      "dishes": [
        {
          "title": "Refresco Clásico (Coca-Cola, Fanta, Sprite)",
          "description": "",
          "price": 2.50
        },
        {
          "title": "Limonada Natural",
          "description": "",
          "price": 3.00
        },
        {
          "title": "Batido de Chocolate o Vainilla",
          "description": "",
          "price": 3.50
        },
        {
          "title": "Café Americano o Cappuccino",
          "description": "",
          "price": 2.80
        }
      ]
    }
  ]
};

```

`src/lib/data/restaurants/restaurant-data-prueba-reco-1739809230507.ts`:

```ts
export const seedData = 
  {
  "userEmail": "chico10117@gmail.com",
  "restaurant": {
    "name": "PRUEBA RECO",
    "logo": "",
    "customPrompt": "RESTAURANT INFO\nDirección: Calle Ficticia 123, Madrid\nTeléfono: 900 123 456\n¡Te esperamos en Fast Bite para una experiencia rápida, deliciosa y llena de sabor! 🚀🔥"
  },
  "categories": [
    {
      "name": "COMIDAS",
      "dishes": [
        {
          "title": "Big Bite Burger",
          "description": "Jugosa hamburguesa de ternera con queso cheddar, lechuga, tomate, cebolla caramelizada y salsa especial en un pan brioche.",
          "price": 7.99
        },
        {
          "title": "Crispy Chicken Deluxe",
          "description": "Pechuga de pollo crujiente con mayonesa de ajo, lechuga fresca y pepinillos en un pan artesanal.",
          "price": 6.99
        },
        {
          "title": "BBQ Ribs Wrap",
          "description": "Tortilla de trigo rellena de costillas deshuesadas a la barbacoa, mezcla de quesos y cebolla frita.",
          "price": 7.49
        },
        {
          "title": "Veggie Supreme",
          "description": "Hamburguesa de garbanzos y espinacas con aguacate, rúcula y salsa de yogur en pan multicereal.",
          "price": 6.49
        }
      ]
    },
    {
      "name": "BEBIDAS",
      "dishes": [
        {
          "title": "Refresco Clásico (Coca-Cola, Fanta, Sprite)",
          "description": "",
          "price": 2.50
        },
        {
          "title": "Limonada Natural",
          "description": "",
          "price": 3.00
        },
        {
          "title": "Batido de Chocolate o Vainilla",
          "description": "",
          "price": 3.50
        },
        {
          "title": "Café Americano o Cappuccino",
          "description": "",
          "price": 2.80
        }
      ]
    }
  ]
};

```

`src/lib/data/restaurants/restaurant-data-prueba-reco-1739809258645.ts`:

```ts
export const seedData = 
  {
  "userEmail": "chico10117@gmail.com",
  "restaurant": {
    "name": "PRUEBA RECO",
    "logo": "",
    "customPrompt": "RESTAURANT INFO\nDirección: Calle Ficticia 123, Madrid\nTeléfono: 900 123 456\n¡Te esperamos en Fast Bite para una experiencia rápida, deliciosa y llena de sabor! 🚀🔥"
  },
  "categories": [
    {
      "name": "COMIDAS",
      "dishes": [
        {
          "title": "Big Bite Burger",
          "description": "Jugosa hamburguesa de ternera con queso cheddar, lechuga, tomate, cebolla caramelizada y salsa especial en un pan brioche.",
          "price": 7.99
        },
        {
          "title": "Crispy Chicken Deluxe",
          "description": "Pechuga de pollo crujiente con mayonesa de ajo, lechuga fresca y pepinillos en un pan artesanal.",
          "price": 6.99
        },
        {
          "title": "BBQ Ribs Wrap",
          "description": "Tortilla de trigo rellena de costillas deshuesadas a la barbacoa, mezcla de quesos y cebolla frita.",
          "price": 7.49
        },
        {
          "title": "Veggie Supreme",
          "description": "Hamburguesa de garbanzos y espinacas con aguacate, rúcula y salsa de yogur en pan multicereal.",
          "price": 6.49
        }
      ]
    },
    {
      "name": "BEBIDAS",
      "dishes": [
        {
          "title": "Refresco Clásico (Coca-Cola, Fanta, Sprite)",
          "description": "",
          "price": 2.50
        },
        {
          "title": "Limonada Natural",
          "description": "",
          "price": 3.00
        },
        {
          "title": "Batido de Chocolate o Vainilla",
          "description": "",
          "price": 3.50
        },
        {
          "title": "Café Americano o Cappuccino",
          "description": "",
          "price": 2.80
        }
      ]
    }
  ]
};

```

`src/lib/data/restaurants/restaurant-data-prueba-reco-1739809332833.ts`:

```ts
export const seedData = 
  {
  "userEmail": "chico10117@gmail.com",
  "restaurant": {
    "name": "PRUEBA RECO",
    "logo": "",
    "customPrompt": "RESTAURANT INFO\nDirección: Calle Ficticia 123, Madrid\nTeléfono: 900 123 456\n¡Te esperamos en Fast Bite para una experiencia rápida, deliciosa y llena de sabor! 🚀🔥"
  },
  "categories": [
    {
      "name": "COMIDAS",
      "dishes": [
        {
          "title": "Big Bite Burger",
          "description": "Jugosa hamburguesa de ternera con queso cheddar, lechuga, tomate, cebolla caramelizada y salsa especial en un pan brioche.",
          "price": 7.99
        },
        {
          "title": "Crispy Chicken Deluxe",
          "description": "Pechuga de pollo crujiente con mayonesa de ajo, lechuga fresca y pepinillos en un pan artesanal.",
          "price": 6.99
        },
        {
          "title": "BBQ Ribs Wrap",
          "description": "Tortilla de trigo rellena de costillas deshuesadas a la barbacoa, mezcla de quesos y cebolla frita.",
          "price": 7.49
        },
        {
          "title": "Veggie Supreme",
          "description": "Hamburguesa de garbanzos y espinacas con aguacate, rúcula y salsa de yogur en pan multicereal.",
          "price": 6.49
        }
      ]
    },
    {
      "name": "BEBIDAS",
      "dishes": [
        {
          "title": "Refresco Clásico (Coca-Cola, Fanta, Sprite)",
          "description": "",
          "price": 2.50
        },
        {
          "title": "Limonada Natural",
          "description": "",
          "price": 3.00
        },
        {
          "title": "Batido de Chocolate o Vainilla",
          "description": "",
          "price": 3.50
        },
        {
          "title": "Café Americano o Cappuccino",
          "description": "",
          "price": 2.80
        }
      ]
    }
  ]
};

```

`src/lib/data/restaurants/restaurant-data-restaurante-prueba-reco-1739809361774.ts`:

```ts
export const seedData = 
  {
  "userEmail": "chico10117@gmail.com",
  "restaurant": {
    "name": "Restaurante PRUEBA RECO",
    "logo": "",
    "customPrompt": "RESTAURANT INFO\nDirección: Calle Ficticia 123, Madrid\nTeléfono: 900 123 456\n¡Te esperamos en Fast Bite para una experiencia rápida, deliciosa y llena de sabor! 🚀🔥"
  },
  "categories": [
    {
      "name": "COMIDAS",
      "dishes": [
        {
          "title": "Big Bite Burger",
          "description": "Jugosa hamburguesa de ternera con queso cheddar, lechuga, tomate, cebolla caramelizada y salsa especial en un pan brioche.",
          "price": 7.99
        },
        {
          "title": "Crispy Chicken Deluxe",
          "description": "Pechuga de pollo crujiente con mayonesa de ajo, lechuga fresca y pepinillos en un pan artesanal.",
          "price": 6.99
        },
        {
          "title": "BBQ Ribs Wrap",
          "description": "Tortilla de trigo rellena de costillas deshuesadas a la barbacoa, mezcla de quesos y cebolla frita.",
          "price": 7.49
        },
        {
          "title": "Veggie Supreme",
          "description": "Hamburguesa de garbanzos y espinacas con aguacate, rúcula y salsa de yogur en pan multicereal.",
          "price": 6.49
        }
      ]
    },
    {
      "name": "BEBIDAS",
      "dishes": [
        {
          "title": "Refresco Clásico (Coca-Cola, Fanta, Sprite)",
          "description": "",
          "price": 2.50
        },
        {
          "title": "Limonada Natural",
          "description": "",
          "price": 3.00
        },
        {
          "title": "Batido de Chocolate o Vainilla",
          "description": "",
          "price": 3.50
        },
        {
          "title": "Café Americano o Cappuccino",
          "description": "",
          "price": 2.80
        }
      ]
    }
  ]
};

```

`src/lib/env.d.ts`:

```ts
/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Locals {
    userid: string;
  }
}

interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        renderButton: (element: HTMLElement, options: any) => void;
        prompt: () => void;
      };
    };
  }
} 
```

`src/lib/i18n/translations.ts`:

```ts
interface Translation {
  [key: string]: {
    es: string;
    en: string;
  };
}

export const translations: Translation = {
  appTitle: {
    es: "Crea Tu Carta Inteligente",
    en: "Create Your Smart Menu"
  },
  processingImages: {
    es: "Procesando imágenes",
    en: "Processing images"
  },
  completedProcessingImages: {
    es: "Procesamiento de imágenes completado",
    en: "Image processing completed"
  },
  restaurantName: {
    es: "Nombre del Restaurante",
    en: "Restaurant Name"
  },
  enterRestaurantName: {
    es: "Ingrese el nombre del restaurante",
    en: "Enter restaurant name"
  },
  menuLogo: {
    es: "Logo del Restaurante",
    en: "Restaurant Logo"
  },
  addLogo: {
    es: "Agregar logo",
    en: "Add logo"
  },
  categories: {
    es: "Categorías",
    en: "Categories"
  },
  categoryName: {
    es: "Nombre de la categoría",
    en: "Category name"
  },
  add: {
    es: "Agregar",
    en: "Add"
  },
  title: {
    es: "Nombre del plato",
    en: "Dish name"
  },
  price: {
    es: "Precio",
    en: "Price"
  },
  description: {
    es: "Descripción",
    en: "Description"
  },
  image: {
    es: "Imagen",
    en: "Image"
  },
  addDish: {
    es: "Agregar Plato",
    en: "Add Dish"
  },
  cancel: {
    es: "Cancelar",
    en: "Cancel"
  },
  save: {
    es: "Guardar",
    en: "Save"
  },
  menuPreview: {
    es: "Vista Previa de la Carta",
    en: "Menu Preview"
  },
  required: {
    es: "requerido",
    en: "required"
  },
  confirmDelete: {
    es: "¿Estás seguro de que quieres eliminar esto?",
    en: "Are you sure you want to delete this?"
  },
  deleteSuccess: {
    es: "Eliminado exitosamente",
    en: "Successfully deleted"
  },
  saveSuccess: {
    es: "Menú guardado con éxito",
    en: "Menu saved successfully"
  },
  error: {
    es: "Error",
    en: "Error"
  },
  noFileSelected: {
    es: "No se ha seleccionado ningún archivo",
    en: "No file selected"
  },
  pleaseSelectCategory: {
    es: "Por favor selecciona una categoría",
    en: "Please select a category"
  },
  pleaseSelectCategoryAndCompleteDishTitle: {
    es: "Por favor selecciona una categoría y completa al menos el título del plato",
    en: "Please select a category and complete at least the dish title"
  },
  pleaseEnterRestaurantNameFirst: {
    es: "Por favor ingresa primero el nombre del restaurante",
    en: "Please enter a restaurant name first"
  },
  confirmDeleteLogo: {
    es: "¿Estás seguro de que quieres eliminar el logo?",
    en: "Are you sure you want to delete the logo?"
  },
  confirmDeleteCategory: {
    es: "¿Estás seguro de que quieres eliminar esta categoría?",
    en: "Are you sure you want to delete this category?"
  },
  confirmDeleteDish: {
    es: "¿Estás seguro de que quieres eliminar este plato?",
    en: "Are you sure you want to delete this dish?"
  },
  confirmDeleteRestaurant: {
    es: "¿Estás seguro de que quieres eliminar este restaurante?",
    en: "Are you sure you want to delete this restaurant?"
  },
  logoDeleteSuccess: {
    es: "Logo eliminado exitosamente",
    en: "Logo successfully deleted"
  },
  categoryAddSuccess: {
    es: "Categoría agregada exitosamente",
    en: "Category added successfully"
  },
  categoryNameRequired: {
    es: "El nombre de la categoría es obligatorio",
    en: "Category name is required"
  },
  categoryDeleteSuccess: {
    es: "Categoría eliminada exitosamente",
    en: "Category successfully deleted"
  },
  dishUpdateSuccess: {
    es: "Plato actualizado exitosamente",
    en: "Dish successfully updated"
  },
  dishDeleteSuccess: {
    es: "Plato eliminado exitosamente",
    en: "Dish successfully deleted"
  },
  restaurantUpdateSuccess: {
    es: "Carta actualizada exitosamente",
    en: "Menu successfully updated"
  },
  restaurantDeleteSuccess: {
    es: "Carta eliminada exitosamente",
    en: "Menu successfully deleted"
  },
  noFileUploaded: {
    es: "No se ha subido ningún archivo",
    en: "No file uploaded"
  },
  fileUploadSuccess: {
    es: "Archivo subido exitosamente",
    en: "File uploaded successfully"
  },
  fileUploadError: {
    es: "Error al subir el archivo",
    en: "Error uploading file"
  },
  uploadImage: {
    es: "Subir imagen",
    en: "Upload image"
  },
  removeImage: {
    es: "Eliminar imagen",
    en: "Remove image"
  },
  saveMenu: {
    es: "Guardar Menú",
    en: "Save Menu"
  },
  invalidFileType: {
    es: "Tipo de archivo no válido",
    en: "Invalid file type"
  },
  fileTooLarge: {
    es: "El archivo es demasiado grande",
    en: "File is too large"
  },
  maxFileSize: {
    es: "Tamaño máximo",
    en: "Max file size"
  },
  allowedFormats: {
    es: "Formatos permitidos",
    en: "Allowed formats"
  },
  invalidServerResponse: {
    es: "Respuesta del servidor inválida",
    en: "Invalid server response"
  },
  customPromptLabel: {
    es: "Instrucciones o información adicional",
    en: "Additional instructions or information"
  },
  customPromptPlaceholder: {
    es: "Ingrese cualquier instrucción o información adicional para su chatbot (máximo 10000 caracteres)",
    en: "Enter any additional instructions or information for your chatbot (max 10,000 characters)"
  },
  noRestaurantSelected: {
    es: "No hay carta seleccionada",
    en: "No menu selected"
  },
  logo: {
    es: "Logo",
    en: "Logo"
  },
  edit: {
    es: "Editar",
    en: "Edit"
  },
  dragAndDrop: {
    es: "o arrastrar y soltar",
    en: "or drag and drop"
  },
  dragAndDropOrClick: {
    en: 'Drag and drop files here or click to select',
    es: 'Arrastra y suelta archivos aquí o haz clic para seleccionar'
  },
  dropToUpload: {
    en: 'Drop files to upload',
    es: 'Suelta los archivos para subir'
  },
  supportedFormats: {
    en: 'Supported formats: PDF, JPG, PNG, WebP',
    es: 'Formatos soportados: PDF, JPG, PNG, WebP'
  },
  processingFiles: {
    en: 'Processing files...',
    es: 'Procesando archivos...'
  },
  processingPage: {
    en: 'Processing page',
    es: 'Procesando página'
  },
  generatingRestaurantData: {
    en: 'Creating Restaurant Reco Smart Menu...',
    es: 'Creando Carta Reco Smart para tu Restaurante...'
  },
  seedingDatabase: {
    en: 'Saving to database...',
    es: 'Guardando en la base de datos...'
  },
  completed: {
    en: 'Completed',
    es: 'Completado'
  },
  menuUploadSuccess: {
    en: 'Menu uploaded and processed successfully',
    es: 'Carta subida y procesada exitosamente'
  },
  changesSaved: {
    es: "Cambios guardados",
    en: "Changes saved"
  },
  themeColor: {
    en: 'Theme Color',
    es: 'Color del Tema'
  },
  currency: {
    en: 'Currency',
    es: 'Moneda'
  },
  colorLight: {
    en: 'Light',
    es: 'Claro'
  },
  colorGreen: {
    en: 'Green',
    es: 'Verde'
  },
  colorPink: {
    en: 'Pink',
    es: 'Rosa'
  },
  colorDark: {
    en: 'Dark',
    es: 'Oscuro'
  },
  colorCustom: {
    en: 'Custom',
    es: 'Personalizado'
  },
  uploadMenu: {
    en: 'Upload Your Menu Here',
    es: 'Sube Tu Carta Acá'
  },
  uploadMenuFiles: {
    en: 'Upload Menu Files',
    es: 'Subir Archivos de la Carta'
  },
  yourRestaurants: {
    es: "Tus Restaurantes",
    en: "Your Restaurants"
  },
  selectRestaurantManage: {
    es: "Selecciona una carta",
    en: "Select a menu"
  },
  addRestaurant: {
    es: "Agregar Nueva Carta",
    en: "Add New Menu"
  },
  noRestaurantsFound: {
    es: "No se encontraron restaurantes",
    en: "No restaurants found"
  },
  addFirstRestaurant: {
    es: "Agrega tu primera carta para comenzar",
    en: "Add your first menu to get started"
  },
  loading: {
    es: "Cargando...",
    en: "Loading..."
  },
  saving: {
    es: "Guardando...",
    en: "Saving..."
  },
  loginSubtitle: {
    es: "La Carta Digital con IA para Restaurantes y Hoteles",
    en: "The Digital Menu with AI for Restaurants and Hotels"
  },
  manualLoginPrompt: {
    es: "Si el botón de Google no funciona:",
    en: "If the Google button doesn't work:"
  },
  tryManualLogin: {
    es: "Intentar inicio de sesión manual",
    en: "Try Manual Login"
  },
  demo: {
    es: "Demo",
    en: "Demo"
  },
  increaseSales: {
    es: "Aumenta las ventas y la rentabilidad de tu restaurante con Reco.",
    en: "Increase sales and profitability of your restaurant with Reco."
  },
  copyright: {
    es: "© 2025 - Reco • Todos los derechos reservados.",
    en: "© 2025 - Reco • All rights reserved."
  },
  recoWebsite: {
    es: "reco.chat",
    en: "reco.chat"
  },
  phoneNumber: {
    en: 'Phone Number',
    es: 'Número de Teléfono'
  },
  enterPhoneNumber: {
    en: 'Enter phone number',
    es: 'Introduce el número de teléfono'
  },
  phoneNumberTooShort: {
    en: 'Phone number must be at least 6 digits',
    es: 'El número de teléfono debe tener al menos 6 dígitos'
  },
  phoneNumberTooLong: {
    en: 'Phone number must not exceed 15 digits',
    es: 'El número de teléfono no debe exceder los 15 dígitos'
  },
  googleButtonText: {
    es: "continuar_con",
    en: "continue_with"
  },
  reservasLabel: {
    en: 'Reservations URL',
    es: 'URL de Reservas',
  },
  reservasPlaceholder: {
    en: 'https://reservations.example.com',
    es: 'https://reservas.ejemplo.com',
  },
  redesSocialesLabel: {
    en: 'Social Media URL',
    es: 'URL de Redes Sociales',
  },
  redesSocialesPlaceholder: {
    en: 'https://instagram.com/yourrestaurant',
    es: 'https://instagram.com/turestaurante',
  },
  qrCodeFor: {
    en: 'QR code for {url}',
    es: 'Código QR para {url}'
  },
  qrCodeError: {
    en: 'Error generating QR code',
    es: 'Error al generar el código QR'
  },
  haveQuestions: {
    es: "¿Tienes dudas o preguntas?",
    en: "Have questions?"
  },
  logout: {
    es: "Cerrar sesión",
    en: "Logout"
  },
  expand: {
    es: "Expandir",
    en: "Expand"
  },
  collapse: {
    es: "Contraer",
    en: "Collapse"
  },
  processingPleaseWait: {
    en: 'Processing, please wait...',
    es: 'Procesando, por favor espera...'
  },
  processingImage: {
    en: 'Processing image',
    es: 'Procesando imagen'
  },
  loadingPdf: {
    en: 'Loading PDF document',
    es: 'Cargando documento PDF'
  },
  preparingToUpload: {
    en: 'Preparing images for upload',
    es: 'Preparando imágenes para subir'
  },
  uploadingImages: {
    en: 'Uploading images to server',
    es: 'Subiendo imágenes al servidor'
  },
  waitingForAI: {
    en: 'Waiting for AI processing',
    es: 'Esperando procesamiento de IA'
  },
  stillAnalyzing: {
    en: 'Still analyzing menu',
    es: 'Analizando la carta'
  },
  analyzingMenuItems: {
    en: 'Analyzing menu items',
    es: 'Analizando elementos del menú'
  },
  extractingData: {
    en: 'Extracting menu data',
    es: 'Extrayendo datos del menú'
  },
  processingLargeMenu: {
    en: 'Processing large menu (this may take a while)',
    es: 'Procesando carta grande (esto puede tomar tiempo)'
  },
  aiProcessingStarted: {
    en: 'AI processing has started',
    es: 'El procesamiento de IA ha comenzado'
  },
  aiProcessingError: {
    en: 'Error during AI processing',
    es: 'Error durante el procesamiento de IA'
  },
  errorProcessingImage: {
    en: 'Error processing image',
    es: 'Error al procesar la imagen'
  },
  errorProcessingPage: {
    en: 'Error processing page',
    es: 'Error al procesar la página'
  },
  errorProcessingPdf: {
    en: 'Error processing PDF file',
    es: 'Error al procesar el archivo PDF'
  },
  warning: {
    en: 'Warning',
    es: 'Advertencia'
  },
  processingFirstPages: {
    en: 'Processing only the first',
    es: 'Procesando solo las primeras'
  },
  of: {
    en: 'of',
    es: 'de'
  },
  maxPdfPages: {
    en: 'max PDF pages',
    es: 'máximo de páginas PDF'
  },
  // Backend progress message translations
  "Starting analysis...": {
    en: 'Starting analysis...',
    es: 'Iniciando análisis...'
  },
  "Analyzing menu content...": {
    en: 'Analyzing menu content...',
    es: 'Analizando contenido del menú...'
  },
  "Processing menu sections...": {
    en: 'Processing menu sections...',
    es: 'Procesando secciones del menú...'
  },
  "Extracting detailed information...": {
    en: 'Extracting detailed information...',
    es: 'Extrayendo información detallada...'
  },
  takePhotoOnMobile: {
    es: "Toma una foto",
    en: "Take a picture!"
  }
}; 
```

`src/lib/server/auth/auth-server.ts`:

```ts
import type { AuthRequest, AuthResponse } from '$lib/types/server-types';

export class AuthServer {
    async authenticate(request: AuthRequest): Promise<AuthResponse> {
        // Lógica de autenticación
    }
} 
```

`src/lib/server/database.ts`:

```ts
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';
import { eq } from 'drizzle-orm';
import { DATABASE_URL } from '$lib/config/env';

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

// Configuración de la conexión usando el cliente HTTP de Neon
const sql = neon(DATABASE_URL);

// Crear la instancia de Drizzle con el schema
export const db = drizzle(sql, { schema });

// Función para verificar la conexión
export async function connectDB() {
  try {
    // Verificar la conexión realizando una consulta simple
    const result = await sql`SELECT NOW()`;
    console.log('Connected to Neon PostgreSQL database!');
    return db;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

// Funciones helper para consultas relacionadas
export async function getRestaurantWithRelations(restaurantId: string) {
  const restaurant = await db.select().from(schema.restaurants)
    .where(eq(schema.restaurants.id, restaurantId))
    .execute();

  if (!restaurant.length) return null;

  const categories = await db.select().from(schema.categories)
    .where(eq(schema.categories.restaurantId, restaurantId))
    .execute();

  const categoryIds = categories.map(cat => cat.id);
  
  const dishes = await db.select().from(schema.dishes)
    .where(
      eq(schema.dishes.categoryId, categoryIds[0]) // TODO: Implement IN operator
    )
    .execute();

  return {
    ...restaurant[0],
    categories: categories.map(category => ({
      ...category,
      dishes: dishes.filter(dish => dish.categoryId === category.id)
    }))
  };
}

// Función para crear un restaurante con sus relaciones
export async function createRestaurantWithRelations(data: {
  name: string;
  logo?: string;
  categories: Array<{
    name: string;
    dishes?: Array<{
      title: string;
      imageUrl?: string;
      price?: string;
      description?: string;
    }>;
  }>;
}) {
  const [restaurant] = await db.insert(schema.restaurants)
    .values({
      name: data.name,
      logo: data.logo
    })
    .returning();

  const categoriesPromises = data.categories.map(async (category) => {
    const [newCategory] = await db.insert(schema.categories)
      .values({
        name: category.name,
        restaurantId: restaurant.id
      })
      .returning();

    if (category.dishes?.length) {
      await db.insert(schema.dishes)
        .values(
          category.dishes.map(dish => ({
            ...dish,
            categoryId: newCategory.id
          }))
        );
    }

    return newCategory;
  });

  const categories = await Promise.all(categoriesPromises);

  return {
    ...restaurant,
    categories
  };
} 
```

`src/lib/server/email/email-server.ts`:

```ts
import type { EmailConfig } from '$lib/types/server-types';

export class EmailServer {
    async sendEmail(config: EmailConfig) {
        // Lógica de envío de emails
    }
} 
```

`src/lib/server/migrate.ts`:

```ts
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const runMigration = async () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('⏳ Running migrations...');
  
  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "email" text NOT NULL,
        "name" text,
        "picture" text,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
    `;

    // Create admin user
    await sql`
      INSERT INTO "users" (id, email, name, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        'admin@example.com',
        'Admin',
        now(),
        now()
      )
      ON CONFLICT (email) DO NOTHING;
    `;

    // Add user_id column if it doesn't exist
    const columnExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'restaurants' AND column_name = 'user_id'
      );
    `;

    if (!columnExists[0].exists) {
      await sql`ALTER TABLE "restaurants" ADD COLUMN "user_id" uuid;`;
    }

    // Update existing restaurants to use admin user
    await sql`
      UPDATE "restaurants" 
      SET "user_id" = (SELECT id FROM "users" WHERE email = 'admin@example.com')
      WHERE "user_id" IS NULL;
    `;

    // Make user_id not null
    await sql`ALTER TABLE "restaurants" ALTER COLUMN "user_id" SET NOT NULL;`;

    // Add foreign key constraint if it doesn't exist
    const constraintExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_name = 'restaurants_user_id_users_id_fk'
      );
    `;

    if (!constraintExists[0].exists) {
      await sql`
        ALTER TABLE "restaurants" 
        ADD CONSTRAINT "restaurants_user_id_users_id_fk" 
        FOREIGN KEY ("user_id") 
        REFERENCES "users"("id") 
        ON DELETE cascade 
        ON UPDATE no action;
      `;
    }

    console.log('✅ Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigration(); 
```

`src/lib/server/schema.ts`:

```ts
import { pgTable, text, timestamp, uuid, unique, decimal, integer, bigint } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  logo: text('logo'),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  customPrompt: text('custom_prompt'),
  currency: text('currency').notNull().default('€'),
  color: text('color').notNull().default('1'),
  phoneNumber: bigint('phoneNumber', { mode: 'number' }),
  reservas: text('reservas'),
  redes_sociales: text('redes_sociales'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  restaurantId: uuid('restaurant_id').references(() => restaurants.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}, (table) => ({
  // Add unique constraint for name within a restaurant
  nameRestaurantUnique: unique().on(table.name, table.restaurantId)
}));

export const dishes = pgTable('dishes', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  imageUrl: text('image_url'),
  price: decimal('price', { precision: 10, scale: 2 }),
  description: text('description'),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'cascade' }),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
}); 
```

`src/lib/services/auth.service.ts`:

```ts
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export class AuthService {
  private googleAuth: any;

  constructor() {
    // Initialize Google OAuth client
    window.gapi.load('auth2', () => {
      window.gapi.auth2.init({
        client_id: PUBLIC_GOOGLE_CLIENT_ID
      });
    });
  }

  async signInWithGoogle() {
    try {
      const googleAuth = await window.gapi.auth2.getAuthInstance();
      const user = await googleAuth.signIn();
      return {
        token: user.getAuthResponse().id_token,
        user: {
          name: user.getBasicProfile().getName(),
          email: user.getBasicProfile().getEmail(),
          picture: user.getBasicProfile().getImageUrl()
        }
      };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  }

  async signOut() {
    const googleAuth = await window.gapi.auth2.getAuthInstance();
    await googleAuth.signOut();
  }
} 
```

`src/lib/services/category.service.ts`:

```ts
import type { Category } from '$lib/types/menu.types';

export async function fetchCategories(restaurantId: string): Promise<Category[]> {
  const response = await fetch(`/api/restaurants/${restaurantId}/categories`, {
    credentials: 'include'
  });
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch categories');
  }
  
  return result.data;
}

export async function createOrUpdateCategory(
  restaurantId: string,
  categoryData: { name: string },
  categoryId?: string
): Promise<Category> {
  const method = categoryId ? 'PUT' : 'POST';
  const url = categoryId 
    ? `/api/restaurants/${restaurantId}/categories/${categoryId}`
    : `/api/restaurants/${restaurantId}/categories`;
  
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...categoryData, restaurantId }),
    credentials: 'include'
  });

  if (!response.ok) {
    // If update fails because category doesn't exist, create a new one
    if (response.status === 404 && categoryId) {
      return createOrUpdateCategory(restaurantId, categoryData);
    }
    throw new Error(`Failed to ${categoryId ? 'update' : 'create'} category: ${await response.text()}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || `Failed to ${categoryId ? 'update' : 'create'} category`);
  }

  return result.data;
}

export async function deleteCategory(restaurantId: string, categoryId: string): Promise<void> {
  const response = await fetch(`/api/restaurants/${restaurantId}/categories/${categoryId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete category: ${await response.text()}`);
  }
} 
```

`src/lib/services/dish.service.ts`:

```ts
import type { Dish } from '$lib/types/menu.types';

export async function fetchDishes(restaurantId: string, categoryId: string): Promise<Dish[]> {
  const response = await fetch(`/api/restaurants/${restaurantId}/categories/${categoryId}/dishes`, {
    credentials: 'include'
  });
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch dishes');
  }
  
  return result.data;
}

export async function createOrUpdateDish(
  restaurantId: string,
  categoryId: string,
  dishData: Omit<Dish, 'id' | 'restaurantId' | 'categoryId'>,
  dishId?: string
): Promise<Dish> {
  const method = dishId ? 'PUT' : 'POST';
  const url = dishId 
    ? `/api/restaurants/${restaurantId}/categories/${categoryId}/dishes/${dishId}`
    : `/api/restaurants/${restaurantId}/categories/${categoryId}/dishes`;
  
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...dishData, restaurantId, categoryId }),
    credentials: 'include'
  });

  if (!response.ok) {
    // If update fails because dish doesn't exist, create a new one
    if (response.status === 404 && dishId) {
      return createOrUpdateDish(restaurantId, categoryId, dishData);
    }
    throw new Error(`Failed to ${dishId ? 'update' : 'create'} dish: ${await response.text()}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || `Failed to ${dishId ? 'update' : 'create'} dish`);
  }

  return result.data;
}

export async function deleteDish(restaurantId: string, categoryId: string, dishId: string): Promise<void> {
  const response = await fetch(`/api/restaurants/${restaurantId}/categories/${categoryId}/dishes/${dishId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete dish: ${await response.text()}`);
  }
} 
```

`src/lib/services/menu.service.ts`:

```ts
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import type { MenuStore } from '$lib/stores/menu-store';
import * as restaurantService from './restaurant.service';
import * as categoryService from './category.service';
import * as dishService from './dish.service';
import { menuStore } from '$lib/stores/menu-store';
import { get } from 'svelte/store';

interface SaveResult {
  restaurant: Restaurant;
  categories: Category[];
  dishes: Dish[];
}

export async function saveMenuChanges(
  restaurantData: {
    name: string;
    logo: string | null;
    slug?: string;
    customPrompt?: string | null;
    phoneNumber?: number | null;
    currency: string;
    color: string;
    reservas?: string | null;
    redes_sociales?: string | null;
  },
  currentRestaurantId: string | null
): Promise<SaveResult> {
  console.log('Starting saveMenuChanges with:', {
    restaurantData,
    reservas: restaurantData.reservas,
    redes_sociales: restaurantData.redes_sociales,
    currentRestaurantId
  });

  // Get the store state
  const store = menuStore;
  const storeState = get(store);

  // Step 1: Save restaurant
  // If we have a currentRestaurantId, it's an update. Otherwise, it's a new restaurant.
  const isNewRestaurant = !currentRestaurantId || currentRestaurantId.startsWith('temp_');
  
  console.log('Restaurant operation type:', {
    isNewRestaurant,
    currentRestaurantId
  });

  // Find the current restaurant in the store
  const currentRestaurant = storeState.restaurants.find(r => r.id === currentRestaurantId);

  // CRITICAL: Log the actual values being sent to createOrUpdateRestaurant
  const reservas = restaurantData.reservas ?? currentRestaurant?.reservas;
  const redes_sociales = restaurantData.redes_sociales ?? currentRestaurant?.redes_sociales;
  
  console.log('CRITICAL - Values being sent to createOrUpdateRestaurant:', {
    updatingReservas: restaurantData.reservas, 
    existingReservas: currentRestaurant?.reservas,
    finalReservas: reservas,
    updatingRedesSociales: restaurantData.redes_sociales,
    existingRedesSociales: currentRestaurant?.redes_sociales,
    finalRedesSociales: redes_sociales
  });

  const savedRestaurant = await restaurantService.createOrUpdateRestaurant(
    {
      name: restaurantData.name,
      logo: restaurantData.logo,
      slug: restaurantData.slug || currentRestaurant?.slug,
      customPrompt: restaurantData.customPrompt ?? currentRestaurant?.customPrompt,
      phoneNumber: restaurantData.phoneNumber ?? currentRestaurant?.phoneNumber,
      currency: restaurantData.currency,
      color: restaurantData.color,
      reservas,
      redes_sociales,
    },
    isNewRestaurant ? undefined : currentRestaurantId
  );

  console.log('Restaurant saved:', savedRestaurant, 'with URLs:', {
    reservas: savedRestaurant.reservas,
    redes_sociales: savedRestaurant.redes_sociales
  });
  
  const restaurantId = savedRestaurant.id;
  
  // Step 2: Get existing categories from the API
  const existingCategories = await categoryService.fetchCategories(restaurantId);
  const existingCategoryMap = new Map(existingCategories.map(cat => [cat.id, cat]));
  const existingCategoryNameMap = new Map(existingCategories.map(cat => [cat.name.toLowerCase(), cat]));
  
  const savedCategories: Category[] = [];
  const savedDishes: Dish[] = [];
  const tempToRealIdMap = new Map<string, string>();

  // Step 3: First process category deletions
  for (const deletedCategoryId of storeState.changedItems.deletedCategories) {
    // Only delete if it's not a temporary ID (starts with 'temp_')
    if (!deletedCategoryId.startsWith('temp_')) {
      await categoryService.deleteCategory(restaurantId, deletedCategoryId);
      // Remove from existingCategoryMap so it won't be considered when checking for duplicates
      existingCategoryMap.delete(deletedCategoryId);
      
      // Find and remove from existingCategoryNameMap
      for (const [name, cat] of existingCategoryNameMap.entries()) {
        if (cat.id === deletedCategoryId) {
          existingCategoryNameMap.delete(name);
          break;
        }
      }
    }
  }

  // Step 4: Process category creates and updates
  for (const categoryId of storeState.changedItems.categories) {
    // Find the category in the store
    const category = storeState.categories.find(c => c.id === categoryId);
    if (!category) continue;

    // Check if this is a temporary ID (new category)
    const isNewCategory = categoryId.startsWith('temp_');
    
    // For existing categories, verify it still exists
    if (!isNewCategory && !existingCategoryMap.has(categoryId)) {
      // If category was deleted on the server, treat this as a create
      const savedCategory = await categoryService.createOrUpdateCategory(
        restaurantId,
        { name: category.name }
      );
      savedCategories.push(savedCategory);
      tempToRealIdMap.set(categoryId, savedCategory.id);
      continue;
    }

    // Check if a category with this name already exists
    const existingCategoryWithName = existingCategoryNameMap.get(category.name.toLowerCase());
    
    if (existingCategoryWithName && existingCategoryWithName.id !== categoryId) {
      // If a category with this name already exists, use that one instead
      tempToRealIdMap.set(categoryId, existingCategoryWithName.id);
      savedCategories.push(existingCategoryWithName);
    } else {
      // Create or update the category
      const savedCategory = await categoryService.createOrUpdateCategory(
        restaurantId,
        { name: category.name },
        isNewCategory ? undefined : categoryId
      );
      savedCategories.push(savedCategory);
      
      // Map temporary ID to real ID
      if (isNewCategory) {
        tempToRealIdMap.set(categoryId, savedCategory.id);
      }
    }
  }

  // Step 5: Process dish deletions
  for (const deletedDishId of storeState.changedItems.deletedDishes) {
    // Find the dish in any category
    let categoryId: string | undefined;
    
    // Only delete if it's not a temporary ID
    if (!deletedDishId.startsWith('temp_')) {
      // Find which category this dish belongs to
      for (const category of storeState.categories) {
        if (category.dishes?.some(d => d.id === deletedDishId)) {
          categoryId = category.id;
          break;
        }
      }
      
      if (categoryId) {
        // If the category has a temporary ID, map it to the real ID
        const realCategoryId = tempToRealIdMap.get(categoryId) || categoryId;
        await dishService.deleteDish(restaurantId, realCategoryId, deletedDishId);
      }
    }
  }

  // Step 6: Process dish creates and updates
  for (const dishId of storeState.changedItems.dishes) {
    // Find the dish in any category
    let dish: Dish | undefined;
    let categoryId: string | undefined;
    
    for (const category of storeState.categories) {
      const foundDish = category.dishes?.find(d => d.id === dishId);
      if (foundDish) {
        dish = foundDish;
        categoryId = category.id;
        break;
      }
    }
    
    if (!dish || !categoryId) continue;
    
    // Check if this is a temporary ID (new dish)
    const isNewDish = dishId.startsWith('temp_');
    
    // Map category ID if it's a temporary ID
    const realCategoryId = tempToRealIdMap.get(categoryId) || categoryId;
    
    // Create or update the dish
    const savedDish = await dishService.createOrUpdateDish(
      restaurantId,
      realCategoryId,
      {
        title: dish.title,
        description: dish.description,
        price: dish.price,
        imageUrl: dish.imageUrl
      },
      isNewDish ? undefined : dishId
    );
    
    savedDishes.push(savedDish);
  }

  // Step 7: Update category order AFTER other saves resolve temp IDs
  // Get the latest state which might include newly created categories with real IDs
  const finalStoreState = get(menuStore); // Get the state *after* potential updates
  const orderedCategoryIds = finalStoreState.categories
      .filter(cat => cat.restaurantId === restaurantId) // Ensure categories belong to the saved restaurant
      .map(category => tempToRealIdMap.get(category.id) || category.id); // Use real IDs

  console.log('Attempting to update category order with IDs:', orderedCategoryIds);
  if (orderedCategoryIds.length > 0) { // Only call if there are categories to order
    try {
        const orderResponse = await fetch(`/api/restaurants/${restaurantId}/categories/order`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedCategoryIds }),
            credentials: 'include'
        });
 
        if (!orderResponse.ok) {
            const orderError = await orderResponse.json().catch(() => ({ error: 'Failed to update category order' }));
            console.error('Failed to update category order:', orderError);
            // Consider throwing an error or showing a toast message here
            // For now, we log the error and continue
        } else {
            console.log('Category order updated successfully.');
        }
    } catch (orderError) {
        console.error('Error calling category order update endpoint:', orderError);
        // Consider throwing an error or showing a toast message here
        // For now, we log the error and continue
    }
  } else {
    console.log("No categories found for this restaurant to update order.");
  }

  // Step 8: Reset the change tracking in the store (moved from original Step 7)
  menuStore.resetChanges();

  // Step 9: Fetch all categories to return complete data (Fetch should now respect order)
  const allCategories = await categoryService.fetchCategories(restaurantId);
  
  // Fetch dishes for each category
  const categoriesWithDishes = await Promise.all(
    allCategories.map(async (category) => {
      try {
        const dishes = await dishService.fetchDishes(restaurantId, category.id);
        return {
          ...category,
          dishes
        };
      } catch (error) {
        console.error(`Error fetching dishes for category ${category.id}:`, error);
        return {
          ...category,
          dishes: []
        };
      }
    })
  );

  return {
    restaurant: savedRestaurant,
    categories: categoriesWithDishes,
    dishes: savedDishes
  };
} 
```

`src/lib/services/restaurant.service.ts`:

```ts
import type { Restaurant } from '$lib/types';
import { generateSlug } from '$lib/utils/slug';

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const response = await fetch('/api/restaurants', {
    credentials: 'include'
  });
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to load restaurants');
  }
  
  return data.data;
}

export async function fetchRestaurantById(restaurantId: string): Promise<Restaurant> {
  //console.log('Fetching restaurant by ID:', restaurantId);
  
  const response = await fetch(`/api/restaurants?id=${restaurantId}`, {
    credentials: 'include'
  });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch restaurant: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to load restaurant');
  }
  
  return data.data;
}

export async function createOrUpdateRestaurant(
  restaurantData: { 
    id?: string; 
    name: string; 
    logo: string | null; 
    slug?: string;
    customPrompt?: string | null;
    phoneNumber?: number | null;
    userId?: string;
    currency: string;
    color: string;
    reservas?: string | null;
    redes_sociales?: string | null;
  }, 
  restaurantId?: string
): Promise<Restaurant> {
  // Debug URL values
  console.log('createOrUpdateRestaurant - URL values:', {
    reservas: restaurantData.reservas,
    redes_sociales: restaurantData.redes_sociales
  });

  // Ensure reservas and redes_sociales are strings or null, not undefined
  const reservas = restaurantData.reservas === undefined ? null : restaurantData.reservas;
  const redes_sociales = restaurantData.redes_sociales === undefined ? null : restaurantData.redes_sociales;

  // For updates, we use the explicit restaurantId parameter
  // Don't use restaurantId if it's a temporary ID
  const isUpdate = !!restaurantId && !restaurantId.startsWith('temp_');
  
  const url = isUpdate ? `/api/restaurants/${restaurantId}` : '/api/restaurants';
  
  // Only generate slug for new restaurants when no slug is provided
  const slug = isUpdate ? restaurantData.slug : (restaurantData.slug || await generateSlug(restaurantData.name));
  
  try {
    // Ensure color is always a hex value
    const color = restaurantData.color === 'light' || restaurantData.color === '1' 
      ? '#85A3FA' 
      : restaurantData.color;
    
    // CRITICAL FIX: Validate URL values - prevent color values from being stored in URL fields
    let validatedReservas = reservas;
    let validatedRedesSociales = redes_sociales;
    
    // Check if reservas accidentally got the color value
    if (reservas && typeof reservas === 'string' && reservas.startsWith('#')) {
      console.warn('CRITICAL: Detected color value in reservas field, using null instead');
      validatedReservas = null;
    }
    
    // Check if redes_sociales accidentally got the color value  
    if (redes_sociales && typeof redes_sociales === 'string' && redes_sociales.startsWith('#')) {
      console.warn('CRITICAL: Detected color value in redes_sociales field, using null instead');
      validatedRedesSociales = null;
    }
    
    // Debug body data
    console.log('Restaurant operation - preparing body data with URLs:', {
      originalReservas: reservas,
      validatedReservas,
      originalRedesSociales: redes_sociales,
      validatedRedesSociales,
    });

    // CRITICAL: Ensure these fields are definitely included in the request
    console.log('Explicitly checking URL values before creating bodyData:', {
      reservas: validatedReservas,
      redes_sociales: validatedRedesSociales,
      restaurantDataReservas: restaurantData.reservas,
      restaurantDataRedesSociales: restaurantData.redes_sociales,
    });

    // For POST (new restaurant), include all data EXCEPT temporary IDs
    // For PUT (update), don't include id in body since it's in URL
    const bodyData = isUpdate 
      ? { 
          name: restaurantData.name, 
          logo: restaurantData.logo, 
          customPrompt: restaurantData.customPrompt,
          phoneNumber: restaurantData.phoneNumber,
          currency: restaurantData.currency,
          color, // Use modified color value
          reservas: validatedReservas, // Use normalized value
          redes_sociales: validatedRedesSociales, // Use normalized value
        }
      : { 
          // Only include ID if it's not a temporary ID
          ...(restaurantData.id && !restaurantData.id.startsWith('temp_') ? { id: restaurantData.id } : {}), 
          name: restaurantData.name, 
          logo: restaurantData.logo,
          slug,
          customPrompt: restaurantData.customPrompt,
          phoneNumber: restaurantData.phoneNumber,
          currency: restaurantData.currency,
          color, // Use modified color value
          reservas: validatedReservas, // Use normalized value
          redes_sociales: validatedRedesSociales, // Use normalized value
        };

    // CRITICAL: Check if the URL values are in the bodyData
    console.log('FINAL BODY DATA CHECK:', {
      bodyHasReservas: 'reservas' in bodyData,
      bodyReservas: bodyData.reservas,
      bodyHasRedesSociales: 'redes_sociales' in bodyData,
      bodyRedesSociales: bodyData.redes_sociales,
    });

    console.log('Restaurant API request:', {
      method: isUpdate ? 'PUT' : 'POST',
      url,
      bodyData,
    });

    const response = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
      credentials: 'include'
    });

    const result = await response.json();
    
    // Debug response
    console.log('Restaurant API response:', {
      success: result.success,
      urlValues: {
        reservas: result.data?.reservas,
        redes_sociales: result.data?.redes_sociales
      }
    });
    
    if (!response.ok || !result.success) {
      console.error('Restaurant operation failed:', { 
        status: response.status, 
        result 
      });
      throw new Error(result.error || `Failed to ${isUpdate ? 'update' : 'create'} restaurant`);
    }

    return result.data;
  } catch (error) {
    console.error('Restaurant operation failed:', error);
    throw error;
  }
}

export async function deleteRestaurant(restaurantId: string): Promise<void> {
  const response = await fetch(`/api/restaurants/${restaurantId}`, {
    method: 'DELETE',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete restaurant: ${await response.text()}`);
  }
} 
```

`src/lib/stores/iframe-refresh.ts`:

```ts
import { writable } from 'svelte/store';

export const iframeRefreshTrigger = writable(0);

export function triggerIframeRefresh() {
    iframeRefreshTrigger.update(n => n + 1);
} 
```

`src/lib/stores/language.ts`:

```ts
import { writable } from 'svelte/store';

type Language = 'es' | 'en';

// Get the initial language from localStorage or default to Spanish
const getStoredLanguage = (): Language => {
  if (typeof window === 'undefined') return 'es';
  const stored = localStorage.getItem('language');
  return (stored === 'en' || stored === 'es') ? stored : 'es';
};

// Create the store with initial value
const language = writable<Language>(getStoredLanguage());

// Subscribe to changes and update localStorage
if (typeof window !== 'undefined') {
  language.subscribe((value) => {
    localStorage.setItem('language', value);
  });
}

export { language }; 
```

`src/lib/stores/menu-store.ts`:

```ts
import { writable, derived, get } from 'svelte/store';
import type { Restaurant, Category, Dish } from '$lib/types/menu.types';
import * as restaurantService from '$lib/services/restaurant.service';
import * as categoryService from '$lib/services/category.service';
import * as dishService from '$lib/services/dish.service';
import * as menuService from '$lib/services/menu.service';

export interface MenuStore {
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  restaurantName: string;
  menuLogo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  categories: Category[];
  color: string;
  currency: string;
  reservas: string | null;
  redes_sociales: string | null;
  
  changedItems: {
    restaurant: boolean;
    categories: Set<string>; // IDs of changed categories
    dishes: Set<string>;     // IDs of changed dishes
    deletedCategories: Set<string>; // IDs of categories to delete
    deletedDishes: Set<string>;     // IDs of dishes to delete
  };
  
  isSaving: boolean;
  lastSaveTime: Date | null;
  isLoading: boolean;
}

const createTempId = () => `temp_${Math.random().toString(36).substring(2, 11)}`;

function mergeWithUnsavedChanges(
  dbCategories: Category[], 
  currentCategories: Category[], 
  changedCategoryIds: Set<string>,
  changedDishIds: Set<string>,
  deletedCategoryIds: Set<string>,
  deletedDishIds: Set<string>
): Category[] {
  const dbCategoriesMap = new Map<string, Category>();
  dbCategories.forEach(category => {
    dbCategoriesMap.set(category.id, { 
      ...category,
      dishes: category.dishes || [] // Ensure dishes array exists
    });
  });
  
  const currentCategoriesMap = new Map<string, Category>();
  currentCategories.forEach(category => {
    if (!deletedCategoryIds.has(category.id)) {
      currentCategoriesMap.set(category.id, { 
        ...category,
        dishes: category.dishes || [] // Ensure dishes array exists
      });
    }
  });
  
  const mergedCategories: Category[] = [];
  
  dbCategories.forEach(dbCategory => {
    if (!deletedCategoryIds.has(dbCategory.id)) {
      if (changedCategoryIds.has(dbCategory.id)) {
        const currentCategory = currentCategoriesMap.get(dbCategory.id);
        if (currentCategory) {
          mergedCategories.push({
            ...currentCategory,
            dishes: currentCategory.dishes || [] // Ensure dishes array exists
          });
        }
      } else {
        const mergedCategory = { 
          ...dbCategory,
          dishes: dbCategory.dishes || [] // Ensure dishes array exists
        };
        
        if (mergedCategory.dishes && mergedCategory.dishes.length > 0) {
          mergedCategory.dishes = mergedCategory.dishes.filter(dish => !deletedDishIds.has(dish.id));
          
          mergedCategory.dishes = mergedCategory.dishes.map(dish => {
            if (changedDishIds.has(dish.id)) {
              const currentCategory = currentCategoriesMap.get(dbCategory.id);
              if (currentCategory && currentCategory.dishes) {
                const currentDish = currentCategory.dishes.find(d => d.id === dish.id);
                if (currentDish) {
                  return currentDish;
                }
              }
            }
            return dish;
          });
        }
        
        mergedCategories.push(mergedCategory);
      }
    }
  });
  
  currentCategories.forEach(category => {
    if (category.id.startsWith('temp_') && !dbCategoriesMap.has(category.id)) {
      mergedCategories.push({
        ...category,
        dishes: category.dishes || [] // Ensure dishes array exists
      });
    }
  });
  
  return mergedCategories;
}

const restaurantStates = new Map();

function createMenuStore() {
  const initialState: MenuStore = {
    restaurants: [],
    selectedRestaurant: null,
    restaurantName: '',
    menuLogo: null,
    customPrompt: null,
    phoneNumber: null,
    categories: [],
    color: '#85A3FA',
    currency: '€',
    reservas: null,
    redes_sociales: null,
    
    changedItems: {
      restaurant: false,
      categories: new Set<string>(),
      dishes: new Set<string>(),
      deletedCategories: new Set<string>(),
      deletedDishes: new Set<string>()
    },
    
    isSaving: false,
    lastSaveTime: null,
    isLoading: false
  };

  const { subscribe, set, update } = writable<MenuStore>(initialState);

  const currentRestaurant = derived({ subscribe }, $state => 
    $state.restaurants.find(r => r.id === $state.selectedRestaurant)
  );

  const hasUnsavedChanges = derived({ subscribe }, $state => {
    return $state.changedItems.restaurant || 
           $state.changedItems.categories.size > 0 || 
           $state.changedItems.dishes.size > 0 ||
           $state.changedItems.deletedCategories.size > 0 ||
           $state.changedItems.deletedDishes.size > 0;
  });

  function saveCurrentState() {
    const state = get({ subscribe });
    if (!state.selectedRestaurant) return;
    
    if (state.changedItems.restaurant || 
        state.changedItems.categories.size > 0 || 
        state.changedItems.dishes.size > 0 || 
        state.changedItems.deletedCategories.size > 0 || 
        state.changedItems.deletedDishes.size > 0) {
      
      restaurantStates.set(state.selectedRestaurant, {
        restaurantName: state.restaurantName,
        menuLogo: state.menuLogo,
        customPrompt: state.customPrompt,
        phoneNumber: state.phoneNumber,
        color: state.color, // Save color state 
        categories: [...state.categories],
        changedItems: {
          restaurant: state.changedItems.restaurant,
          categories: new Set(state.changedItems.categories),
          dishes: new Set(state.changedItems.dishes),
          deletedCategories: new Set(state.changedItems.deletedCategories),
          deletedDishes: new Set(state.changedItems.deletedDishes)
        }
      });
    }
  }
  
  async function loadAndMergeData(restaurantId: string) {
    try {
      const restaurant = await restaurantService.fetchRestaurantById(restaurantId);
      
      const fetchedCategories = await categoryService.fetchCategories(restaurantId);
      
      const categoriesWithDishes = await Promise.all(
        fetchedCategories.map(async (category) => {
          try {
            const dishes = await dishService.fetchDishes(restaurantId, category.id);
            return {
              ...category,
              dishes
            } as Category;
          } catch (error) {
            console.error(`Error fetching dishes for category ${category.id}:`, error);
            return {
              ...category,
              dishes: []
            } as Category;
          }
        })
      );
      
      let finalCategories = categoriesWithDishes;
      let changedItems = {
        restaurant: false,
        categories: new Set<string>(),
        dishes: new Set<string>(),
        deletedCategories: new Set<string>(),
        deletedDishes: new Set<string>()
      };
      
      if (restaurantStates.has(restaurantId)) {
        const savedState = restaurantStates.get(restaurantId);
        
        finalCategories = mergeWithUnsavedChanges(
          categoriesWithDishes,
          savedState.categories || [],
          savedState.changedItems.categories,
          savedState.changedItems.dishes,
          savedState.changedItems.deletedCategories,
          savedState.changedItems.deletedDishes
        );
        
        changedItems = {
          restaurant: savedState.changedItems.restaurant,
          categories: new Set(savedState.changedItems.categories),
          dishes: new Set(savedState.changedItems.dishes),
          deletedCategories: new Set(savedState.changedItems.deletedCategories),
          deletedDishes: new Set(savedState.changedItems.deletedDishes)
        };
      }
      
      finalCategories = finalCategories.map(category => ({
        ...category,
        dishes: category.dishes || []
      }));
      
      return {
        restaurant,
        categories: finalCategories,
        changedItems
      };
    } catch (error) {
      console.error('Error loading data for restaurant:', restaurantId, error);
      throw error;
    }
  }

  return {
    subscribe,
    hasUnsavedChanges,
    
    reset() {
      set(initialState);
    },

    resetChanges() {
      update(state => ({
        ...state,
        changedItems: {
          restaurant: false,
          categories: new Set<string>(),
          dishes: new Set<string>(),
          deletedCategories: new Set<string>(),
          deletedDishes: new Set<string>()
        },
        lastSaveTime: new Date()
      }));
    },

    async loadRestaurants() {
      try {
        const restaurants = await restaurantService.fetchRestaurants();
        update(state => ({ ...state, restaurants }));
        return restaurants;
      } catch (error) {
        console.error('Error loading restaurants:', error);
        throw error;
      }
    },

    async selectRestaurant(restaurantId: string) {
      if (!restaurantId) {
        console.error('No restaurant ID provided to selectRestaurant');
        throw new Error('No restaurant ID provided');
      }
      
      try {
        const currentState = get({ subscribe });
        
        if (currentState.selectedRestaurant === restaurantId) {
          return currentState.restaurants.find(r => r.id === restaurantId);
        }
        
        update(s => ({ ...s, isLoading: true }));
        
        saveCurrentState();
        
        const { restaurant, categories, changedItems } = await loadAndMergeData(restaurantId);
        
        let colorValue = restaurant.color || '#85A3FA';
        if (colorValue === '1' || colorValue === 'light') {
          colorValue = '#85A3FA';
        }
        
        update(s => {
          return {
            ...s,
            selectedRestaurant: restaurantId,
            restaurantName: restaurant.name,
            menuLogo: restaurant.logo,
            customPrompt: restaurant.customPrompt,
            phoneNumber: restaurant.phoneNumber,
            color: colorValue,
            currency: restaurant.currency || '€',
            reservas: restaurant.reservas || null,
            redes_sociales: restaurant.redes_sociales || null,
            categories: categories,
            isLoading: false,
            changedItems: changedItems
          };
        });
        
        return restaurant;
      } catch (error) {
        console.error('Error selecting restaurant:', error);
        update(s => ({ ...s, isLoading: false }));
        throw error;
      }
    },

    createRestaurant(name: string, logo: string | null = null, customPrompt: string | null = null, phoneNumber: number | null = null, reservas: string | null = null, redes_sociales: string | null = null, currency: string = '€') {
      const tempId = createTempId();
      
      update(state => {
        let currentColor = state.color || '#85A3FA'; 
        
        if (currentColor === 'light' || currentColor === '1') {
          currentColor = '#85A3FA';
        }
      
        const newRestaurant: Restaurant = {
          id: tempId,
          name,
          slug: '', // Will be set by the server
          logo,
          customPrompt,
          phoneNumber,
          userId: '', // Will be set by the server
          currency: currency, // Use passed currency
          color: currentColor, // Use the current color value
          createdAt: new Date(),
          updatedAt: new Date(),
          reservas,
          redes_sociales,
        };
        
        return {
          ...state,
          restaurants: [...state.restaurants, newRestaurant],
          selectedRestaurant: tempId,
          restaurantName: name,
          menuLogo: logo,
          customPrompt,
          phoneNumber,
          currency: currency, // Update store state currency
          color: currentColor, // Keep the current color value
          changedItems: {
            ...state.changedItems,
            restaurant: true
          },
          reservas,
          redes_sociales,
        };
      });
    },

    updateRestaurantInfo(name: string, logo: string | null, customPrompt: string | null = null, slug: string | null = null, phoneNumber: number | null = null, reservas?: string | null, redes_sociales?: string | null, color: string | null = null, currency?: string | null) {
      let validatedColor = color;
      if (validatedColor && typeof validatedColor === 'string' && !validatedColor.startsWith('#')) {
        console.warn('CRITICAL: Color value must start with #, got:', validatedColor);
        validatedColor = '#' + validatedColor;
      }

      console.log('updateRestaurantInfo called with:', {
        name,
        logo,
        customPrompt,
        slug,
        phoneNumber,
        reservas,
        redes_sociales,
        color: validatedColor,
        currency,
        isUrlUpdate: {
          reservasProvided: reservas !== undefined,
        }
      });

      update(state => {
        const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
        const currentRestaurant = currentRestaurantIndex >= 0 ? state.restaurants[currentRestaurantIndex] : null;
        
        const updatedRestaurants = [...state.restaurants];
        
        // Determine the currency to use: passed value > current restaurant value > state value > default '€'
        const finalCurrency = currency ?? currentRestaurant?.currency ?? state.currency ?? '€';

        if (currentRestaurantIndex >= 0 && currentRestaurant) {
          updatedRestaurants[currentRestaurantIndex] = {
            ...currentRestaurant,
            name: name !== undefined ? name : currentRestaurant.name,
            logo: logo !== undefined ? logo : currentRestaurant.logo,
            customPrompt: customPrompt !== undefined ? customPrompt : currentRestaurant.customPrompt,
            slug: (slug !== undefined ? slug : currentRestaurant.slug) || '', // Ensure non-null string
            phoneNumber: phoneNumber !== undefined ? phoneNumber : currentRestaurant.phoneNumber,
            reservas: reservas !== undefined ? reservas : currentRestaurant.reservas,
            redes_sociales: redes_sociales !== undefined ? redes_sociales : currentRestaurant.redes_sociales,
            color: validatedColor || currentRestaurant.color || '#85A3FA',
            currency: finalCurrency, // Update currency in the restaurants array
            updatedAt: new Date(),
          };
        }
        
        return {
          ...state,
          restaurantName: name !== undefined ? name : state.restaurantName,
          menuLogo: logo !== undefined ? logo : state.menuLogo,
          customPrompt: customPrompt !== undefined ? customPrompt : state.customPrompt,
          phoneNumber: phoneNumber !== undefined ? phoneNumber : state.phoneNumber,
          color: validatedColor || state.color || '#85A3FA',
          currency: finalCurrency, // Update top-level store currency state
          ...(reservas !== undefined ? { reservas } : {}),
          ...(redes_sociales !== undefined ? { redes_sociales } : {}),
          restaurants: updatedRestaurants,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          }
        };
      });
    },

    updateReservasAndSocials(reservas: string | null, redes_sociales: string | null) {
      update(state => {
        const currentRestaurantIndex = state.restaurants.findIndex(r => r.id === state.selectedRestaurant);
        
        const updatedRestaurants = [...state.restaurants];
        
        if (currentRestaurantIndex >= 0) {
          updatedRestaurants[currentRestaurantIndex] = {
            ...updatedRestaurants[currentRestaurantIndex],
            reservas,
            redes_sociales,
            updatedAt: new Date(),
          };
        }
        
        return {
          ...state,
          reservas,
          redes_sociales,
          restaurants: updatedRestaurants,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          }
        };
      });
    },

    updateLocalRestaurantName(name: string) {
      update(state => {
        return {
          ...state,
          restaurantName: name,
          changedItems: {
            ...state.changedItems,
            restaurant: true
          }
        };
      });
    },

    addCategory(name: string) {
      const tempId = createTempId();
      
      update(state => {
        const newCategory: Category = {
          id: tempId,
          name,
          restaurantId: state.selectedRestaurant || '',
          dishes: []
        };
        
        return {
          ...state,
          categories: [...state.categories, newCategory],
          changedItems: {
            ...state.changedItems,
            categories: new Set([...state.changedItems.categories, tempId])
          }
        };
      });

      return tempId; // Return the temporary ID
    },
    
    updateCategory(categoryId: string, name: string) {
      update(state => {
        const updatedCategories = state.categories.map(category => 
          category.id === categoryId ? { ...category, name } : category
        );
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: new Set([...state.changedItems.categories, categoryId])
          }
        };
      });
    },
    
    deleteCategory(categoryId: string) {
      update(state => {
        const updatedCategories = state.categories.filter(category => 
          category.id !== categoryId
        );
        
        const deletedCategories = new Set(state.changedItems.deletedCategories);
        deletedCategories.add(categoryId);
        
        const changedCategories = new Set(state.changedItems.categories);
        changedCategories.delete(categoryId);
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            categories: changedCategories,
            deletedCategories
          }
        };
      });
    },

    addDish(categoryId: string, dishData: { title: string, price: string, description: string, imageUrl: string | null }) {
      const tempId = createTempId();
      
      update(state => {
        const newDish: Dish = {
          id: tempId,
          ...dishData,
          categoryId
        };
        
        const updatedCategories = state.categories.map(category => {
          if (category.id === categoryId) {
            return {
              ...category,
              dishes: [...(category.dishes || []), newDish]
            };
          }
          return category;
        });
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            dishes: new Set([...state.changedItems.dishes, tempId])
          }
        };
      });
    },
    
    updateDish(dishId: string, dishData: { title?: string, price?: string, description?: string, imageUrl?: string | null }) {
      update(state => {
        const updatedCategories = state.categories.map(category => {
          if (!category.dishes) return { ...category, dishes: [] };
          
          const dishIndex = category.dishes.findIndex(dish => dish.id === dishId);
          if (dishIndex === -1) return category;
          
          const updatedDishes = [...category.dishes];
          updatedDishes[dishIndex] = {
            ...updatedDishes[dishIndex],
            ...dishData
          };
          
          return {
            ...category,
            dishes: updatedDishes
          };
        });
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            dishes: new Set([...state.changedItems.dishes, dishId])
          }
        };
      });
    },
    
    deleteDish(dishId: string) {
      update(state => {
        const updatedCategories = state.categories.map(category => {
          if (!category.dishes) return { ...category, dishes: [] };
          
          const dishIndex = category.dishes.findIndex(dish => dish.id === dishId);
          if (dishIndex === -1) return category;
          
          const updatedDishes = category.dishes.filter(dish => dish.id !== dishId);
          
          return {
            ...category,
            dishes: updatedDishes
          };
        });
        
        const deletedDishes = new Set(state.changedItems.deletedDishes);
        deletedDishes.add(dishId);
        
        const changedDishes = new Set(state.changedItems.dishes);
        changedDishes.delete(dishId);
        
        return {
          ...state,
          categories: updatedCategories,
          changedItems: {
            ...state.changedItems,
            dishes: changedDishes,
            deletedDishes
          }
        };
      });
    },

    addUploadedCategoriesAndDishes(restaurantId: string, uploadedCategories: any[]) {
      update(state => {
        const newCategories: Category[] = [];
        const changedCategoryIds = new Set(state.changedItems.categories);
        const changedDishIds = new Set(state.changedItems.dishes);

        uploadedCategories.forEach(uploadedCategory => {
          const categoryTempId = createTempId();
          const newDishes: Dish[] = [];

          (uploadedCategory.dishes || []).forEach((uploadedDish: any) => {
            const dishTempId = createTempId();
            newDishes.push({
              id: dishTempId,
              title: uploadedDish.title || 'Untitled Dish',
              description: uploadedDish.description || '',
              price: uploadedDish.price?.toString() || '0',
              imageUrl: uploadedDish.imageUrl || null,
              categoryId: categoryTempId // Link to the new category temp ID
            });
            changedDishIds.add(dishTempId); // Mark dish as changed
          });

          newCategories.push({
            id: categoryTempId,
            name: uploadedCategory.name || 'Untitled Category',
            restaurantId: restaurantId, 
            dishes: newDishes
          });
          changedCategoryIds.add(categoryTempId); // Mark category as changed
        });

        console.log(`Menu Store: Added ${newCategories.length} uploaded categories and their dishes.`);

        return {
          ...state,
          categories: [...state.categories, ...newCategories],
          changedItems: {
            ...state.changedItems,
            categories: changedCategoryIds,
            dishes: changedDishIds
          }
        };
      });
    },

    async saveChanges() {
      const state = get({ subscribe });
      
      // Capture the frontend order before saving
      const frontendCategoryOrder = state.categories.map(c => c.id);
      
      try {
        update(s => ({ ...s, isSaving: true }));
        
        const currentRestaurantObj = state.restaurants.find(r => r.id === state.selectedRestaurant);
        
        const colorValue = state.color === 'light' || state.color === '1'
          ? '#85A3FA'
          : state.color;
        
        const reservas = state.reservas !== undefined ? state.reservas : currentRestaurantObj?.reservas;
        const redes_sociales = state.redes_sociales !== undefined ? state.redes_sociales : currentRestaurantObj?.redes_sociales;
        
        const result = await menuService.saveMenuChanges(
          {
            name: state.restaurantName,
            logo: state.menuLogo,
            customPrompt: state.customPrompt,
            phoneNumber: state.phoneNumber,
            currency: state.currency || '€',
            color: colorValue,
            reservas,
            redes_sociales,
          },
          state.selectedRestaurant
        );
        
        update(s => {
          // Re-sort the categories returned from the backend based on the frontend order
          const orderMap = new Map(frontendCategoryOrder.map((id, index) => [id, index]));
          const reorderedCategories = [...result.categories].sort((a, b) => {
            const orderA = orderMap.get(a.id);
            const orderB = orderMap.get(b.id);
            
            // Handle potential new categories not present before save
            if (orderA === undefined && orderB === undefined) return 0; 
            if (orderA === undefined) return 1; 
            if (orderB === undefined) return -1; 

            return orderA - orderB;
          });

          const restaurantIndex = s.restaurants.findIndex(r => r.id === result.restaurant.id);
          const restaurants = [...s.restaurants];
          
          if (restaurantIndex >= 0) {
            restaurants[restaurantIndex] = {
              ...result.restaurant,
              reservas: result.restaurant.reservas ?? restaurants[restaurantIndex].reservas,
              redes_sociales: result.restaurant.redes_sociales ?? restaurants[restaurantIndex].redes_sociales
            };
          } else {
            restaurants.push(result.restaurant);
          }
          
          return {
            ...s,
            restaurants,
            selectedRestaurant: result.restaurant.id,
            restaurantName: result.restaurant.name,
            menuLogo: result.restaurant.logo,
            customPrompt: result.restaurant.customPrompt,
            phoneNumber: result.restaurant.phoneNumber,
            categories: reorderedCategories, // Use the re-sorted categories
            isSaving: false,
            lastSaveTime: new Date(),
            changedItems: {
              restaurant: false,
              categories: new Set<string>(),
              dishes: new Set<string>(),
              deletedCategories: new Set<string>(),
              deletedDishes: new Set<string>()
            },
            reservas: result.restaurant.reservas ?? s.reservas,
            redes_sociales: result.restaurant.redes_sociales ?? s.redes_sociales,
            color: result.restaurant.color || '#85A3FA',
            currency: result.restaurant.currency || '€'
          };
        });
        
        return result;
      } catch (error) {
        console.error('Error saving changes:', error);
        update(s => ({ ...s, isSaving: false }));
        throw error;
      }
    },
    //To check later
    reorderCategories(newOrderCategories: Category[]) {
      update(state => {
        if (!state.selectedRestaurant) return state;
        
        const oldOrderIds = state.categories.map(c => c.id);
        const newOrderIds = newOrderCategories.map(c => c.id);
        const orderChanged = JSON.stringify(oldOrderIds) !== JSON.stringify(newOrderIds);

        if (orderChanged) {
          return {
            ...state,
            categories: newOrderCategories,
            changedItems: {
              ...state.changedItems,
              restaurant: true // Mark restaurant as changed because category order affects it
            }
          };
        } else {
          return state; // No changes if order is the same
        }
      });
    },
    reorderDishes(categoryId: string, reorderedDishes: Dish[]) {
      update(state => {
        const categories = state.categories.map(category => {
          if (category.id === categoryId) {
            // Update the order property on each dish and ensure dishes array exists
            const updatedDishes = (reorderedDishes || []).map((dish, index) => ({
              ...dish,
              order: index // Set the order based on the new array index
            }));
            return { ...category, dishes: updatedDishes };
          }
          return category;
        });

        // Mark the category as changed because its dish order changed.
        const changedCategories = new Set(state.changedItems.categories);
        changedCategories.add(categoryId);

        return {
          ...state,
          categories,
          changedItems: {
            ...state.changedItems,
            categories: changedCategories
          }
        };
      });
    },
  };
}

export const menuStore = createMenuStore();
```

`src/lib/stores/restaurant.ts`:

```ts
import { writable, get } from 'svelte/store';
import type { Restaurant } from '$lib/types/menu.types';

function createRestaurantStore() {
  const { subscribe, set } = writable<Restaurant | null>(null);
  let cachedRestaurants: Restaurant[] = [];

  return {
    subscribe,
    set,
    async loadRestaurants(): Promise<Restaurant[]> {
      try {
        // console.log('Fetching restaurants from API...');
        // console.log('Current auth state:', document.cookie.includes('auth_token') ? 'Auth token exists' : 'No auth token');
        
        const response = await fetch('/api/restaurants', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          console.error('Error response from API:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error details:', errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        // console.log('API response type:', typeof data);
        // console.log('API response keys:', Object.keys(data));
        // console.log('API response full:', data);
        
        if (!data.success) {
          console.error('API reported failure:', data.error);
          throw new Error(data.error || 'Failed to load restaurants');
        }
        
        // Check if data.data exists and is an array
        if (!data.data) {
          console.error('API response missing data property:', data);
          return [];
        }
        
        if (!Array.isArray(data.data)) {
          console.error('API response data is not an array:', data.data);
          return [];
        }
        
        // console.log(`Received ${data.data.length} restaurants from API`);
        // data.data.forEach((r: Restaurant, index: number) => {
        //   console.log(`Restaurant ${index} from API:`, r);
        //   console.log(`- Name: ${r.name || 'undefined'}`);
        //   console.log(`- ID: ${r.id || 'undefined'}`);
        //   console.log(`- User ID: ${r.userId || 'undefined'}`);
        // });
        
        cachedRestaurants = data.data;
        return data.data;
      } catch (error) {
        console.error('Error loading restaurants:', error);
        return [];
      }
    },
    async loadRestaurant(id: string): Promise<void> {
      try {
        const response = await fetch(`/api/restaurants?id=${id}`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          console.error('Error response from API:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('Error details:', errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to load restaurant');
        }
        
        // Update the current restaurant
        set(data.data);
        
        // Update the restaurant in the cached list if it exists
        const index = cachedRestaurants.findIndex(r => r.id === id);
        if (index !== -1) {
          cachedRestaurants[index] = data.data;
        }
      } catch (error) {
        console.error('Error loading restaurant:', error);
        set(null);
      }
    },
    async refreshCurrentRestaurant(): Promise<void> {
      const current = get(this);
      if (current?.id) {
        await this.loadRestaurant(current.id);
      }
    },
    getCachedRestaurants(): Restaurant[] {
      return cachedRestaurants;
    },
    updateCachedRestaurant(updatedRestaurant: Restaurant): void {
      const index = cachedRestaurants.findIndex(r => r.id === updatedRestaurant.id);
      if (index !== -1) {
        cachedRestaurants[index] = updatedRestaurant;
      }
      // If this is the current restaurant, update it too
      const current = get(this);
      if (current?.id === updatedRestaurant.id) {
        set(updatedRestaurant);
      }
    }
  };
}

export const currentRestaurant = createRestaurantStore(); 
```

`src/lib/stores/toast.ts`:

```ts
import { writable } from 'svelte/store';

export interface Toast {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timeout?: number;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  let id = 0;

  function addToast(type: Toast['type'], message: string, timeout: number = 3000) {
    const toast: Toast = {
      id: id++,
      type,
      message,
      timeout
    };

    update(toasts => [...toasts, toast]);

    if (timeout) {
      setTimeout(() => {
        remove(toast.id);
      }, timeout);
    }
  }

  function remove(id: number) {
    update(toasts => toasts.filter(toast => toast.id !== id));
  }

  return {
    subscribe,
    success: (message: string) => addToast('success', message),
    error: (message: string) => addToast('error', message),
    info: (message: string) => addToast('info', message),
    warning: (message: string) => addToast('warning', message),
    remove
  };
}

export const toasts = createToastStore(); 
```

`src/lib/stores/uploaderStore.ts`:

```ts
import { writable } from 'svelte/store';

interface UploaderState {
  isLoading: boolean;
  currentStep: string;
  progress: number;
}

function createUploaderStore() {
  const { subscribe, set, update } = writable<UploaderState>({
    isLoading: false,
    currentStep: '',
    progress: 0,
  });

  return {
    subscribe,
    setLoading: (loading: boolean, step: string = '', progress: number = 0) => {
      set({ isLoading: loading, currentStep: step, progress: progress });
    },
    updateProgress: (step: string, progress: number) => {
      update(state => ({ ...state, currentStep: step, progress: progress }));
    },
    reset: () => set({ isLoading: false, currentStep: '', progress: 0 }),
  };
}

export const uploaderStore = createUploaderStore(); 
```

`src/lib/stores/user.ts`:

```ts
import { writable } from 'svelte/store';
import { browser } from '$app/environment';

interface User {
  id: string | null;
  name: string | null;
  email: string | null;
  picture: string | null;
}

function formatDisplayName(fullName: string | null): string | null {
  if (!fullName) return null;
  
  // Decodificar el nombre en caso de que venga codificado
  try {
    const decodedName = decodeURIComponent(fullName);
    const nameParts = decodedName.split(' ');
    return nameParts.slice(0, 2).join(' ');
  } catch {
    // Si hay error en la decodificación, usar el nombre original
    const nameParts = fullName.split(' ');
    return nameParts.slice(0, 2).join(' ');
  }
}

// Función para obtener el usuario inicial desde localStorage
const getStoredUser = (): User => {
  if (!browser) return { id: null, name: null, email: null, picture: null };
  
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return { id: null, name: null, email: null, picture: null };

    const user = JSON.parse(storedUser);
    return {
      ...user,
      name: user.name ? formatDisplayName(user.name) : null
    };
  } catch {
    return { id: null, name: null, email: null, picture: null };
  }
};

// Crear el store con el valor inicial desde localStorage
const userStore = writable<User>(getStoredUser());

// Crear un store personalizado que actualiza localStorage cuando cambia
export const user = {
  ...userStore,
  set: (value: User) => {
    if (browser && value) {
      const formattedUser = {
        ...value,
        name: value.name ? formatDisplayName(value.name) : null
      };
      
      if (formattedUser.name) {
        localStorage.setItem('user', JSON.stringify(formattedUser));
      } else {
        localStorage.removeItem('user');
      }
      
      userStore.set(formattedUser);
    }
  },
  logout: () => {
    if (browser) {
      localStorage.removeItem('user');
    }
    userStore.set({ id: null, name: null, email: null, picture: null });
  }
}; 
```

`src/lib/types.ts`:

```ts
// Re-export types from menu.types.ts for backward compatibility
export type { Restaurant, Category, Dish } from './types/menu.types'; 
```

`src/lib/types/menu.types.ts`:

```ts
export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  customPrompt: string | null;
  userId: string;
  currency: string;
  color: string;
  phoneNumber: number | null;
  createdAt: Date;
  updatedAt: Date;
  reservas: string | null;
  redes_sociales: string | null;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
  dishes?: Dish[];
}

export interface Dish {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  categoryId: string;
} 
```

`src/lib/types/server-types.ts`:

```ts
export interface AuthRequest {
  credential?: string;
  accessToken?: string;
  userID?: string;
  authorization?: {
    id_token: string;
  };
  user?: {
    name?: string;
    email?: string;
  };
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  data?: {
    id: string;
    name?: string;
    email?: string;
    picture?: string;
  };
}

export interface EmailConfig {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export interface JwtPayload {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
    FB: {
      init: (params: {
        appId: string;
        cookie?: boolean;
        xfbml?: boolean;
        version: string;
      }) => void;
      login: (callback: (response: {
        authResponse?: {
          accessToken: string;
          userID: string;
        };
        status?: string;
      }) => void, options?: { scope: string }) => void;
    };
    AppleID: {
      auth: {
        init: (config: {
          clientId: string;
          scope: string;
          redirectURI: string;
          usePopup?: boolean;
        }) => void;
        signIn: () => Promise<{
          authorization: {
            id_token: string;
            code: string;
            state: string;
          };
          user?: {
            name?: {
              firstName: string;
              lastName: string;
            };
            email?: string;
          };
        }>;
      };
    };
  }
} 
```

`src/lib/utils.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 
```

`src/lib/utils/RestaurantInfo.helpers.ts`:

```ts
// src/lib/utils/restaurant-info-helpers.ts
import { get } from 'svelte/store';
import { currentRestaurant } from '$lib/stores/restaurant';
import { user } from '$lib/stores/user';
import { menuStore } from '$lib/stores/menu-store';
import { toasts } from '$lib/stores/toast';
import { generateSlug } from '$lib/utils/slug';
import type { Restaurant } from '$lib/types/menu.types';
import { language } from '$lib/stores/language';

export interface UpdateEvent {
  id?: string;
  name: string;
  logo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  color: string | number;
  currency: string;
  reservas: string | null;
  redes_sociales: string | null;
  slug?: string;
}

// For dispatch functions, accept more flexible parameter types
type DispatchFunction = {
  (event: 'update', detail: UpdateEvent): void;
  (event: 'select', detail: string): void;
  (event: string, detail: any): void;
};

/** Ensure a string for UI usage */
export function ensureString(value: string | number | null | undefined): string {
  return value == null ? '' : String(value);
}

/** Ensure a string or null (for DB usage) */
export function ensureStringOrNull(value: string | null | undefined): string | null {
  return value || null;
}

/**
 * Handle drag events for logo upload
 * (enter, over, leave can all delegate here).
 */
export function handleDrag(event: DragEvent, canEdit: boolean, isEntering: boolean): boolean {
  event.preventDefault();
  event.stopPropagation();
  if (!canEdit) return false;
  return isEntering;
}

/**
 * Called when a file is dropped; checks file type and calls handleFileUpload if valid.
 */
export async function handleDrop(
  event: DragEvent,
  canEdit: boolean,
  t: (key: string) => string,
  handleFileUploadFn: (file: File) => Promise<void>,
  setIsDragging: (val: boolean) => void
) {
  event.preventDefault();
  event.stopPropagation();
  setIsDragging(false);

  if (!canEdit) {
    toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
    return;
  }

  const file = event.dataTransfer?.files[0];
  if (!file) return;

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    toasts.error(t('error') + ': ' + t('invalidFileType'));
    return;
  }

  await handleFileUploadFn(file);
}

/**
 * Upload the file using /api/upload and ONLY dispatch the change.
 */
export async function handleFileUpload(
  file: File,
  restaurantId: string | null, // Need ID to dispatch
  t: (key: string) => string,
  dispatch: DispatchFunction
) {
  let isUploading = false;
  try {
    isUploading = true;
    const currentUser = get(user);
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const formData = new FormData();
    formData.append('file', file);

    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload logo');
    }
    const uploadResult = await uploadResponse.json();
    const logoUrl = uploadResult.url || null;

    // ONLY dispatch the changed logo URL
    if (logoUrl !== null) {
      dispatch('update', {
        id: restaurantId || undefined,
        logo: logoUrl,
      } as Partial<UpdateEvent>); // Dispatch partial update
    } else {
        // Optionally handle null URL case, maybe dispatch null?
        dispatch('update', {
            id: restaurantId || undefined,
            logo: null,
        } as Partial<UpdateEvent>);
    }

    return logoUrl; // Return the URL for local state update in component

  } catch (error) {
    console.error('Error uploading logo:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
    return null;
  } finally {
    isUploading = false;
  }
}

/**
 * Called after typing in the restaurant name input (on blur).
 */
export function handleRestaurantNameInput(
  restaurantName: string,
  selectedRestaurant: string | null,
  isCreatingRestaurant: boolean,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: string | null,
  color: string | number,
  currency: string,
  dispatch: DispatchFunction,
  t: (key: string) => string
) {
  try {
    if (!restaurantName || selectedRestaurant || isCreatingRestaurant) {
      return;
    }
    // Just update the local store name, no restaurant created in DB
    menuStore.updateLocalRestaurantName(restaurantName);

    const cRest = get(currentRestaurant);
    dispatch('update', {
      id: selectedRestaurant || undefined,
      name: restaurantName,
      logo: menuLogo,
      customPrompt,
      phoneNumber: phoneNumber ? Number(phoneNumber) : null,
      currency,
      color,
      slug: cRest?.slug || '',
      reservas: cRest?.reservas,
      redes_sociales: cRest?.redes_sociales
    });
  } catch (error) {
    console.error('Error updating restaurant name:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
  }
}

export function startEditingRestaurant(setEditingName: (name: string) => void, setIsEditing: (val: boolean) => void, currentName: string) {
  setEditingName(currentName);
  setIsEditing(true);
}

export function cancelEditingRestaurant(setEditingName: (name: string) => void, setIsEditing: (val: boolean) => void, currentName: string) {
  setEditingName(currentName);
  setIsEditing(false);
}

/**
 * Called when the restaurant name is confirmed (e.g., checkmark clicked)
 */
export async function updateRestaurantName(
  editingRestaurantName: string,
  selectedRestaurant: string | null,
  // REMOVED other fields as they are not directly changed here
  dispatchFn: DispatchFunction,
  t: (key: string) => string,
  setLocalRestaurantName: (val: string) => void,
  setIsEditing: (val: boolean) => void
) {
  const trimmedName = editingRestaurantName.trim();
  if (!trimmedName) {
    toasts.error(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
    return;
  }
  
  const currentStoreState = get(menuStore);
  const restaurantId = selectedRestaurant || currentStoreState.selectedRestaurant;

  if (!restaurantId) {
    toasts.error(t('error') + ': ' + t('noRestaurantSelected'));
    return;
  }

  try {
    const newSlug = await generateSlug(trimmedName);
    
    // Dispatch ONLY the name and slug change
    dispatchFn('update', {
      id: restaurantId,
      name: trimmedName,
      slug: newSlug,
    } as Partial<UpdateEvent>); // Dispatch partial update
    
    // update local component state
    setLocalRestaurantName(trimmedName);
    setIsEditing(false);

  } catch (error) {
    console.error('Error updating restaurant name:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
  }
}

export function handleRestaurantEditKeyPress(event: KeyboardEvent, updateFn: () => void, cancelFn: () => void) {
  if (event.key === 'Enter') {
    updateFn();
  } else if (event.key === 'Escape') {
    cancelFn();
  }
}

/**
 * Handle restaurant selection from dropdown
 */
export function handleRestaurantSelect(event: Event, dispatchFn: (event: 'select', val: string) => void) {
  const select = event.target as HTMLSelectElement;
  
  // Clear any custom color values from local storage when switching restaurants
  // This helps prevent custom colors from persisting between restaurant switches
  if (typeof window !== 'undefined') {
    const previousRestaurantId = get(currentRestaurant)?.id || 'new';
    const newRestaurantId = select.value;
    
    if (previousRestaurantId !== newRestaurantId) {
      console.log('Restaurant changed, clearing previous custom color state');
      localStorage.removeItem(`customColor_${previousRestaurantId}`);
    }

    // If selecting "Add Restaurant", reset the menu store state
    if (newRestaurantId === 'new') {
      console.log('Creating new restaurant, resetting menu store state');
      menuStore.reset();
    }
  }
  
  try {
    dispatchFn('select', select.value);
  } catch (error) {
    console.error('Error selecting restaurant:', error);
    if (error instanceof Error) {
      toasts.error('Error: ' + error.message);
    }
  }
}

/**
 * Handle custom prompt input change
 */
export function handleCustomPromptInput(
  event: Event,
  selectedRestaurantId: string | null, // Need ID to dispatch
  t: (key: string) => string,
  dispatchFn: DispatchFunction
): string | null {
  const target = event.target as HTMLTextAreaElement;
  const newValue = target.value;

  try {
    // Basic validation (optional)
    if (newValue.length > 10000) { 
      toasts.info(t('customPromptTooLong'));
      // Maybe truncate or prevent further input?
      // For now, just dispatch the truncated value
      const truncatedValue = newValue.substring(0, 10000);
       dispatchFn('update', {
        id: selectedRestaurantId || undefined,
        customPrompt: truncatedValue,
      } as Partial<UpdateEvent>); // Dispatch partial update
      return truncatedValue;
    }

    // Dispatch ONLY the prompt change
    dispatchFn('update', {
      id: selectedRestaurantId || undefined,
      customPrompt: newValue,
    } as Partial<UpdateEvent>); // Dispatch partial update
    
    return newValue;

  } catch (error) {
    console.error('Error updating custom prompt:', error);
    if (error instanceof Error) {
      toasts.error(t('error') + ': ' + error.message);
    }
    return null; // Return null on error to signal failure
  }
}

/**
 * Handle deleting the logo.
 */
export function handleLogoDelete(
  selectedRestaurantId: string | null, // Need ID to dispatch
  dispatchFn: DispatchFunction
) {
  // Dispatch ONLY the logo change (setting it to null)
  dispatchFn('update', {
    id: selectedRestaurantId || undefined,
    logo: null,
  } as Partial<UpdateEvent>); // Dispatch partial update

  return null; // Return null for local state update in component
}

/**
 * Handle currency change
 */
export function handleCurrencyChange(
  value: string,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: number | null,
  color: string | number,
  reservas: string | null,
  redes_sociales: string | null,
  dispatchFn: DispatchFunction
) {
  try {
    const currentUser = get(user);
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const cRest = get(currentRestaurant);

    // Dispatch an update event with ALL relevant current data,
    // including the NEW currency and the EXISTING color.
    dispatchFn('update', {
      id: cRest?.id || undefined, // Use current restaurant ID if available
      name: restaurantName, // Use current name
      logo: menuLogo, // Use current logo
      customPrompt: customPrompt, // Use current prompt
      phoneNumber: phoneNumber, // Use current phone number
      currency: value, // Use the NEW currency value
      color: String(color), // Use the CURRENT color value, ensure it's a string
      reservas: reservas, // Use current reservas
      redes_sociales: redes_sociales, // Use current redes sociales
      slug: cRest?.slug // Include slug if available
    });

  } catch (error) {
    console.error('Error handling currency change:', error);
    // Optionally add a user-facing toast notification here
  }
}

/**
 * Handle phone number change
 */
export function handlePhoneNumberChange(
  newPhoneNumber: number | null,
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  color: string | number,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  dispatchFn: DispatchFunction
) {
  try {
    const cRest = get(currentRestaurant);
    
    // For existing restaurant
    if (cRest) {
      // Preserve the current color from the database
      // const existingColor = cRest.color || color; // No longer needed, let updateRestaurantInfo handle it
      
      menuStore.updateRestaurantInfo(
        cRest.name,
        cRest.logo,
        cRest.customPrompt,
        cRest.slug,
        newPhoneNumber,
        // String(existingColor) // Remove explicit color
        // Pass undefined for optional args not being set here
        undefined, // reservas
        undefined, // redes_sociales
        undefined, // color
        cRest.currency // Pass existing currency
      );
      dispatchFn('update', {
        id: cRest.id,
        name: cRest.name,
        logo: cRest.logo,
        customPrompt: cRest.customPrompt,
        phoneNumber: newPhoneNumber,
        currency: cRest.currency, // Use current restaurant's currency
        color: cRest.color, // Dispatch the actual current color from store
        slug: cRest.slug,
        reservas: cRest.reservas,
        redes_sociales: cRest.redes_sociales
      });
    } else {
      // For new local restaurant
      menuStore.updateRestaurantInfo(
        restaurantName,
        menuLogo,
        customPrompt,
        null, // slug
        newPhoneNumber,
        // String(color) // Remove explicit color
        // Pass undefined for optional args not being set here
        reservas, // Pass existing reservas if available
        redes_sociales, // Pass existing redes_sociales if available
        undefined, // color
        currency // Pass existing currency
      );
      dispatchFn('update', {
        id: undefined,
        name: restaurantName,
        logo: menuLogo,
        customPrompt: customPrompt, // Explicitly set customPrompt
        phoneNumber: newPhoneNumber,
        currency,
        // color, // Remove explicit color from dispatch for new restaurant
        reservas: reservas,
        redes_sociales: redes_sociales
      });
    }
  } catch (error) {
    console.error('Error updating phone number:', error);
  }
}

// Function to clean phone number - ensure it's a valid number without spaces
function cleanPhoneNumber(phone: any): number | null {
  if (phone === null || phone === undefined) return null;
  
  // If it's already a number, return it
  if (typeof phone === 'number') return phone;
  
  // Convert to string, remove all spaces and non-digit characters
  const cleaned = phone.toString().replace(/\s+/g, '').replace(/\D/g, '');
  
  // Convert back to number if we have digits
  if (cleaned.length > 0) {
    const numericValue = Number(cleaned);
    if (!isNaN(numericValue) && Number.isInteger(numericValue)) {
      return numericValue;
    }
  }
  return null;
}

interface RestaurantState {
  restaurantName: string;
  menuLogo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  currency: string;
  color: string;
  reservas: string | null;
  redes_sociales: string | null;
}
/**
 * Handle menu upload success
 */
export async function handleMenuUploadSuccess(
  event: CustomEvent,
  dispatchFn: DispatchFunction,
  currentState: RestaurantState,
  t: (key: string) => string
) {
  try {
    console.log('handleMenuUploadSuccess received event:', {
      detail: event.detail,
      currentState
    });

    const cRest = get(currentRestaurant);
    console.log('Current restaurant from store:', cRest);
    
    // Get the data potentially returned from the processing API
    const { restaurantData } = event.detail;
    const uploadedRestaurantInfo = restaurantData?.restaurant || {};
    const uploadedCategories = restaurantData?.categories || [];
    const uploadedDishes = uploadedCategories.flatMap((cat: any) => cat.dishes || []);

    // Preserve the current UI color if not provided by upload
    const existingColor = uploadedRestaurantInfo.color || currentState.color || cRest?.color || '#85A3FA';

    // Handle restaurant name priority:
    // 1. Manual input (if exists)
    // 2. Uploaded name (if exists)
    // 3. Current store name (if exists)
    // 4. Placeholder name
    const finalName = currentState.restaurantName || 
                     uploadedRestaurantInfo.name || 
                     cRest?.name || 
                     t('unknownRestaurant');

    console.log('Restaurant name resolution:', {
      manualName: currentState.restaurantName,
      uploadedName: uploadedRestaurantInfo.name,
      storeName: cRest?.name,
      finalName
    });

    const finalLogo = uploadedRestaurantInfo.logo || currentState.menuLogo || cRest?.logo;
    const finalPrompt = uploadedRestaurantInfo.customPrompt || currentState.customPrompt || cRest?.customPrompt;
    const finalPhone = cleanPhoneNumber(uploadedRestaurantInfo.phoneNumber !== undefined ? uploadedRestaurantInfo.phoneNumber : currentState.phoneNumber !== undefined ? currentState.phoneNumber : cRest?.phoneNumber);
    const finalCurrency = uploadedRestaurantInfo.currency || currentState.currency || cRest?.currency || '€';
    const finalReservas = uploadedRestaurantInfo.reservas || currentState.reservas || cRest?.reservas;
    const finalRedes = uploadedRestaurantInfo.redes_sociales || currentState.redes_sociales || cRest?.redes_sociales;

    if (cRest) {
      // Update existing restaurant
      menuStore.updateRestaurantInfo(
        finalName,
        finalLogo,
        finalPrompt,
        cRest.slug,
        finalPhone,
        String(existingColor)
      );

      // If categories/dishes were processed and returned, update the store for them too
      if (uploadedCategories.length > 0) {
        console.log('Uploaded categories data available, update menuStore if specific methods exist:', uploadedCategories);
        // Add categories to the store
        for (const category of uploadedCategories) {
          const categoryId = menuStore.addCategory(category.name);
          if (category.dishes && Array.isArray(category.dishes)) {
            for (const dish of category.dishes) {
              menuStore.addDish(categoryId, {
                title: dish.title || 'Untitled Dish',
                description: dish.description || '',
                price: dish.price?.toString() || '0',
                imageUrl: dish.imageUrl || null
              });
            }
          }
        }
      }

      // Dispatch the merged UI state
      const updateData = {
        id: cRest.id,
        name: finalName,
        logo: finalLogo,
        customPrompt: finalPrompt,
        phoneNumber: finalPhone,
        currency: finalCurrency,
        color: existingColor,
        slug: cRest.slug,
        reservas: finalReservas,
        redes_sociales: finalRedes
      };
      console.log('Dispatching update for existing restaurant after upload:', updateData);
      dispatchFn('update', updateData);
    } else {
      // For a NEW restaurant being created FROM an upload
      console.log('Processing new restaurant data from upload:', restaurantData);

      if (!restaurantData || !restaurantData.restaurant) {
        console.error('Invalid restaurant data received:', restaurantData);
        throw new Error('Invalid restaurant data format');
      }

      // Extract restaurant data
      const { restaurant, categories } = restaurantData;
      console.log('Extracted categories:', categories);

      // Generate a slug for the new restaurant
      const slug = await generateSlug(finalName);

      // Extract details, prioritizing manual input then uploaded data
      const finalLogo = restaurant.logo || currentState.menuLogo;
      const finalPrompt = restaurant.customPrompt || currentState.customPrompt;
      const finalPhone = cleanPhoneNumber(restaurant.phoneNumber !== undefined ? restaurant.phoneNumber : currentState.phoneNumber);
      const finalCurrency = restaurant.currency || currentState.currency || '€';
      const finalColor = restaurant.color || currentState.color || '#85A3FA';
      const finalReservas = restaurant.reservas || currentState.reservas;
      const finalRedes = restaurant.redes_sociales || currentState.redes_sociales;

      // Create the restaurant in the store first (this selects it)
      menuStore.createRestaurant(
        finalName,
        finalLogo,
        finalPrompt,
        finalPhone,
        finalReservas,
        finalRedes
      );

      // Get the newly created restaurant ID
      const storeState = get(menuStore);
      const newId = storeState.selectedRestaurant;

      if (!newId) {
        throw new Error('Failed to create restaurant');
      }

      // Update with the proper slug and other details
      menuStore.updateRestaurantInfo(
        finalName,
        finalLogo,
        finalPrompt,
        slug,
        finalPhone,
        String(finalColor)
      );

      // Add categories and dishes from the upload
      if (categories && Array.isArray(categories)) {
        console.log('Processing categories:', categories.length);

        for (const category of categories) {
          // Create category and get its ID
          const categoryId = menuStore.addCategory(category.name);
          console.log('Created category:', { name: category.name, id: categoryId });

          // Add dishes if they exist
          if (category.dishes && Array.isArray(category.dishes)) {
            console.log(`Processing ${category.dishes.length} dishes for category ${category.name}`);

            for (const dish of category.dishes) {
              const dishData = {
                title: dish.title || 'Untitled Dish',
                description: dish.description || '',
                price: dish.price?.toString() || '0',
                imageUrl: dish.imageUrl || null
              };
              console.log('Adding dish:', dishData);

              // Add the dish to the store
              menuStore.addDish(categoryId, dishData);
            }
          }
        }
      }

      // Dispatch the final state to the parent component
      const updateData = {
        id: newId,
        name: finalName,
        logo: finalLogo,
        customPrompt: finalPrompt,
        phoneNumber: finalPhone,
        currency: finalCurrency,
        color: finalColor,
        slug,
        reservas: finalReservas,
        redes_sociales: finalRedes
      };
      console.log('Dispatching update for new restaurant from upload:', updateData);
      dispatchFn('update', updateData);
    }
  } catch (error) {
    console.error('Error handling menu upload success:', error);
    toasts.error(t('errorProcessingUpload') + ': ' + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Handle menu upload error
 */
export function handleMenuUploadError(event: CustomEvent, t: (key: string) => string) {
  const errorMessage = event.detail?.message || event.detail || 'Unknown upload error';
  toasts.error(t('error') + ': ' + t('menuUploadFailed') + ' - ' + errorMessage);
} 
```

`src/lib/utils/color.helpers.ts`:

```ts
import { toasts } from '$lib/stores/toast';
import { get } from 'svelte/store';
import { currentRestaurant } from '$lib/stores/restaurant';
import { menuStore } from '$lib/stores/menu-store';
import type { UpdateEvent } from './RestaurantInfo.helpers';

/**
 * Handle selecting a color from the palette - ONLY sets temp value now
 */
export function handleCustomColorSelect(
  hexColor: string,
  setTempColorValue: (val: string) => void
  // setCustomColorInput: (val: string) => void // Removed 3rd argument
) {
  const capitalizedHexColor = hexColor.toUpperCase();
  setTempColorValue(capitalizedHexColor);
  // setCustomColorInput(capitalizedHexColor); // Removed this line
}

/**
 * Handle custom color input change (validation)
 */
export function handleCustomColorInputValidation(
  customColorInput: string,
  setTempColorValue: (val: string) => void
) {
  // Validate color format
  if (/^#[0-9A-F]{6}$/i.test(customColorInput)) {
    setTempColorValue(customColorInput.toUpperCase());
  } else if (/^[0-9A-F]{6}$/i.test(customColorInput)) {
    setTempColorValue(`#${customColorInput}`.toUpperCase());
  }
  // If invalid, tempColorValue remains unchanged, providing visual feedback
}

/**
 * Save custom color to localStorage when it changes
 */
export function saveCustomColorToStorage(
  customColorValue: string,
  selectedRestaurant: string | null
) {
  if (customColorValue && typeof customColorValue === 'string' && typeof window !== 'undefined') {
    localStorage.setItem(`customColor_${selectedRestaurant || 'new'}`, customColorValue.toUpperCase());
  }
}

// Type for the dispatch function expected by helpers
type ColorDispatchFunction = (
  event: 'update',
  detail: UpdateEvent
) => void;

/**
 * Update color based on selection (specifically for light theme selection)
 */
export function updateColorToLight(
  // newColorValue: string, // Implicitly 'light' -> '#85A3FA'
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: number | null,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  selectedRestaurantId: string | null, // Added ID
  dispatchFn: ColorDispatchFunction
) {
  const finalColor = '#85A3FA'; // Standard hex for light theme

  console.log("Setting color to light theme:", finalColor);

  // Dispatch the update event with the light theme color and other current state
  dispatchFn('update', {
    id: selectedRestaurantId || undefined, // Include the ID
    name: restaurantName,
    logo: menuLogo,
    customPrompt: customPrompt,
    phoneNumber: phoneNumber,
    currency: currency,
    color: finalColor,
    // slug is handled by save logic based on ID
    reservas: reservas,
    redes_sociales: redes_sociales,
  });
}

/**
 * Handle accepting a custom color
 */
export function onAcceptCustomColor(
  tempColorValue: string, // The hex color selected/entered
  restaurantName: string,
  menuLogo: string | null,
  customPrompt: string | null,
  phoneNumber: number | null,
  currency: string,
  reservas: string | null,
  redes_sociales: string | null,
  selectedRestaurantId: string | null, // Added ID
  dispatchFn: ColorDispatchFunction
) {
  if (!/^#[0-9A-F]{6}$/i.test(tempColorValue)) {
    console.error("Attempted to accept invalid hex color:", tempColorValue);
    // Optionally add a user toast message here
    return; // Don't proceed with invalid color
  }
  const finalColor = tempColorValue.toUpperCase();

  console.log("Accepting custom color:", finalColor);

  // Dispatch the update event with the accepted custom color
  dispatchFn('update', {
    id: selectedRestaurantId || undefined, // Include the ID
    name: restaurantName,
    logo: menuLogo,
    customPrompt: customPrompt,
    phoneNumber: phoneNumber,
    currency: currency,
    color: finalColor,
    // slug is handled by save logic based on ID
    reservas: reservas,
    redes_sociales: redes_sociales,
  });
}

/**
 * Handle canceling custom color selection (No dispatch needed)
 */
export function onCancelCustomColor(
  // No dispatch needed, parent handles UI reset
) {
  console.log("Custom color cancelled. Parent should handle state reset.");
  // Parent (`ThemeColorSection`) should handle reverting its visual state
  // (e.g., closing the picker, resetting radio buttons if needed).
} 
```

`src/lib/utils/formatters.ts`:

```ts
/**
 * Formats a price string or number into a string with two decimal places.
 * Returns '0.00' if the input is invalid.
 * @param price The price value (string or number).
 * @returns The formatted price string.
 */
export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) {
    return '0.00';
  }
  const numPrice = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
  return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
} 
```

`src/lib/utils/slug.ts`:

```ts
export async function generateSlug(name: string, customFetch?: typeof fetch): Promise<string> {
    try {
        const fetchToUse = customFetch || fetch;
        
        // The API endpoint handles duplicate slugs by adding a counter or random suffix
        // for different users to ensure global uniqueness
        const response = await fetchToUse('/api/slug', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name }),
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to generate slug: ${response.status}`);
        }

        const data = await response.json();
        return data.slug;
    } catch (error) {
        console.error('Error generating slug:', error);
        throw error;
    }
}

/**
 * Check if a slug is available or already in use
 * @param slug The slug to check
 * @param customFetch Optional custom fetch function
 * @returns Object with availability information
 */
export async function checkSlug(slug: string, customFetch?: typeof fetch): Promise<{
    exists: boolean;
    ownedByCurrentUser: boolean;
    ownedByOtherUser: boolean;
    available: boolean;
    slug: string;
}> {
    try {
        const fetchToUse = customFetch || fetch;
        
        const response = await fetchToUse(`/api/slug/check?slug=${encodeURIComponent(slug)}`, {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Failed to check slug: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error checking slug:', error);
        throw error;
    }
} 
```

`src/routes/+layout.js`:

```js
export const prerender = false;
export const ssr = true;
export const trailingSlash = 'never'; 
```

`src/routes/+layout.server.ts`:

```ts
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    user: locals.user
  };
}; 
```

`src/routes/+layout.svelte`:

```svelte
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
```

`src/routes/+page.server.ts`:

```ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
  if (!locals.user?.id) {
    throw error(401, 'Unauthorized');
  }

  const restaurantId = url.searchParams.get('restaurant');

  if (restaurantId) {
    // Load specific restaurant
    const [restaurant] = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (!restaurant) {
      throw error(404, 'Restaurant not found');
    }

    // Verify ownership
    if (restaurant.userId !== locals.user.id) {
      throw error(403, 'Unauthorized');
    }

    return {
      restaurant
    };
  }

  // Load first restaurant for user
  const userRestaurants = await db.select()
    .from(restaurants)
    .where(eq(restaurants.userId, locals.user.id))
    .limit(1);

  return {
    restaurant: userRestaurants[0] || null
  };
}; 
```

`src/routes/+page.svelte`:

```svelte
<script lang="ts">
  import MenuEditor from '$lib/components/menu-editor/MenuEditor.svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import type { PageData } from './$types';

  export let data: PageData;

  // Initialize the current restaurant from server data ok
  $: if (data.restaurant) {
    currentRestaurant.set(data.restaurant);
  }
</script>

<MenuEditor /> 
```

`src/routes/api/auth/apple/+server.ts`:

```ts
// Temporarily disabled - Only using Google auth for now
// import { json } from '@sveltejs/kit';
// import type { RequestEvent } from '@sveltejs/kit';
// import jwt from 'jsonwebtoken';

// export async function POST({ request, cookies }: RequestEvent) {
//   try {
//     const { authorization, user } = await request.json();
    
//     if (!authorization || !authorization.id_token) {
//       return json({ error: 'Missing credentials' }, { status: 400 });
//     }

//     // Verify the identity token
//     const decodedToken = jwt.decode(authorization.id_token) as jwt.JwtPayload;
    
//     if (!decodedToken || !decodedToken.sub) {
//       return json({ error: 'Invalid token' }, { status: 401 });
//     }

//     // Set authentication cookie
//     cookies.set('auth_token', authorization.id_token, {
//       path: '/',
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60 * 24 * 7 // 1 week
//     });

//     return json({ success: true });
//   } catch (error) {
//     console.error('Error processing Apple login:', error);
//     return json({ error: 'Internal server error' }, { status: 500 });
//   }
// }

// // Handle Apple's OAuth callback
// export async function GET({ url, cookies }: RequestEvent) {
//   try {
//     const code = url.searchParams.get('code');
//     const state = url.searchParams.get('state');
    
//     if (!code) {
//       return json({ error: 'Missing authorization code' }, { status: 400 });
//     }

//     // Exchange the authorization code for tokens
//     const tokenResponse = await fetch('https://appleid.apple.com/auth/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded'
//       },
//       body: new URLSearchParams({
//         client_id: 'YOUR_APPLE_CLIENT_ID', // Replace with your Apple Client ID
//         client_secret: 'YOUR_APPLE_CLIENT_SECRET', // Generate this using your private key
//         code,
//         grant_type: 'authorization_code',
//         redirect_uri: `${url.origin}/api/auth/apple/callback`
//       })
//     });

//     const tokens = await tokenResponse.json();

//     if (!tokens.id_token) {
//       return json({ error: 'Failed to obtain tokens' }, { status: 401 });
//     }

//     // Set authentication cookie
//     cookies.set('auth_token', tokens.id_token, {
//       path: '/',
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60 * 24 * 7 // 1 week
//     });

//     // Redirect to home page
//     return new Response(null, {
//       status: 302,
//       headers: {
//         Location: '/'
//       }
//     });
//   } catch (error) {
//     console.error('Error processing Apple callback:', error);
//     return json({ error: 'Internal server error' }, { status: 500 });
//   }
// } 
```

`src/routes/api/auth/auth.server.ts`:

```ts
import type { AuthRequest, AuthResponse } from '$lib/types/server-types';

export class AuthServer {
    async authenticate(request: AuthRequest): Promise<AuthResponse> {
        // Authentication logic
    }
} 
```

`src/routes/api/auth/check/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function GET({ cookies }: RequestEvent) {
  try {
    console.log('GET /api/auth/check - Checking authentication status');
    
    const token = cookies.get('auth_token');
    if (!token) {
      console.log('GET /api/auth/check - No auth token found');
      return json({ 
        authenticated: false,
        message: 'No authentication token found'
      });
    }
    
    console.log('GET /api/auth/check - Auth token found');
    
    // Decode the JWT token
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    
    // Get user from database
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);
    
    if (!user) {
      console.log('GET /api/auth/check - User not found for token');
      return json({ 
        authenticated: false,
        message: 'User not found for token'
      });
    }
    
    console.log(`GET /api/auth/check - User authenticated: ${user.email} (${user.id})`);
    
    return json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error checking authentication:', error);
    return json({ 
      authenticated: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 
```

`src/routes/api/auth/facebook/+server.ts`:

```ts
// Temporarily disabled - Only using Google auth for now
// import { json } from '@sveltejs/kit';
// import type { RequestEvent } from '@sveltejs/kit';

// export async function POST({ request, cookies }: RequestEvent) {
//   try {
//     const { accessToken, userID } = await request.json();
    
//     if (!accessToken || !userID) {
//       return json({ error: 'Missing credentials' }, { status: 400 });
//     }

//     // Verify the access token with Facebook
//     const response = await fetch(`https://graph.facebook.com/v18.0/me?access_token=${accessToken}&fields=id,name,email`);
//     const userData = await response.json();

//     if (userData.id !== userID) {
//       return json({ error: 'Invalid user ID' }, { status: 401 });
//     }

//     // Set authentication cookie
//     cookies.set('auth_token', accessToken, {
//       path: '/',
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 60 * 60 * 24 * 7 // 1 week
//     });

//     return json({ success: true });
//   } catch (error) {
//     console.error('Error processing Facebook login:', error);
//     return json({ error: 'Internal server error' }, { status: 500 });
//   }
// } 
```

`src/routes/api/auth/google/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function POST({ request, cookies }: RequestEvent) {
  try {
    const { credential } = await request.json();
    
    if (!credential) {
      return json({ error: 'No credential provided' }, { status: 400 });
    }

    // Decode the JWT token
    const [, payloadBase64] = credential.split('.');
    const payload = JSON.parse(atob(payloadBase64));

    // Find or create user
    const existingUsers = await db.select().from(users).where(eq(users.email, payload.email)).limit(1);
    
    let dbUser;
    if (!existingUsers.length) {
      // Create new user
      const newUsers = await db.insert(users)
        .values({
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();
      dbUser = newUsers[0];
    } else {
      // Update existing user
      const updatedUsers = await db.update(users)
        .set({
          name: payload.name,
          picture: payload.picture,
          updatedAt: new Date()
        })
        .where(eq(users.email, payload.email))
        .returning();
      dbUser = updatedUsers[0];
    }

    // Store user info in session cookie
    cookies.set('auth_token', credential, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 1 week
    });

    return json({ 
      success: true,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.picture
      }
    });
  } catch (error) {
    console.error('Error processing Google login:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 
```

`src/routes/api/auth/logout/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ cookies }: RequestEvent) {
  try {
    // Eliminar la cookie de sesión
    cookies.delete('auth_token', { path: '/' });
    
    return json({ success: true });
  } catch (error) {
    console.error('Error during logout:', error);
    return json({ error: 'Internal server error' }, { status: 500 });
  }
} 
```

`src/routes/api/auth/me/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function GET({ cookies }: RequestEvent) {
  try {
    const token = cookies.get('auth_token');
    
    if (!token) {
      return json({ user: null });
    }

    // Decode the JWT token
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));

    // Get user from database
    const [user] = await db.select()
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (!user) {
      return json({ user: null });
    }

    return json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
      }
    });
  } catch (error) {
    console.error('Error getting user session:', error);
    return json({ user: null });
  }
} 
```

`src/routes/api/categories/[categoryId]/dishes/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import type { RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories, dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export async function POST({ params, request }: RequestEvent) {
  try {
    const { categoryId } = params;
    
    console.log('Received categoryId:', categoryId); // Debug log
    
    if (!categoryId) {
      return json({ 
        success: false, 
        error: 'Category ID is required' 
      }, { status: 400 });
    }

    const dishData = await request.json();
    console.log('Received dish data:', dishData); // Debug log

    if (!dishData.title) {
      return json({ 
        success: false, 
        error: 'Dish title is required' 
      }, { status: 400 });
    }

    const category = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId))
      .limit(1);

    if (!category.length) {
      return json({ 
        success: false, 
        error: `Category not found with id: ${categoryId}` 
      }, { status: 404 });
    }

    const [newDish] = await db.insert(dishes)
      .values({
        title: dishData.title,
        price: dishData.price,
        description: dishData.description,
        imageUrl: dishData.imageUrl,
        categoryId: categoryId
      })
      .returning();

    return json({ success: true, data: newDish });
  } catch (error) {
    console.error('POST dish error:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error 
    }, { status: 500 });
  }
} 
```

`src/routes/api/categories/[categoryId]/dishes/[dishId]/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { dishId } = params;
    const updatedDish = await request.json();

    const [dish] = await db.update(dishes)
      .set({
        title: updatedDish.title,
        price: updatedDish.price,
        description: updatedDish.description,
        imageUrl: updatedDish.imageUrl,
        updatedAt: new Date()
      })
      .where(eq(dishes.id, dishId))
      .returning();

    if (!dish) {
      return json({ 
        success: false, 
        error: 'Dish not found' 
      }, { status: 404 });
    }

    return json({ 
      success: true, 
      data: dish,
      message: 'Dish updated successfully'
    });
  } catch (error) {
    console.error('Error updating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { dishId } = params;

    const [deletedDish] = await db.delete(dishes)
      .where(eq(dishes.id, dishId))
      .returning();

    if (!deletedDish) {
      return json({ 
        success: false, 
        error: 'Dish not found' 
      }, { status: 404 });
    }

    return json({ 
      success: true, 
      data: deletedDish,
      message: 'Dish deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 
```

`src/routes/api/process-images/+server.ts`:

```ts
import {json} from '@sveltejs/kit';
import OpenAI from "openai";
import type {ChatCompletionContentPart} from 'openai/resources/chat/completions';
import type { RequestEvent } from '@sveltejs/kit';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Configuration constants
const MAX_IMAGES_PER_REQUEST = 8; // Limit the number of images to send to OpenAI
const STREAM_PROGRESS_INTERVAL_MS = 1000; // How often to send progress updates

const DEFAULT_PROMPT = `Por favor, devuelve tu respuesta estrictamente en formato JSON. Analiza las imagenes que te adjunto, la cuales contiene la carta de un restaurante. Extrae y organiza la información de la siguiente forma:
    
    - Identifica las categorías o secciones de la carta (por ejemplo: Entradas, Platos Principales, Postres, Bebidas). Trata de utilizar todo el contenido visible de la imagen, no dejes nada sin procesar que esté relacionado a platos de la carta
    - Para cada categoría, extrae los nombres de los platos y sus respectivos precios.
    - Si hay descripciones adicionales, inclúyelas en el campo "description".
    - Para los precios, utiliza el formato numérico (ejemplo: 10.00) sin símbolos de moneda.
    - Es CRÍTICO que cada plato tenga un título (title) y un precio (price).
    - Si no puedes determinar el precio, usa 0.00 como valor predeterminado.
    - Si no identificas el nombre intenta crear uno corto basado en la informacion que aparece en la tabla
    - IMPORTANTE: Para el número de teléfono, devuelve SOLO los dígitos sin espacios ni caracteres especiales (ejemplo: 34123456789)
    
    Devuelve la información estrictamente en formato JSON. El formato de salida debe ser exactamente como este ejemplo:
    
    {
      "restaurant": {
        name: "Nombre del restaurante",
        logo: "",
        customPrompt: "",
        currency: "€",
        phoneNumber: 34123456789,
        description: "Descripción del restaurante y toda la información relevante como horarios, ubicación, etc."
      },
      categories: [
        {
          name: "Entradas",
          dishes: [
            {
              title: "Ensalada César",
              description: "Con pollo, lechuga y crutones",
              price: 10.00
              allergens: ["pollo", "huevo", "lacteos"],
              portions: "100gr",
    
            },
            {
              title: "Sopa de Mariscos",
              description: "Con pollo, lechuga y crutones",
              price: 12.50,
              allergens: ['lácteos', 'huevo', 'mariscos'],
              portions: "200gr"
            }
          ]
        },
        {
          name: "Platos Principales",
          dishes: [
            {
              title: "Filete de Res",
              description: "Con arroz, papas y vegetales",
              price: 20.00,
              allergens: ["gluten"],
              portions: "200gr"
            }
          ]
        }
      ]
    }
    `;

interface ImageData {
    page: number;
    base64: string;
}

interface RequestData {
    prompt?: string;
    images: ImageData[];
}

export async function POST({ request, locals }: RequestEvent) {
    try {
        const startTime = Date.now();
        console.log('Starting process-images...');

        // Get the current user from locals
        const user = locals.user;
        
        if (!user) {
            return json({ error: 'User not authenticated' }, { status: 401 });
        }

        console.log('Processing request for user:', user.email);

        const {prompt, images}: RequestData = await request.json();
        console.log('Received request:', {
            hasPrompt: !!prompt,
            imagesCount: images.length
        });

        // Sort images by page number to ensure correct order
        const sortedImages = [...images].sort((a, b) => a.page - b.page);
        
        // Limit the number of images to process (to avoid excessive API usage)
        let processedImages: ImageData[];
        if (sortedImages.length > MAX_IMAGES_PER_REQUEST) {
            console.log(`Limiting request to ${MAX_IMAGES_PER_REQUEST} images (received ${sortedImages.length})`);
            processedImages = sortedImages.slice(0, MAX_IMAGES_PER_REQUEST);
        } else {
            processedImages = sortedImages;
        }

        // Calculate total size of base64 data being sent
        const totalBase64Length = processedImages.reduce((sum, img) => sum + img.base64.length, 0);
        console.log(`Total image data size: ${(totalBase64Length / (1024 * 1024)).toFixed(2)}MB`);

        const contentList: ChatCompletionContentPart[] = [
            {
                type: 'text' as const,
                text: prompt || DEFAULT_PROMPT
            },
            ...processedImages.map((img: ImageData) => ({
                type: 'image_url' as const,
                image_url: {url: `data:image/png;base64,${img.base64}`}
            }))
        ];
        console.log('Prepared content for OpenAI:', {
            contentListLength: contentList.length,
            promptLength: (prompt || DEFAULT_PROMPT).length
        });

        console.log('Sending request to OpenAI...');
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente diseñado para extraer información de imágenes y responder estrictamente en formato JSON."
                },
                {
                    role: "user",
                    content: contentList
                }
            ],
            response_format: {
                type: "json_object"
            },
            stream: true,
            store: true,
            temperature: 0
        });

        console.log('OpenAI request sent successfully');
        const encoder = new TextEncoder();
        let generatedAnswer = '';
        
        return new Response(
            new ReadableStream({
                async start(controller) {
                    // Set up a timer to send periodic updates to keep the connection alive
                    // and provide the user with feedback that processing is happening
                    let processStartTime = Date.now();
                    let lastUpdateTime = Date.now();
                    let chunkCount = 0;
                    let isFirstChunk = true;
                    
                    const progressInterval = setInterval(() => {
                        const currentTime = Date.now();
                        const elapsedSecs = (currentTime - processStartTime) / 1000;
                        
                        // Only send status updates if we haven't received data in a while
                        if (currentTime - lastUpdateTime > STREAM_PROGRESS_INTERVAL_MS) {
                            let statusMessage = '';
                            
                            if (elapsedSecs < 5) {
                                statusMessage = 'Starting analysis...';
                            } else if (elapsedSecs < 15) {
                                statusMessage = 'Analyzing menu content...';
                            } else if (elapsedSecs < 30) {
                                statusMessage = 'Processing menu sections...';
                            } else {
                                statusMessage = 'Extracting detailed information...';
                            }
                            
                            controller.enqueue(encoder.encode(`data: [PROGRESS] ${statusMessage}\n\n`));
                        }
                    }, STREAM_PROGRESS_INTERVAL_MS);
                    
                    try {
                        for await (const chunk of stream) {
                            if (chunk.choices && chunk.choices[0].delta?.content) {
                                const text = chunk.choices[0].delta.content;
                                generatedAnswer += text;
                                
                                // Update timing info
                                lastUpdateTime = Date.now();
                                chunkCount++;
                                
                                // For the first chunk, send a notification that processing has started
                                if (isFirstChunk) {
                                    controller.enqueue(encoder.encode(`data: [START] Processing has begun\n\n`));
                                    isFirstChunk = false;
                                }
                                
                                // Every few chunks, send a loading update to keep the connection alive
                                if (chunkCount % 5 === 0) {
                                    controller.enqueue(encoder.encode(`data: [LOADING]\n\n`));
                                }
                            }
                        }
                        
                        clearInterval(progressInterval);
                        
                        let parsedContent = null;
                        try {
                            parsedContent = JSON.parse(generatedAnswer);
                            
                            // Add user information to the response
                            if (parsedContent && typeof parsedContent === 'object') {
                                // Ensure we have a restaurant object
                                if (!parsedContent.restaurant) {
                                    parsedContent.restaurant = {};
                                }
                                
                                // Add user email to the response
                                parsedContent.userEmail = user.email;
                            }
                            
                        } catch (parseError) {
                            console.error('Failed to parse OpenAI response:', {
                                error: parseError,
                                contentPreview: generatedAnswer.substring(0, 200) + '...'
                            });
                            throw new Error('Failed to parse OpenAI response: Invalid JSON format');
                        }

                        console.log('Content parsed successfully:', {
                            hasRestaurant: !!parsedContent.restaurant,
                            categoriesCount: parsedContent.categories?.length,
                            userEmail: parsedContent.userEmail,
                            totalTime: `${((Date.now() - startTime) / 1000).toFixed(1)}s`
                        });

                        controller.enqueue(encoder.encode(`data: [DONE]${JSON.stringify(parsedContent)}`));
                    } catch (streamError) {
                        clearInterval(progressInterval);
                        console.error('Error processing OpenAI stream:', streamError);
                        controller.enqueue(encoder.encode(`data: [ERROR]${JSON.stringify({error: 'Processing error'})}\n\n`));
                    } finally {
                        controller.close();
                    }
                }
            }),
            {headers: {'Content-Type': 'text/event-stream'}}
        );

    } catch (error) {
        console.error('Error en el procesamiento de imágenes:', error);
        return json({error: 'Error procesando la solicitud'}, {status: 500});
    }
}
```

`src/routes/api/restaurants/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, users } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSlug } from '$lib/utils/slug';

async function getUserFromToken(token: string) {
  const [, payloadBase64] = token.split('.');
  const payload = JSON.parse(atob(payloadBase64));
  const [user] = await db.select().from(users).where(eq(users.email, payload.email));
  return user;
}

export async function POST({ request, cookies, fetch }: RequestEvent) {
  try {
    const token = cookies.get('auth_token');
    if (!token) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const { id, name, logo, slug, customPrompt, phoneNumber, color, currency, reservas, redes_sociales } = await request.json();

    if (!name) {
      return json({ 
        success: false, 
        error: 'Restaurant name is required' 
      }, { status: 400 });
    }

    // Use provided slug or generate one from name
    const finalSlug = slug || await generateSlug(name, fetch);

    // Check if a restaurant with this slug already exists for this user
    const existingRestaurant = await db.select()
      .from(restaurants)
      .where(
        and(
          eq(restaurants.slug, finalSlug),
          eq(restaurants.userId, user.id)
        )
      )
      .limit(1);

    if (existingRestaurant.length > 0) {
      return json({ 
        success: false, 
        error: 'A restaurant with this name already exists' 
      }, { status: 400 });
    }

    // Create the new restaurant with the provided ID if available
    const [newRestaurant] = await db.insert(restaurants)
      .values({
        id: id || undefined,
        name,
        slug: finalSlug,
        logo: logo || null,
        customPrompt: customPrompt || null,
        phoneNumber: phoneNumber || null,
        currency: currency || '€',
        color: String(color || '1'),
        userId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
        reservas: reservas || null,
        redes_sociales: redes_sociales || null,
      })
      .returning();

    return json({ 
      success: true, 
      data: newRestaurant 
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to create restaurant',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function GET({ url, cookies }: RequestEvent) {
  try {
    const token = cookies.get('auth_token');
    if (!token) {
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const restaurantId = url.searchParams.get('id');
    
    if (restaurantId) {
      const restaurant = await db.select()
        .from(restaurants)
        .where(eq(restaurants.id, restaurantId))
        .limit(1);

      if (!restaurant.length) {
        return json({ success: false, error: 'Restaurant not found' }, { status: 404 });
      }

      if (restaurant[0].userId !== user.id) {
        return json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }

      return json({ success: true, data: restaurant[0] });
    }
    
    const userRestaurants = await db.select()
      .from(restaurants)
      .where(eq(restaurants.userId, user.id));

    return json({ success: true, data: userRestaurants });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 
```

`src/routes/api/restaurants/[restaurantId]/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq, and, ne } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { generateSlug } from '$lib/utils/slug';
import { users } from '$lib/server/schema';

async function getUserFromToken(token: string) {
  const [, payloadBase64] = token.split('.');
  const payload = JSON.parse(atob(payloadBase64));
  const [user] = await db.select().from(users).where(eq(users.email, payload.email));
  return user;
}

export async function PUT({ params, request, cookies, fetch }: RequestEvent) {
  try {
    const { restaurantId } = params;
    const updateData = await request.json();

    console.log('PUT /api/restaurants/[restaurantId]:', {
      restaurantId,
      updateData
    });

    // Check authentication
    const token = cookies.get('auth_token');
    if (!token) {
      console.log('No auth token found');
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const user = await getUserFromToken(token);
    if (!user) {
      console.log('No user found for token');
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', {
      userId: user.id,
      userEmail: user.email
    });

    // First check if restaurant exists at all
    const [restaurant] = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId as string))
      .limit(1);

    console.log('Restaurant lookup result:', {
      found: !!restaurant,
      restaurant,
      requestedId: restaurantId
    });

    if (!restaurant) {
      return json({ 
        success: false, 
        error: 'Restaurant not found' 
      }, { status: 404 });
    }

    // Then check if it belongs to the user
    if (restaurant.userId !== user.id) {
      console.log('Restaurant ownership mismatch:', {
        restaurantUserId: restaurant.userId,
        requestingUserId: user.id
      });
      return json({ 
        success: false, 
        error: 'Restaurant does not belong to current user' 
      }, { status: 403 });
    }

    // Prepare update data
    const updateSet: any = {
      updatedAt: new Date()
    };

    // Handle name update if provided
    if (updateData.name !== undefined && updateData.name !== restaurant.name) {
      const slug = await generateSlug(updateData.name, fetch);
      
      // Check if name is already taken by another restaurant owned by the same user
      const slugExists = await db.select()
        .from(restaurants)
        .where(
          and(
            eq(restaurants.userId, user.id),
            eq(restaurants.slug, slug),
            ne(restaurants.id, restaurantId as string)
          )
        )
        .limit(1);

      if (slugExists.length > 0) {
        return json({ 
          success: false, 
          error: 'A restaurant with this name already exists' 
        }, { status: 400 });
      }

      updateSet.name = updateData.name;
      updateSet.slug = slug;
    } else if (updateData.slug !== undefined && updateData.slug !== restaurant.slug) {
      // If slug is provided directly and has changed, use it
      updateSet.slug = updateData.slug;
    }

    // Handle logo update if provided
    if (updateData.logo !== undefined) {
      updateSet.logo = updateData.logo;
    }

    // Handle custom prompt update if provided
    if (updateData.customPrompt !== undefined) {
      updateSet.customPrompt = updateData.customPrompt;
    }

    // Handle phone number update if provided
    if (updateData.phoneNumber !== undefined) {
      updateSet.phoneNumber = updateData.phoneNumber;
    }

    // Add currency and color updates
    if (updateData.currency !== undefined) {
      updateSet.currency = updateData.currency;
    }

    if (updateData.color !== undefined) {
      console.log('Before conversion - Color value:', updateData.color, 'type:', typeof updateData.color);
      // Ensure color is saved as a string
      updateSet.color = String(updateData.color);
      console.log('After conversion - Updating restaurant color to:', updateSet.color, 'type:', typeof updateSet.color);
    }
    
    // Add customColor update
    if (updateData.customColor !== undefined) {
      updateSet.customColor = updateData.customColor;
    }

    // Handle new fields update if provided
    if (updateData.reservas !== undefined) {
      // Validate reservas URL
      if (updateData.reservas && typeof updateData.reservas === 'string' && updateData.reservas.startsWith('#')) {
        console.warn('CRITICAL: Detected color value in reservas field in API, resetting to null');
        updateSet.reservas = null;
      } else {
        updateSet.reservas = updateData.reservas;
      }
    }
    
    if (updateData.redes_sociales !== undefined) {
      // Validate redes_sociales URL
      if (updateData.redes_sociales && typeof updateData.redes_sociales === 'string' && updateData.redes_sociales.startsWith('#')) {
        console.warn('CRITICAL: Detected color value in redes_sociales field in API, resetting to null');
        updateSet.redes_sociales = null;
      } else {
        updateSet.redes_sociales = updateData.redes_sociales;
      }
    }

    // Update the restaurant
    const [updatedRestaurant] = await db.update(restaurants)
      .set(updateSet)
      .where(eq(restaurants.id, restaurantId as string))
      .returning();

    return json({ 
      success: true, 
      data: updatedRestaurant 
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update restaurant',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { restaurantId } = params;

    // Delete the restaurant (categories and dishes will be cascade deleted due to foreign key constraints)
    const [deletedRestaurant] = await db.delete(restaurants)
      .where(eq(restaurants.id, restaurantId as string))
      .returning();

    if (!deletedRestaurant) {
      return json({ 
        success: false, 
        error: 'Restaurant not found' 
      }, { status: 404 });
    }

    return json({
      success: true,
      data: deletedRestaurant
    });

  } catch (error) {
    console.error('Error deleting restaurant:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete restaurant',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 
```

`src/routes/api/restaurants/[restaurantId]/categories/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories, restaurants, users } from '$lib/server/schema';
import { eq, and, sql, max, asc } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import { dishes } from '$lib/server/schema';

/**
 * Endpoint POST to find or create a category in a restaurant based on name.
 * @param {RequestEvent} evento - Contains request and params of the petition
 * @returns {Promise<Response>} JSON with the found or created category or error
 */
export async function POST({ request, params, cookies }: RequestEvent) {
  try {
    const data = await request.json();
    const { restaurantId } = params;

    console.log('Finding or creating category with data:', { ...data, restaurantId }); // Debug log

    if (!data.name) {
      return json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    // Validation of restaurant ID
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }

    // Calculate the next order value for this restaurant
    const maxOrderResult = await db.select({ value: max(categories.order) })
      .from(categories)
      .where(eq(categories.restaurantId, restaurantId));

    const nextOrder = (maxOrderResult[0]?.value ?? -1) + 1;
    console.log(`Calculated next order for category: ${nextOrder}`);

    // 1. Try to find an existing category with the same name in this restaurant
    const [existingCategory] = await db.select()
      .from(categories)
      .where(
        and(
          // Case-insensitive comparison might be better, depends on requirements
          // Using lower() might require indexing for performance:
          // eq(sql`lower(${categories.name})`, data.name.toLowerCase()),
          eq(categories.name, data.name),
          eq(categories.restaurantId, restaurantId)
        )
      )
      .limit(1);

    let finalCategory: typeof categories.$inferSelect;
    let message: string;

    if (existingCategory) {
      // 2. If found, return the existing category
      console.log('Found existing category:', existingCategory);
      finalCategory = existingCategory;
      message = 'Category found successfully';
    } else {
      // 3. If not found, insert a new category with the calculated order
      console.log('No existing category found with that name, creating new one...');
      const [newCategory] = await db.insert(categories)
        .values({
          name: data.name,
          restaurantId: restaurantId,
          order: nextOrder
        })
        .returning();

      console.log('Created new category:', newCategory); // Debug log
      finalCategory = newCategory;
      message = 'Category created successfully';
    }

    return json({
      success: true,
      data: finalCategory,
      message: message
    });
  } catch (error) {
    // Detailed error handling
    console.error('Error finding or creating category:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * Endpoint GET para obtener todas las categorías de un restaurante
 * @param {RequestEvent} evento - Contiene los params de la petición
 * @returns {Promise<Response>} JSON con las categorías encontradas o error
 */
export async function GET({ params }: RequestEvent) {
  try {
    const { restaurantId } = params;
    console.log('Fetching categories for restaurant:', restaurantId); // Debug log

    // Validación del ID del restaurante
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }

    // Consultar categorías del restaurante, ordenadas
    const restaurantCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.restaurantId, restaurantId))
      .orderBy(asc(categories.order));

    console.log(`Found ${restaurantCategories.length} categories for restaurant ${restaurantId}`);

    return json({ success: true, data: restaurantCategories });
  } catch (error) {
    // Manejo detallado de errores
    console.error('Error getting categories:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

/**
 * Endpoint DELETE para eliminar una categoría específica
 * @param {RequestEvent} evento - Contiene los params de la petición
 * @returns {Promise<Response>} JSON con la categoría eliminada o error
 */
export async function DELETE({ params }: RequestEvent) {
  try {
    const { restaurantId, categoryId } = params;
    console.log('Deleting category:', { restaurantId, categoryId }); // Debug log
    
    // Validation of category ID
    if (!categoryId || categoryId === 'undefined') {
      return json({ success: false, error: 'Valid category ID is required' }, { status: 400 });
    }

    // Validation of restaurant ID
    if (!restaurantId || restaurantId === 'undefined') {
      return json({ success: false, error: 'Valid restaurant ID is required' }, { status: 400 });
    }

    // Delete category, verifying it belongs to the correct restaurant
    const [deletedCategory] = await db.delete(categories)
      .where(
        and(
          eq(categories.id, categoryId),
          eq(categories.restaurantId, restaurantId)
        )
      )
      .returning();

    // Verificar si se encontró y eliminó la categoría
    if (!deletedCategory) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    console.log('Deleted category:', deletedCategory); // Debug log

    return json({ success: true, data: deletedCategory });
  } catch (error) {
    // Manejo detallado de errores
    console.error('Error deleting category:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 
```

`src/routes/api/restaurants/[restaurantId]/categories/[categoryId]/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories } from '$lib/server/schema';
import { and, eq, ne } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { restaurantId, categoryId } = params;

    if (!data.name || !restaurantId || !categoryId) {
      return json({ success: false, error: 'Category name and IDs are required' }, { status: 400 });
    }

    // Check for existing category with the same name in this restaurant (excluding current category)
    const existingCategory = await db.select()
      .from(categories)
      .where(
        and(
          eq(categories.name, data.name),
          eq(categories.restaurantId, restaurantId as string),
          ne(categories.id, categoryId as string)
        )
      )
      .limit(1);

    if (existingCategory.length > 0) {
      return json({ 
        success: false, 
        error: 'A category with this name already exists in this restaurant'
      }, { status: 409 });
    }

    // Update the category
    const [updatedCategory] = await db.update(categories)
      .set({
        name: data.name,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .returning();

    if (!updatedCategory) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return json({ success: true, data: updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { restaurantId, categoryId } = params;

    if (!restaurantId || !categoryId) {
      return json({ success: false, error: 'Restaurant ID and Category ID are required' }, { status: 400 });
    }

    const [deletedCategory] = await db.delete(categories)
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .returning();

    if (!deletedCategory) {
      return json({ success: false, error: 'Category not found' }, { status: 404 });
    }

    return json({ success: true, data: deletedCategory });
  } catch (error) {
    console.error('Error deleting category:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
```

`src/routes/api/restaurants/[restaurantId]/categories/[categoryId]/dishes/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories } from '$lib/server/schema';
import { and, eq, asc, desc, max } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';
import type { Dish } from '$lib/types/menu.types';

export async function POST({ request, params }: RequestEvent) {
  try {
    const data = await request.json();
    const { categoryId } = params;
    
    // Basic validation
    if (!data.title || !categoryId) {
      return json({ 
        success: false, 
        error: 'Dish title and category ID are required' 
      }, { status: 400 });
    }

    // Calculate the next order value
    const [{ maxOrder }] = await db
      .select({ maxOrder: max(dishes.order) })
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId));

    const nextOrder = (maxOrder ?? -1) + 1;

    // Simple insert
    const [newDish] = await db.insert(dishes)
      .values({
        title: data.title,
        price: data.price || null,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        categoryId,
        order: nextOrder
      })
      .returning();

    return json({ 
      success: true, 
      data: newDish 
    });
  } catch (error) {
    console.error('Error creating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET({ params }: RequestEvent): Promise<Response> {
  try {
    const { restaurantId, categoryId } = params;

    if (!restaurantId || !categoryId) {
      return json({ success: false, error: 'Restaurant ID and Category ID are required' }, { status: 400 });
    }

    // Optional: Verify category exists and belongs to the restaurant (could be skipped for GET)
    const [categoryExists] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(and(eq(categories.id, categoryId), eq(categories.restaurantId, restaurantId)))
      .limit(1);

    if (!categoryExists) {
      return json({ success: false, error: 'Category not found in this restaurant' }, { status: 404 });
    }

    // Explicitly select columns and handle potential nulls to match the Dish type
    const dbDishes = await db
      .select({
        id: dishes.id,
        title: dishes.title,
        imageUrl: dishes.imageUrl,
        price: dishes.price,
        description: dishes.description,
        categoryId: dishes.categoryId,
        order: dishes.order,
        createdAt: dishes.createdAt,
        updatedAt: dishes.updatedAt
      })
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId))
      .orderBy(asc(dishes.order));

    // Map database results
    const categoryDishes = dbDishes.map(dbDish => ({
      ...dbDish,
      imageUrl: dbDish.imageUrl ?? null, // Use null if db value is null, matching Dish type
      price: dbDish.price ?? '', // Use empty string if null, matching non-optional string
      description: dbDish.description ?? '', // Use empty string if null, matching non-optional string
      categoryId: dbDish.categoryId ?? '', // Use empty string if null, assuming categoryId is required in Dish type
      createdAt: dbDish.createdAt ?? new Date(), // Provide default if null
      updatedAt: dbDish.updatedAt ?? new Date() // Provide default if null
    }));

    return json({ success: true, data: categoryDishes });
  } catch (error) {
    console.error('Error fetching dishes:', error);
    return json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch dishes' },
      { status: 500 }
    );
  }
}

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { restaurantId, categoryId, dishId } = params;
    const data = await request.json();

    // Validate that the category exists and belongs to the restaurant
    const existingCategory = await db.select()
      .from(categories)
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .limit(1);

    if (!existingCategory.length) {
      return json({ 
        success: false, 
        error: 'Category not found or does not belong to this restaurant' 
      }, { status: 404 });
    }

    const [updatedDish] = await db.update(dishes)
      .set({
        title: data.title,
        imageUrl: data.imageUrl || null,
        price: data.price || null,
        description: data.description || null,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(dishes.id, dishId as string),
          eq(dishes.categoryId, categoryId as string)
        )
      )
      .returning();

    if (!updatedDish) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    return json({ success: true, data: updatedDish });
  } catch (error) {
    console.error('Error updating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { restaurantId, categoryId, dishId } = params;
    
    // Validate that the category exists and belongs to the restaurant
    const existingCategory = await db.select()
      .from(categories)
      .where(
        and(
          eq(categories.id, categoryId as string),
          eq(categories.restaurantId, restaurantId as string)
        )
      )
      .limit(1);

    if (!existingCategory.length) {
      return json({ 
        success: false, 
        error: 'Category not found or does not belong to this restaurant' 
      }, { status: 404 });
    }

    const [deletedDish] = await db.delete(dishes)
      .where(
        and(
          eq(dishes.id, dishId as string),
          eq(dishes.categoryId, categoryId as string)
        )
      )
      .returning();

    if (!deletedDish) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    return json({ success: true, data: deletedDish });
  } catch (error) {
    console.error('Error deleting dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
```

`src/routes/api/restaurants/[restaurantId]/categories/[categoryId]/dishes/[dishId]/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories } from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export async function PUT({ params, request }: RequestEvent) {
  try {
    const { dishId, categoryId } = params;
    const updatedDish = await request.json();

    console.log('Updating dish:', { dishId, categoryId, updatedDish }); // Debug log

    // Primero verificamos si el plato existe
    const existingDish = await db.select()
      .from(dishes)
      .where(eq(dishes.id, dishId))
      .limit(1);

    if (!existingDish.length) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    // Actualizamos el plato
    const [dish] = await db.update(dishes)
      .set({
        title: updatedDish.title,
        price: updatedDish.price,
        description: updatedDish.description,
        imageUrl: updatedDish.imageUrl,
        categoryId: categoryId // Usamos el categoryId de los params
      })
      .where(eq(dishes.id, dishId))
      .returning();

    if (!dish) {
      return json({ 
        success: false, 
        error: 'Failed to update dish'
      }, { status: 500 });
    }

    // Obtenemos la categoría actualizada con sus platos
    const updatedCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId));

    const response = {
      success: true,
      data: {
        dish,
        category: {
          ...updatedCategory[0],
          dishes: categoryDishes
        }
      },
      message: 'Dish updated successfully'
    };

    console.log('Response:', response); // Debug log
    return json(response);

  } catch (error) {
    console.error('Error updating dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to update dish',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE({ params }: RequestEvent) {
  try {
    const { dishId, categoryId } = params;
    
    // Primero verificamos si el plato existe
    const existingDish = await db.select()
      .from(dishes)
      .where(eq(dishes.id, dishId))
      .limit(1);

    if (!existingDish.length) {
      return json({ success: false, error: 'Dish not found' }, { status: 404 });
    }

    // Eliminamos el plato
    const [deletedDish] = await db.delete(dishes)
      .where(eq(dishes.id, dishId))
      .returning();

    // Obtenemos la categoría actualizada con sus platos
    const updatedCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, categoryId));

    const categoryDishes = await db.select()
      .from(dishes)
      .where(eq(dishes.categoryId, categoryId));

    return json({ 
      success: true, 
      data: {
        dish: deletedDish,
        category: {
          ...updatedCategory[0],
          dishes: categoryDishes
        }
      },
      message: 'Dish deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting dish:', error);
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to delete dish',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 
```

`src/routes/api/restaurants/[restaurantId]/categories/[categoryId]/dishes/dish.api.ts`:

```ts
// Move dish operations here
import { json } from '@sveltejs/kit';
import { connectDB } from '$lib/server/database';
import { Restaurant } from '$lib/server/models/menu';

export const POST = async ({ params, request }) => {
  // ... existing POST logic
};

export const PUT = async ({ params, request }) => {
  // ... existing PUT logic
};

export const DELETE = async ({ params }) => {
  // ... existing DELETE logic
}; 
```

`src/routes/api/restaurants/[restaurantId]/categories/[categoryId]/dishes/order/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { dishes, categories, restaurants, users } from '$lib/server/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

// --- Helper Function to Get User (copy if not already in a shared location) ---
// TODO: Consider moving this to a shared utility file (e.g., $lib/server/authUtils.ts)
async function getUserFromToken(token: string | undefined) {
    if (!token || !token.includes('.')) return null;
    try {
        const [, payloadBase64] = token.split('.');
        const payload = JSON.parse(atob(payloadBase64));
        if (!payload.email) return null;
        const [user] = await db.select().from(users).where(eq(users.email, payload.email));
        return user;
    } catch (error) {
        console.error("Helper getUserFromToken Error:", error);
        return null;
    }
}
// --- End Helper ---

export async function PUT({ request, params, cookies }: RequestEvent): Promise<Response> {
    const { restaurantId, categoryId } = params;
    const token = cookies.get('auth_token');

    // --- Basic Validation ---
    if (!restaurantId || !categoryId) {
        return json({ success: false, error: 'Restaurant ID and Category ID are required' }, { status: 400 });
    }

    // --- Authentication & Authorization ---
    if (!token) {
        return json({ success: false, error: 'Unauthorized - No token' }, { status: 401 });
    }
    const user = await getUserFromToken(token);
    if (!user) {
        return json({ success: false, error: 'Unauthorized - Invalid user' }, { status: 401 });
    }

    // Verify ownership: Check if the category belongs to a restaurant owned by the user
    const [categoryCheck] = await db.select({ catId: categories.id })
        .from(categories)
        .innerJoin(restaurants, eq(categories.restaurantId, restaurants.id))
        .where(and(
            eq(categories.id, categoryId),
            eq(restaurants.id, restaurantId), // Ensure category is in the specified restaurant
            eq(restaurants.userId, user.id)     // Ensure restaurant belongs to the user
        ))
        .limit(1);

    if (!categoryCheck) {
        return json({ success: false, error: 'Category not found or unauthorized' }, { status: 404 });
    }
    // --- End Auth & Authz ---

    try {
        const { orderedDishIds } = await request.json() as { orderedDishIds: string[] };

        if (!Array.isArray(orderedDishIds)) {
            return json({ success: false, error: 'orderedDishIds must be an array' }, { status: 400 });
        }

        let existingDishIds: Set<string> = new Set(); // Declare here to be accessible later

        // Verify all provided dish IDs actually belong to this category *before* updating
        if (orderedDishIds.length > 0) {
            const existingDishes = await db.select({ id: dishes.id })
                .from(dishes)
                .where(and(
                    eq(dishes.categoryId, categoryId),
                    inArray(dishes.id, orderedDishIds)
                ));

            existingDishIds = new Set(existingDishes.map(d => d.id)); // Assign here
            const invalidIds = orderedDishIds.filter(id => !existingDishIds.has(id));

            if (invalidIds.length > 0) {
                 console.error(`API Error: Attempted to reorder dishes not belonging to category ${categoryId}:`, invalidIds);
                 // Return 400 Bad Request if invalid IDs are provided
                 return json({ success: false, error: `Invalid dish IDs provided for category ${categoryId}: ${invalidIds.join(', ')}` }, { status: 400 });
            }
             if (existingDishIds.size !== orderedDishIds.length) {
                 console.warn(`API Warning: Mismatch between provided (${orderedDishIds.length}) and existing (${existingDishIds.size}) dish IDs for category ${categoryId}. Some provided IDs might not exist or be duplicates.`);
                 // Decide if this should be an error or just proceed with valid ones based on requirements
                 // For now, we proceed with the valid ones, but return a 400 if any invalid ones were *also* present (handled above)
             }
        } else {
            // If no dishes were sent, we can consider it a success (nothing to update)
            return json({ success: true, message: 'No dishes to order.' });
        }

        // Update order for each dish based on its index in the received array
        // Using individual updates for simplicity here. A bulk update might be more performant for large lists.
        // Ensure we only update dishes that actually exist and belong to the category
        const validOrderedDishIds = orderedDishIds.filter(id => existingDishIds.has(id)); // Filter based on validated IDs
        const updatePromises = validOrderedDishIds.map((dishId, index) =>
            db.update(dishes)
              .set({ order: index })
              .where(eq(dishes.id, dishId)) // Implicitly ensures it's in the correct category due to earlier checks
        );

        await Promise.all(updatePromises);

        return json({ success: true, message: 'Dish order updated successfully' });

    } catch (error) {
        console.error(`API Error updating dish order for category ${categoryId}:`, error);
        return json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update dish order'
        }, { status: 500 });
    }
} 
```

`src/routes/api/restaurants/[restaurantId]/categories/category.api.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, categories } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * Endpoint GET para obtener las categorías de un restaurante específico
 * @param {Object} params - Contiene restaurantId del restaurante a consultar
 * @returns {Promise<Response>} JSON con las categorías o error
 */
export const GET = async ({ params }) => {
  try {
    const { restaurantId } = params;
    
    // Buscar las categorías del restaurante
    const restaurantCategories = await db.select()
      .from(categories)
      .where(eq(categories.restaurantId, restaurantId));
    
    return json({ success: true, data: restaurantCategories });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};

/**
 * Endpoint POST para agregar una nueva categoría a un restaurante
 * @param {Object} params - Contiene restaurantId del restaurante a modificar
 * @param {Request} request - Contiene los datos de la nueva categoría
 * @returns {Promise<Response>} JSON con la categoría creada o error
 */
export const POST = async ({ params, request }) => {
  try {
    const { restaurantId } = params;
    const data = await request.json();
    
    // Verificar si el restaurante existe
    const restaurant = await db.select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (!restaurant.length) {
      return json({ 
        success: false, 
        error: 'Restaurant not found' 
      }, { status: 404 });
    }

    // Crear nueva categoría
    const [newCategory] = await db.insert(categories)
      .values({
        name: data.name,
        restaurantId: restaurantId
      })
      .returning();

    return json({ success: true, data: newCategory });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}; 
```

`src/routes/api/restaurants/[restaurantId]/categories/order/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { categories, restaurants, users } from '$lib/server/schema';
import { eq, and, inArray } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

// Helper to get user from token (reuse if available elsewhere)
async function getUserFromToken(token: string) {
  // Basic token validation (should be more robust in production)
  if (!token || !token.includes('.')) return null;
  try {
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    // Ensure email exists in payload
    if (!payload.email) return null;
    const [user] = await db.select().from(users).where(eq(users.email, payload.email));
    return user;
  } catch (error) {
    console.error("Error decoding token or fetching user:", error);
    return null;
  }
}

export async function PUT({ request, params, cookies }: RequestEvent) {
  const { restaurantId } = params;
  const token = cookies.get('auth_token');

  // Ensure restaurantId is provided
  if (!restaurantId) {
    return json({ success: false, error: 'Restaurant ID is required' }, { status: 400 });
  }

  if (!token) {
    return json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  const user = await getUserFromToken(token);
  if (!user) {
    // Changed status to 401 as 'User not found' might imply the user exists but wasn't located, 
    // whereas an invalid/expired token or non-existent email should result in Unauthorized.
    return json({ success: false, error: 'Unauthorized: Invalid token or user not found' }, { status: 401 }); 
  }

  // Verify restaurant ownership
  const [restaurant] = await db.select({ id: restaurants.id })
    .from(restaurants)
    .where(and(eq(restaurants.id, restaurantId), eq(restaurants.userId, user.id)))
    .limit(1);

  if (!restaurant) {
    return json({ success: false, error: 'Restaurant not found or unauthorized' }, { status: 404 });
  }

  try {
    const { orderedCategoryIds } = await request.json();

    if (!Array.isArray(orderedCategoryIds)) {
      return json({ success: false, error: 'orderedCategoryIds must be an array' }, { status: 400 });
    }

    // Basic validation: Check if IDs are UUIDs (optional but good practice)
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!orderedCategoryIds.every(id => typeof id === 'string' && uuidRegex.test(id))) {
      return json({ success: false, error: 'Invalid category ID format in the list' }, { status: 400 });
    }
    
    if (orderedCategoryIds.length === 0) {
       console.log("Received empty array for category order update, doing nothing.");
       return json({ success: true, message: 'No categories to reorder.' });
    }

    // Verify all provided category IDs belong to the specified restaurant *before* updating
    // Perform checks directly on 'db' instead of 'tx'
    const existingCategories = await db.select({ id: categories.id })
      .from(categories)
      .where(and(
          eq(categories.restaurantId, restaurantId),
          inArray(categories.id, orderedCategoryIds)
      ));

    const existingCategoryIds = new Set(existingCategories.map(cat => cat.id));
    const invalidIds = orderedCategoryIds.filter(id => !existingCategoryIds.has(id));

    if (invalidIds.length > 0) {
        console.error(`Attempted to reorder categories not belonging to restaurant ${restaurantId}:`, invalidIds);
        // Throw error *before* attempting any updates
        throw new Error(`Invalid category IDs provided: ${invalidIds.join(', ')}`);
    }
      
    if (existingCategoryIds.size !== orderedCategoryIds.length) {
      console.warn("Mismatch between provided IDs and existing IDs for the restaurant. Proceeding with valid ones.");
      // Decide if this should be an error based on desired strictness.
    }

    // Proceed with update only if all IDs are valid and belong to the restaurant
    // Perform updates sequentially directly on 'db'
    for (let i = 0; i < orderedCategoryIds.length; i++) {
      const categoryId = orderedCategoryIds[i];
      await db.update(categories)
        .set({ order: i })
        .where(eq(categories.id, categoryId));
    }

    return json({ success: true, message: 'Category order updated successfully' });

  } catch (error) {
    console.error('Error updating category order:', error);
    // Check if it's an error we threw intentionally from validation
    if (error instanceof Error && error.message.startsWith('Invalid category IDs provided')) {
      return json({ success: false, error: error.message }, { status: 400 });
    }
    return json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update category order'
    }, { status: 500 });
  }
} 
```

`src/routes/api/restaurants/restaurant.api.ts`:

```ts
import { json } from '@sveltejs/kit';
import { db } from '$lib/server/database';
import { restaurants, categories, dishes } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

/**
 * Endpoint GET para obtener todos los restaurantes
 * @returns {Promise<Response>} JSON con los restaurantes o error
 */
export const GET = async () => {
  try {
    const allRestaurants = await db.select().from(restaurants);
    
    // Obtener categorías y platos para cada restaurante
    const restaurantsWithDetails = await Promise.all(
      allRestaurants.map(async (restaurant) => {
        const restaurantCategories = await db.select()
          .from(categories)
          .where(eq(categories.restaurantId, restaurant.id));

        const categoriesWithDishes = await Promise.all(
          restaurantCategories.map(async (category) => {
            const categoryDishes = await db.select()
              .from(dishes)
              .where(eq(dishes.categoryId, category.id));

            return {
              ...category,
              dishes: categoryDishes
            };
          })
        );

        return {
          ...restaurant,
          categories: categoriesWithDishes
        };
      })
    );
    
    return json({ success: true, data: restaurantsWithDetails });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
};

/**
 * Endpoint POST para crear un nuevo restaurante
 * @param {Request} request - Objeto de solicitud HTTP
 */
export const POST = async ({ request }: { request: Request }) => {
  try {
    const data = await request.json();
    
    // Generate a slug from the name if not provided
    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-');
    
    // Check if userId is provided
    if (!data.userId) {
      return json({ 
        success: false, 
        error: 'User ID is required' 
      }, { status: 400 });
    }
    
    const [newRestaurant] = await db.insert(restaurants)
      .values({
        name: data.name,
        slug: slug,
        userId: data.userId,
        logo: data.logo || null,
        customPrompt: data.customPrompt || null,
        phoneNumber: data.phoneNumber || null,
        currency: data.currency || '€',
        color: data.color || 1
      })
      .returning();

    return json({ success: true, data: newRestaurant });
  } catch (error) {
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}; 
```

`src/routes/api/seed/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '$lib/server/schema';
import { eq, and } from 'drizzle-orm';
import { generateSlug } from '$lib/utils/slug';
import { join } from 'path';

export async function POST({ request, cookies, fetch }: RequestEvent) {
  try {
    console.log('Starting seed process...');
    
    // Get the auth token
    const token = cookies.get('auth_token');
    if (!token) {
      console.error('No auth token found');
      return json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the JWT token to get user info
    const [, payloadBase64] = token.split('.');
    const payload = JSON.parse(atob(payloadBase64));
    console.log('User from token:', { email: payload.email });

    // Initialize database connection
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found in environment');
      throw new Error('DATABASE_URL environment variable is required');
    }

    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql, { schema });
    console.log('Database connection initialized');

    // Get user from database
    const [user] = await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, payload.email));

    if (!user) {
      console.error('User not found in database:', { email: payload.email });
      return json({ success: false, error: 'User not found' }, { status: 404 });
    }
    console.log('User found:', { id: user.id, email: user.email });

    // Get request data
    const { fileName, restaurantName, customPrompt, restaurantId } = await request.json();
    console.log('Request data:', { fileName, restaurantName, hasCustomPrompt: !!customPrompt, restaurantId });

    if (!fileName || !restaurantName) {
      console.error('Missing required fields:', { fileName: !!fileName, restaurantName: !!restaurantName });
      return json({ 
        success: false, 
        error: 'File name and restaurant name are required' 
      }, { status: 400 });
    }

    // Import the restaurant data file
    console.log('Attempting to import restaurant data from:', fileName);
    let seedData;
    try {
      const { seedData: importedData } = await import(/* @vite-ignore */ `/static/data/restaurants/${fileName}`);
      seedData = importedData;
      console.log('Restaurant data imported successfully');
      
      if (!seedData) {
        console.error('No seed data found in imported file');
        return json({ 
          success: false, 
          error: 'No seed data found in file' 
        }, { status: 400 });
      }
      console.log('Seed data structure:', {
        hasRestaurant: !!seedData.restaurant,
        categoriesCount: seedData.categories?.length
      });
    } catch (importError) {
      console.error('Error importing restaurant data:', importError);
      return json({ 
        success: false, 
        error: 'Failed to import restaurant data file',
        details: importError instanceof Error ? importError.message : 'Unknown import error'
      }, { status: 500 });
    }

    let restaurant;

    // Check if we're updating an existing restaurant
    if (restaurantId) {
      // Verify the restaurant exists and belongs to the user
      const [existingRestaurant] = await db.select()
        .from(schema.restaurants)
        .where(
          and(
            eq(schema.restaurants.id, restaurantId),
            eq(schema.restaurants.userId, user.id)
          )
        );

      if (!existingRestaurant) {
        console.error('Restaurant not found or does not belong to user:', { restaurantId });
        return json({ 
          success: false, 
          error: 'Restaurant not found or unauthorized' 
        }, { status: 404 });
      }

      // Delete existing categories and dishes
      const existingCategories = await db.select()
        .from(schema.categories)
        .where(eq(schema.categories.restaurantId, restaurantId));

      for (const category of existingCategories) {
        // Delete dishes in category
        await db.delete(schema.dishes)
          .where(eq(schema.dishes.categoryId, category.id));
      }

      // Delete categories
      await db.delete(schema.categories)
        .where(eq(schema.categories.restaurantId, restaurantId));

      // Update existing restaurant
      [restaurant] = await db.update(schema.restaurants)
        .set({
          name: restaurantName,
          customPrompt: customPrompt || seedData.restaurant.customPrompt || null,
          updatedAt: new Date()
        })
        .where(eq(schema.restaurants.id, restaurantId))
        .returning();

      console.log('Updated existing restaurant:', restaurant);
    } else {
      // Generate slug for new restaurant
      const slug = await generateSlug(restaurantName, fetch);
      console.log('Generated slug:', slug);

      // Create new restaurant
      [restaurant] = await db.insert(schema.restaurants)
        .values({
          name: restaurantName,
          slug,
          userId: user.id,
          logo: seedData.restaurant.logo || null,
          customPrompt: customPrompt || seedData.restaurant.customPrompt || null
        })
        .returning();
      console.log('Created new restaurant:', restaurant);
    }

    // Create categories and dishes
    console.log('Creating categories and dishes...');
    try {
      for (const categoryData of seedData.categories) {
        console.log('Creating category:', categoryData.name);
        const [category] = await db.insert(schema.categories)
          .values({
            name: categoryData.name,
            restaurantId: restaurant.id
          })
          .returning();

        if (categoryData.dishes) {
          console.log(`Creating ${categoryData.dishes.length} dishes for category:`, category.name);
          for (const dishData of categoryData.dishes) {
            await db.insert(schema.dishes)
              .values({
                ...dishData,
                categoryId: category.id,
                imageUrl: dishData.imageUrl || null
              })
              .returning();
          }
        }
      }
      console.log('All categories and dishes created successfully');
    } catch (dbError) {
      console.error('Error creating categories or dishes:', dbError);
      throw dbError;
    }

    console.log('Seed process completed successfully');
    return json({ 
      success: true, 
      data: {
        restaurant,
        message: 'Restaurant data seeded successfully'
      }
    });
  } catch (error) {
    console.error('Error in seed endpoint:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to seed restaurant data',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 
```

`src/routes/api/slug/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { and, eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const { name } = await request.json();
        
        if (!name?.trim()) {
            return json({ error: 'Valid name parameter is required' }, { status: 400 });
        }

        // Get the current user ID from session
        const userId = locals.user?.id;
        if (!userId) {
            return json({ error: 'Authentication required' }, { status: 401 });
        }

        // Generate base slug - moved to separate function for clarity
        const baseSlug = generateBaseSlug(name);
        
        // Try simple slug first
        const existingRestaurants = await db.select()
            .from(restaurants)
            .where(eq(restaurants.slug, baseSlug));

        // If slug doesn't exist, use it directly
        if (existingRestaurants.length === 0) {
            return json({ slug: baseSlug });
        }

        // If slug exists but only for current user, add counter
        if (existingRestaurants.every(r => r.userId === userId)) {
            const slug = await generateCounterSlug(baseSlug, userId);
            return json({ slug });
        }

        // If slug exists for another user, add random suffix
        const slug = generateRandomSlug(baseSlug);
        return json({ slug });

    } catch (error) {
        console.error('Error generating slug:', error);
        return json({ error: 'Failed to generate slug' }, { status: 500 });
    }
};

// Helper functions
function generateBaseSlug(name: string): string {
    return name.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

async function generateCounterSlug(baseSlug: string, userId: string): Promise<string> {
    let counter = 1;
    let slug: string;
    
    do {
        slug = `${baseSlug}-${counter}`;
        const exists = await db.select()
            .from(restaurants)
            .where(eq(restaurants.slug, slug))
            .then(results => results.length > 0);
            
        if (!exists) break;
        counter++;
    } while (counter < 100); // Safeguard against infinite loops
    
    return slug;
}

function generateRandomSlug(baseSlug: string): string {
    const randomSuffix = Math.random().toString(36).substring(2, 7);
    return `${baseSlug}-${randomSuffix}`;
} 
```

`src/routes/api/slug/check/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/database';
import { restaurants } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

export const GET: RequestHandler = async ({ url, locals }) => {
    const slug = url.searchParams.get('slug');
    
    if (!slug) {
        return json({ error: 'Slug parameter is required' }, { status: 400 });
    }

    // Get the current user ID from session
    const userId = locals.user?.id;
    
    if (!userId) {
        return json({ error: 'Authentication required' }, { status: 401 });
    }

    try {
        // Check if slug exists in the database
        const existingRestaurants = await db.select()
            .from(restaurants)
            .where(eq(restaurants.slug, slug));

        // Check if the slug is used by the current user or another user
        const ownedByCurrentUser = existingRestaurants.some(r => r.userId === userId);
        const ownedByOtherUser = existingRestaurants.some(r => r.userId !== userId);

        return json({ 
            exists: existingRestaurants.length > 0,
            ownedByCurrentUser,
            ownedByOtherUser,
            available: existingRestaurants.length === 0,
            slug
        });
    } catch (error) {
        console.error('Error checking slug:', error);
        return json({ error: 'Failed to check slug' }, { status: 500 });
    }
}; 
```

`src/routes/api/upload/+server.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { put } from '@vercel/blob';
import { translations } from '$lib/i18n/translations';
import { language } from '$lib/stores/language';
import { get } from 'svelte/store';
import env from '$lib/config/env';

export async function POST({ request }: RequestEvent) {
  const currentLanguage = get(language);
  const t = (key: string) => translations[key][currentLanguage];

  try {
    const data = await request.formData();
    const file = data.get('file') as File;
    
    if (!file) {
      return json({ success: false, error: t('noFileUploaded') }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return json({ success: false, error: t('invalidFileType') }, { status: 400 });
    }

    // Validate file size (max 4MB)
    const maxSize = 4 * 1024 * 1024; // 4MB in bytes
    if (file.size > maxSize) {
      return json({ success: false, error: t('fileTooLarge') }, { status: 400 });
    }

    try {
      // Upload to Vercel Blob Storage with token
      const { url } = await put(file.name, file, {
        access: 'public',
        token: env.BLOB_READ_WRITE_TOKEN
      });

      console.log('File uploaded to Vercel Blob, URL:', url); // Debug log
      
      return json({ 
        success: true, 
        url,
        message: t('fileUploadSuccess')
      });
    } catch (uploadError) {
      console.error('Vercel Blob upload error:', uploadError);
      return json({ 
        success: false, 
        error: t('fileUploadError'),
        details: uploadError instanceof Error ? uploadError.message : 'Upload failed'
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing upload request:', error);
    return json({ 
      success: false, 
      error: t('fileUploadError'),
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
```

`src/routes/api/upload/upload.api.ts`:

```ts
import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const POST = async ({ request }: RequestEvent) => {
  // ... existing upload logic
}; 
```

`src/routes/login/+page.svelte`:

```svelte
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
            <p class="text-gray-700 font-medium text-lg mb-4">{t('haveQuestions')}</p>
            <div class="flex flex-col sm:flex-row justify-center gap-3">
              <a 
                href="https://calendly.com/fernando-lqrb/15min" 
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
          <iframe
            src="https://santocdmx.reco.restaurant"
            title="Demo Preview"
            class="w-full h-full rounded-[40px] bg-white"
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
  <link rel="preload" href="https://santocdmx.reco.restaurant" as="document">
</svelte:head> 
```

`src/routes/pdftoimages/+page.svelte`:

```svelte
<script>
    // @ts-nocheck
    import * as pdfjsLib from 'pdfjs-dist';

    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

    let images = [];
    let prompt = ""; // Define aquí el prompt que necesites
    let loading = false;
    let serverResponse = "";

    async function handleFileChange(event) {
        const files = event.target.files;
        if (!files.length) return;

        images = [];
        for (const file of files) {
            if (file.type === 'application/pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(new Uint8Array(arrayBuffer)).promise;

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({scale: 2});
                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    await page.render({canvasContext: context, viewport}).promise;

                    const dataURL = canvas.toDataURL('image/png');
                    images.push({page: pageNum, dataURL});
                }
            } else if (file.type.startsWith('image/')) {
                const dataURL = await convertToBase64(file);
                images.push({page: images.length + 1, dataURL});
            }
        }
        images = [...images];
    }

    async function handleCameraCapture(event) {
        const file = event.target.files[0];
        if (!file) return;

        const dataURL = await convertToBase64(file);
        images.push({page: images.length + 1, dataURL});
        images = [...images];
    }

    async function convertToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function removeImage(index) {
        images.splice(index, 1);
        images = [...images];
    }

    async function sendImagesToServer() {
        if (images.length === 0) {
            alert("No hay imágenes para enviar");
            return;
        }

        loading = true;
        serverResponse = "";

        const payload = {
            prompt,
            images: images.map(img => ({
                page: img.page,
                base64: img.dataURL.split(',')[1]
            }))
        };

        try {
            const response = await fetch('/api/process-images', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
                credentials: 'include'
            });
            const data = await response.json();
            serverResponse = data;
        } catch (error) {
            console.error("Error al enviar imágenes al servidor:", error);
            serverResponse = "Error al procesar las imágenes.";
        } finally {
            loading = false;
        }
    }
</script>


<style>
    .file-input-container {
        position: relative;
        display: inline-block;
    }

    .file-input {
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .file-input-label {
        display: inline-block;
        padding: 10px 20px;
        color: white;
        cursor: pointer;
        border: none;
        font-size: 16px;
    }

    .image-container {
        display: inline-block;
        margin: 0.5rem;
        position: relative;
    }

    img {
        max-width: 400px;
        border: 1px solid #ccc;
    }

    .remove-button {
        position: absolute;
        top: 5px;
        right: 5px;
        background-color: #2b2b2b;
        color: white;
        border: none;
        width: 25px;
        cursor: pointer;
        font-size: 12px;
        padding: 5px;
    }

    .send-button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        cursor: pointer;
        font-size: 16px;
    }

    .send-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .loading {
        font-size: 16px;
        color: #555;
    }
</style>

<div class="file-input-container">
    <label class="file-input-label px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium" for="file-input-general">🗂️ Seleccionar archivos</label>
    <input type="file" id="file-input-general" class="file-input" accept="application/pdf,image/*" multiple
           on:change={handleFileChange}/>
</div>

<div class="file-input-container">
    <label class="file-input-label px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium" for="file-input-camera">📷 Capturar imagen</label>
    <input type="file" id="file-input-camera" class="file-input" accept="image/*" capture="camera"
           on:change={handleCameraCapture}/>
</div>
<div id="image-display">
    {#if images.length > 0}
        <div>
            {#each images as img, index}
                <div class="image-container">
                    <p>Página {img.page}</p>
                    <img src={img.dataURL} alt="Página del PDF"/>
                    <button class="remove-button" on:click={() => removeImage(index)}>×</button>
                </div>
            {/each}
        </div>
        <button class="send-button" on:click={sendImagesToServer} disabled={loading}>Enviar imágenes a ChatGPT</button>
    {/if}
</div>

{#if loading}
    <div class="loading">Cargando...</div>
{/if}

{#if serverResponse}
    <div class="server-response">{serverResponse}</div>
{/if}
```