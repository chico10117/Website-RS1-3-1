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
}

export interface Dish {
  id: string;
  title: string;
  imageUrl: string | null;
  price: string;
  currency: string;
  description: string | null;
  categoryId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
} 