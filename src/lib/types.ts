export interface Dish {
  title: string;
  imageUrl: string;
  price: string;
  description: string;
}

export interface Category {
  name: string;
  dishes: Dish[];
} 