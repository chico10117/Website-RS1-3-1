import { type Restaurant, type Category, type Dish } from '../../src/lib/types/menu.types';

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'El Pez',
    logo: '', // Will be set by generateAndStoreImage in seed.ts
    customPrompt: `
EL PEZ
Cocina Mediterránea

ESPECIALIDADES:
- Verdes y Sopa
- Tapas
- Arroces
- Brasa
- Postres

HORARIO DE APERTURA:
Abierto todos los días

MEDIOS DE PAGO:
Visa, MasterCard, Efectivo
`
  },
  categories: [
    {
      name: 'VERDES Y SOPA',
      dishes: [
        {
          title: 'ENSALADA MIXTA',
          price: '12',
          description: '',
          portions: ''
        },
        {
          title: 'ENSALADA MIXTA CON VENTRESCA DE BONITO',
          price: '16',
          description: '',
          allergens: ['pescado'],
          portions: ''
        },
        {
          title: 'TOMATES DE TEMPORADA CON PIL PIL DE ACEITUNA Y QUESO DE CABRA',
          price: '14',
          description: '',
          allergens: ['lácteos'],
          portions: ''
        },
        {
          title: 'ENSALADA DE ESPINACAS, AGUACATE, NARANJA, HINOJO Y PIPAS DE CALABAZA CON SALSA DE YOGUR',
          price: '15',
          description: '',
          allergens: ['lácteos'],
          portions: ''
        },
        {
          title: 'BURRATA (STRACCIATELLA) CON CALABAZA ASADA, PESTO ROJO Y NUECES',
          price: '17',
          description: '',
          allergens: ['lácteos', 'frutos secos'],
          portions: ''
        },
        {
          title: 'CREMA DE BOGAVANTE CON PICATOSTES Y ALI OLI DE AZAFRÁN',
          price: '17',
          description: '',
          allergens: ['crustáceos', 'gluten'],
          portions: ''
        }
      ]
    },
    {
      name: 'TAPAS',
      dishes: [
        {
          title: 'PATATAS PICANTES CON ALI OLI',
          price: '10',
          description: '',
          allergens: ['huevo'],
          portions: ''
        },
        {
          title: 'CROQUETAS DE JAMÓN IBÉRICO',
          price: '7.50',
          description: '',
          allergens: ['gluten', 'lácteos', 'huevo'],
          portions: '3U'
        },
        {
          title: 'CROQUETAS DE BOGAVANTE',
          price: '10.50',
          description: '',
          allergens: ['gluten', 'lácteos', 'huevo', 'crustáceos'],
          portions: '3U'
        },
        {
          title: 'CROQUETAS DE POLLO DE PAGES CON MAYONESA DE AJI AMARILLO',
          price: '9',
          description: '',
          allergens: ['gluten', 'lácteos', 'huevo'],
          portions: '3U'
        },
        {
          title: 'FRITURA DE CALAMAR CON MAYONESA DE LIMA',
          price: '18.50',
          description: '',
          allergens: ['moluscos', 'gluten', 'huevo'],
          portions: ''
        },
        {
          title: 'ALMEJAS CON TOMATE, GUINDILLA Y ALBAHACA',
          price: '18.50',
          description: '',
          allergens: ['moluscos'],
          portions: ''
        },
        {
          title: 'LUBINA FRITA ADOBADA CON SOJA, JENGIBRE Y LIMÓN',
          price: '21',
          description: '',
          allergens: ['pescado', 'soja'],
          portions: ''
        },
        {
          title: 'PESCADITO FRITO',
          price: '15',
          description: '',
          allergens: ['pescado', 'gluten'],
          portions: ''
        },
        {
          title: 'GAMBITA DE CRISTAL CON GUACAMOLE',
          price: '15',
          description: '',
          allergens: ['crustáceos'],
          portions: ''
        },
        {
          title: 'PULPO AL CARBÓN CON PATATA Y PIMENTÓN',
          price: '20',
          description: '',
          allergens: ['moluscos'],
          portions: ''
        },
        {
          title: 'JAMÓN IBÉRICO DE BELLOTA',
          price: '22',
          description: '',
          portions: ''
        },
        {
          title: 'JAMÓN IBÉRICO DE BELLOTA MEDIA RACIÓN',
          price: '13',
          description: '',
          portions: 'Media ración'
        },
        {
          title: 'ANCHOAS DEL CANTÁBRICO',
          price: '17',
          description: '',
          allergens: ['pescado'],
          portions: ''
        },
        {
          title: 'MEJILLONES AL CARBÓN AL PESTO MARINO',
          price: '16',
          description: '',
          allergens: ['moluscos', 'lácteos'],
          portions: ''
        },
        {
          title: 'PAN CON TOMATE',
          price: '1.75',
          description: '',
          allergens: ['gluten'],
          portions: 'Unidad'
        }
      ]
    },
    {
      name: 'ARROCES',
      description: 'MIN 2 PAX / PRECIO POR PERSONA',
      dishes: [
        {
          title: 'ARROZ DE CALAMARCITOS, GAMBAS Y ALMEJAS',
          price: '25',
          description: '',
          allergens: ['moluscos', 'crustáceos'],
          portions: 'Precio por persona'
        },
        {
          title: 'ARROZ NEGRO DE SEPIONET Y ALCACHOFAS',
          price: '24',
          description: '',
          allergens: ['moluscos'],
          portions: 'Precio por persona'
        },
        {
          title: 'ARROZ DE CARABINERO Y ALMEJAS',
          price: '37',
          description: '',
          allergens: ['crustáceos', 'moluscos'],
          portions: 'Precio por persona'
        },
        {
          title: 'ARROZ DE BUTIFARRA, SETAS Y ESPÁRRAGOS VERDES',
          price: '24',
          description: '',
          portions: 'Precio por persona'
        },
        {
          title: 'ARROZ DE VERDURAS A LA BRASA',
          price: '21',
          description: '',
          portions: 'Precio por persona',
          isVegetarian: true
        }
      ]
    },
    {
      name: 'BRASA',
      dishes: [
        {
          title: 'PESCADO DE PLAYA',
          price: '20',
          description: 'Precio depende del tamaño S/M',
          allergens: ['pescado'],
          portions: ''
        },
        {
          title: 'LOMO DE BACALAO CON CÍRCULA DE CASTAÑER Y CREMA DE PATATA',
          price: '25',
          description: '',
          allergens: ['pescado', 'lácteos'],
          portions: ''
        },
        {
          title: 'POLLO AL HORNO DE LEÑA CON PATATAS FRITAS',
          price: '17.50',
          description: '',
          portions: ''
        },
        {
          title: 'HAMBURGUESA DE VACA "ANGUS" CON SALSA DE CHAMPIÑONES',
          price: '17.50',
          description: '',
          allergens: ['gluten', 'lácteos'],
          portions: ''
        },
        {
          title: 'CHULETÓN DE VACA ECO A LA BRASA',
          price: '74',
          description: '',
          portions: '1KG (2PAX)'
        }
      ]
    },
    {
      name: 'POSTRES',
      dishes: [
        {
          title: 'CORTE DE HELADO DE TURRÓN',
          price: '5',
          description: '',
          allergens: ['lácteos', 'frutos secos'],
          portions: ''
        },
        {
          title: 'CORTE DE HELADO DE VAINILLA Y CHOCOLATE',
          price: '5',
          description: '',
          allergens: ['lácteos'],
          portions: ''
        },
        {
          title: 'SORBETE DE LIMÓN',
          price: '5.50',
          description: '',
          portions: ''
        },
        {
          title: 'TARTA DE QUESO',
          price: '8',
          description: '',
          allergens: ['lácteos', 'huevo', 'gluten'],
          portions: ''
        },
        {
          title: 'LEMON PIE',
          price: '8',
          description: '',
          allergens: ['lácteos', 'huevo', 'gluten'],
          portions: ''
        },
        {
          title: 'DELICIA DE CHOCOLATE',
          price: '8',
          description: '',
          allergens: ['lácteos', 'huevo', 'gluten'],
          portions: ''
        },
        {
          title: 'FRUTA FRESCA, CREMA DE MARACUYÁ Y SORBETE DE MANGO',
          price: '7',
          description: '',
          allergens: ['lácteos'],
          portions: ''
        },
        {
          title: 'TARTA FINA DE MANZANA CON HELADO DE ALMENDRA',
          price: '9',
          description: '',
          allergens: ['lácteos', 'gluten', 'frutos secos'],
          portions: ''
        },
        {
          title: 'FLAN A LA VAINILLE CON NATA',
          price: '8',
          description: '',
          allergens: ['lácteos', 'huevo'],
          portions: ''
        }
      ]
    }
  ]
}; 