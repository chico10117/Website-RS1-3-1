import type { Category } from '$lib/types/menu.types';
import type { MenuStore } from '../types';
import { createTempId } from '../utils';

export function addCategory(state: MenuStore, name: string): { state: MenuStore; tempId: string } {
  const tempId = createTempId();
  
  const newCategory: Category = {
    id: tempId,
    name,
    restaurantId: state.selectedRestaurant || '',
    dishes: []
  };
  
  return {
    state: {
      ...state,
      categories: [...state.categories, newCategory],
      changedItems: {
        ...state.changedItems,
        categories: new Set([...state.changedItems.categories, tempId])
      }
    },
    tempId
  };
}

export function updateCategory(state: MenuStore, categoryId: string, name: string): MenuStore {
  const updatedCategories = state.categories.map(category => 
    category.id === categoryId ? { ...category, name } : category
  );
  
  return {
    ...state,
    categories: updatedCategories,
    changedItems: {
      ...state.changedItems,
      categories: new Set([...state.changedItems.categories, categoryId])
    }
  };
}

export function deleteCategory(state: MenuStore, categoryId: string): MenuStore {
  const updatedCategories = state.categories.filter(category => 
    category.id !== categoryId
  );
  
  const deletedCategories = new Set(state.changedItems.deletedCategories);
  deletedCategories.add(categoryId);
  
  const changedCategories = new Set(state.changedItems.categories);
  changedCategories.delete(categoryId);
  
  return {
    ...state,
    categories: updatedCategories,
    changedItems: {
      ...state.changedItems,
      categories: changedCategories,
      deletedCategories
    }
  };
} 