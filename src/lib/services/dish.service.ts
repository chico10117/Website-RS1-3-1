import type { Dish } from '$lib/types/menu.types';

export async function fetchDishes(restaurantId: string, categoryId: string): Promise<Dish[]> {
  const response = await fetch(`/api/restaurants/${restaurantId}/categories/${categoryId}/dishes`);
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch dishes');
  }
  
  return result.data;
}

export async function createOrUpdateDish(
  restaurantId: string,
  categoryId: string,
  dishData: Omit<Dish, 'id' | 'restaurantId' | 'categoryId'>,
  dishId?: string
): Promise<Dish> {
  const method = dishId ? 'PUT' : 'POST';
  const url = dishId 
    ? `/api/restaurants/${restaurantId}/categories/${categoryId}/dishes/${dishId}`
    : `/api/restaurants/${restaurantId}/categories/${categoryId}/dishes`;
  
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...dishData, restaurantId, categoryId })
  });

  if (!response.ok) {
    // If update fails because dish doesn't exist, create a new one
    if (response.status === 404 && dishId) {
      return createOrUpdateDish(restaurantId, categoryId, dishData);
    }
    throw new Error(`Failed to ${dishId ? 'update' : 'create'} dish: ${await response.text()}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || `Failed to ${dishId ? 'update' : 'create'} dish`);
  }

  return result.data;
}

export async function deleteDish(restaurantId: string, categoryId: string, dishId: string): Promise<void> {
  const response = await fetch(`/api/restaurants/${restaurantId}/categories/${categoryId}/dishes/${dishId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete dish: ${await response.text()}`);
  }
} 