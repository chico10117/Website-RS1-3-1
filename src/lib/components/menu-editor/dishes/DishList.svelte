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

  export let dishes: Dish[] = [];
  export let categoryId: string;
  export let currency: string = '€';

  const dispatch = createEventDispatcher<{
    update: Dish[];
  }>();

  let editingDish: Dish | null = null;
  let localDishes: Dish[] = dishes;
  let isDragging = false;
  const flipDurationMs = 300;

  $: if (!isDragging && JSON.stringify(dishes) !== JSON.stringify(localDishes)) {
    localDishes = dishes;
  }

  $: currentLanguage = $language;
  $: t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][currentLanguage] || key;
  };

  $: if ($currentRestaurant && $currentRestaurant.currency) {
    currency = $currentRestaurant.currency;
  }

  $: dishMap = new Map(dishes.map(dish => [dish.id, dish]));

  async function handleDishAdd(event: CustomEvent<Dish>) {
    const newDish = event.detail;
    
    dishMap.set(newDish.id, newDish);
    dishes = Array.from(dishMap.values());
    
    dispatch('update', dishes);
  }

  async function handleDishUpdate(event: CustomEvent<Dish>) {
    const updatedDish = event.detail;
    
    dishMap.set(updatedDish.id, updatedDish);
    dishes = Array.from(dishMap.values());
    
    dispatch('update', dishes);
    editingDish = null;
  }

  async function handleDishDelete(event: CustomEvent<string>) {
    const dishId = event.detail;
    
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

  function handleDndConsider(e: CustomEvent<DndEvent<Dish>>) {
    isDragging = true;
    localDishes = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<DndEvent<Dish>>) {
    isDragging = false;
    localDishes = e.detail.items;
    menuStore.reorderDishes(categoryId, localDishes);
    dispatch('update', localDishes);
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