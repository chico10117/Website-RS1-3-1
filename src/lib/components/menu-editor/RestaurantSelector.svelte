<script lang="ts">
  import { onMount } from 'svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';
  import type { Restaurant, Category } from '$lib/types/menu.types';
  import { Button } from '$lib/components/ui/button';
  import { goto } from '$app/navigation';
  import { menuCache } from '$lib/stores/menu-cache';
  import { menuState } from '$lib/stores/menu-state';
  import * as categoryService from '$lib/services/category.service';
  import * as dishService from '$lib/services/dish.service';

  let restaurants: Restaurant[] = [];
  let loading = true;
  let error: string | null = null;
  let switchingRestaurant: string | null = null;

  onMount(async () => {
    try {
      loading = true;
      // Clear all state on page load
      menuCache.clearCache();
      menuState.reset();
      menuState.updateRestaurantInfo('', null);
      menuState.updateCategories([]);
      currentRestaurant.set(null);
      
      // Load restaurants
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
      
      // Clear previous state
      menuCache.clearCache();
      menuState.reset();
      
      // Load the restaurant data
      await currentRestaurant.loadRestaurant(restaurant.id);
      
      // Update URL without reloading
      const url = new URL(window.location.href);
      url.searchParams.set('restaurant', restaurant.id);
      window.history.replaceState({}, '', url.toString());
      
      // Load categories and dishes
      const categories = await categoryService.fetchCategories(restaurant.id);
      const categoriesWithDishes = await Promise.all(
        categories.map(async (category: Category) => {
          const dishes = await dishService.fetchDishes(restaurant.id, category.id);
          return { ...category, dishes };
        })
      );
      
      // Update menu state
      menuState.updateRestaurantInfo(restaurant.name, restaurant.logo);
      menuState.updateCategories(categoriesWithDishes);
      
    } catch (err) {
      console.error('Error switching restaurant:', err);
      error = err instanceof Error ? err.message : 'Failed to switch restaurant';
    } finally {
      switchingRestaurant = null;
    }
  }

  async function handleAddRestaurant() {
    // Clear current restaurant
    menuCache.clearCache();
    menuState.reset();
    menuState.updateRestaurantInfo('', null);
    menuState.updateCategories([]);
    currentRestaurant.set(null);
  }
</script>

<div class="w-full max-w-screen-xl mx-auto mt-8 px-4">
  <div class="bg-black/30 backdrop-blur-md rounded-lg border border-white/10 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-white">Your Restaurants</h2>
      <Button
        variant="outline"
        class="bg-white/5 text-white hover:bg-white/10 hover:text-white"
        on:click={handleAddRestaurant}
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