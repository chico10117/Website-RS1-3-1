import { type Restaurant, type Category, type Dish } from '../../src/lib/types/menu.types';

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'La Brasserie',
    logo: '', // Will be set by generateAndStoreImage in seed.ts
    customPrompt: `
LA BRASSERIE
Al Faisaliah Hotel

SPECIALTIES:
- International Breakfast
- Levantine Cuisine
- Asian Cuisine
- Saudi Cuisine
- Sandwiches & Burgers
- Pasta & Pizza
- From the Grill
- Desserts

OPENING HOURS:
Breakfast: 6 - 11am
Lunch: 12 - 3:30pm
Dinner: 6:30 - 11:30pm
Friday Brunch: 1 - 5pm

PAYMENT METHODS:
All major credit cards accepted
`
  },
  categories: [
    {
      name: 'BREAKFAST MENU',
      dishes: [
        {
          title: 'BREAKFAST PASTRIES',
          price: '22',
          description: 'Your choice of three: Croissants, Danish pastries, Muffins, Banana bread, Doughnuts, Bagel. Served with jam, honey and butter',
          allergens: ['nuts', 'seeds', 'eggs', 'gluten', 'sesame'],
          portions: 'Kcal 450'
        },
        {
          title: 'NATURAL DAIRY SELECTION',
          price: '12',
          description: 'Plain yoghurt, fruit yoghurt, Greek yoghurt, Berry yoghurt or Laban',
          allergens: ['dairy'],
          portions: 'Kcal 115'
        },
        {
          title: 'SLICED FRUITS AND BERRIES',
          price: '22',
          description: 'Pineapple, Watermelon, Rock melon, Honeydew Strawberry, Blueberry',
          allergens: ['healthy'],
          portions: 'Kcal 297'
        },
        {
          title: 'BIRCHER MUESLI',
          price: '17',
          description: 'Oats, yoghurt, fruits, nuts',
          allergens: ['nuts', 'dairy'],
          portions: 'Kcal 385'
        },
        {
          title: 'OAT PORRIDGE',
          price: '17',
          description: 'Served with full fat, low fat, soy milk or almond milk',
          allergens: ['dairy'],
          portions: 'Kcal 75'
        },
        {
          title: 'ARABIC FOUL MEDAMES',
          price: '15',
          description: 'Traditional condiments, Arabic bread',
          allergens: ['healthy', 'gluten'],
          portions: 'Kcal 514'
        }
      ]
    },
    {
      name: 'INTERNATIONAL BREAKFAST SPECIALTIES',
      dishes: [
        {
          title: 'GREEN EGG WHITE FRITTATA',
          price: '22',
          description: 'Tomatillos, grilled asparagus, basil, sweet potato hash',
          allergens: ['eggs', 'healthy', 'organic'],
          portions: 'Kcal 98'
        },
        {
          title: 'BRUSCHETTA EGGS',
          price: '23',
          description: 'Poached eggs, basil pesto, buffalo mozzarella, heirloom tomatoes, arugula, country bread',
          allergens: ['eggs', 'dairy', 'gluten', 'nuts'],
          portions: 'Kcal 245'
        },
        {
          title: 'EGGS BENEDICT',
          price: '22',
          description: 'Turkey ham, hollandaise sauce, toasted muffin',
          allergens: ['dairy', 'gluten', 'eggs', 'organic'],
          portions: 'Kcal 310'
        },
        {
          title: 'SMOKED SALMON AND BAGELS',
          price: '23',
          description: 'Scrambled eggs, chives, capers, smoked salmon',
          allergens: ['seafood', 'dairy', 'gluten', 'organic'],
          portions: 'Kcal 290'
        },
        {
          title: 'MOROCCAN SHAKSHUKA',
          price: '22',
          description: 'Baked eggs with tomato, cumin, coriander, shallots',
          allergens: ['eggs', 'organic'],
          portions: 'Kcal 180'
        },
        {
          title: 'THREE EGG OMELET',
          price: '23',
          description: 'Choose your ingredients: Mushroom, bell pepper, tomatoes, olives, beef bacon, turkey ham, onion, chili, cheddar cheese',
          allergens: ['eggs', 'dairy', 'organic'],
          portions: 'Kcal 235'
        },
        {
          title: 'EGGS ANY STYLE',
          price: '22',
          description: 'Sunny side up, over easy, scrambled, poached, hard boiled',
          allergens: ['eggs', 'dairy', 'organic'],
          portions: 'Kcal 150'
        },
        {
          title: 'FRENCH TOAST, PANCAKE STACK OR WAFFLES',
          price: '22',
          description: 'Choice of blueberry, strawberry, blackberry, banana, Canadian maple syrup, cinnamon sugar',
          allergens: ['dairy', 'eggs', 'gluten'],
          portions: 'Kcal varies'
        }
      ]
    },
    {
      name: 'LEVANTINE CUISINE - COLD',
      dishes: [
        {
          title: 'QUINOA TABBOULEH',
          price: '15',
          description: 'bibb lettuce',
          allergens: [],
          portions: 'Kcal 135'
        },
        {
          title: 'FATTOUSH',
          price: '15',
          description: 'organic cucumbers',
          allergens: ['gluten'],
          portions: 'Kcal 165'
        },
        {
          title: 'LABNEH',
          price: '15',
          description: 'cucumber & mint',
          allergens: ['dairy'],
          portions: 'Kcal 210'
        },
        {
          title: 'HUMMUS',
          price: '15',
          description: 'tahini & olive oil',
          allergens: [],
          portions: 'Kcal 550'
        }
      ]
    },
    {
      name: 'LEVANTINE CUISINE - WARM',
      dishes: [
        {
          title: 'PUMPKIN SOUP (RAS EL HANOUT)',
          price: '15',
          description: 'pine nuts',
          allergens: ['dairy', 'nuts'],
          portions: 'Kcal 241'
        },
        {
          title: 'SPICED HUMMUS DUMPLING',
          price: '15',
          description: 'braised onion, cumin, yoghurt, manti',
          allergens: ['dairy', 'nuts'],
          portions: 'Kcal 360'
        },
        {
          title: 'LAMB & MINT DUMPLING',
          price: '15',
          description: 'caramelized tomato sauce, manti',
          allergens: ['gluten', 'eggs'],
          portions: 'Kcal 420'
        },
        {
          title: 'MASHAWI HALIBI',
          price: '15',
          description: 'beef kebab, lamb kofta, shish tawook, garlic sauce',
          allergens: ['dairy'],
          portions: 'Kcal 385'
        },
        {
          title: 'KIBBEH LABANIYA',
          price: '15',
          description: 'lamb kibbeh, yoghurt sauce',
          allergens: ['dairy', 'nuts'],
          portions: 'Kcal 325'
        },
        {
          title: 'CHICKEN FRIKKEH',
          price: '15',
          description: 'whole wheat grains, poultry broth',
          allergens: ['gluten', 'gluten'],
          portions: 'Kcal 304'
        },
        {
          title: 'FALAFEL',
          price: '15',
          description: 'pickled turnips, yoghurt tahini',
          allergens: ['gluten', 'dairy'],
          portions: 'Kcal 175'
        }
      ]
    },
    {
      name: 'APPETIZERS',
      dishes: [
        {
          title: 'POKE SALAD BOWL',
          price: '25',
          description: 'avocado, cucumber, scallion, chili dressing, sesame seed. Choice of salmon or black angus beef',
          allergens: ['seafood'],
          portions: 'Kcal 492'
        },
        {
          title: 'SELECTION OF SUSHI',
          price: '42',
          description: 'nigiri, maki, sashimi, soy sauce, wasabi, pickled ginger',
          allergens: ['seafood'],
          portions: 'Kcal 180'
        },
        {
          title: 'CURED PEPPERED BEEF',
          price: '28',
          description: 'arugula, balsamic, olive oil',
          allergens: [],
          portions: 'Kcal 280'
        },
        {
          title: 'SHANGHAI CHICKEN POT STICKERS',
          price: '25',
          description: 'ginger, black vinegar, soy dipping',
          allergens: ['gluten', 'gluten'],
          portions: 'Kcal 310'
        },
        {
          title: 'STEAMED DIM SUM BASKET',
          price: '22',
          description: 'scallop prawn siu mai, prawn har gau, smoked wagyu beef, edamame truffle dumpling',
          allergens: ['gluten', 'seafood', 'nuts'],
          portions: 'Kcal 211'
        },
        {
          title: 'TOMATO SHORBA',
          price: '15',
          description: 'cardamom, ginger, coriander',
          allergens: [],
          portions: 'Kcal 160'
        }
      ]
    },
    {
      name: 'SANDWICHES & BURGERS',
      dishes: [
        {
          title: 'WAGYU TRUFFLE BURGER',
          price: '37',
          description: 'mushroom, mulwarra bacon, brie cheese, truffle butter, brioche bun',
          allergens: ['gluten', 'dairy'],
          portions: 'Kcal 560'
        },
        {
          title: 'MUFFALETTA SANDWICH',
          price: '28',
          description: 'salami, mortadella, provolone cheese, dijon mustard, olive tapenade',
          allergens: ['gluten', 'dairy'],
          portions: 'Kcal 492'
        },
        {
          title: 'GRILLED HALLOUMI & CHICKEN WRAP',
          price: '25',
          description: 'roasted red pepper, spinach, curried avocado',
          allergens: ['gluten', 'dairy'],
          portions: 'Kcal 506'
        }
      ]
    },
    {
      name: 'PASTA & PIZZA',
      dishes: [
        {
          title: 'SPAGHETTI CACIO E PEPE',
          price: '28',
          description: 'cracked black pepper, pecorino',
          allergens: ['gluten', 'dairy'],
          portions: 'Kcal 722'
        },
        {
          title: 'FETTUCCINI ALLA ROMAGNOLA',
          price: '42',
          description: 'veal ragout, black truffle, mire poix',
          allergens: ['gluten', 'dairy', 'gluten'],
          portions: 'Kcal 470'
        },
        {
          title: 'MARGHERITA PIZZA',
          price: '28',
          description: 'san marzano tomatoes, mozzarella, basil, olive oil, sea salt',
          allergens: ['gluten', 'dairy'],
          portions: 'Kcal 280'
        },
        {
          title: 'SWEET POTATO PIZZA',
          price: '28',
          description: 'shiitake, mozzarella, rosemary, morita chili oil',
          allergens: ['gluten', 'dairy'],
          portions: 'Kcal 306'
        },
        {
          title: 'QUATTRO FORMAGGI PIZZA',
          price: '40',
          description: 'parmesan, mozzarella, fontina, gorgonzola, black truffle',
          allergens: ['gluten', 'dairy'],
          portions: 'Kcal 853'
        }
      ]
    },
    {
      name: 'FROM THE GRILL',
      dishes: [
        {
          title: 'BEEF TENDERLOIN, BLACK ANGUS MULWARRA',
          price: '70',
          description: '250 Gram',
          allergens: [],
          portions: 'Kcal 668'
        },
        {
          title: 'BEEF RIBEYE, BLACK ANGUS MULWARRA',
          price: '70',
          description: '350 Gram',
          allergens: [],
          portions: 'Kcal 678'
        },
        {
          title: 'GRILLED CHICKEN BREAST',
          price: '37',
          description: '',
          allergens: [],
          portions: 'Kcal 663'
        },
        {
          title: 'AUSTRALIAN RACK OF LAMB',
          price: '83',
          description: '',
          allergens: [],
          portions: 'Kcal 1054'
        },
        {
          title: 'NORWEGIAN SALMON',
          price: '62',
          description: '200 Gram',
          allergens: ['seafood'],
          portions: 'Kcal 292'
        },
        {
          title: 'TIGER PRAWNS',
          price: '70',
          description: '',
          allergens: ['seafood'],
          portions: 'Kcal 237'
        }
      ]
    },
    {
      name: 'SIDES',
      dishes: [
        {
          title: 'Creamy Mashed Potato',
          price: '15',
          description: '',
          allergens: ['dairy'],
          portions: 'Kcal 250'
        },
        {
          title: 'Sauté Spinach',
          price: '15',
          description: '',
          allergens: [],
          portions: 'Kcal 100'
        },
        {
          title: 'French Fries',
          price: '15',
          description: '',
          allergens: [],
          portions: 'Kcal 200'
        },
        {
          title: 'Steamed Vegetables',
          price: '15',
          description: '',
          allergens: [],
          portions: 'Kcal 65'
        },
        {
          title: 'Garden Asparagus',
          price: '15',
          description: '',
          allergens: [],
          portions: 'Kcal 80'
        },
        {
          title: 'Mesclun Salad',
          price: '15',
          description: '',
          allergens: [],
          portions: 'Kcal 28'
        },
        {
          title: 'White Rice',
          price: '15',
          description: '',
          allergens: [],
          portions: 'Kcal 130'
        }
      ]
    },
    {
      name: 'SAUCES',
      dishes: [
        {
          title: 'Veal Jus',
          price: '0',
          description: '',
          allergens: [],
          portions: 'Kcal 75'
        },
        {
          title: 'Green Peppercorn',
          price: '0',
          description: '',
          allergens: [],
          portions: 'Kcal 133'
        },
        {
          title: 'Lemon Butter',
          price: '0',
          description: '',
          allergens: ['dairy'],
          portions: 'Kcal 107'
        },
        {
          title: 'Creamy Mushroom',
          price: '0',
          description: '',
          allergens: ['dairy'],
          portions: 'Kcal 283'
        },
        {
          title: 'Bbq Sauce',
          price: '0',
          description: '',
          allergens: [],
          portions: 'Kcal 172'
        },
        {
          title: 'Vierge',
          price: '0',
          description: '',
          allergens: [],
          portions: 'Kcal 84'
        }
      ]
    },
    {
      name: 'SAUDI CUISINE',
      dishes: [
        {
          title: 'KABSA RICE | ROAST CHICKEN',
          price: '52',
          description: 'tomato, cardamom, lemon, arugula',
          allergens: [],
          portions: 'Kcal 335'
        },
        {
          title: 'KABSA RICE | BRAISED LAMB',
          price: '55',
          description: 'tomato, cardamom, lemon, arugula',
          allergens: [],
          portions: 'Kcal 750'
        },
        {
          title: 'MARGOUG',
          price: '25',
          description: 'braised vegetables, roma tomato broth',
          allergens: [],
          portions: 'Kcal 130'
        },
        {
          title: 'JEERESH',
          price: '18',
          description: 'creamed wheat, milk, caramelized onion, lime',
          allergens: [],
          portions: 'Kcal 380'
        }
      ]
    },
    {
      name: 'ASIAN CUISINE',
      dishes: [
        {
          title: 'HOKKIEN CHAR KUEY TEOW',
          price: '37',
          description: 'flat rice noodles, bean sprout, prawn, soy sauce',
          allergens: ['gluten', 'seafood', 'eggs'],
          portions: 'Kcal 638'
        },
        {
          title: 'DAN DAN MEE',
          price: '32',
          description: 'long su noodles, dan dan paste, bok choy, spring onion, sesame seed, chili oil',
          allergens: ['gluten', 'nuts', 'vegetarian'],
          portions: 'Kcal 392'
        },
        {
          title: 'SOTO DAGING',
          price: '32',
          description: 'compressed rice, shredded "rendang" beef, fried shallot, spring onion, spicy dark soy sauce',
          allergens: ['gluten', 'nuts'],
          portions: 'Kcal 440'
        },
        {
          title: '1/2 CHICKEN TANDOORI',
          price: '37',
          description: 'saffron rice, tandoori vegetables, raita, coriander chutney',
          allergens: ['dairy'],
          portions: 'Kcal 263'
        }
      ]
    },
    {
      name: 'DESSERTS',
      dishes: [
        {
          title: 'HONEY & LEMON CHEESECAKE',
          price: '15',
          description: 'rose ice cream, pistachio',
          allergens: ['dairy', 'lactose', 'nuts', 'gluten'],
          portions: 'Kcal 327'
        },
        {
          title: 'ORANGE MAHALLABIA',
          price: '15',
          description: 'milk pudding, chocolate wafers',
          allergens: ['dairy', 'lactose', 'nuts', 'gluten'],
          portions: 'Kcal 153'
        },
        {
          title: 'SELECTION OF ORIENTAL SWEETS',
          price: '18',
          description: 'a tasting of traditional middle eastern sweets',
          allergens: [],
          portions: 'Kcal 540'
        },
        {
          title: 'SELECTION OF ICE CREAM',
          price: '18',
          description: 'vanilla, strawberry, chocolate, mango (3 scoops)',
          allergens: [],
          portions: 'Kcal 593'
        },
        {
          title: 'SEASONAL SLICED FRUITS',
          price: '18',
          description: '',
          allergens: [],
          portions: 'Kcal 72'
        }
      ]
    }
  ]
}; 