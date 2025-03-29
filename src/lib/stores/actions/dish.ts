import type { Dish } from '$lib/types/menu.types';
import type { MenuStore } from '../types';
import { createTempId } from '../utils';

export function addDish(state: MenuStore, categoryId: string, dishData: { title: string, price: string, description: string, imageUrl: string | null }) {
  const tempId = createTempId();
  
  const newDish: Dish = {
    id: tempId,
    ...dishData,
    categoryId
  };
  
  const updatedCategories = state.categories.map(category => {
    if (category.id === categoryId) {
      return {
        ...category,
        dishes: [...(category.dishes || []), newDish]
      };
    }
    return category;
  });
  
  return {
    ...state,
    categories: updatedCategories,
    changedItems: {
      ...state.changedItems,
      dishes: new Set([...state.changedItems.dishes, tempId])
    }
  };
}

export function updateDish(state: MenuStore, dishId: string, dishData: { title?: string, price?: string, description?: string, imageUrl?: string | null }) {
  const updatedCategories = state.categories.map(category => {
    if (!category.dishes) return { ...category, dishes: [] };
    
    const dishIndex = category.dishes.findIndex(dish => dish.id === dishId);
    if (dishIndex === -1) return category;
    
    const updatedDishes = [...category.dishes];
    updatedDishes[dishIndex] = {
      ...updatedDishes[dishIndex],
      ...dishData
    };
    
    return {
      ...category,
      dishes: updatedDishes
    };
  });
  
  return {
    ...state,
    categories: updatedCategories,
    changedItems: {
      ...state.changedItems,
      dishes: new Set([...state.changedItems.dishes, dishId])
    }
  };
}

export function deleteDish(state: MenuStore, dishId: string) {
  const updatedCategories = state.categories.map(category => {
    if (!category.dishes) return { ...category, dishes: [] };
    
    const dishIndex = category.dishes.findIndex(dish => dish.id === dishId);
    if (dishIndex === -1) return category;
    
    const updatedDishes = category.dishes.filter(dish => dish.id !== dishId);
    
    return {
      ...category,
      dishes: updatedDishes
    };
  });
  
  const deletedDishes = new Set(state.changedItems.deletedDishes);
  deletedDishes.add(dishId);
  
  const changedDishes = new Set(state.changedItems.dishes);
  changedDishes.delete(dishId);
  
  return {
    ...state,
    categories: updatedCategories,
    changedItems: {
      ...state.changedItems,
      dishes: changedDishes,
      deletedDishes
    }
  };
} 