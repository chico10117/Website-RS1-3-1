export interface Dish {
  title: string;
  imageUrl: string;
  price: string;
  description: string;
}

export interface Category {
  _id: string;
  name: string;
  dishes: Dish[];
} 