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