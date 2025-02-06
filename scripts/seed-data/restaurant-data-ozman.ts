import { type Restaurant, type Category, type Dish } from '../../src/lib/types/menu.types';

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'Ozman Kebab',
    logo: '', // Will be set by getRandomPhotoUrl in seed.ts with query "ozman-kebab-logo"
    customPrompt: `
OZMAN KEBAB

ESPECIALIDADES:
- Kebab
- Durum
- Platos
- Hamburguesas
- Pizza Turca (Lawasa)
- Pollo Frito

HORARIO DE APERTURA:
12:30 a 17:00h y de 19:00 a 00:00h

MEDIOS DE PAGO:
Visa, MasterCard

SERVICIO DOMICILIO
Tel: 555 555 555 - WhatsApp: 555 555 555
Pedido mínimo: 10€
Dirección: AV. DE GIBRALTAR, 9, 28912 LEGANÉS, MADRID
`
  },
  categories: [
    {
      name: 'KEBAB',
      dishes: [
        {
          title: 'Kebab Normal Tradicional',
          price: '4.50',
          description: 'Pan tostado, ternera o pollo o mixto, ensalada y salsas',
          allergens: []
        },
        {
          title: 'Kebab Crujiente',
          price: '4.50',
          description: 'Pan tostado, tiras pollo, ensalada y salsa',
          allergens: []
        },
        {
          title: 'Kebab con Patatas Dentro o Arroz',
          price: '5.50',
          description: 'Pan tostado, ternera o pollo, patatas o arroz dentro y salsas',
          allergens: []
        },
        {
          title: 'Kebab Vegetal',
          price: '4.00',
          description: 'Pan tostado, maíz, aceitunas, queso, ensalada y salsas',
          allergens: []
        },
        {
          title: 'Kebab Falafel',
          price: '4.50',
          description: 'Pan tostado, puré de garbanzo, ensalada y salsas',
          allergens: []
        },
        {
          title: 'Super Kebab',
          price: '6.00',
          description: 'Pan tostado, doble de ternera o pollo o mixto, queso, ensalada y salsas',
          allergens: []
        }
      ]
    },
    {
      name: 'DURUM',
      dishes: [
        {
          title: 'Durum Normal',
          price: '6.00',
          description: 'Pan enrollado, ternera o pollo o mixto, ensalada y salsas',
          allergens: []
        },
        {
          title: 'Durum Crujiente',
          price: '6.00',
          description: 'Pan enrollado, tiras pollo, ensalada y salsa',
          allergens: []
        },
        {
          title: 'Durum con Patatas Dentro o Arroz',
          price: '7.00',
          description: 'Pan enrollado, ternera o pollo, patatas o arroz dentro y salsas',
          allergens: []
        },
        {
          title: 'Durum Vegetal',
          price: '5.00',
          description: 'Pan enrollado, maíz, aceitunas, queso, ensalada y salsas',
          allergens: []
        },
        {
          title: 'Durum Falafel',
          price: '6.00',
          description: 'Pan enrollado, puré de garbanzo, ensalada y salsas',
          allergens: []
        },
        {
          title: 'Durum Gratinado',
          price: '7.00',
          description: 'Pan enrollado, ternera o pollo, ensalada y salsas',
          allergens: []
        },
        {
          title: 'Super Durum',
          price: '8.00',
          description: 'Pan enrollado, doble ternera o pollo, queso, ensalada y salsas',
          allergens: []
        },
        {
          title: 'Durum Burrito',
          price: '7.00',
          description: 'Pan enrollado, tiras pollo, ensalada y salsas',
          allergens: []
        }
      ]
    },
    {
      name: 'BOX',
      dishes: [
        {
          title: 'Box Normal',
          price: '5.00',
          allergens: []
        },
        {
          title: 'Box Normal + Bebida',
          price: '6.00',
          allergens: []
        },
        {
          title: 'Box Salchipapa',
          price: '5.00',
          allergens: []
        },
        {
          title: 'Box Salchipapa + Bebida',
          price: '6.00',
          allergens: []
        }
      ]
    },
    {
      name: 'PIZZA TURCA (LAWASA)',
      dishes: [
        {
          title: 'Pizza Turca',
          price: '6.00',
          description: 'Pizza enrollada, ternera o pollo, tomate, pimiento, especias y ensalada',
          allergens: []
        },
        {
          title: 'Lahmacun Vegetal',
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
          title: 'Plato con Ensalada',
          price: '7.00',
          allergens: []
        },
        {
          title: 'Plato con Patatas',
          price: '8.00',
          allergens: []
        },
        {
          title: 'Plato con Arroz',
          price: '8.00',
          allergens: []
        },
        {
          title: 'Plato Especial',
          price: '9.00',
          description: 'Carne o pollo, patata + arroz',
          allergens: []
        },
        {
          title: 'Plato de la Casa',
          price: '9.00',
          description: 'Falafel, arroz, patatas y queso',
          allergens: []
        },
        {
          title: 'Plato para Dos Personas',
          price: '14.00',
          description: 'Patatas, arroz, queso y falafel',
          allergens: []
        },
        {
          title: 'Super Plato Gratinado',
          price: '9.00',
          allergens: []
        }
      ]
    },
    {
      name: 'HAMBURGUESAS',
      dishes: [
        {
          title: 'Hamburguesa Normal Pollo o Ternera',
          price: '4.00',
          allergens: []
        }
      ]
    },
    {
      name: 'ENSALADAS',
      dishes: [
        {
          title: 'Ensalada Ozman',
          price: '4.50',
          description: 'Lechuga, cebolla, tomate, queso, atún, maíz y aceitunas',
          allergens: []
        },
        {
          title: 'Ensalada Mixta',
          price: '5.50',
          description: 'Lechuga, cebolla, tomate, queso, maíz y carne',
          allergens: []
        }
      ]
    },
    {
      name: 'POLLO FRITO',
      dishes: [
        {
          title: '3 Unidades de Pollo Frito',
          price: '7.50',
          description: '+ Patatas + Refresco',
          allergens: []
        },
        {
          title: '6 Unidades de Pollo Frito',
          price: '13.50',
          description: '+ Patatas + Refresco',
          allergens: []
        },
        {
          title: '9 Unidades de Pollo Frito',
          price: '18.50',
          description: '+ Patatas + 2 Refrescos',
          allergens: []
        },
        {
          title: '12 Unidades de Pollo Frito',
          price: '21.50',
          description: '+ Patatas + 1L Refresco',
          allergens: []
        },
        {
          title: '16 Unidades de Pollo Frito',
          price: '25.50',
          description: '+ Patatas + 1L Refresco',
          allergens: []
        }
      ]
    },
    {
      name: 'POSTRES',
      dishes: [
        {
          title: 'Tequeños con Queso',
          price: '7.00',
          allergens: []
        },
        {
          title: 'Tequeños con Chocolate',
          price: '8.00',
          allergens: []
        },
        {
          title: 'Baklava',
          price: '1.50',
          allergens: []
        }
      ]
    },
    {
      name: 'BEBIDAS',
      dishes: [
        {
          title: 'Refresco Lata',
          price: '2.00',
          allergens: []
        }
      ]
    }
  ]
}; 