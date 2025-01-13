<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Category, Dish } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import CategoryItem from './CategoryItem.svelte';
  import AddCategory from './AddCategory.svelte';

  export let categories: Category[] = [];
  export let selectedRestaurant: string | null;

  const dispatch = createEventDispatcher<{
    update: Category[];
  }>();

  let selectedCategory: number | null = null;
  let newCategory = '';

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  async function handleCategoryAdd(event: CustomEvent<Category>) {
    const category = event.detail;
    // Update cache instead of saving
    menuCache.updateCategory(category.id, 'create', category);
    categories = [...categories, category];
    dispatch('update', categories);
  }

  async function handleCategoryUpdate(event: CustomEvent<{ index: number; category: Category }>) {
    const { index, category } = event.detail;
    // Update cache instead of saving
    menuCache.updateCategory(category.id, 'update', category);
    categories = categories.map((cat, i) => i === index ? category : cat);
    dispatch('update', categories);
  }

  async function handleCategoryDelete(event: CustomEvent<number>) {
    const index = event.detail;
    const category = categories[index];
    // Update cache instead of saving
    menuCache.updateCategory(category.id, 'delete', category);
    categories = categories.filter((_, i) => i !== index);
    if (selectedCategory === index) {
      selectedCategory = null;
    }
    dispatch('update', categories);
  }

  function toggleCategory(index: number) {
    selectedCategory = selectedCategory === index ? null : index;
  }
</script>

<div class="space-y-3">
  <h2 class="text-lg font-semibold mb-3 text-gray-800">{t('categories')}</h2>
  
  <AddCategory
    {selectedRestaurant}
    on:add={handleCategoryAdd}
  />

  <!-- Categories List -->
  <div class="bg-white/20 backdrop-blur-md rounded-lg border border-white/50">
    {#each categories as category, index}
      <CategoryItem
        {category}
        {index}
        isSelected={selectedCategory === index}
        on:update={handleCategoryUpdate}
        on:delete={handleCategoryDelete}
        on:toggle={() => toggleCategory(index)}
      />
    {/each}
  </div>
</div> 