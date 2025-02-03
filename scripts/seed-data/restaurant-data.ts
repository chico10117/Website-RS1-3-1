import { type Restaurant, type Category, type Dish } from '../../src/lib/types/menu.types';

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'Burger',
    logo: '' // Will be set by getRandomPhotoUrl in seed.ts with query "burger-restaurant-storefront"
  },
  categories: [
    {
      name: 'Burgers',
      dishes: [
        {
          title: 'Classic Cheeseburger',
          price: '12.99',
          description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce',
          imageUrl: '' // Will be set by getRandomPhotoUrl in seed.ts with query "hamburger-cheeseburger-closeup"
        },
        {
          title: 'BBQ Bacon Supreme',
          price: '15.99',
          description: 'Angus beef patty topped with crispy bacon, caramelized onions, aged cheddar, and smoky BBQ sauce',
          imageUrl: ''
        },
        {
          title: 'Mushroom Swiss Deluxe',
          price: '14.99',
          description: 'Grilled beef patty with sautéed mushrooms, melted Swiss cheese, and truffle aioli',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Drinks',
      dishes: [
        {
          title: 'Classic Milkshake',
          price: '5.99',
          description: 'Creamy vanilla milkshake topped with whipped cream',
          imageUrl: '' // Will be set by getRandomPhotoUrl in seed.ts with query "vanilla-milkshake-dessert"
        },
        {
          title: 'Craft Root Beer Float',
          price: '6.99',
          description: 'Artisanal root beer poured over premium vanilla ice cream, topped with a cherry',
          imageUrl: ''
        },
        {
          title: 'Berry Blast Lemonade',
          price: '4.99',
          description: 'Fresh-squeezed lemonade infused with mixed berries and mint leaves',
          imageUrl: ''
        }
      ]
    }
  ]
};
