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
  import { page } from '$app/stores';

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

  function toggleCategory(index: number) {
    const category = localCategories[index];
    if (!category) return;
    selectedCategoryId = selectedCategoryId === category.id ? null : category.id;
  }

  function handleDndConsider(e: CustomEvent<DndEvent<Category>>) {
    isDragging = true;
    localCategories = e.detail.items;
  }

  async function handleDndFinalize(e: CustomEvent<DndEvent<Category>>) {
    isDragging = false;
    const newOrderedCategories = e.detail.items;
    const originalOrder = [...localCategories];
    localCategories = newOrderedCategories;

    menuStore.reorderCategories(newOrderedCategories);
    dispatch('update', newOrderedCategories);

    const orderedCategoryIds = newOrderedCategories.map((cat) => cat.id);
    const restaurantId = selectedRestaurant;

    if (!restaurantId) {
      console.error('Restaurant ID is missing, cannot reorder categories.');
      toasts.error(t('error') + ': ' + t('missingRestaurantId'));
      localCategories = originalOrder;
      menuStore.reorderCategories(originalOrder);
      dispatch('update', originalOrder);
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${restaurantId}/categories/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderedCategoryIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Category reorder successful:', result.message);
    } catch (error) {
      console.error('Error reordering categories:', error);
      toasts.error(t('error') + ': ' + (error instanceof Error ? error.message : t('reorderCategoriesError')));
      
      localCategories = originalOrder;
      menuStore.reorderCategories(originalOrder);
      dispatch('update', originalOrder);
    }
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
          on:toggle={() => toggleCategory(index)}
        />
      </div>
    {/each}
  </div>
</div> 