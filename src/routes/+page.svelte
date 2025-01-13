<script lang="ts">
  import { X } from "lucide-svelte";
  import { onMount } from 'svelte';
  import type { Restaurant, Category, Dish } from '$lib/types';
  import { translations } from '$lib/i18n/translations';
  import { language } from '$lib/stores/language';
  import LanguageSwitch from '$lib/components/LanguageSwitch.svelte';

  let restaurants: Restaurant[] = [];
  let selectedRestaurant: string | null = null;
  let categories: Category[] = [];
  let newCategory = '';
  let selectedCategory: number | null = null;
  let newDish: Dish = { 
    id: '',
    title: '', 
    imageUrl: '', 
    price: '', 
    description: '', 
    categoryId: '' 
  };
  let editingDish: Dish = { 
    id: '',
    title: '', 
    imageUrl: '', 
    price: '', 
    description: '', 
    categoryId: '' 
  };
  let editingDishIndex: number | null = null;
  let isEditing = false;

  let menuName = '';
  let menuLogo = '';
  let editingCategoryIndex: number | null = null;
  let editingCategoryName = '';
  let restaurantName = '';
  let isUploading = false;
  let isEditingRestaurant = false;
  let editingRestaurantName = '';
  let currentCategoryIndex: number | null = null;

  let editingCategory: Category | null = null;
  let editingName = '';

  let isCreatingRestaurant = false;

  // Add $: to make the translations reactive
  $: currentLanguage = $language;
  
  // Make the translation function reactive
  $: t = (key: string): string => {
    return translations[key][currentLanguage];
  };

  // Función para guardar categoría
  async function saveCategory(categoryName: string) {
    try {
      if (!restaurantName) {
        throw new Error('Please enter a restaurant name first');
      }

      // Si no hay restaurante seleccionado, crear uno nuevo
      if (!selectedRestaurant) {
        const restaurant = await saveRestaurant();
        selectedRestaurant = restaurant.id;
      }

      console.log('Saving category for restaurant:', selectedRestaurant);

      // Verificar si la categoría ya existe
      const categoryExists = categories.some(cat => cat.name === categoryName);
      if (categoryExists) {
        throw new Error('Category already exists');
      }

      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: categoryName })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error: any) {
      console.error('Error saving category:', error);
      alert(t('error') + ': ' + error.message);
      throw error;
    }
  }

  // Función para obtener un restaurante con sus categorías
  async function getRestaurantWithCategories(restaurantId: string) {
    try {
      const response = await fetch(`/api/restaurants?id=${restaurantId}`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }
      
      return data.data;
    } catch (error: unknown) {
      console.error('Error getting restaurant:', error);
      throw error;
    }
  }

  // Modificar la función saveDish
  async function saveDish(category: Category, dish: Dish) {
    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      const dishData = {
        ...dish,
        categoryId: category.id
      };

      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dishData)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar las categorías
      const updatedRestaurant = await getRestaurantWithCategories(selectedRestaurant);
      if (updatedRestaurant) {
        categories = updatedRestaurant.categories || [];
      }

      return data.data;
    } catch (error: any) {
      console.error('Error saving dish:', error);
      throw new Error('Error saving dish: ' + error.message);
    }
  }

  async function addCategory() {
    if (newCategory.trim()) {
      try {
        const savedCategory = await saveCategory(newCategory);
        if (savedCategory) {
          // Actualizar las categorías sin duplicar
          const categoryExists = categories.some(cat => cat.name === savedCategory.name);
          if (!categoryExists) {
            categories = [...categories, { ...savedCategory, dishes: [] }];
            // Automatically select the new category
            selectedCategory = categories.length - 1;
          }
          newCategory = ''; // Limpiar el input después de guardar
        }
      } catch (error: any) {
        console.error('Error adding category:', error);
        alert(t('error') + ': ' + error.message);
      }
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addCategory();
    }
  }

  // Función para agregar plato
  async function addDish() {
    if (selectedCategory !== null && newDish.title.trim()) {
      try {
        const category = categories[selectedCategory];
        
        // Primero actualizamos la base de datos
        await saveDish(category, newDish);
        
        // Reset form
        newDish = { 
          id: '',
          title: '', 
          imageUrl: '', 
          price: '', 
          description: '', 
          categoryId: '' 
        };
        // Deseleccionar la categoría para cerrar el formulario
        selectedCategory = null;
        
        alert(t('saveSuccess'));
      } catch (error: any) {
        console.error('Error adding dish:', error);
        alert(t('error') + ': ' + error.message);
      }
    } else {
      alert(t('error') + ': ' + t('pleaseSelectCategoryAndCompleteDishTitle'));
    }
  }

  // Add this new function to handle dish updates in the database
  async function updateDishInDB(categoryId: string, dishId: string, dish: Dish) {
    try {
      const response = await fetch(`/api/categories/${categoryId}/dishes/${dishId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dish)
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Error updating dish');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error updating dish:', error);
      throw error;
    }
  }

  // Update the existing updateDish function
  async function updateDish(categoryIndex: number, dish: Dish) {
    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      const category = categories[categoryIndex];
      if (!category || !dish.id) {
        throw new Error('Category or dish not found');
      }

      // Asegurarnos de enviar todos los campos del plato
      const updatedDish = {
        id: dish.id,
        title: dish.title,
        imageUrl: dish.imageUrl,
        price: dish.price,
        description: dish.description,
        categoryId: category.id
      };

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes/${dish.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedDish)
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar las categorías
      if (selectedRestaurant) {
        const updatedRestaurant = await getRestaurantWithCategories(selectedRestaurant);
        if (updatedRestaurant) {
          categories = updatedRestaurant.categories || [];
        }
      }

      return data.data;
    } catch (error: unknown) {
      console.error('Error updating dish:', error);
      if (error instanceof Error) {
        throw new Error('Error updating dish: ' + error.message);
      }
      throw new Error('Error updating dish');
    }
  }

  // Función para iniciar la edición de un plato
  function editDish(dish: any, categoryId: string, index: number) {
    console.log('Edit dish called with:', { dish, categoryId, index });
    
    // Si ya estamos editando este plato, cancelamos la edición
    if (isEditing && editingDish.id === (dish.id || dish._id)) {
      cancelEditDish();
      return;
    }
    
    // Guardamos el índice de la categoría actual
    currentCategoryIndex = index;
    
    // Iniciamos la edición con todos los datos necesarios
    isEditing = true;
    editingDish = {
      id: dish.id || dish._id,
      title: dish.title || '',
      price: dish.price || '',
      description: dish.description || '',
      imageUrl: dish.imageUrl || '',
      categoryId: categoryId
    };

    console.log('Editing dish state initialized:', editingDish);
  }

  function cancelEditDish() {
    isEditing = false;
    currentCategoryIndex = null;
    editingDish = {
      id: '',
      title: '',
      price: '',
      description: '',
      imageUrl: '',
      categoryId: ''
    };
  }

  function removeCategory(index: number) {
    categories = categories.filter((_, i) => i !== index);
    if (selectedCategory === index) {
      selectedCategory = null;
    }
  }

  async function removeDish(categoryIndex: number, dishIndex: number) {
    try {
      const category = categories[categoryIndex];
      if (!category?.dishes) return;
      
      const dish = category.dishes[dishIndex];
      if (!dish) return;

      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${category.id}/dishes/${dish.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Actualizar las categorías
      const updatedRestaurant = await getRestaurantWithCategories(selectedRestaurant);
      if (updatedRestaurant) {
        categories = updatedRestaurant.categories || [];
      }

      return data.data;
    } catch (error) {
      console.error('Error removing dish:', error);
      if (error instanceof Error) {
        throw new Error('Error removing dish: ' + error.message);
      }
      throw new Error('Error removing dish');
    }
  }

  async function handleImageUpload(e: Event) {
    try {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading dish image...'); // Debug log

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      console.log('Upload response:', uploadResult); // Debug log
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      // Update the dish image URL
      if (isEditing && editingDish) {
        editingDish.imageUrl = uploadResult.url;
        editingDish = editingDish; // Trigger reactivity
      } else {
        newDish.imageUrl = uploadResult.url;
        newDish = newDish; // Trigger reactivity
      }

      console.log('Image URL saved:', uploadResult.url); // Debug log

    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  function handleDishKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      addDish();
    }
  }

  async function handleLogoUpload(event: Event) {
    try {
      isUploading = true;
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];
      
      if (!file) {
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      const uploadResult = await uploadResponse.json();
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      menuLogo = uploadResult.url;

      // If we don't have a restaurant yet but have a name, create one
      if (!selectedRestaurant && restaurantName) {
        const restaurant = await saveRestaurant();
        selectedRestaurant = restaurant.id;
      }

      // Update the restaurant with the new logo if we have one
      if (selectedRestaurant) {
        const response = await fetch(`/api/restaurants/${selectedRestaurant}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            name: restaurantName,
            logo: menuLogo 
          })
        });

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }

        // Update the restaurant in the restaurants array
        const restaurantIndex = restaurants.findIndex(r => r.id === selectedRestaurant);
        if (restaurantIndex !== -1) {
          restaurants[restaurantIndex] = {
            ...restaurants[restaurantIndex],
            logo: menuLogo
          };
          restaurants = [...restaurants];
        }
      }

      isUploading = false;
    } catch (error: unknown) {
      console.error('Error uploading logo:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
      isUploading = false;
    }
  }

  async function updateRestaurantLogo(restaurantId: string, logoUrl: string) {
    try {
      const response = await fetch(`/api/restaurants/${restaurantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo: logoUrl })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update local state if needed
      const restaurantIndex = restaurants.findIndex(r => r._id === restaurantId);
      if (restaurantIndex !== -1) {
        restaurants[restaurantIndex].logo = logoUrl;
        restaurants = [...restaurants];
      }

    } catch (error) {
      console.error('Error updating restaurant logo:', error);
      throw error;
    }
  }

  function startEditingCategory(index: number) {
    editingCategoryIndex = index;
    editingCategoryName = categories[index].name;
  }

  // Add new function to update category in database
  async function updateCategoryInDB(categoryId: string, name: string) {
    try {
      console.log('Attempting to update category:', { categoryId, name });

      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      console.log('Server response status:', response.status);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          console.error('Server error response:', errorData);
          throw new Error(errorData.error || 'Failed to update category');
        } else {
          const textError = await response.text();
          console.error('Non-JSON error response:', textError);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('Server success response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Error updating category');
      }
      
      return data.data;
    } catch (error) {
      console.error('Error in updateCategoryInDB:', error);
      throw error;
    }
  }

  // Update the updateCategoryName function to include more logging
  async function updateCategoryName() {
    if (editingCategoryIndex !== null && editingCategoryName.trim()) {
      try {
        if (!selectedRestaurant) {
          throw new Error('Restaurant ID is required');
        }

        const category = categories[editingCategoryIndex];
        if (!category || !category.id) {
          throw new Error('Category not found');
        }

        const response = await fetch(
          `/api/restaurants/${selectedRestaurant}/categories/${category.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: editingCategoryName })
          }
        );

        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error);
        }

        // Update the local state with the updated category
        categories = categories.map((cat, index) => 
          index === editingCategoryIndex 
            ? { ...cat, name: editingCategoryName }
            : cat
        );
        
        // Reset editing state
        cancelEditingCategory();
      } catch (error) {
        console.error('Error updating category:', error);
        alert(t('error') + ': ' + error.message);
      }
    }
  }

  // Update the handleCategoryEditKeyPress function to handle async operation
  async function handleCategoryEditKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await updateCategoryName();
    } else if (event.key === 'Escape') {
      cancelEditingCategory();
    }
  }

  function cancelEditingCategory() {
    editingCategoryIndex = null;
    editingCategoryName = '';
  }

  // Función para manejar la selección de categoría
  function handleCategorySelect(index: number) {
    selectedCategory = index;
    console.log('Categoría seleccionada:', categories[index]);
  }

  // Función para iniciar la edición
  function startEditing(category: Category) {
    editingCategory = category;
    editingName = category.name;
  }

  // Función para guardar la edición
  async function saveEdit() {
    if (!editingCategory) return;

    try {
      const response = await fetch(`/api/restaurants/${selectedRestaurant}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editingName })
      });

      const result = await response.json();

      if (result.success) {
        // Update the local state
        categories = categories.map(cat => 
          cat.id === editingCategory?.id 
            ? { ...cat, name: editingName }
            : cat
        );
        
        // Reset editing state
        editingCategory = null;
        editingName = "";
      } else {
        throw new Error(result.error);
      }
    } catch (error: unknown) {
      console.error('Error updating category:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  // Función para cancelar la edición
  function cancelEdit() {
    editingCategory = null;
    editingName = "";
  }

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
    } catch (error: unknown) {
      console.error('Error loading restaurants:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  });

  async function deleteCategory(categoryId: string) {
    if (!confirm(t('confirmDeleteCategory'))) {
      return;
    }

    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${categoryId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update local state
      const deletedIndex = categories.findIndex(cat => cat.id === categoryId);
      categories = categories.filter(cat => cat.id !== categoryId);
      
      // If the deleted category was selected, deselect it
      if (selectedCategory === deletedIndex) {
        selectedCategory = null;
      }

      alert(t('deleteSuccess'));
    } catch (error: unknown) {
      console.error('Error deleting category:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  // Agregar esta función para manejar la selección del restaurante
  async function handleRestaurantCreated(restaurant: Restaurant) {
    selectedRestaurant = restaurant.id;
    categories = restaurant.categories || [];
    console.log('Selected restaurant:', selectedRestaurant);
  }

  // Modificar la función saveRestaurant existente
  async function saveRestaurant(): Promise<Restaurant> {
    try {
      if (!restaurantName?.trim()) {
        throw new Error('Restaurant name is required');
      }

      // Check if a restaurant with this name already exists in the local state
      const existingRestaurant = restaurants.find(r => 
        r.name.toLowerCase() === restaurantName.trim().toLowerCase()
      );

      if (existingRestaurant) {
        throw new Error('A restaurant with this name already exists');
      }

      const restaurantData = {
        name: restaurantName.trim(),
        logo: menuLogo || null
      };

      const response = await fetch('/api/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(restaurantData)
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create restaurant');
      }

      // Add the new restaurant to the local state
      const newRestaurant = result.data as Restaurant;
      restaurants = [...restaurants, newRestaurant];
      
      // Select the new restaurant
      selectedRestaurant = newRestaurant.id;
      categories = []; // Initialize empty categories for the new restaurant
      
      return newRestaurant;
    } catch (error: unknown) {
      console.error('Error saving restaurant:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(t('error') + ': ' + errorMessage);
      throw error;
    }
  }

  // Función para manejar la edición de un plato
  async function handleEditDish(categoryIndex: number | null, dish: Dish) {
    if (categoryIndex === null) {
      alert(t('error') + ': ' + t('pleaseSelectCategory'));
      return;
    }
    
    try {
      await updateDish(categoryIndex, dish);
      
      // Forzar una actualización de la vista
      categories = [...categories];
      
      // Limpiar el formulario de edición y cerrar la vista de edición
      editingDish = { 
        id: '',
        title: '', 
        imageUrl: '', 
        price: '', 
        description: '', 
        categoryId: '' 
      };
      editingDishIndex = null;
      isEditing = false;
      alert(t('saveSuccess'));
    } catch (error) {
      console.error('Error updating dish:', error);
      alert(t('error') + ': ' + error.message);
    }
  }

  async function deleteDish(categoryId: string, dishId: string) {
    if (!confirm(t('confirmDeleteDish'))) {
      return;
    }

    try {
      if (!selectedRestaurant) {
        throw new Error('Restaurant ID is required');
      }

      console.log('Deleting dish:', { restaurantId: selectedRestaurant, categoryId, dishId });

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${categoryId}/dishes/${dishId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete dish');
      }

      // Actualizar el estado local
      categories = categories.map(category => {
        if (category.id === categoryId) {
          return {
            ...category,
            dishes: category.dishes.filter(dish => dish.id !== dishId)
          };
        }
        return category;
      });
      
      alert(t('deleteSuccess'));
    } catch (error: unknown) {
      console.error('Error deleting dish:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async function startEditingRestaurant() {
    isEditingRestaurant = true;
    editingRestaurantName = restaurantName;
  }

  async function updateRestaurantName() {
    if (!selectedRestaurant || !editingRestaurantName.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${selectedRestaurant}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: editingRestaurantName,
          logo: menuLogo // Include the current logo in the update
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update both name and logo in local state
      restaurantName = editingRestaurantName;
      isEditingRestaurant = false;
      
      // Update the restaurant in the restaurants array
      const restaurantIndex = restaurants.findIndex(r => r.id === selectedRestaurant);
      if (restaurantIndex !== -1) {
        restaurants[restaurantIndex] = {
          ...restaurants[restaurantIndex],
          name: editingRestaurantName,
          logo: menuLogo
        };
        restaurants = [...restaurants];
      }

      alert(t('saveSuccess'));
    } catch (error: unknown) {
      console.error('Error updating restaurant:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  async function deleteRestaurant() {
    if (!selectedRestaurant || !confirm(t('confirmDeleteRestaurant'))) {
      return;
    }

    try {
      const response = await fetch(`/api/restaurants/${selectedRestaurant}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error);
      }

      // Update local state
      restaurants = restaurants.filter(r => r.id !== selectedRestaurant);
      selectedRestaurant = null;
      restaurantName = '';
      categories = [];

      alert(t('deleteSuccess'));
    } catch (error: unknown) {
      console.error('Error deleting restaurant:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  function cancelEditingRestaurant() {
    isEditingRestaurant = false;
    editingRestaurantName = '';
  }

  async function handleRestaurantEditKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      await updateRestaurantName();
    } else if (event.key === 'Escape') {
      cancelEditingRestaurant();
    }
  }

  function toggleCategory(index: number) {
    if (selectedCategory === index) {
      selectedCategory = null; // Si la categoría ya está seleccionada, la deseleccionamos
    } else {
      selectedCategory = index; // Si es una categoría diferente, la seleccionamos
    }
  }

  // Función para guardar los cambios
  async function saveDishChanges() {
    try {
      if (!selectedRestaurant) {
        throw new Error('No restaurant selected');
      }

      if (currentCategoryIndex === null) {
        throw new Error('No category selected');
      }

      const currentCategory = categories[currentCategoryIndex];
      console.log('Selected category:', currentCategory);

      const categoryId = currentCategory.id;
      console.log('Category ID:', categoryId);

      if (!categoryId) {
        throw new Error('Invalid category ID');
      }

      if (!editingDish.id) {
        throw new Error('No dish selected');
      }

      const dishData = {
        title: editingDish.title.trim(),
        price: editingDish.price.trim(),
        description: editingDish.description.trim(),
        imageUrl: editingDish.imageUrl || '',
        categoryId: categoryId
      };

      const response = await fetch(
        `/api/restaurants/${selectedRestaurant}/categories/${categoryId}/dishes/${editingDish.id}`,
        {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dishData)
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to update dish');
      }

      // Update the dish in the local state
      const updatedCategories = [...categories];
      const updatedCategory = updatedCategories[currentCategoryIndex];
      if (updatedCategory && updatedCategory.dishes) {
        const dishIndex = updatedCategory.dishes.findIndex(d => d.id === editingDish.id);
        if (dishIndex !== -1) {
          updatedCategory.dishes[dishIndex] = {
            ...updatedCategory.dishes[dishIndex],
            ...dishData
          };
        }
      }
      categories = updatedCategories;
      
      // Clear the form
      cancelEditDish();
      alert(t('saveSuccess'));
    } catch (error: unknown) {
      console.error('Error updating dish:', error);
      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }

  function handleLogoClick() {
    if (!restaurantName) {
      alert(t('error') + ': ' + t('pleaseEnterRestaurantNameFirst'));
      return;
    }
    const logoInput = document.getElementById('logo-input');
    if (logoInput) {
      logoInput.click();
    }
  }

  async function handleRestaurantNameInput() {
    if (restaurantName && !selectedRestaurant && !isCreatingRestaurant) {
      isCreatingRestaurant = true;
      try {
        const restaurant = await saveRestaurant();
        selectedRestaurant = restaurant.id;
      } catch (error) {
        // Error already handled in saveRestaurant
      } finally {
        isCreatingRestaurant = false;
      }
    }
  }

  // Fix the error handling
  function handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return 'Unknown error';
  }
