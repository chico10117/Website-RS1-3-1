import { type Restaurant, type Category, type Dish } from '../../src/lib/types/menu.types';

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'The Best Kebab & Pizzeria',
    logo: '', // Will be set by getRandomPhotoUrl in seed.ts with query "kebab-pizzeria-logo"
    customPrompt: `
THE BEST KEBAB & PIZZERIA

ESPECIALIDADES:
- Kebab
- Durum
- Pizza
- Hamburguesas
- Platos combinados

HORARIO DE APERTURA:
Abierto todos los días

MEDIOS DE PAGO:
Visa, MasterCard

TELÉFONO:
680 68 41 01 - 914 202 462
`
  },
  categories: [
    {
      name: 'KEBAB',
      dishes: [
        {
          title: '01. KEBAB NORMAL',
          price: '4.50',
          description: 'Pan de pita, ternera o pollo, ensalada y salsas',
          allergens: []
        },
        {
          title: '02. KEBAB CRUJIENTE',
          price: '4.50',
          description: 'Pan de pita, ternera o pollo, ensalada y salsas',
          allergens: []
        },
        {
          title: '03. KEBAB CON PATATAS DENTRO O ARROZ',
          price: '5.50',
          description: 'Pan de pita, ternera o pollo, ensalada y salsas',
          allergens: []
        },
        {
          title: '04. KEBAB VEGETAL',
          price: '4.00',
          description: 'Pan de pita, lechuga, tomate, cebolla, maíz y salsas',
          allergens: []
        },
        {
          title: '05. KEBAB FALAFEL',
          price: '4.50',
          description: 'Pan de pita, falafel, lechuga, tomate, cebolla, maíz y salsas',
          allergens: []
        }
      ]
    },
    {
      name: 'DURUM',
      dishes: [
        {
          title: '06. DURUM NORMAL',
          price: '6.00',
          description: 'Pan enrollado, ternera o pollo, ensalada y salsas',
          allergens: []
        },
        {
          title: '07. DURUM CRUJIENTE',
          price: '6.00',
          description: 'Pan enrollado, ternera o pollo, ensalada y salsas',
          allergens: []
        },
        {
          title: '08. DURUM CON PATATAS DENTRO O ARROZ',
          price: '7.00',
          description: 'Pan enrollado, ternera o pollo, ensalada y salsas',
          allergens: []
        },
        {
          title: '09. DURUM VEGETAL',
          price: '5.00',
          description: 'Pan enrollado, lechuga, tomate, cebolla, maíz y salsas',
          allergens: []
        },
        {
          title: '10. DURUM FALAFEL',
          price: '6.00',
          description: 'Pan enrollado, falafel, lechuga, tomate, cebolla, maíz y salsas',
          allergens: []
        },
        {
          title: '11. DURUM GRATINADO',
          price: '7.00',
          description: 'Pan enrollado, ternera o pollo, ensalada y salsas',
          allergens: []
        }
      ]
    },
    {
      name: 'BOX KEBAB',
      dishes: [
        {
          title: '22. BOX NORMAL',
          price: '5.00',
          allergens: []
        },
        {
          title: '23. BOX NORMAL + BEBIDA',
          price: '6.00',
          allergens: []
        },
        {
          title: '24. BOX SALCHIPAPA',
          price: '5.00',
          allergens: []
        },
        {
          title: '25. BOX SALCHIPAPA + BEBIDA',
          price: '6.00',
          allergens: []
        }
      ]
    },
    {
      name: 'PIZZA TURCA',
      dishes: [
        {
          title: '26. PIZZA TURCA',
          price: '6.00',
          description: 'Pizza enrollada, ternera o pollo, tomate, pimiento, especias y ensalada',
          allergens: []
        },
        {
          title: '27. LAHMACUN VEGETAL',
          price: '5.50',
          description: 'Pizza enrollada, tomate, pimiento, especias y ensalada',
          allergens: []
        }
      ]
    },
    {
      name: 'PLATOS',
      dishes: [
        {
          title: '12. PLATO CON ENSALADA',
          price: '7.00',
          allergens: []
        },
        {
          title: '13. PLATO CON PATATAS O ARROZ',
          price: '8.00',
          allergens: []
        },
        {
          title: '16. PLATO ESPECIAL',
          price: '9.00',
          description: 'falafel, arroz, patatas y queso',
          allergens: []
        },
        {
          title: '17. PLATO PARA DOS PERSONAS',
          price: '14.00',
          description: 'patatas, arroz, queso y falafel',
          allergens: []
        },
        {
          title: '18. SUPER PLATO GRATINADO',
          price: '9.00',
          allergens: []
        }
      ]
    },
    {
      name: 'RACIONES',
      dishes: [
        {
          title: '63. Fingers (6uds)',
          price: '6.00',
          description: '+ patatas',
          allergens: []
        },
        {
          title: '64. Alitas (6uds)',
          price: '6.00',
          description: '+ patatas',
          allergens: []
        },
        {
          title: '65. Nuggets (6uds)',
          price: '6.00',
          description: '+ patatas',
          allergens: []
        },
        {
          title: '66. Falafel (6uds)',
          price: '6.00',
          description: '+ ensalada',
          allergens: []
        },
        {
          title: '67. Jalapeños (6uds)',
          price: '4.50',
          allergens: []
        },
        {
          title: '68. Popcorn de pollo',
          price: '4.50',
          allergens: []
        },
        {
          title: '69. Patitos mozzarella (6uds)',
          price: '5.90',
          allergens: []
        },
        {
          title: '70. Croquetas pollo (6uds)',
          price: '6.00',
          allergens: []
        },
        {
          title: '71. Aros cebolla (6uds)',
          price: '4.50',
          allergens: []
        },
        {
          title: '72. Patatas DELUXE',
          price: '4.00',
          allergens: []
        },
        {
          title: '73. Ración de carne',
          price: '5.50',
          allergens: []
        },
        {
          title: '74. Patatas bravas',
          price: '4.50',
          allergens: []
        },
        {
          title: '75. Patatas grande',
          price: '4.00',
          allergens: []
        },
        {
          title: '76. Patatas normal',
          price: '3.00',
          allergens: []
        },
        {
          title: '79. Salchipapa',
          price: '6.00',
          allergens: []
        },
        {
          title: '80. Patatas gratinadas',
          price: '6.00',
          allergens: []
        },
        {
          title: '81. Arroz blanco grande',
          price: '4.00',
          allergens: []
        },
        {
          title: '82. Arroz blanco pequeño',
          price: '3.00',
          allergens: []
        }
      ]
    },
    {
      name: 'POLLO FRITO',
      dishes: [
        {
          title: '3 UNDS POLLO',
          price: '7.50',
          description: '+ patatas + 1 refresco',
          allergens: []
        },
        {
          title: '6 UNDS POLLO',
          price: '13.50',
          description: '+ patatas + 1 refresco',
          allergens: []
        },
        {
          title: '9 UNDS POLLO',
          price: '18.50',
          description: '+ patatas + 2 refresco',
          allergens: []
        },
        {
          title: '12 UNDS POLLO',
          price: '21.50',
          description: '+ patatas + 1L refresco',
          allergens: []
        },
        {
          title: '16 UNDS POLLO',
          price: '25.50',
          description: '+ patatas + 1L refresco',
          allergens: []
        }
      ]
    },
    {
      name: 'PIZZAS',
      dishes: [
        {
          title: '53. MARGARITA',
          price: '7.95',
          description: 'queso gouda',
          allergens: [],
          sizes: {
            MEDIANA: '7.95',
            FAMILIAR: '12.95'
          }
        },
        {
          title: '56. TOSCANA',
          price: '9.95',
          description: 'salami, jamón de pavo y champiñones',
          allergens: [],
          sizes: {
            MEDIANA: '9.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '57. MOZZARELLA',
          price: '8.95',
          description: 'tomate, olivas y mozzarella',
          allergens: [],
          sizes: {
            MEDIANA: '8.95',
            FAMILIAR: '13.95'
          }
        },
        {
          title: '59. CARBONARA',
          price: '8.95',
          description: 'jamón pavo, champiñones y nata',
          allergens: [],
          sizes: {
            MEDIANA: '8.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '61. HAWAI',
          price: '9.95',
          description: 'jamón de pavo y piña',
          allergens: [],
          sizes: {
            MEDIANA: '9.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '62. QUATRO FORMAGI',
          price: '9.95',
          description: 'gorgonzola, mozzarela, gouda y grana padano',
          allergens: [],
          sizes: {
            MEDIANA: '9.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '63. TONO',
          price: '9.95',
          description: 'atún y cebolla',
          allergens: [],
          sizes: {
            MEDIANA: '9.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '64. PIZZA KEBAB',
          price: '9.95',
          description: 'carne kebab y salsas',
          allergens: [],
          sizes: {
            MEDIANA: '9.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '65. DIABOLO',
          price: '9.95',
          description: 'mortadela, peperoni picante, mozzarella y olivas',
          allergens: [],
          sizes: {
            MEDIANA: '9.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '66. JAMÓN',
          price: '8.95',
          description: 'queso y jamón de pavo',
          allergens: [],
          sizes: {
            MEDIANA: '8.95',
            FAMILIAR: '13.95'
          }
        },
        {
          title: '67. VEGI',
          price: '9.95',
          description: 'champiñones, alcachofa, maíz, brócoli, olivas y peperoni',
          allergens: [],
          sizes: {
            MEDIANA: '9.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '69. BARBACOA',
          price: '11.95',
          description: 'carne picada, pimentón, cebolla crujiente y salsa barbacoa',
          allergens: [],
          sizes: {
            MEDIANA: '11.95',
            FAMILIAR: '16.95'
          }
        },
        {
          title: '70. PIZZAPOINT',
          price: '11.95',
          description: 'bacon, jamón de pavo, salami, champiñones y pimentón',
          allergens: [],
          sizes: {
            MEDIANA: '11.95',
            FAMILIAR: '16.95'
          }
        },
        {
          title: '71. BACON',
          price: '10.95',
          description: 'bacon, champiñones y cebolla',
          allergens: [],
          sizes: {
            MEDIANA: '10.95',
            FAMILIAR: '14.95'
          }
        },
        {
          title: '72. MAFIOSI',
          price: '11.95',
          description: 'salami, peperoni picante, atún y cebolla',
          allergens: [],
          sizes: {
            MEDIANA: '11.95',
            FAMILIAR: '16.95'
          }
        },
        {
          title: '73. MITAD Y MITAD',
          price: '11.95',
          description: '2 ingredientes a elegir',
          allergens: [],
          sizes: {
            MEDIANA: '11.95',
            FAMILIAR: '16.95'
          }
        },
        {
          title: '74. CALZONE',
          price: '11.95',
          description: '3 ingredientes a elegir',
          allergens: [],
          sizes: {
            MEDIANA: '11.95',
            FAMILIAR: '15.95'
          }
        },
        {
          title: '75. AL GUSTO',
          price: '12.95',
          description: '4 ingredientes a elegir',
          allergens: [],
          sizes: {
            MEDIANA: '12.95',
            FAMILIAR: '16.95'
          }
        },
        {
          title: '77. F40',
          price: '11.95',
          description: 'carne kebab, jamón de pavo y salsas',
          allergens: [],
          sizes: {
            MEDIANA: '11.95',
            FAMILIAR: '15.95'
          }
        }
      ]
    },
    {
      name: 'MENÚS',
      dishes: [
        {
          title: '51. MENÚ DURUM',
          price: '8.00',
          description: '+ PATATAS + BEBIDA',
          allergens: []
        },
        {
          title: '52. DURUM GRATINADO',
          price: '9.00',
          description: '+ PATATAS + BEBIDA',
          allergens: []
        },
        {
          title: '53. DURUM BURRITO',
          price: '8.50',
          description: '+ PATATAS + BEBIDA',
          allergens: []
        },
        {
          title: '54. MENÚ KEBAB',
          price: '7.00',
          description: '+ PATATAS + BEBIDA',
          allergens: []
        },
        {
          title: '55. MENÚ PLATO',
          price: '8.50',
          description: '+ BEBIDA',
          allergens: []
        },
        {
          title: '56. PLATO ESPECIAL',
          price: '10.00',
          description: '+ BEBIDA',
          allergens: []
        }
      ]
    },
    {
      name: 'POSTRES',
      dishes: [
        {
          title: '19. TEQUEÑOS CON QUESO (6 Unds)',
          price: '8.00',
          allergens: []
        },
        {
          title: '20. TEQUEÑOS CON CHOCOLATE (6 Unds)',
          price: '8.00',
          allergens: []
        },
        {
          title: '21. BAKLAVA (1und)',
          price: '1.50',
          allergens: []
        }
      ]
    },
    {
      name: 'BEBIDAS',
      dishes: [
        {
          title: 'REFRESCO LATA',
          price: '2.00',
          allergens: []
        }
      ]
    }
  ]
}; 