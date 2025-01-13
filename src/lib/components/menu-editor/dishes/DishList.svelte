<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import DishItem from './DishItem.svelte';
  import DishForm from './DishForm.svelte';

  export let dishes: Dish[] = [];
  export let categoryId: string;

  const dispatch = createEventDispatcher<{
    update: Dish[];
  }>();

  let editingDish: Dish | null = null;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Keep track of dishes by ID to prevent duplicates
  $: dishMap = new Map(dishes.map(dish => [dish.id, dish]));

  async function handleDishAdd(event: CustomEvent<Dish>) {
    const newDish = event.detail;
    menuCache.updateDish(newDish.id, 'create', newDish);
    
    // Update map and convert back to array
    dishMap.set(newDish.id, newDish);
    dishes = Array.from(dishMap.values());
    
    dispatch('update', dishes);
  }

  async function handleDishUpdate(event: CustomEvent<Dish>) {
    const updatedDish = event.detail;
    menuCache.updateDish(updatedDish.id, 'update', updatedDish);
    
    // Update map and convert back to array
    dishMap.set(updatedDish.id, updatedDish);
    dishes = Array.from(dishMap.values());
    
    dispatch('update', dishes);
    editingDish = null;
  }

  async function handleDishDelete(event: CustomEvent<string>) {
    const dishId = event.detail;
    const dish = dishMap.get(dishId);
    if (dish) {
      menuCache.updateDish(dishId, 'delete', dish);
      
      // Remove from map and update array
      dishMap.delete(dishId);
      dishes = Array.from(dishMap.values());
      
      dispatch('update', dishes);
    }
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
      on:edit={() => startEditing(dish)}
      on:update={handleDishUpdate}
      on:delete={() => handleDishDelete(new CustomEvent('delete', { detail: dish.id }))}
    />
  {/each}

  <DishForm
    {categoryId}
    on:add={handleDishAdd}
  />
</div> 