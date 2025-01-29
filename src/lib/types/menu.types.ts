export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  userId: string;
  customPrompt: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
  dishes?: Dish[];
}

export interface Dish {
  id: string;
  title: string;
  price: number;
  description?: string;
  imageUrl?: string;
  categoryId: string;
  restaurantId: string;
} 