</script>
<div class="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 font-sans">
  <div class="container mx-auto p-4">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-3xl font-bold text-gray-800 tracking-tight">{t('appTitle')}</h1>
      <LanguageSwitch />
    </div>
    
    <div class="flex gap-8">
      <!-- Left Section - Menu Editor -->
      <div class="flex-1 p-8 rounded-xl bg-white/30 backdrop-blur-md border border-white/50 shadow-lg">
        <!-- Restaurant Name Section -->
        <div class="mb-6">
          <label class="block text-lg font-semibold mb-3 text-gray-800">{t('restaurantName')}</label>
          <div class="flex items-center space-x-2">
            {#if isEditingRestaurant}
              <div class="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
                  bind:value={editingRestaurantName}
                  on:keydown={handleRestaurantEditKeyPress}
                  autofocus
                />
                <button 
                  class="p-2 text-green-500 hover:text-green-600"
                  on:click={updateRestaurantName}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </button>
                <button 
                  class="p-2 text-gray-500 hover:text-gray-600"
                  on:click={cancelEditingRestaurant}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            {:else}
              <div class="flex-1 flex items-center justify-between">
                <input
                  type="text"
                  class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal {selectedRestaurant ? 'bg-gray-50/50' : ''}"
                  placeholder={t('enterRestaurantName')}
                  bind:value={restaurantName}
                  on:blur={handleRestaurantNameInput}
                  readonly={selectedRestaurant}
                  disabled={selectedRestaurant}
                />
                {#if selectedRestaurant}
                  <button 
                    class="p-2 text-gray-500 hover:text-blue-500 ml-2"
                    on:click={startEditingRestaurant}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                    </svg>
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        </div>

        <!-- Menu Logo Section -->
        <div class="mb-8">
          <label class="block text-lg font-semibold mb-3 text-gray-800">{t('menuLogo')}</label>
          <div class="flex items-center gap-4">
            <div class="relative group">
              <button 
                class="w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-200 
                  {!restaurantName 
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed' 
                    : menuLogo 
                      ? 'border-transparent shadow-md hover:shadow-lg' 
                      : 'border-blue-200 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-300'}"
                on:click={handleLogoClick}
              >
                {#if menuLogo}
                  <img 
                    src={menuLogo} 
                    alt="Menu logo" 
                    class="w-full h-full object-cover rounded-xl"
                  />
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors duration-200" />
                {:else}
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="text-sm text-blue-600 mt-2 font-medium">{t('addLogo')}</span>
                {/if}
              </button>
              <input
                id="logo-input"
                type="file"
                accept="image/*"
                class="hidden"
                on:change={handleLogoUpload}
              />
            </div>
            {#if menuLogo}
              <button 
                class="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-all duration-200"
                on:click={() => {
                  if (!confirm(t('confirmDeleteLogo'))) return;
                  
                  const removeLogo = async () => {
                    try {
                      if (selectedRestaurant) {
                        const response = await fetch(`/api/restaurants/${selectedRestaurant}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            name: restaurantName,
                            logo: null 
                          })
                        });

                        const data = await response.json();
                        
                        if (!data.success) {
                          throw new Error(data.error);
                        }

                        // Update the restaurant in the restaurants array
                        const restaurantIndex = restaurants.findIndex(r => r.id === selectedRestaurant);
                        if (restaurantIndex !== -1) {
                          restaurants[restaurantIndex] = {
                            ...restaurants[restaurantIndex],
                            logo: null
                          };
                          restaurants = [...restaurants];
                        }
                      }
                      menuLogo = '';
                      alert(t('logoDeleteSuccess'));
                    } catch (error) {
                      console.error('Error removing logo:', error);
                      alert(t('error') + ': ' + (error instanceof Error ? error.message : 'Unknown error'));
                    }
                  };

                  removeLogo();
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            {/if}
          </div>
        </div>

        <!-- Categories Section -->
        <div class="space-y-3">
          <h2 class="text-lg font-semibold mb-3 text-gray-800">Categories</h2>
          <div class="flex items-center space-x-2">
            <input
              type="text"
              class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
              placeholder={t('categoryName')}
              bind:value={newCategory}
              on:keydown={handleKeyPress}
            />
            <button 
              class="px-4 py-2 bg-blue-500/80 backdrop-blur-sm text-white rounded-lg hover:bg-blue-600/80 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              on:click={addCategory}
              disabled={!selectedRestaurant}
            >
              {t('add')}
            </button>
          </div>

          <!-- Categories List -->
          <div class="bg-white/20 backdrop-blur-md rounded-lg border border-white/50">
            {#each categories as category, categoryIndex}
              <div class="flex flex-col p-2">
                <!-- Category Header -->
                <div 
                  class="flex items-center justify-between bg-white/30 backdrop-blur-sm p-2 rounded cursor-pointer hover:bg-white/40 transition-colors"
                  on:click={() => toggleCategory(categoryIndex)}
                >
                  {#if editingCategoryIndex === categoryIndex}
                    <div class="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        class="flex-1 px-3 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white/70 font-normal"
                        bind:value={editingCategoryName}
                        on:keydown={handleCategoryEditKeyPress}
                        autofocus
                      />
                      <button 
                        class="p-2 text-green-500 hover:text-green-600"
                        on:click={updateCategoryName}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      <button 
                        class="p-2 text-gray-500 hover:text-gray-600"
                        on:click={cancelEditingCategory}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  {:else}
                    <div class="flex-1 font-medium text-gray-800">{category.name}</div>
                    <div class="flex space-x-1">
                      <button 
                        class="p-1 text-gray-500 hover:text-blue-500"
                        on:click|stopPropagation={() => startEditingCategory(categoryIndex)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        class="p-1 text-gray-500 hover:text-red-500"
                        on:click|stopPropagation={() => deleteCategory(category.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  {/if}
                </div>

                <!-- Dishes for this category -->
                <div class="mt-2 space-y-2 pl-4">
                  {#if category.dishes && category.dishes.length > 0}
                    {#each category.dishes as dish}
                      <div class="space-y-2">
                        <!-- Dish Display -->
                        <div class="bg-gray-900/80 backdrop-blur-sm text-white p-4 rounded-lg border border-gray-800/50">
                          <div class="flex items-center justify-between">
                            <div class="flex-1">
                              <div class="flex items-center justify-between">
                                <span class="text-lg font-medium">{dish.title}</span>
                                <div class="flex items-center space-x-1">
                                  <button 
                                    class="p-1 text-white hover:text-blue-300"
                                    on:click={() => editDish(dish, category.id, categoryIndex)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                  </button>
                                  <button 
                                    class="p-1 text-white hover:text-red-300"
                                    on:click|stopPropagation={() => deleteDish(category.id, dish.id)}
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              {#if dish.price}
                                <span class="text-sm font-medium">${dish.price}</span>
                              {/if}
                              {#if dish.description}
                                <p class="text-sm font-normal text-gray-300 mt-1">{dish.description}</p>
                              {/if}
                            </div>
                          </div>
                        </div>

                        <!-- Edit Form -->
                        {#if isEditing && editingDish.id === dish.id}
                          <div class="bg-white/40 backdrop-blur-md rounded-lg border border-white/50 p-3">
                            <div class="space-y-2">
                              <div class="grid grid-cols-2 gap-2">
                                <div>
                                  <label class="text-xs font-semibold text-gray-600">{t('title')} *</label>
                                  <input
                                    type="text"
                                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
                                    bind:value={editingDish.title}
                                    required
                                  />
                                </div>
                                <div>
                                  <label class="text-xs font-semibold text-gray-600">{t('price')} *</label>
                                  <input
                                    type="text"
                                    class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
                                    bind:value={editingDish.price}
                                    required
                                  />
                                </div>
                              </div>
                              <div>
                                <label class="text-xs font-semibold text-gray-600">{t('description')}</label>
                                <textarea
                                  class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none font-normal"
                                  bind:value={editingDish.description}
                                />
                              </div>
                              <div>
                                <label class="text-xs font-semibold text-gray-600">{t('image')}</label>
                                <div class="flex items-center space-x-2">
                                  {#if editingDish.imageUrl}
                                    <img 
                                      src={editingDish.imageUrl} 
                                      alt={editingDish.title}
                                      class="w-16 h-16 object-cover rounded"
                                    />
                                  {/if}
                                  <div class="relative">
                                    <button
                                      class="px-4 py-2 bg-white/80 text-gray-700 rounded border border-gray-300 hover:bg-white/90 transition-colors text-sm font-medium flex items-center gap-2"
                                      on:click={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e) => handleImageUpload(e);
                                        input.click();
                                      }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                      </svg>
                                      {t('uploadImage')}
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div class="flex justify-end space-x-2 pt-2">
                                <button
                                  class="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 font-medium"
                                  on:click={cancelEditDish}
                                >
                                  {t('cancel')}
                                </button>
                                <button
                                  class="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
                                  on:click={saveDishChanges}
                                >
                                  {t('save')}
                                </button>
                              </div>
                            </div>
                          </div>
                        {/if}
                      </div>
                    {/each}
                  {/if}
                </div>

                <!-- Add Dish Form -->
                {#if selectedCategory === categoryIndex}
                  <div class="mt-4 bg-white/40 backdrop-blur-md rounded-lg border border-white/50 p-3">
                    <div class="space-y-2">
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <label class="text-xs font-semibold text-gray-600">{t('title')} *</label>
                          <input
                            type="text"
                            class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
                            bind:value={newDish.title}
                            required
                          />
                        </div>
                        <div>
                          <label class="text-xs font-semibold text-gray-600">{t('price')} *</label>
                          <input
                            type="text"
                            class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-normal"
                            bind:value={newDish.price}
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label class="text-xs font-semibold text-gray-600">{t('description')}</label>
                        <textarea
                          class="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 h-16 resize-none font-normal"
                          bind:value={newDish.description}
                        />
                      </div>
                      <div>
                        <label class="text-xs font-semibold text-gray-600">{t('image')}</label>
                        <div class="flex items-center space-x-2">
                          {#if newDish.imageUrl}
                            <img 
                              src={newDish.imageUrl} 
                              alt="New dish"
                              class="w-16 h-16 object-cover rounded"
                            />
                          {/if}
                          <div class="relative">
                            <button
                              class="px-4 py-2 bg-white/80 text-gray-700 rounded border border-gray-300 hover:bg-white/90 transition-colors text-sm font-medium flex items-center gap-2"
                              on:click={() => {
                                const input = document.createElement('input');
                                input.type = 'file';
                                input.accept = 'image/*';
                                input.onchange = (e) => handleImageUpload(e);
                                input.click();
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                              {t('uploadImage')}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div class="flex justify-end pt-2">
                        <button
                          class="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 font-medium"
                          on:click={addDish}
                        >
                          {t('addDish')}
                        </button>
                      </div>
                    </div>
                  </div>
                {/if}
              </div>
            {/each}
          </div>
        </div>
      </div>

      <!-- Vertical Divider -->
      <div class="w-px bg-white/30"></div>

      <!-- Right Section - Preview -->
      <div class="flex-1 p-8">
        <div class="bg-white/30 backdrop-blur-md rounded-xl border border-white/50 shadow-lg p-6">
          <h2 class="text-2xl font-bold mb-6 text-gray-800 tracking-tight">{t('menuPreview')}</h2>
          
          <!-- Restaurant Info -->
          <div class="flex items-center space-x-4 mb-8">
            {#if menuLogo}
              <img 
                src={menuLogo} 
                alt="Restaurant logo" 
                class="w-16 h-16 object-cover rounded-lg shadow-md"
              />
            {/if}
            {#if restaurantName}
              <h1 class="text-3xl font-bold text-gray-800 tracking-tight">{restaurantName}</h1>
            {/if}
          </div>

          <!-- Categories and Dishes -->
          {#each categories as category}
            <div class="mb-8">
              <h3 class="text-xl font-semibold mb-4 text-gray-800 tracking-tight">{category.name}</h3>
              {#if category.dishes && category.dishes.length > 0}
                <div class="space-y-4">
                  {#each category.dishes as dish}
                    <div class="flex items-start space-x-4 p-4 bg-white/40 backdrop-blur-sm rounded-lg border border-white/50 hover:bg-white/50 transition-colors">
                      {#if dish.imageUrl}
                        <img 
                          src={dish.imageUrl} 
                          alt={dish.title}
                          class="w-24 h-24 object-cover rounded-lg shadow-md"
                        />
                      {/if}
                      <div class="flex-1">
                        <div class="flex justify-between items-start">
                          <h4 class="text-lg font-semibold text-gray-800">{dish.title}</h4>
                          <p class="text-lg font-bold text-gray-800">${dish.price}</p>
                        </div>
                        <p class="text-gray-600 mt-1 font-normal">{dish.description}</p>
                      </div>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div> 