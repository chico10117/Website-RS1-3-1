export interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  customPrompt: string | null;
  userId: string;
  currency: string;
  color: string;
  phoneNumber: number | null;
  createdAt: Date;
  updatedAt: Date;
  reservas: string | null;
  redes_sociales: string | null;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  restaurantId: string;
  dishes?: Dish[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Dish {
  id: string;
  title: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
} 