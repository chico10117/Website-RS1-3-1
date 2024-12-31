export interface Restaurant {
  id: string;
  name: string;
  logo: string | null;
  createdAt: Date;
  updatedAt: Date;
  categories?: Category[];
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
  imageUrl: string;
  price: string;
  description: string;
  categoryId: string;
} 