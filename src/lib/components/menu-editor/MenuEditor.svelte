<script lang="ts">
  import { onMount } from 'svelte';
  import type { Restaurant, Category, Dish } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import { menuCache } from '$lib/stores/menu-cache';
  import LanguageSwitch from '$lib/components/LanguageSwitch.svelte';
  import RestaurantInfo from './restaurant/RestaurantInfo.svelte';
  import CategoryList from './categories/CategoryList.svelte';
  import MenuPreview from './preview/MenuPreview.svelte';

  // State
  let restaurants: Restaurant[] = [];
  let selectedRestaurant: string | null = null;
  let categories: Category[] = [];
  let restaurantName = '';
  let menuLogo = '';
  let isSaving = false;

  // Make translations reactive
  $: currentLanguage = $language;
  $: t = (key: string): string => translations[key][currentLanguage];

  // Debug cache changes
  $: console.log('Cache state:', $menuCache);
  $: console.log('Has unsaved changes:', $menuCache.hasUnsavedChanges);

  onMount(async () => {
    try {
      const response = await fetch('/api/restaurants');
      const data = await response.json();
      
      if (data.success) {
        restaurants = data.data;
        console.log('Loaded restaurants:', restaurants);
      } else {
        throw new Error(data.error || 'Failed to load restaurants');
      }
    } catch (error) {
      console.error('Error loading restaurants:', error);
      if (error instanceof Error) {
        alert(t('error') + ': ' + error.message);
      }
    }
  });

  // Event handlers
  async function handleRestaurantUpdate(event: CustomEvent<{ name: string; logo: string }>) {
    restaurantName = event.detail.name;
    menuLogo = event.detail.logo;
    
    // Generate a temporary ID if we don't have one
    const tempId = selectedRestaurant || crypto.randomUUID();
    
    // Update cache with the restaurant data while preserving existing categories and dishes
    menuCache.updateRestaurant({
      id: tempId,
      name: restaurantName,
      logo: menuLogo
    });

    // If we have a selected restaurant, fetch its categories and dishes
    if (selectedRestaurant) {
      try {
        // Fetch categories with their dishes
        const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories`);
        const result = await response.json();
        
        if (result.success) {
          // For each category, ensure we have its dishes
          const categoriesWithDishes = await Promise.all(result.data.map(async (category: Category) => {
            try {
              const dishesResponse = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes`);
              const dishesResult = await dishesResponse.json();
              return {
                ...category,
                dishes: dishesResult.success ? dishesResult.data : []
              };
            } catch (error) {
              console.error(`Error fetching dishes for category ${category.id}:`, error);
              return {
                ...category,
                dishes: category.dishes || []
              };
            }
          }));

          categories = categoriesWithDishes;
          
          // Update cache with existing categories and their dishes
          categories.forEach(category => {
            menuCache.updateCategory(category.id, 'update', category);
            // Update dishes in cache
            category.dishes?.forEach(dish => {
              menuCache.updateDish(dish.id, 'update', dish);
            });
          });
        }
      } catch (error) {
        console.error('Error fetching categories and dishes after restaurant update:', error);
      }
    }
  }

  async function handleCategoriesUpdate(event: CustomEvent<Category[]>) {
    const oldCategories = new Set(categories.map(c => c.id));
    const newCategories = event.detail;
    
    // Preserve existing dishes when updating categories
    const updatedCategories = newCategories.map(newCat => {
      const existingCategory = categories.find(c => c.id === newCat.id);
      // Merge existing dishes with new dishes, avoiding duplicates by checking both ID and content
      const existingDishes = existingCategory?.dishes || [];
      const newDishes = newCat.dishes || [];
      const allDishes = [...existingDishes];
      
      // Add new dishes that don't exist yet, checking both ID and content
      newDishes.forEach(newDish => {
        const isDuplicate = allDishes.some(d => 
          d.id === newDish.id || 
          (d.title === newDish.title && 
           d.price === newDish.price && 
           d.categoryId === newDish.categoryId)
        );
        if (!isDuplicate) {
          allDishes.push(newDish);
        }
      });
      
      return {
        ...newCat,
        dishes: allDishes
      };
    });
    
    categories = updatedCategories;
    
    // Update cache for changed categories
    categories.forEach(category => {
      const action = oldCategories.has(category.id) ? 'update' : 'create';
      menuCache.updateCategory(category.id, action, category);
    });
  }

  async function handleRestaurantSelect(event: CustomEvent<string>) {
    selectedRestaurant = event.detail;
    
    // Find the selected restaurant in the list
    const restaurant = restaurants.find(r => r.id === selectedRestaurant);
    if (restaurant) {
      restaurantName = restaurant.name;
      menuLogo = restaurant.logo || '';
      
      // Update cache with the selected restaurant
      menuCache.updateRestaurant({
        id: selectedRestaurant,
        name: restaurant.name,
        logo: restaurant.logo || ''
      });
    }
  }

  async function saveAllChanges() {
    try {
      isSaving = true;
      console.log('Starting save operation...');
      console.log('Cache state:', $menuCache);
      
      // Step 1: Validate restaurant name
      if (!restaurantName.trim()) {
        throw new Error(t('restaurantNameRequired'));
      }

      // Step 2: Create or update restaurant
      console.log('Saving restaurant changes...');
      let currentRestaurantId = selectedRestaurant;
      let restaurantResponse;
      let savedRestaurant;

      // Create new restaurant if we don't have an ID or if the restaurant doesn't exist
      if (!currentRestaurantId) {
        console.log('Creating new restaurant:', { name: restaurantName, logo: menuLogo });
        restaurantResponse = await fetch('/api/restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: restaurantName.trim(),
            logo: menuLogo
          })
        });

        if (!restaurantResponse.ok) {
          const errorText = await restaurantResponse.text();
          throw new Error(`Failed to create restaurant: ${errorText}`);
        }

        const createResult = await restaurantResponse.json();
        if (!createResult.success) {
          throw new Error(createResult.error || 'Failed to create restaurant');
        }

        currentRestaurantId = createResult.data.id;
        selectedRestaurant = currentRestaurantId; // Update the selected restaurant ID
        savedRestaurant = createResult.data;
        console.log('New restaurant created with ID:', currentRestaurantId);
      } else {
        // First check if the restaurant exists
        console.log('Checking if restaurant exists:', currentRestaurantId);
        const checkResponse = await fetch(`/api/restaurants?id=${currentRestaurantId}`);
        const checkResult = await checkResponse.json();
        
        if (!checkResult.success || !checkResult.data) {
          console.log('Restaurant not found, creating new one');
          // Restaurant doesn't exist, create a new one
          restaurantResponse = await fetch('/api/restaurants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: restaurantName.trim(),
              logo: menuLogo
            })
          });

          if (!restaurantResponse.ok) {
            const errorText = await restaurantResponse.text();
            throw new Error(`Failed to create restaurant: ${errorText}`);
          }

          const createResult = await restaurantResponse.json();
          if (!createResult.success) {
            throw new Error(createResult.error || 'Failed to create restaurant');
          }

          currentRestaurantId = createResult.data.id;
          selectedRestaurant = currentRestaurantId;
          savedRestaurant = createResult.data;
          console.log('New restaurant created with ID:', currentRestaurantId);
        } else {
          // Update existing restaurant
          console.log('Updating existing restaurant:', currentRestaurantId, { name: restaurantName, logo: menuLogo });
          restaurantResponse = await fetch(`/api/restaurants/${currentRestaurantId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: restaurantName.trim(),
              logo: menuLogo
            })
          });

          if (!restaurantResponse.ok) {
            const errorText = await restaurantResponse.text();
            throw new Error(`Failed to update restaurant: ${errorText}`);
          }

          const updateResult = await restaurantResponse.json();
          if (!updateResult.success) {
            throw new Error(updateResult.error || 'Failed to update restaurant');
          }
          savedRestaurant = updateResult.data;
        }
      }

      // Step 3: Process categories
      console.log('Processing categories...');
      const categoryIdMap = new Map(); // Map temporary IDs to real IDs
      const savedCategories: Category[] = [];

      // First check existing categories to avoid duplicates
      const existingCategoriesResponse = await fetch(`/api/restaurants/${currentRestaurantId}/categories`);
      const existingCategoriesResult = await existingCategoriesResponse.json();
      const existingCategories = existingCategoriesResult.success ? existingCategoriesResult.data : [];
      const existingCategoryNames = new Set(existingCategories.map((c: Category) => c.name.toLowerCase().trim()));

      // First handle category creations and updates
      for (const [tempId, categoryChange] of Object.entries($menuCache.categories)) {
        console.log('Processing category:', { tempId, action: categoryChange.action, data: categoryChange.data });
        
        // Check if this is a temporary ID (new category) or existing one
        const isNewCategory = tempId.length > 30; // UUID length check
        const action = isNewCategory ? 'create' : categoryChange.action;
        
        // Check if category with same name already exists
        const categoryName = categoryChange.data.name.toLowerCase().trim();
        const existingCategory = existingCategories.find((c: Category) => c.name.toLowerCase().trim() === categoryName);
        
        if (action === 'create' && existingCategory) {
          // If category exists, treat it as an update instead
          console.log('Category already exists, updating instead:', existingCategory.id);
          const updateCategoryResponse = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${existingCategory.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: categoryChange.data.name,
              restaurantId: currentRestaurantId
            })
          });

          if (!updateCategoryResponse.ok) {
            const errorText = await updateCategoryResponse.text();
            throw new Error(`Failed to update category: ${errorText}`);
          }

          const categoryResult = await updateCategoryResponse.json();
          if (!categoryResult.success) {
            throw new Error(categoryResult.error || 'Failed to update category');
          }
          
          // Store the mapping of temporary ID to existing ID
          categoryIdMap.set(tempId, existingCategory.id);
          savedCategories.push(categoryResult.data);
        } else if (action === 'create') {
          const createCategoryResponse = await fetch(`/api/restaurants/${currentRestaurantId}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: categoryChange.data.name,
              restaurantId: currentRestaurantId
            })
          });

          if (!createCategoryResponse.ok) {
            const errorText = await createCategoryResponse.text();
            throw new Error(`Failed to create category: ${errorText}`);
          }

          const categoryResult = await createCategoryResponse.json();
          if (!categoryResult.success) {
            throw new Error(categoryResult.error || 'Failed to create category');
          }

          // Store the mapping of temporary ID to real ID
          categoryIdMap.set(tempId, categoryResult.data.id);
          savedCategories.push(categoryResult.data);
          existingCategoryNames.add(categoryName); // Add to existing names to prevent duplicates
          console.log('Created category:', { tempId, realId: categoryResult.data.id });
        } else if (action === 'update') {
          const updateCategoryResponse = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${tempId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: categoryChange.data.name,
              restaurantId: currentRestaurantId
            })
          });

          if (!updateCategoryResponse.ok) {
            const errorText = await updateCategoryResponse.text();
            throw new Error(`Failed to update category: ${errorText}`);
          }

          const categoryResult = await updateCategoryResponse.json();
          if (!categoryResult.success) {
            throw new Error(categoryResult.error || 'Failed to update category');
          }
          savedCategories.push(categoryResult.data);
        }
      }

      // Step 4: Process dishes
      console.log('Processing dishes...');
      const savedDishes: Dish[] = [];
      for (const [tempId, dishChange] of Object.entries($menuCache.dishes)) {
        console.log('Processing dish:', { tempId, action: dishChange.action, data: dishChange.data });
        
        // Get the real category ID if this dish belongs to a new category
        const realCategoryId = categoryIdMap.get(dishChange.data.categoryId) || dishChange.data.categoryId;
        console.log('Using category ID:', { tempId: dishChange.data.categoryId, realId: realCategoryId });
        
        if (dishChange.action === 'create') {
          const createDishResponse = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${realCategoryId}/dishes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: dishChange.data.title,
              price: dishChange.data.price,
              description: dishChange.data.description,
              imageUrl: dishChange.data.imageUrl,
              categoryId: realCategoryId
            })
          });

          if (!createDishResponse.ok) {
            const errorText = await createDishResponse.text();
            throw new Error(`Failed to create dish: ${errorText}`);
          }

          const dishResult = await createDishResponse.json();
          if (!dishResult.success) {
            throw new Error(dishResult.error || 'Failed to create dish');
          }
          savedDishes.push(dishResult.data);
        } else if (dishChange.action === 'update') {
          const updateDishResponse = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${realCategoryId}/dishes/${tempId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: dishChange.data.title,
              price: dishChange.data.price,
              description: dishChange.data.description,
              imageUrl: dishChange.data.imageUrl,
              categoryId: realCategoryId
            })
          });

          if (!updateDishResponse.ok) {
            const errorText = await updateDishResponse.text();
            throw new Error(`Failed to update dish: ${errorText}`);
          }

          const dishResult = await updateDishResponse.json();
          if (!dishResult.success) {
            throw new Error(dishResult.error || 'Failed to update dish');
          }
          savedDishes.push(dishResult.data);
        } else if (dishChange.action === 'delete') {
          // Handle dish deletion
          const deleteDishResponse = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${realCategoryId}/dishes/${tempId}`, {
            method: 'DELETE'
          });

          if (!deleteDishResponse.ok) {
            const errorText = await deleteDishResponse.text();
            throw new Error(`Failed to delete dish: ${errorText}`);
          }

          const deleteResult = await deleteDishResponse.json();
          if (!deleteResult.success) {
            throw new Error(deleteResult.error || 'Failed to delete dish');
          }
          // Don't add deleted dishes to savedDishes array
        }
      }

      // Step 5: Update local state with saved data
      console.log('All changes saved successfully, updating local state...');
      
      // Update restaurants list
      if (savedRestaurant) {
        const existingIndex = restaurants.findIndex(r => r.id === savedRestaurant.id);
        if (existingIndex >= 0) {
          restaurants[existingIndex] = savedRestaurant;
        } else {
          restaurants = [...restaurants, savedRestaurant];
        }
      }

      // Update categories with their dishes, excluding deleted ones
      categories = savedCategories.map(category => {
        const existingCategory = categories.find(c => c.id === category.id);
        const categoryDishes = savedDishes.filter(dish => dish.categoryId === category.id);
        const existingDishes = existingCategory?.dishes || [];
        
        // Get list of deleted dish IDs for this category
        const deletedDishIds = new Set(
          Object.entries($menuCache.dishes)
            .filter(([_, change]) => change.action === 'delete' && change.data.categoryId === category.id)
            .map(([id, _]) => id)
        );
        
        // Merge existing dishes with newly saved dishes, excluding deleted ones and duplicates
        const allDishes = [...existingDishes.filter(d => !deletedDishIds.has(d.id))];
        
        // Add new dishes, avoiding duplicates by checking both ID and content
        categoryDishes.forEach(newDish => {
          const isDuplicate = allDishes.some(d => 
            d.id === newDish.id || 
            (d.title === newDish.title && 
             d.price === newDish.price && 
             d.categoryId === newDish.categoryId)
          );
          
          if (!isDuplicate) {
            allDishes.push(newDish);
          } else {
            // If it's a duplicate by content but has the same ID, update it
            const existingIndex = allDishes.findIndex(d => d.id === newDish.id);
            if (existingIndex >= 0) {
              allDishes[existingIndex] = newDish;
            }
          }
        });
        
        return {
          ...category,
          dishes: allDishes
        };
      });

      // Clear the cache since changes are saved
      menuCache.clearCache();

      // Show success message
      alert(t('saveSuccess'));
    } catch (error) {
      console.error('Error saving changes:', error);
      if (error instanceof Error) {
        alert(t('error') + ': ' + error.message);
      }
    } finally {
      isSaving = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 font-sans relative">
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold text-gray-800 tracking-tight">{t('appTitle')}</h1>
      <LanguageSwitch />
    </div>
    
    <div class="flex gap-8">
      <!-- Left Section - Menu Editor -->
      <div class="flex-1 p-8 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 shadow-lg">
        <RestaurantInfo
          {restaurantName}
          {menuLogo}
          {selectedRestaurant}
          {restaurants}
          on:update={handleRestaurantUpdate}
          on:select={handleRestaurantSelect}
        />

        <CategoryList
          {categories}
          {selectedRestaurant}
          on:update={handleCategoriesUpdate}
        />
      </div>

      <!-- Vertical Divider -->
      <div class="w-px bg-white/30"></div>

      <!-- Right Section - Preview -->
      <div class="flex-1 p-8">
        <MenuPreview
          {restaurantName}
          {menuLogo}
          {categories}
        />
      </div>
    </div>

    <!-- Save Menu Button (Fixed to bottom right) -->
    {#if $menuCache.hasUnsavedChanges}
      <div class="fixed bottom-8 right-8 z-50">
        <button
          class="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2 shadow-lg"
          on:click={saveAllChanges}
          disabled={isSaving}
        >
          {#if isSaving}
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          {/if}
          {t('saveMenu')}
        </button>
      </div>
    {/if}
  </div>
</div> 