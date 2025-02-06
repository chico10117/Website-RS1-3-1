import { type Restaurant, type Category, type Dish } from '../../src/lib/types/menu.types';

const allergenMap = {
  1: 'Gluten',
  2: 'Crustáceos',
  3: 'Huevos',
  4: 'Pescado',
  5: 'Cacahuetes',
  6: 'Soja',
  7: 'Lácteos',
  8: 'Frutos de cáscara',
  9: 'Apio',
  10: 'Mostaza',
  11: 'Sésamo',
  12: 'Dióxido de azufre y sulfitos',
  13: 'Moluscos',
  14: 'Altramuces'
};

const getAllergenText = (allergens: number[]): string => {
  if (!allergens || allergens.length === 0) return '';
  const allergenTexts = allergens.map(num => allergenMap[num as keyof typeof allergenMap]);
  return `Alérgenos: ${allergenTexts.join(', ')}`;
};

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'China Town',
    logo: '', // Will be set by getRandomPhotoUrl in seed.ts with query "chinese-restaurant-logo"
    customPrompt: `
RESTAURANTE CHINO CHINA TOWN

COMIDA CHINA A DOMICILIO
ABUNDANTE Y SABROSA, INGREDIENTES FRESCOS

MENÚS ESPECIALES:

PARA 1 PERSONA    12.50€
- Rollo de primavera
- Arroz frito tres delicias
- Pollo con almendras o
  Ternera con salsa de ostras
- 1 lata de refresco

PARA 2 PERSONAS    21.40€
- Rollo de primavera (2)
- Arroz frito tres delicias
- Pollo con almendras
- Ternera con bambú y setas chinas

PARA 3 PERSONAS    30.90€
- Ensalada china
- Rollo de primavera (3)
- Arroz frito tres delicias
- Pollo con almendras
- Cerdo agridulce
- Ternera con salsa de ostras

PARA 4 PERSONAS    42.40€
- Ensalada china
- Rollo de primavera (4)
- Arroz frito tres delicias (2)
- Pollo con almendras
- Cerdo agridulce
- Ternera con salsa de ostras
- Gambas con bambú y setas chinas

PARA 5 PERSONAS    51.90€
- Ensalada china
- Rollo de primavera (5)
- Corteza de gambas
- Arroz frito tres delicias (2)
- Pollo con almendras
- Cerdo agridulce
- Ternera con salsa de ostras
- Gambas con bambú y setas chinas
- Familia feliz

PARA 7 PERSONAS    73.90€
- Ensalada china
- Rollo de primavera (7)
- Corteza de gambas
- Arroz frito tres delicias (2)
- Pollo con almendras
- Cerdo agridulce
- Ternera con salsa de ostras
- Gambas con bambú y setas chinas
- Familia feliz
- Tallarines con tres delicias
- Pato a la naranja

HORARIO:
de 12:30 a 16:30 Y DE 20:00 A 24:00
ABIERTO TODOS LOS DÍAS
(Cerrado el miércoles excepto los miércoles festivos)

PEDIDO MÍNIMO: 12.00 Euros

REGALOS* POR PUNTOS:
(*Por cada 12€ ó 30€ de Consumición NO INCLUIDO menú para 1 persona)

Por cada 12€ de Consumición:
REGALO:
- Lata de Coca Cola o
- Pan de Gambas o
- Pan Chino

Si pedido supera los 30€
REGALO:
- Ternera con salsa de ostras o
- Pollo al limón o
- Lata de refresco o
- Pan chino o
- Pan de gambas

BEBIDAS:
- Refresco     1.70€
- Cerveza      1.70€
- Aquarius     1.90€
- Nestea       1.90€
- Salsa agridulce  0.30€
- Salsa soja   0.30€

CONTACTO:
Teléfonos:
- 91 672 91 21
- 91 669 39 30

DIRECCIÓN:
C/ Trafalgar, 6 (Esq. C/Dr Fleming 43)
28820 Coslada (Madrid)

MEDIOS DE PAGO:
Admitimos: Cheque Gourmet, Ticket Restaurant

CADUCA: 2025/06/31`
  },
  categories: [
    {
      name: 'SOPAS',
      dishes: [
        {
          title: '1 Sopa de aleta de tiburón',
          price: '3.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '2 Sopa de maiz',
          price: '3.75',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '6 Sopa de pollo con champiñón',
          price: '3.75',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '7 Sopa agripicante',
          price: '3.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '7A Sopa de miso',
          price: '4.40',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '34A Sopa de fideos o tallarines',
          price: '5.95',
          allergens: [1],
          description: getAllergenText([1])
        }
      ]
    },
    {
      name: 'ENTREMESES',
      dishes: [
        {
          title: '8 Rollo de primavera',
          price: '1.80',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '9 Mini Rollitos (4piezas)',
          price: '3.70',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '9A Rollo vegetal',
          price: '4.15',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '9B Rollos de la Casa (2 piezas)',
          price: '4.70',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '9C Rollos de vietnamita (4 piezas)',
          price: '4.90',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '10 Wan-Tun frito',
          price: '3.50',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '10A Queso frito',
          price: '5.70',
          allergens: [1, 7],
          description: getAllergenText([1, 7])
        },
        {
          title: '10B Gyoza',
          price: '5.70',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '11 Cortezas de gambas',
          price: '3.50',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '12 Patatas fritas',
          price: '3.50',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '13 Pan chino',
          price: '1.80',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '14 Ensalada china',
          price: '4.20',
          allergens: [2],
          description: getAllergenText([2])
        },
        {
          title: '16 Ensalada de gambas',
          price: '5.25',
          allergens: [],
          description: getAllergenText([])
        }
      ]
    },
    {
      name: 'ARROZ',
      dishes: [
        {
          title: '18 Arroz blanco',
          price: '3.20',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '19 Arroz frito con tres delicias',
          price: '4.50',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '20 Arroz frito con gambas',
          price: '5.30',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '21 Arroz frito con ternera',
          price: '5.10',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '23 Arroz frito con mil delicias',
          price: '5.80',
          allergens: [3, 6],
          description: getAllergenText([3, 6])
        },
        {
          title: '23A Arroz frito cantones',
          price: '5.90',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '26 Ku-Bak con gambas',
          price: '6.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '27 Ku-Bak con tres delicias',
          price: '6.90',
          allergens: [2, 6],
          description: getAllergenText([2, 6])
        }
      ]
    },
    {
      name: 'TALLARINES',
      dishes: [
        {
          title: '28 Tallarines fritos con tres delicias',
          price: '5.20',
          allergens: [2, 3, 6],
          description: getAllergenText([2, 3, 6])
        },
        {
          title: '29 Tallarines fritos con gambas',
          price: '5.30',
          allergens: [2, 3, 6],
          description: getAllergenText([2, 3, 6])
        },
        {
          title: '29C Tallarines bambú setas',
          price: '5.20',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '30 Tallarines fritos con ternera',
          price: '5.20',
          allergens: [3, 6],
          description: getAllergenText([3, 6])
        },
        {
          title: '31 Tallarines fritos con pollo',
          price: '5.20',
          allergens: [3, 6],
          description: getAllergenText([3, 6])
        },
        {
          title: '32 Tallarines fritos estilo chino',
          price: '5.90',
          allergens: [2, 3, 6],
          description: getAllergenText([2, 3, 6])
        },
        {
          title: '32A Tallarines udon con picante',
          price: '5.90',
          allergens: [2, 3, 6],
          description: getAllergenText([2, 3, 6])
        },
        {
          title: '32B Tallarines de la casa',
          price: '5.90',
          allergens: [2, 3, 6],
          description: getAllergenText([2, 3, 6])
        },
        {
          title: '34 Fideos de arroz fritos',
          price: '6.10',
          allergens: [2, 3, 6],
          description: getAllergenText([2, 3, 6])
        }
      ]
    },
    {
      name: 'HUEVOS Y VERDURAS',
      dishes: [
        {
          title: '35 Bambú y setas chinas',
          price: '6.10',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '36 Verduras variadas salteadas',
          price: '5.60',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '36A Bolita de verdura',
          price: '6.20',
          allergens: [1, 3],
          description: getAllergenText([1, 3])
        },
        {
          title: '37 Huevos revueltos con gambas',
          price: '5.90',
          allergens: [],
          description: getAllergenText([])
        }
      ]
    },
    {
      name: 'CERDO',
      dishes: [
        {
          title: '39 Lomo asado con salsa picante y dulce',
          price: '7.60',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '41A Costillas con salsa picante',
          price: '6.70',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '42 Cerdo con bambú y setas chinas',
          price: '7.00',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '43 Cerdo agridulce',
          price: '6.70',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '44 Costillas asadas',
          price: '6.50',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '45 Costillas agridulces',
          price: '6.70',
          allergens: [6],
          description: getAllergenText([6])
        }
      ]
    },
    {
      name: 'POLLO',
      dishes: [
        {
          title: '47 Pollo con almendras',
          price: '6.70',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '48 Pollo al limón',
          price: '6.70',
          allergens: [1, 3],
          description: getAllergenText([1, 3])
        },
        {
          title: '49 Pollo con champiñón',
          price: '6.70',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '51A Wok de pollo con brócoli',
          price: '7.20',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '52 Pollo con bambú y setas chinas',
          price: '7.00',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '53 Pollo agridulce',
          price: '6.70',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '54 Bolitas de pollo fritas',
          price: '6.70',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '56 Pollo al curry',
          price: '6.70',
          allergens: [1, 3],
          description: getAllergenText([1, 3])
        },
        {
          title: '59 Pollo con salsa picante',
          price: '6.70',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '59A Pollo crujiente picante',
          price: '7.40',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '86A Pollo con-bao',
          price: '7.00',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '104 Pollo almendrado frito',
          price: '7.10',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '104A Pollo con sésamo',
          price: '7.10',
          allergens: [11],
          description: getAllergenText([11])
        }
      ]
    },
    {
      name: 'TERNERA',
      dishes: [
        {
          title: '47A Ternera con almendras',
          price: '7.10',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '61 Ternera con pimientos verdes',
          price: '6.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '63 Ternera con curry',
          price: '6.90',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '64 Ternera con cebolla',
          price: '6.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '66 Ternera con salsa picante',
          price: '6.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '66B Ternera crujiente picante',
          price: '7.40',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '67 Ternera con salsa de ostras',
          price: '6.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '68A Wok de ternera con brócoli',
          price: '7.30',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '69 Ternera con champiñón',
          price: '6.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '71 Ternera con bambú y setas chinas',
          price: '7.00',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '72 Ternera con patatas fritas',
          price: '6.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '113 Ternera en salsa',
          price: '7.90',
          allergens: [],
          description: getAllergenText([])
        }
      ]
    },
    {
      name: 'MARISCOS',
      dishes: [
        {
          title: '73 Sepia al estilo Tsa-Yan',
          price: '7.50',
          allergens: [3],
          description: getAllergenText([3])
        },
        {
          title: '74 Calamares con salsa picante',
          price: '7.50',
          allergens: [6],
          description: getAllergenText([6])
        }
      ]
    },
    {
      name: 'GAMBAS',
      dishes: [
        {
          title: '83 Gambas con salsa picante',
          price: '7.80',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '84 Gambas con bambú y setas chinas',
          price: '7.90',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '87 Gambas agridulces',
          price: '7.80',
          allergens: [1, 3],
          description: getAllergenText([1, 3])
        },
        {
          title: '89 Gambas fritas',
          price: '7.80',
          allergens: [1, 3],
          description: getAllergenText([1, 3])
        }
      ]
    },
    {
      name: 'PATO',
      dishes: [
        {
          title: '91 Pato asado de Pekín',
          price: '12.50',
          allergens: [1, 5, 11],
          description: getAllergenText([1, 5, 11])
        },
        {
          title: '96 Pato con naranja o limón',
          price: '9.20',
          allergens: [1],
          description: getAllergenText([1])
        },
        {
          title: '97 Pato frito',
          price: '9.50',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: '97B Pato crujiente',
          price: '9.50',
          allergens: [3],
          description: getAllergenText([3])
        }
      ]
    },
    {
      name: 'PLATOS ESPECIALES',
      dishes: [
        {
          title: '109 Fideos especial',
          price: '6.70',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '110 Familia feliz',
          price: '7.60',
          allergens: [6],
          description: getAllergenText([6])
        },
        {
          title: '292 Du-Fu',
          price: '7.60',
          allergens: [1],
          description: getAllergenText([1])
        }
      ]
    },
    {
      name: 'MENÚS ESPECIALES',
      dishes: [
        {
          title: 'PARA 1 PERSONA (12.50€)',
          price: '12.50',
          description: 'Rollo de primavera, Arroz frito tres delicias, Pollo con almendras o Ternera con salsa de ostras, 1 lata de refresco. ' + getAllergenText([1, 3, 6]),
          allergens: [1, 3, 6]
        },
        {
          title: 'PARA 2 PERSONAS (21.40€)',
          price: '21.40',
          description: 'Rollo de primavera (2), Arroz frito tres delicias, Pollo con almendras, Ternera con bambú y setas chinas. ' + getAllergenText([1, 3, 6]),
          allergens: [1, 3, 6]
        },
        {
          title: 'PARA 3 PERSONAS (30.90€)',
          price: '30.90',
          description: 'Ensalada china, Rollo de primavera (3), Arroz frito tres delicias, Pollo con almendras, Cerdo agridulce, Ternera con salsa de ostras. ' + getAllergenText([1, 2, 3, 6]),
          allergens: [1, 2, 3, 6]
        },
        {
          title: 'PARA 4 PERSONAS (42.40€)',
          price: '42.40',
          description: 'Ensalada china, Rollo de primavera (4), Arroz frito tres delicias (2), Pollo con almendras, Cerdo agridulce, Ternera con salsa de ostras, Gambas con bambú y setas chinas. ' + getAllergenText([1, 2, 3, 6]),
          allergens: [1, 2, 3, 6]
        },
        {
          title: 'PARA 5 PERSONAS (51.90€)',
          price: '51.90',
          description: 'Ensalada china, Rollo de primavera (5), Corteza de gambas, Arroz frito tres delicias (2), Pollo con almendras, Cerdo agridulce, Ternera con salsa de ostras, Gambas con bambú y setas chinas, Familia feliz. ' + getAllergenText([1, 2, 3, 6]),
          allergens: [1, 2, 3, 6]
        },
        {
          title: 'PARA 7 PERSONAS (73.90€)',
          price: '73.90',
          description: 'Ensalada china, Rollo de primavera (7), Corteza de gambas, Arroz frito tres delicias (2), Pollo con almendras, Cerdo agridulce, Ternera con salsa de ostras, Gambas con bambú y setas chinas, Familia feliz, Tallarines con tres delicias, Pato a la naranja. ' + getAllergenText([1, 2, 3, 6]),
          allergens: [1, 2, 3, 6]
        }
      ]
    },
    {
      name: 'BEBIDAS',
      dishes: [
        {
          title: 'Refresco',
          price: '1.70',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: 'Cerveza',
          price: '1.70',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: 'Aquarius',
          price: '1.90',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: 'Nestea',
          price: '1.90',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: 'Salsa agridulce',
          price: '0.30',
          allergens: [],
          description: getAllergenText([])
        },
        {
          title: 'Salsa soja',
          price: '0.30',
          allergens: [],
          description: getAllergenText([])
        }
      ]
    }
  ]
}; 