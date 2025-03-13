export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  customPrompt: string | null;
  userId: string;
  currency: string;
  color: number;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
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
  description: string;
  price: string;
  imageUrl: string | null;
  categoryId: string;
} 