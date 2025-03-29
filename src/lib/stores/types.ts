import type { Restaurant, Category, Dish } from '$lib/types/menu.types';

export interface MenuStore {
  restaurants: Restaurant[];
  selectedRestaurant: string | null;
  restaurantName: string;
  menuLogo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  categories: Category[];
  color: string;
  reservas: string | null;
  redes_sociales: string | null;
  
  changedItems: {
    restaurant: boolean;
    categories: Set<string>;
    dishes: Set<string>;
    deletedCategories: Set<string>;
    deletedDishes: Set<string>;
  };
  
  isSaving: boolean;
  lastSaveTime: Date | null;
  isLoading: boolean;
}

export interface RestaurantUpdateData {
  name: string;
  logo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  currency: string;
  color: string;
  reservas: string | null;
  redes_sociales: string | null;
}

export interface UpdateEvent {
  restaurantName: string;
  menuLogo: string | null;
  customPrompt: string | null;
  phoneNumber: number | null;
  color: string;
  currency: string;
  reservas: string | null;
  redes_sociales: string | null;
}

export interface MenuStoreActions {
  subscribe: (run: (value: MenuStore) => void) => () => void;
  reset: () => void;
  resetChanges: () => void;
  loadRestaurants: () => Promise<Restaurant[]>;
  selectRestaurant: (restaurantId: string) => Promise<Restaurant>;
  createRestaurant: (
    name: string,
    logo?: string | null,
    customPrompt?: string | null,
    phoneNumber?: number | null,
    reservas?: string | null,
    redes_sociales?: string | null
  ) => void;
  updateRestaurantInfo: (
    name: string,
    logo: string | null,
    customPrompt?: string | null,
    slug?: string | null,
    phoneNumber?: number | null,
    reservas?: string | null,
    redes_sociales?: string | null,
    color?: string | null
  ) => void;
  updateReservasAndSocials: (
    reservas: string | null,
    redes_sociales: string | null
  ) => void;
  addCategory: (name: string) => string;
  updateCategory: (categoryId: string, name: string) => void;
  deleteCategory: (categoryId: string) => void;
  addDish: (categoryId: string, dishData: {
    title: string;
    price: string;
    description: string;
    imageUrl: string | null;
  }) => void;
  updateDish: (dishId: string, dishData: {
    title?: string;
    price?: string;
    description?: string;
    imageUrl?: string | null;
  }) => void;
  deleteDish: (dishId: string) => void;
  saveChanges: () => Promise<{
    restaurant: Restaurant;
    categories: Category[];
  }>;
} 