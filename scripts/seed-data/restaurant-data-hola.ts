import { type Restaurant, type Category, type Dish } from '../../src/lib/types/menu.types';

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'Hola Restaurante',
    logo: '', // Will be set by getRandomPhotoUrl in seed.ts with query "chinese-thai-restaurant-logo"
    customPrompt: `
    
Nuestro horario de apertura es de 12:00 a 16:30 y de 20:00 a 24:00 h.

Para pedidos a domicilio:
- Pedido mínimo en zona urbana: 10€
- Pedido mínimo en Parque Coimbra: 15€
- Descuento del 5% en pedidos online superiores a 20€

Puede contactarnos en los teléfonos:
- 91 645 25 84
- 91 239 00 88

Ofrecemos una amplia variedad de platos tradicionales chinos y tailandeses, incluyendo entrantes, sopas, arroces, tallarines, platos de verduras, pescados, mariscos, ternera, cerdo, pollo, pato y especialidades de la casa. También contamos con una sección especial de auténtica comida tailandesa.`
  },
  categories: [
    {
      name: 'Entrantes',
      dishes: [
        {
          title: 'Ensalada china',
          price: '5.20',
          imageUrl: '' // Will be set by getRandomPhotoUrl
        },
        {
          title: 'Ensalada de frutas',
          price: '5.80',
          imageUrl: ''
        },
        {
          title: 'Ensalada de gambas',
          price: '6.80',
          imageUrl: ''
        },
        {
          title: 'Ensalada de brotes de soja',
          price: '6.00',
          imageUrl: ''
        },
        {
          title: 'Ensalada de la casa',
          price: '7.20',
          imageUrl: ''
        },
        {
          title: 'Rollo de primavera (pequeño)',
          price: '2.30',
          imageUrl: ''
        },
        {
          title: 'Rollo de primavera (grande)',
          price: '2.20',
          imageUrl: ''
        },
        {
          title: 'Wan-tun frito',
          price: '5.30',
          imageUrl: ''
        },
        {
          title: 'Pan chino',
          price: '1.80',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Sopas',
      dishes: [
        {
          title: 'Sopa agripicante',
          price: '4.30',
          imageUrl: ''
        },
        {
          title: 'Sopa de aletas de tiburón',
          price: '4.50',
          imageUrl: ''
        },
        {
          title: 'Sopa de maiz con carne de cangrejo',
          price: '4.50',
          imageUrl: ''
        },
        {
          title: 'Sopa de wan-tun',
          price: '4.80',
          imageUrl: ''
        },
        {
          title: 'Sopa de mariscos',
          price: '4.80',
          imageUrl: ''
        },
        {
          title: 'Sopa de pollo con champiñón',
          price: '4.50',
          imageUrl: ''
        },
        {
          title: 'Copa de huvo con alga comestible',
          price: '4.30',
          imageUrl: ''
        },
        {
          title: 'Sopa de fideos chinos con tsa-chai',
          price: '4.50',
          imageUrl: ''
        },
        {
          title: 'Pan de gambas fritas',
          price: '3.00',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Arroz y Tallarines',
      dishes: [
        {
          title: 'Arroz frito tres delicias',
          price: '5.40',
          imageUrl: ''
        },
        {
          title: 'Arroz frito con gambas',
          price: '6.80',
          imageUrl: ''
        },
        {
          title: 'Arroz frito singapur',
          price: '6.80',
          imageUrl: ''
        },
        {
          title: 'Arroz frito de la casa',
          price: '6.80',
          imageUrl: ''
        },
        {
          title: 'Arroz blanco',
          price: '3.00',
          imageUrl: ''
        },
        {
          title: 'Tallarines fritos de la casa',
          price: '6.80',
          imageUrl: ''
        },
        {
          title: 'Tallarines fritos con gambas',
          price: '7.10',
          imageUrl: ''
        },
        {
          title: 'Tallarines fritos singapur',
          price: '7.00',
          imageUrl: ''
        },
        {
          title: 'Tallarines fritos a la plancha',
          price: '7.40',
          imageUrl: ''
        },
        {
          title: 'Tallarines fritos con tres delicias',
          price: '6.50',
          imageUrl: ''
        },
        {
          title: 'Tallarines fritos ternera',
          price: '6.80',
          imageUrl: ''
        },
        {
          title: 'Fideos fritos con tres delicias',
          price: '6.50',
          imageUrl: ''
        },
        {
          title: 'Fideos fritos con gambas',
          price: '6.90',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Verduras y Huevos',
      dishes: [
        {
          title: 'Verduras variadas salteadas',
          price: '5.10',
          imageUrl: ''
        },
        {
          title: 'Brotes de soja fritos',
          price: '5.10',
          imageUrl: ''
        },
        {
          title: 'Huevo revuelto con gambas',
          price: '6.00',
          imageUrl: ''
        },
        {
          title: 'Huevo revuelto con jamón',
          price: '5.60',
          imageUrl: ''
        },
        {
          title: 'Verduras frescas chinas con maiz',
          price: '5.80',
          imageUrl: ''
        },
        {
          title: 'Delicias variadas salteadas',
          price: '6.30',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Pescado y Marisco',
      dishes: [
        {
          title: 'Calamares salteados',
          price: '9.50',
          imageUrl: ''
        },
        {
          title: 'Pescado con salsa de ostras',
          price: '9.40',
          imageUrl: ''
        },
        {
          title: 'Pescado con salsa agridulce',
          price: '9.10',
          imageUrl: ''
        },
        {
          title: 'Gambas agridulces',
          price: '9.10',
          imageUrl: ''
        },
        {
          title: 'Gambas con verduras',
          price: '9.00',
          imageUrl: ''
        },
        {
          title: 'Gambas con bambú y setas chinas',
          price: '9.40',
          imageUrl: ''
        },
        {
          title: 'Gambas con champiñón',
          price: '9.50',
          imageUrl: ''
        },
        {
          title: 'Langostinos a la sal y pimienta',
          price: '9.80',
          imageUrl: ''
        },
        {
          title: 'Langostinos fritos',
          price: '9.80',
          imageUrl: ''
        },
        {
          title: 'Gambas con salsa de curry',
          price: '9.50',
          imageUrl: ''
        },
        {
          title: 'Gambas con guindillas',
          price: '9.50',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Ternera',
      dishes: [
        {
          title: 'Ternera con bambú y setas chinas',
          price: '8.10',
          imageUrl: ''
        },
        {
          title: 'Ternera con champiñones',
          price: '7.50',
          imageUrl: ''
        },
        {
          title: 'Ternera con guindillas',
          price: '7.50',
          imageUrl: ''
        },
        {
          title: 'Ternera con pimiento verde',
          price: '7.50',
          imageUrl: ''
        },
        {
          title: 'Ternera con cebolla',
          price: '7.50',
          imageUrl: ''
        },
        {
          title: 'Ternera con salsa de curry',
          price: '7.50',
          imageUrl: ''
        },
        {
          title: 'Ternera con salsa de ostras',
          price: '7.90',
          imageUrl: ''
        },
        {
          title: 'Ternera con verduras',
          price: '7.50',
          imageUrl: ''
        },
        {
          title: 'Ternera a la plancha',
          price: '9.10',
          imageUrl: ''
        },
        {
          title: 'Ternera con maiz',
          price: '7.50',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Cerdo',
      dishes: [
        {
          title: 'Cerdo agridulce',
          price: '7.10',
          imageUrl: ''
        },
        {
          title: 'Cerdo con bambú y setas chinas',
          price: '7.30',
          imageUrl: ''
        },
        {
          title: 'Cerdo con verduras',
          price: '7.20',
          imageUrl: ''
        },
        {
          title: 'Cerdo a la plancha',
          price: '7.80',
          imageUrl: ''
        },
        {
          title: 'Costillas agridulces',
          price: '7.65',
          imageUrl: ''
        },
        {
          title: 'Costillas fritas',
          price: '8.50',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Pollo',
      dishes: [
        {
          title: 'Pollo con guindillas',
          price: '7.40',
          imageUrl: ''
        },
        {
          title: 'Pollo con salsa de mariscos',
          price: '8.40',
          imageUrl: ''
        },
        {
          title: 'Pollo con maiz',
          price: '7.40',
          imageUrl: ''
        },
        {
          title: 'Bolitas de pollo',
          price: '7.60',
          imageUrl: ''
        },
        {
          title: 'Pollo agridulce',
          price: '7.60',
          imageUrl: ''
        },
        {
          title: 'Pollo con salsa de limón',
          price: '7.60',
          imageUrl: ''
        },
        {
          title: 'Pollo con bambú y setas chinas',
          price: '7.40',
          imageUrl: ''
        },
        {
          title: 'Pollo con curry',
          price: '7.40',
          imageUrl: ''
        },
        {
          title: 'Pollo zong you',
          price: '8.70',
          imageUrl: ''
        },
        {
          title: 'Pollo con almendras',
          price: '7.40',
          imageUrl: ''
        },
        {
          title: 'Pollo con champiñón',
          price: '6.90',
          imageUrl: ''
        },
        {
          title: 'Pollo con verduras',
          price: '7.40',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Pato',
      dishes: [
        {
          title: 'Pato asado gran Pekín',
          price: '15.80',
          imageUrl: ''
        },
        {
          title: 'Pato con bambú y setas chinas',
          price: '12.80',
          imageUrl: ''
        },
        {
          title: 'Pato con naranja',
          price: '12.80',
          imageUrl: ''
        },
        {
          title: 'Pato con pina natural',
          price: '12.80',
          imageUrl: ''
        },
        {
          title: 'Pato con almendras',
          price: '13.20',
          imageUrl: ''
        },
        {
          title: 'Pato a la plancha',
          price: '12.80',
          imageUrl: ''
        },
        {
          title: 'Pato frito',
          price: '12.80',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Platos Especiales',
      dishes: [
        {
          title: 'Fideos de soja variados salteados',
          price: '6.50',
          imageUrl: ''
        },
        {
          title: 'Famila feliz',
          price: '9.20',
          imageUrl: ''
        },
        {
          title: 'Ku-bak con ternera',
          price: '8.60',
          imageUrl: ''
        },
        {
          title: 'Ku-bak con tres delicias',
          price: '8.80',
          imageUrl: ''
        },
        {
          title: 'Ku-bak con gambas',
          price: '9.00',
          imageUrl: ''
        },
        {
          title: 'Champiñón setas chinas y hongos chinos salteados',
          price: '9.00',
          imageUrl: ''
        },
        {
          title: 'Hormigas en el arbol',
          price: '8.90',
          imageUrl: ''
        },
        {
          title: 'Patatas fritas con huevos',
          price: '6.20',
          imageUrl: ''
        },
        {
          title: 'Patatas fritas con filete de pollo',
          price: '8.60',
          imageUrl: ''
        },
        {
          title: 'Patatas fritas con bistec',
          price: '9.50',
          imageUrl: ''
        },
        {
          title: 'Patatas fritas con ternera',
          price: '7.80',
          imageUrl: ''
        },
        {
          title: 'Pincho frito con tres delicias',
          price: '7.50',
          imageUrl: ''
        },
        {
          title: 'Pollo frito almendrado',
          price: '9.40',
          imageUrl: ''
        },
        {
          title: 'Carne yu xiang',
          price: '8.00',
          imageUrl: ''
        },
        {
          title: 'Carne al guobao',
          price: '8.50',
          imageUrl: ''
        },
        {
          title: 'Patatas fritas',
          price: '4.50',
          imageUrl: ''
        },
        {
          title: 'Ternera con gambas',
          price: '9.60',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Especialidades de la Casa',
      dishes: [
        {
          title: 'Bambú y setas chinas',
          price: '6.50',
          imageUrl: ''
        },
        {
          title: 'Rollo de huevos con carne',
          price: '7.60',
          imageUrl: ''
        },
        {
          title: 'Leche frita',
          price: '8.20',
          imageUrl: ''
        },
        {
          title: 'Bolitas de verdura fritas',
          price: '7.00',
          imageUrl: ''
        },
        {
          title: 'Bolitas con sésamo fritas',
          price: '7.10',
          imageUrl: ''
        },
        {
          title: 'Gambas fritas con sésamo',
          price: '10.50',
          imageUrl: ''
        },
        {
          title: 'Gambas con anacardos',
          price: '10.80',
          imageUrl: ''
        },
        {
          title: 'Gambas quan dong',
          price: '13.00',
          imageUrl: ''
        },
        {
          title: 'Gambas con hongos chinos',
          price: '11.00',
          imageUrl: ''
        },
        {
          title: 'Cangrejo en jengibre',
          price: '12.50',
          imageUrl: ''
        },
        {
          title: 'Calamares a la plancha',
          price: '10.80',
          imageUrl: ''
        },
        {
          title: 'Verdura con tempura frita',
          price: '8.60',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Comida Tailandesa',
      dishes: [
        {
          title: 'Ensalada de fideos transparentes',
          price: '7.90',
          imageUrl: ''
        },
        {
          title: 'Ensalada de mango verde',
          price: '9.20',
          imageUrl: ''
        },
        {
          title: 'Sopa picante con langostinos thai',
          price: '8.40',
          imageUrl: ''
        },
        {
          title: 'Sopa de pollo con coco thai',
          price: '8.40',
          imageUrl: ''
        },
        {
          title: 'Arroz frito con pollo y langostinos thai',
          price: '9.20',
          imageUrl: ''
        },
        {
          title: 'Arroz frito con verduras thai',
          price: '7.90',
          imageUrl: ''
        },
        {
          title: 'Pollo frito con cacahuete estilo thai',
          price: '10.60',
          imageUrl: ''
        },
        {
          title: 'Pollo frito con anacardos thai',
          price: '10.60',
          imageUrl: ''
        },
        {
          title: 'Pollo frito con albahaca thai',
          price: '10.60',
          imageUrl: ''
        },
        {
          title: 'Pollo al curry rojo, verde o amarillo',
          price: '10.60',
          imageUrl: ''
        },
        {
          title: 'Ternera frita con albahaca thai',
          price: '10.60',
          imageUrl: ''
        },
        {
          title: 'Ternera al curry rojo, verde o amarillo',
          price: '10.60',
          imageUrl: ''
        },
        {
          title: 'Langostinos al curry',
          price: '12.80',
          imageUrl: ''
        },
        {
          title: 'Tallarines fritos estilo tailandés',
          price: '9.60',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Salsas',
      dishes: [
        {
          title: 'Salsa agridulce',
          price: '0.50',
          imageUrl: ''
        },
        {
          title: 'Salsa soja',
          price: '0.60',
          imageUrl: ''
        },
        {
          title: 'Salsa picante',
          price: '0.60',
          imageUrl: ''
        },
        {
          title: 'Salsa de ensalada',
          price: '0.80',
          imageUrl: ''
        },
        {
          title: 'Salsa de pato',
          price: '1.00',
          imageUrl: ''
        }
      ]
    },
    {
      name: 'Bebidas',
      dishes: [
        {
          title: 'Refrescos',
          price: '1.75',
          imageUrl: ''
        },
        {
          title: 'Cerveza',
          price: '1.75',
          imageUrl: ''
        },
        {
          title: 'Refrescos de 2 litro',
          price: '3.80',
          imageUrl: ''
        },
        {
          title: 'Palillo',
          price: '0.30',
          imageUrl: ''
        },
        {
          title: 'Bolsa',
          price: '0.10',
          imageUrl: ''
        }
      ]
    }
  ]
}; 