<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category, Dish } from '$lib/types/menu.types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import CategoryItem from './CategoryItem.svelte';
  import AddCategory from './AddCategory.svelte';
  import { toasts } from '$lib/stores/toast';

  export let categories: Category[] = [];
  export let selectedRestaurant: string | null;
  export let restaurantName: string = '';

  const dispatch = createEventDispatcher<{
    update: Category[];
  }>();

  let selectedCategoryId: string | null = null;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Keep track of categories by ID to prevent duplicates
  $: categoryMap = new Map(categories.map(cat => [cat.id, cat]));
  $: orderedCategories = Array.from(categoryMap.values());
  $: categoryNameMap = new Map(orderedCategories.map(cat => [cat.name.toLowerCase(), cat.id]));

  function isCategoryNameDuplicate(name: string, excludeId?: string): boolean {
    const existingId = categoryNameMap.get(name.toLowerCase());
    return existingId !== undefined && existingId !== excludeId;
  }

  async function handleCategoryAdd(event: CustomEvent<Category>) {
    const category = event.detail;
    
    // Check for duplicate name
    if (isCategoryNameDuplicate(category.name)) {
      toasts.error(t('error') + ': ' + t('categoryNameExists'));
      return;
    }
    
    // Update cache
    menuCache.updateCategory(category.id, 'create', category);
    
    // Update the map and convert back to array
    categoryMap.set(category.id, category);
    categories = Array.from(categoryMap.values());
    
    dispatch('update', categories);
    // Automatically select the new category
    selectedCategoryId = category.id;
  }

  async function handleCategoryUpdate(event: CustomEvent<{ index: number; category: Category }>) {
    const { category } = event.detail;
    
    // Get the existing category
    const existingCategory = categoryMap.get(category.id);
    
    // Only check for duplicate names if the name is actually changing
    if (existingCategory && category.name !== existingCategory.name) {
      if (isCategoryNameDuplicate(category.name, category.id)) {
        toasts.error(t('error') + ': ' + t('categoryNameExists'));
        return;
      }
    }
    
    // Ensure we have the restaurantId
    if (!category.restaurantId && selectedRestaurant) {
      category.restaurantId = selectedRestaurant;
    }
    
    const updatedCategory = {
      ...(existingCategory || {}),
      ...category,
      // Ensure dishes are properly handled
      dishes: category.dishes || existingCategory?.dishes || []
    };
    
    // Update cache with appropriate action
    menuCache.updateCategory(updatedCategory.id, 'update', updatedCategory);
    
    // Update the map and convert back to array
    categoryMap.set(updatedCategory.id, updatedCategory);
    categories = Array.from(categoryMap.values());
    
    dispatch('update', categories);
  }

  async function handleCategoryDelete(event: CustomEvent<number>) {
    const index = event.detail;
    const category = orderedCategories[index];
    
    // Update cache to delete the category
    menuCache.updateCategory(category.id, 'delete', category);
    
    // Also mark all dishes in this category for deletion
    if (category.dishes) {
      for (const dish of category.dishes) {
        menuCache.updateDish(dish.id, 'delete', dish);
      }
    }
    
    // Remove from map and update array
    categoryMap.delete(category.id);
    categories = Array.from(categoryMap.values());
    
    if (selectedCategoryId === category.id) {
      selectedCategoryId = null;
    }
    dispatch('update', categories);
  }

  function toggleCategory(index: number) {
    const category = orderedCategories[index];
    selectedCategoryId = selectedCategoryId === category.id ? null : category.id;
  }

  function handleAddCategory(event: CustomEvent<string>) {
    const categoryName = event.detail.trim();
    const existingCategory = categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    
    if (existingCategory) {
      toasts.error(t('error') + ': ' + t('categoryNameExists'));
      return;
    }

    // ... rest of the function ...
  }

  function handleUpdateCategory(event: CustomEvent<{ id: string; name: string }>) {
    const { id, name } = event.detail;
    const existingCategory = categories.find(c => 
      c.id !== id && c.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingCategory) {
      toasts.error(t('error') + ': ' + t('categoryNameExists'));
      return;
    }

    // ... rest of the function ...
  }
</script>

<div class="space-y-3">
  <h2 class="text-lg font-semibold mb-3 text-gray-800">{t('categories')}</h2>
  
  <AddCategory
    {selectedRestaurant}
    {restaurantName}
    on:add={handleCategoryAdd}
  />

  <!-- Categories List -->
  <div class="bg-white/20 backdrop-blur-md rounded-lg border border-white/50">
    {#each orderedCategories as category, index (category.id)}
      <CategoryItem
        {category}
        {index}
        isSelected={selectedCategoryId === category.id}
        on:update={handleCategoryUpdate}
        on:delete={handleCategoryDelete}
        on:toggle={() => toggleCategory(index)}
      />
    {/each}
  </div>
</div> 