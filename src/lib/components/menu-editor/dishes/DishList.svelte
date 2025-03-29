<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuStore } from '$lib/stores';
  import DishItem from './DishItem.svelte';
  import DishForm from './DishForm.svelte';
  import { currentRestaurant } from '$lib/stores/restaurant';

  export let dishes: Dish[] = [];
  export let categoryId: string;
  export let currency: string = '€';

  const dispatch = createEventDispatcher<{
    update: Dish[];
  }>();

  let editingDish: Dish | null = null;

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

  // Keep track of dishes by ID to prevent duplicates
  $: dishMap = new Map(dishes.map(dish => [dish.id, dish]));

  async function handleDishAdd(event: CustomEvent<Dish>) {
    const newDish = event.detail;
    
    // Update map and convert back to array
    dishMap.set(newDish.id, newDish);
    dishes = Array.from(dishMap.values());
    
    dispatch('update', dishes);
  }

  async function handleDishUpdate(event: CustomEvent<Dish>) {
    const updatedDish = event.detail;
    
    // Update map and convert back to array
    dishMap.set(updatedDish.id, updatedDish);
    dishes = Array.from(dishMap.values());
    
    dispatch('update', dishes);
    editingDish = null;
  }

  async function handleDishDelete(event: CustomEvent<string>) {
    const dishId = event.detail;
    
    // Remove from map and update array
    dishMap.delete(dishId);
    dishes = Array.from(dishMap.values());
    
    dispatch('update', dishes);
  }

  function startEditing(dish: Dish) {
    editingDish = dish;
  }

  function cancelEditing() {
    editingDish = null;
  }
</script>

<div class="space-y-4">
  {#each dishes as dish (dish.id)}
    <DishItem
      {dish}
      isEditing={editingDish?.id === dish.id}
      {categoryId}
      {currency}
      on:edit={() => startEditing(dish)}
      on:update={handleDishUpdate}
      on:delete={handleDishDelete}
    />
  {/each}

  <DishForm
    {categoryId}
    {currency}
    on:add={handleDishAdd}
  />
</div> 