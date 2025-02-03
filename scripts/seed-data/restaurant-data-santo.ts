import { type Restaurant, type Category, type Dish } from '$lib/types/menu.types';

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'Santo',
    logo: 'https://api.unsplash.com/photos/random?query=japanese-restaurant&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
  },
  categories: [
    {
      name: 'Starters',
      dishes: [
        {
          title: 'Miso Soup',
          price: '5.00',
          description: 'Shiitake, tofu, negi & wakame',
          imageUrl: 'https://api.unsplash.com/photos/random?query=miso-soup&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Truffled Edamames',
          price: '10.00',
          description: 'Edamame beans with truffle',
          imageUrl: 'https://api.unsplash.com/photos/random?query=edamame&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Seaweed Salad',
          price: '8.00',
          description: 'Traditional Japanese seaweed salad',
          imageUrl: 'https://api.unsplash.com/photos/random?query=seaweed-salad&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Shishito Peppers',
          price: '11.00',
          description: 'Padron peppers with our special house sauce [slightly spicy] and furikake',
          imageUrl: 'https://api.unsplash.com/photos/random?query=shishito-peppers&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        }
      ]
    },
    {
      name: 'Sashimi',
      dishes: [
        {
          title: 'Santo Tiradito Hamachi',
          price: '20.00',
          description: 'Hamachi covered in our "tiradito" style sauce over shiso leaf and house radish (8 piece)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=hamachi-sashimi&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: "Chu'toro",
          price: '19.00',
          description: 'Semi-fatty tuna over shiso leaf and house radish',
          imageUrl: 'https://api.unsplash.com/photos/random?query=tuna-sashimi&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: "O'toro Seared",
          price: '22.00',
          description: 'Fatty tuna seared with binchotan charcoal, over shiso leaf and house radish',
          imageUrl: 'https://api.unsplash.com/photos/random?query=seared-tuna&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Truffled Zucchini',
          price: '15.00',
          description: 'Thin grilled zucchini slices with truffle tartare and salt grains',
          imageUrl: 'https://api.unsplash.com/photos/random?query=grilled-zucchini&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Salmon Sashimi',
          price: '16.00',
          description: 'Salmon, shiso leaf and daikon radish',
          imageUrl: 'https://api.unsplash.com/photos/random?query=salmon-sashimi&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        }
      ]
    },
    {
      name: 'Nigiris',
      dishes: [
        {
          title: 'Akami',
          price: '7.00',
          description: 'Lean tuna with Nikkiri & wasabi (1 piece)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=tuna-nigiri&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: "Chu'toro Nigiri",
          price: '9.00',
          description: 'Semi-fatty tuna with Nikkiri & ginger (1 piece)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=tuna-nigiri-sushi&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: "O'toro Nigiri",
          price: '12.00',
          description: 'Fatty tuna with Nikkiri & wasabi (1 piece)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=fatty-tuna-nigiri&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Salmon Yuzu',
          price: '7.00',
          description: 'Salmon with Lemon & yuzukosho (1 piece)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=salmon-nigiri&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Unagi',
          price: '7.00',
          description: 'Seared eel with a touch of tare (1 piece)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=unagi-sushi&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        }
      ]
    },
    {
      name: 'Rolls',
      dishes: [
        {
          title: 'Double Dragon Roll',
          price: '19.00',
          description: 'Tempura shrimp, asparagus and tare sauce, avocado, bonito flakes inside. Covered in our mango-truffle sauce (8 pieces)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=dragon-roll-sushi&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'San-Shake',
          price: '18.00',
          description: 'Fresh salmon, crispy salmon skin & ikura with a hint of yuzu (6 pieces)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=salmon-roll-sushi&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Daruma Roll',
          price: '19.00',
          description: 'Soft Shell crab & avocado inside. Masago and tare sauce outside (8 pieces)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=spider-roll-sushi&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Veggie Dragon Roll',
          price: '16.00',
          description: 'Tempura style asparagus & enoki mushrooms inside. Mango-truffle sauce, grated coconut and sesame seeds on the outside',
          imageUrl: 'https://api.unsplash.com/photos/random?query=vegetable-sushi-roll&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        },
        {
          title: 'Spicy Tuna Roll',
          price: '18.00',
          description: 'Avocado inside. Spicy tuna, negi, crispy tempura flakes & tare sauce on the outside (8 pieces)',
          imageUrl: 'https://api.unsplash.com/photos/random?query=spicy-tuna-roll&client_id=${process.env.UNSPLASH_ACCESS_KEY}'
        }
      ]
    },
    {
      name: 'Wine - Red',
      dishes: [
        {
          title: 'GULP HABLO/GARNACHA',
          price: '14.00',
          description: 'CHILLED RED',
          imageUrl: ''
        },
        {
          title: 'OENO/PINOT NOIR',
          price: '55.00',
          description: 'Bottle',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Wine - White',
      dishes: [
        {
          title: 'FURLANI/BIANCO ALPINO',
          price: '50.00',
          description: 'Bottle',
          imageUrl: ''
        },
        {
          title: 'STAFFA CONESTABILE/BIANCO',
          price: '58.00',
          description: 'Bottle',
          imageUrl: ''
        },
        {
          title: 'ECHEVERRIA NO ES PITUKO/CHARDONAY',
          price: '14.00',
          description: 'By the glass',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Wine - Skin Contact',
      dishes: [
        {
          title: 'LAS JARAS SUPERBLOOM/ROSÉ',
          price: '65.00',
          description: 'Bottle',
          imageUrl: ''
        },
        {
          title: 'ROSEUS/ROSÉ',
          price: '55.00',
          description: 'Bottle',
          imageUrl: ''
        },
        {
          title: 'DORALICE/ORANGE',
          price: '60.00',
          description: 'Bottle',
          imageUrl: ''
        },
        {
          title: 'ECHEVERRIA NO ES PITUKO/ROSÉ',
          price: '14.00',
          description: 'By the glass',
          imageUrl: ''
        },
        {
          title: 'GULP HABLO/ORANGE',
          price: '14.00',
          description: 'By the glass',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Sparkling Wine',
      dishes: [
        {
          title: 'GARCÍA PÉREZ/PET NAT ANCESTRAL',
          price: '40.00',
          description: 'Bottle',
          imageUrl: ''
        },
        {
          title: 'BETWEEN US/PET NAT ROSÉ',
          price: '70.00',
          description: 'Bottle',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Hot Drinks',
      dishes: [
        {
          title: 'DECAF',
          price: '5.00',
          description: 'Coffee',
          imageUrl: ''
        },
        {
          title: 'ESPRESSO',
          price: '5.00',
          description: 'Coffee',
          imageUrl: ''
        },
        {
          title: 'AMERICANO',
          price: '6.00',
          description: 'Coffee',
          imageUrl: ''
        },
        {
          title: 'MATCHA TEA',
          price: '5.00',
          description: 'Green tea powder',
          imageUrl: ''
        },
        {
          title: 'CAMOMILE TEA',
          price: '4.00',
          description: 'Herbal tea',
          imageUrl: ''
        },
        {
          title: 'MINT TEA',
          price: '4.00',
          description: 'Herbal tea',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Cold Drinks',
      dishes: [
        {
          title: 'CASCADE STILL WATER',
          price: '9.00',
          description: '28 oz.',
          imageUrl: ''
        },
        {
          title: 'ICED TEA',
          price: '5.00',
          description: 'House-made iced tea',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Sodas',
      dishes: [
        {
          title: 'MEXICAN COKE',
          price: '6.00',
          description: 'Made with real sugar',
          imageUrl: ''
        },
        {
          title: 'DIET COKE',
          price: '4.00',
          description: 'Sugar-free',
          imageUrl: ''
        },
        {
          title: 'TOPO CHICO',
          price: '6.00',
          description: 'Sparkling mineral water',
          imageUrl: ''
        },
        {
          title: 'SPRITE',
          price: '4.00',
          description: 'Lemon-lime soda',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Beer',
      dishes: [
        {
          title: 'SAPPORO DRAFT',
          price: '9.00',
          description: 'Japanese lager',
          imageUrl: ''
        },
        {
          title: 'ASAHI',
          price: '8.00',
          description: 'Japanese lager',
          imageUrl: ''
        },
        {
          title: 'CORONA',
          price: '8.00',
          description: 'Mexican lager',
          imageUrl: ''
        },
        {
          title: 'PACIFICO',
          price: '8.00',
          description: 'Mexican lager',
          imageUrl: ''
        },
        {
          title: 'BEST DAY NON ALCOHOLIC PILSNER',
          price: '10.00',
          description: 'Non-alcoholic beer',
          imageUrl: ''
        },
        {
          title: 'SKY DUSTER IPA',
          price: '10.00',
          description: 'India Pale Ale',
          imageUrl: ''
        },
        {
          title: 'SKY DUSTER SUPER DRY LAGER',
          price: '10.00',
          description: 'Japanese-style dry lager',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Sake',
      dishes: [
        {
          title: 'NIGORI',
          price: '65.00',
          description: '500 ml',
          imageUrl: ''
        },
        {
          title: 'GREEN RIDGE',
          price: '35.00',
          description: '300 ml',
          imageUrl: ''
        },
        {
          title: 'HEART OF OAK',
          price: '70.00',
          description: '720 ml',
          imageUrl: ''
        },
        {
          title: 'HEART AND SOUL',
          price: '80.00',
          description: '720 ml',
          imageUrl: ''
        },
        {
          title: 'FAIR MAIDEN',
          price: '75.00',
          description: '500 ml',
          imageUrl: ''
        },
        {
          title: 'OHMINE SHUZO',
          price: '90.00',
          description: '720 ml',
          imageUrl: ''
        },
        {
          title: 'SHIBATA PINK NIGORI FLASK',
          price: '30.00',
          description: '200 ml',
          imageUrl: ''
        },
        {
          title: 'SHIBATA BLACK JUNTA GINJO FLASK',
          price: '30.00',
          description: '200 ml',
          imageUrl: ''
        },
        {
          title: 'HOUSE SAKE 1/2 CARAFE',
          price: '25.00',
          description: '250 ml',
          imageUrl: ''
        },
        {
          title: 'HOUSE SAKE FULL CARAFE',
          price: '45.00',
          description: '500 ml',
          imageUrl: ''
        }
      ]
    }
  ]
};
