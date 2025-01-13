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
    
    // Find deleted categories
    const deletedCategories = categories.filter(oldCat => 
      !newCategories.some(newCat => newCat.id === oldCat.id)
    );
    
    // Mark deleted categories in the cache
    deletedCategories.forEach(category => {
      console.log('Marking category for deletion:', category.id);
      menuCache.updateCategory(category.id, 'delete', category);
    });
    
    // Preserve existing dishes when updating categories
    const updatedCategories = newCategories.map(newCat => {
      // Check if this is an existing category by ID
      const existingCategory = categories.find(c => c.id === newCat.id);
      
      // Also check if a category with the same name already exists
      const existingCategoryByName = categories.find(c => 
        c.name.toLowerCase() === newCat.name.toLowerCase() && 
        c.id !== newCat.id
      );
      
      // If we found an existing category with the same name, use its ID
      if (existingCategoryByName) {
        console.log('Found existing category with same name:', existingCategoryByName.name);
        newCat.id = existingCategoryByName.id;
        return {
          ...existingCategoryByName,
          name: newCat.name, // Update the name in case of case differences
          dishes: existingCategoryByName.dishes || []
        };
      }
      
      // If it's a completely new category or an existing one by ID
      const existingDishes = existingCategory?.dishes || [];
      const newDishes = newCat.dishes || [];
      const allDishes = [...existingDishes];
      
      // Add new dishes that don't exist yet
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
      // If we found an existing category with the same name, always use 'update'
      const existingCategoryByName = categories.find(c => 
        c.name.toLowerCase() === category.name.toLowerCase() && 
        c.id !== category.id
      );
      
      const action = existingCategoryByName ? 'update' : 
                    oldCategories.has(category.id) ? 'update' : 'create';
                    
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
      
      try {
        // Fetch categories for this restaurant
        const categoriesResponse = await fetch(`/api/restaurants/${selectedRestaurant}/categories`);
        const categoriesResult = await categoriesResponse.json();
        
        if (categoriesResult.success) {
          // For each category, fetch its dishes
          const categoriesWithDishes = await Promise.all(
            categoriesResult.data.map(async (category: Category) => {
              try {
                // Use the correct endpoint that includes restaurant ID
                const dishesResponse = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes`);
                const dishesResult = await dishesResponse.json();
                
                return {
                  ...category,
                  dishes: dishesResult.success ? dishesResult.data : []
                };
              } catch (error) {
                console.error(`Error fetching dishes for category ${category.id}:`, error);
                return category;
              }
            })
          );
          
          categories = categoriesWithDishes;
          console.log('Loaded categories with dishes:', categories);
        } else {
          categories = [];
        }
      } catch (error) {
        console.error('Error fetching categories and dishes:', error);
        categories = [];
      }
      
      // Update cache with the selected restaurant and its data
      menuCache.updateRestaurant({
        id: selectedRestaurant,
        name: restaurant.name,
        logo: restaurant.logo || ''
      });

      // Update cache with categories and dishes
      categories.forEach(category => {
        menuCache.updateCategory(category.id, 'update', category);
        category.dishes?.forEach(dish => {
          menuCache.updateDish(dish.id, 'update', dish);
        });
      });
    }
  }

  async function saveAllChanges() {
    try {
      isSaving = true;
      console.log('Starting save operation...');
      
      // Step 1: Restaurant Processing
      const { restaurantId, savedRestaurant } = await processRestaurant();
      if (!restaurantId) {
        throw new Error('Failed to get restaurant ID');
      }
      
      // Step 2: Category Processing
      const { savedCategories, categoryIdMap } = await processCategories(restaurantId);
      
      // Step 3: Dish Processing
      const savedDishes = await processDishes(categoryIdMap);
      
      // Step 4: Update Frontend State
      updateFrontendState(savedRestaurant, savedCategories, savedDishes);
      
      // Step 5: Clear Cache
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

  // Helper functions for saveAllChanges
  async function processRestaurant() {
    if (!restaurantName.trim()) {
      throw new Error(t('restaurantNameRequired'));
    }

    const restaurantData = {
      name: restaurantName.trim(),
      logo: menuLogo
    };

    let currentRestaurantId = selectedRestaurant;
    let savedRestaurant;

    try {
      if (!currentRestaurantId) {
        // Create new restaurant
        console.log('Creating new restaurant:', restaurantData);
        const response = await fetch('/api/restaurants', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(restaurantData)
        });

        if (!response.ok) {
          throw new Error(`Failed to create restaurant: ${await response.text()}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to create restaurant');
        }

        currentRestaurantId = result.data.id;
        selectedRestaurant = currentRestaurantId;
        savedRestaurant = result.data;
      } else {
        // Update existing restaurant
        console.log('Updating restaurant:', currentRestaurantId, restaurantData);
        const response = await fetch(`/api/restaurants/${currentRestaurantId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(restaurantData)
        });

        if (!response.ok) {
          // If update fails because restaurant doesn't exist, create a new one
          if (response.status === 404) {
            console.log('Restaurant not found, creating new one');
            const createResponse = await fetch('/api/restaurants', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(restaurantData)
            });

            if (!createResponse.ok) {
              throw new Error(`Failed to create restaurant: ${await createResponse.text()}`);
            }

            const createResult = await createResponse.json();
            if (!createResult.success) {
              throw new Error(createResult.error || 'Failed to create restaurant');
            }

            currentRestaurantId = createResult.data.id;
            selectedRestaurant = currentRestaurantId;
            savedRestaurant = createResult.data;
          } else {
            throw new Error(`Failed to update restaurant: ${await response.text()}`);
          }
        } else {
          const result = await response.json();
          if (!result.success) {
            throw new Error(result.error || 'Failed to update restaurant');
          }
          savedRestaurant = result.data;
        }
      }

      console.log('Restaurant processed successfully:', { currentRestaurantId, savedRestaurant });
      return { restaurantId: currentRestaurantId, savedRestaurant };
    } catch (error) {
      console.error('Error processing restaurant:', error);
      throw error;
    }
  }

  async function processCategories(restaurantId: string) {
    const categoryIdMap = new Map();
    const savedCategories: Category[] = [];
    
    // First process deletions
    for (const [tempId, categoryChange] of Object.entries($menuCache.categories)) {
      if (categoryChange.action === 'delete') {
        // Only try to delete if it's not a temporary ID
        if (tempId.length < 30) {
          const response = await fetch(`/api/restaurants/${restaurantId}/categories/${tempId}`, {
            method: 'DELETE'
          });

          if (!response.ok) {
            throw new Error(`Failed to delete category: ${await response.text()}`);
          }
        }
      }
    }

    // Then process creates and updates
    for (const [tempId, categoryChange] of Object.entries($menuCache.categories)) {
      if (categoryChange.action === 'delete') continue;

      const categoryData = {
        name: categoryChange.data.name,
        restaurantId
      };

      // If it's a temporary ID (UUID) or marked as create, create new category
      if (tempId.length > 30 || categoryChange.action === 'create') {
        console.log('Creating new category:', categoryData);
        const response = await fetch(`/api/restaurants/${restaurantId}/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
          throw new Error(`Failed to create category: ${await response.text()}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to create category');
        }

        categoryIdMap.set(tempId, result.data.id);
        savedCategories.push(result.data);
      } else {
        // Try to update, if fails with 404 then create
        console.log('Attempting to update category:', tempId, categoryData);
        const response = await fetch(`/api/restaurants/${restaurantId}/categories/${tempId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(categoryData)
        });

        if (!response.ok) {
          if (response.status === 404) {
            // Category doesn't exist, create it
            console.log('Category not found, creating new one:', categoryData);
            const createResponse = await fetch(`/api/restaurants/${restaurantId}/categories`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(categoryData)
            });

            if (!createResponse.ok) {
              throw new Error(`Failed to create category: ${await createResponse.text()}`);
            }

            const createResult = await createResponse.json();
            if (!createResult.success) {
              throw new Error(createResult.error || 'Failed to create category');
            }

            categoryIdMap.set(tempId, createResult.data.id);
            savedCategories.push(createResult.data);
          } else {
            throw new Error(`Failed to update category: ${await response.text()}`);
          }
        } else {
          const result = await response.json();
          if (!result.success) {
            throw new Error(result.error || 'Failed to update category');
          }
          categoryIdMap.set(tempId, result.data.id);
          savedCategories.push(result.data);
        }
      }
    }

    console.log('Categories processed:', { savedCategories, categoryIdMap });
    return { savedCategories, categoryIdMap };
  }

  async function processDishes(categoryIdMap: Map<string, string>) {
    const savedDishes: Dish[] = [];
    const currentRestaurantId = selectedRestaurant;

    if (!currentRestaurantId) {
      throw new Error('No restaurant selected');
    }

    // First process deletions
    for (const [tempId, dishChange] of Object.entries($menuCache.dishes)) {
      if (dishChange.action === 'delete') {
        const realCategoryId = categoryIdMap.get(dishChange.data.categoryId) || dishChange.data.categoryId;
        console.log('Deleting dish:', { tempId, categoryId: realCategoryId });
        
        const response = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${realCategoryId}/dishes/${tempId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`Failed to delete dish: ${await response.text()}`);
        }
      }
    }

    // Then process creates and updates
    for (const [tempId, dishChange] of Object.entries($menuCache.dishes)) {
      if (dishChange.action === 'delete') continue;

      const realCategoryId = categoryIdMap.get(dishChange.data.categoryId) || dishChange.data.categoryId;
      const dishData = {
        title: dishChange.data.title,
        price: dishChange.data.price,
        description: dishChange.data.description,
        imageUrl: dishChange.data.imageUrl,
        categoryId: realCategoryId,
        restaurantId: currentRestaurantId
      };

      console.log('Processing dish:', { 
        tempId, 
        action: dishChange.action, 
        categoryId: realCategoryId,
        data: dishData 
      });

      if (dishChange.action === 'create') {
        const response = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${realCategoryId}/dishes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishData)
        });

        if (!response.ok) {
          throw new Error(`Failed to create dish: ${await response.text()}`);
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to create dish');
        }

        savedDishes.push(result.data);
      } else if (dishChange.action === 'update') {
        const response = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${realCategoryId}/dishes/${tempId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dishData)
        });

        if (!response.ok) {
          if (response.status === 404) {
            // Dish doesn't exist, create it
            console.log('Dish not found, creating new one:', dishData);
            const createResponse = await fetch(`/api/restaurants/${currentRestaurantId}/categories/${realCategoryId}/dishes`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(dishData)
            });

            if (!createResponse.ok) {
              throw new Error(`Failed to create dish: ${await createResponse.text()}`);
            }

            const createResult = await createResponse.json();
            if (!createResult.success) {
              throw new Error(createResult.error || 'Failed to create dish');
            }

            savedDishes.push(createResult.data);
          } else {
            throw new Error(`Failed to update dish: ${await response.text()}`);
          }
        } else {
          const result = await response.json();
          if (!result.success) {
            throw new Error(result.error || 'Failed to update dish');
          }
          savedDishes.push(result.data);
        }
      }
    }

    console.log('Dishes processed:', savedDishes);
    return savedDishes;
  }

  function updateFrontendState(savedRestaurant: Restaurant, savedCategories: Category[], savedDishes: Dish[]) {
    console.log('Updating frontend state with:', { savedRestaurant, savedCategories, savedDishes });
    
    // Update restaurants list
    if (savedRestaurant) {
      const existingIndex = restaurants.findIndex(r => r.id === savedRestaurant.id);
      if (existingIndex >= 0) {
        restaurants[existingIndex] = savedRestaurant;
      } else {
        restaurants = [...restaurants, savedRestaurant];
      }
    }

    // Update categories with their dishes
    categories = savedCategories.map(category => {
      // Get existing dishes for this category
      const existingCategory = categories.find(c => c.id === category.id);
      const existingDishes = existingCategory?.dishes || [];
      
      // Get newly saved dishes for this category
      const newDishes = savedDishes.filter(dish => dish.categoryId === category.id);
      
      // Get list of deleted dish IDs from cache
      const deletedDishIds = new Set(
        Object.entries($menuCache.dishes)
          .filter(([_, change]) => change.action === 'delete')
          .map(([id, _]) => id)
      );
      
      // Combine existing and new dishes, excluding deleted ones
      const allDishes = [...existingDishes];
      
      // Add new dishes, avoiding duplicates
      newDishes.forEach(newDish => {
        if (!deletedDishIds.has(newDish.id)) {
          const existingIndex = allDishes.findIndex(d => d.id === newDish.id);
          if (existingIndex >= 0) {
            // Update existing dish
            allDishes[existingIndex] = newDish;
          } else {
            // Add new dish
            allDishes.push(newDish);
          }
        }
      });
      
      // Filter out deleted dishes
      const finalDishes = allDishes.filter(dish => !deletedDishIds.has(dish.id));
      
      console.log(`Category ${category.id} dishes:`, {
        existing: existingDishes.length,
        new: newDishes.length,
        deleted: deletedDishIds.size,
        final: finalDishes.length
      });
      
      return {
        ...category,
        dishes: finalDishes
      };
    });
    
    // After update, fetch fresh data to ensure consistency
    if (selectedRestaurant) {
      setTimeout(async () => {
        try {
          const categoriesResponse = await fetch(`/api/restaurants/${selectedRestaurant}/categories`);
          const categoriesResult = await categoriesResponse.json();
          
          if (categoriesResult.success) {
            const categoriesWithDishes = await Promise.all(
              categoriesResult.data.map(async (category: Category) => {
                try {
                  const dishesResponse = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes`);
                  const dishesResult = await dishesResponse.json();
                  
                  return {
                    ...category,
                    dishes: dishesResult.success ? dishesResult.data : []
                  };
                } catch (error) {
                  console.error(`Error fetching dishes for category ${category.id}:`, error);
                  return category;
                }
              })
            );
            
            categories = categoriesWithDishes;
            console.log('Refreshed categories with dishes:', categories);
          }
        } catch (error) {
          console.error('Error refreshing categories and dishes:', error);
        }
      }, 100); // Small delay to ensure all saves have completed
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