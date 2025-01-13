import type { Category } from '$lib/types/menu.types';

export async function fetchCategories(restaurantId: string): Promise<Category[]> {
  const response = await fetch(`/api/restaurants/${restaurantId}/categories`);
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch categories');
  }
  
  return result.data;
}

export async function createOrUpdateCategory(
  restaurantId: string,
  categoryData: { name: string },
  categoryId?: string
): Promise<Category> {
  const method = categoryId ? 'PUT' : 'POST';
  const url = categoryId 
    ? `/api/restaurants/${restaurantId}/categories/${categoryId}`
    : `/api/restaurants/${restaurantId}/categories`;
  
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...categoryData, restaurantId })
  });

  if (!response.ok) {
    // If update fails because category doesn't exist, create a new one
    if (response.status === 404 && categoryId) {
      return createOrUpdateCategory(restaurantId, categoryData);
    }
    throw new Error(`Failed to ${categoryId ? 'update' : 'create'} category: ${await response.text()}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || `Failed to ${categoryId ? 'update' : 'create'} category`);
  }

  return result.data;
}

export async function deleteCategory(restaurantId: string, categoryId: string): Promise<void> {
  const response = await fetch(`/api/restaurants/${restaurantId}/categories/${categoryId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete category: ${await response.text()}`);
  }
} 