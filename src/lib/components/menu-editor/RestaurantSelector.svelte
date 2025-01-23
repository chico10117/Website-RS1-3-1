<script lang="ts">
  import { onMount } from 'svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import type { Restaurant } from '$lib/types/menu.types';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';

  let restaurants: Restaurant[] = [];
  let loading = true;
  let error: string | null = null;
  let switchingRestaurant: string | null = null;

  onMount(async () => {
    try {
      loading = true;
      restaurants = await currentRestaurant.loadRestaurants();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Failed to load restaurants';
    } finally {
      loading = false;
    }
  });

  async function handleRestaurantSelect(restaurant: Restaurant) {
    try {
      switchingRestaurant = restaurant.id;
      await currentRestaurant.loadRestaurant(restaurant.id);
      // Use replaceState to avoid adding to browser history
      goto(`/?restaurant=${restaurant.id}`, { 
        replaceState: true,
        invalidateAll: true // Force SvelteKit to reload data
      });
    } catch (err) {
      console.error('Error switching restaurant:', err);
      error = err instanceof Error ? err.message : 'Failed to switch restaurant';
    } finally {
      switchingRestaurant = null;
    }
  }
</script>

<div class="w-full max-w-screen-xl mx-auto mt-8 px-4">
  <div class="bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-white">Your Restaurants</h2>
      <Button
        variant="outline"
        class="bg-white/5 text-white hover:bg-white/10 hover:text-white"
        on:click={() => goto('/restaurants/new')}
      >
        Add Restaurant
      </Button>
    </div>
    
    {#if loading}
      <p class="text-white/70">Loading restaurants...</p>
    {:else if error}
      <p class="text-red-400">{error}</p>
    {:else if restaurants.length === 0}
      <p class="text-white/70">No restaurants found</p>
    {:else}
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {#each restaurants as restaurant (restaurant.id)}
          <Button
            variant="ghost"
            class="w-full justify-start text-white hover:text-white hover:bg-white/10 h-auto py-4"
            on:click={() => handleRestaurantSelect(restaurant)}
            disabled={switchingRestaurant === restaurant.id}
          >
            <div class="flex items-center gap-3">
              {#if restaurant.logo}
                <img 
                  src={restaurant.logo} 
                  alt={restaurant.name} 
                  class="w-10 h-10 rounded-full object-cover"
                />
              {:else}
                <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <span class="text-lg font-medium text-white">
                    {restaurant.name[0].toUpperCase()}
                  </span>
                </div>
              {/if}
              <span class="truncate font-medium">
                {restaurant.name}
                {#if switchingRestaurant === restaurant.id}
                  <span class="ml-2 text-sm opacity-70">Loading...</span>
                {/if}
              </span>
            </div>
          </Button>
        {/each}
      </div>
    {/if}
  </div>
</div> 