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