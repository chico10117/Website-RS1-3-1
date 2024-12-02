export interface Restaurant {
  _id: string;
  name: string;
  logo?: string;
  categories: Category[];
}

export interface Category {
  _id: string;
  name: string;
  dishes: Dish[];
}

export interface Dish {
  _id?: string;
  title: string;
  imageUrl: string;
  price: string;
  description: string;
} 