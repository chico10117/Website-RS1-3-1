import { type Restaurant, type Category, type Dish } from '../../src/lib/types/menu.types';

export const seedData = {
  userEmail: 'chico10117@gmail.com',
  restaurant: {
    name: 'Santo CDMX',
    logo: '', // Will be set by generateAndStoreImage in seed.ts
    customPrompt: `
SANTO MX
Auténtica Cocina Mexicana

ESPECIALIDADES:
- Sashimis
- Nigiris
- Hand Rolls
- Makis
- Set Menús
- Postres

HORARIO DE APERTURA:
Abierto todos los días

MEDIOS DE PAGO:
Visa, MasterCard, Efectivo
`
  },
  categories: [
    {
      name: 'ENTRADAS',
      dishes: [
        {
          title: 'TOSTADA CHU\'TORO',
          price: '235',
          description: 'Láminas de chu\'toro marinado en soya-limón, salsa spicy de la casa y cremoso de aguacate con un toque de brotes de cilantro, aros de cebolla cambray y furikake de shiso. Servido en una tostada de wonton',
          allergens: ['pescado', 'sésamo', 'soja'],
          portions: '2 pzas'
        },
        {
          title: 'HIROSHITO PEPPERS',
          price: '170',
          description: 'Pimientos Padrón con salsa de la casa ligeramente picante y furikake',
          allergens: ['sésamo'],
          portions: '80gr'
        },
        {
          title: 'SOPA MISO',
          price: '70',
          description: 'Tofu, negi & wakame',
          allergens: ['soja'],
          portions: '200ml'
        },
        {
          title: 'ENSALADA DE ALGA',
          price: '130',
          description: '',
          allergens: ['sésamo'],
          portions: '50gr'
        },
        {
          title: 'EDAMAMES AL VAPOR TRUFADOS',
          price: '125',
          description: '',
          allergens: ['soja'],
          portions: '80gr'
        },
        {
          title: 'EDAMAMES AL VAPOR CON SAL DE COLIMA',
          price: '100',
          description: '',
          allergens: ['soja'],
          portions: '80gr'
        },
        {
          title: 'EBI TEMPURA',
          price: '125',
          description: 'Camarones estilo tempura acompañados de una salsa de cacahuate ligeramente picante',
          allergens: ['crustáceos', 'gluten'],
          portions: '2pzas'
        },
        {
          title: 'CAMARONES ROCA',
          price: '290',
          description: 'Camarón tempura servido con salsa spicy, furikake shiso y cebollín',
          allergens: ['crustáceos', 'gluten', 'sésamo']
        }
      ]
    },
    {
      name: 'SASHIMIS',
      dishes: [
        {
          title: 'SANTŌ TIRADITO',
          price: '220',
          description: 'Pargo bañado en nuestra salsa estilo tiradito, shishimi togarashi y yuzukosho',
          allergens: ['pescado'],
          portions: '80gr'
        },
        {
          title: 'CHU\'TORO',
          price: '320',
          description: 'Atún medio graso',
          allergens: ['pescado'],
          portions: '80gr'
        },
        {
          title: 'O\'TORO',
          price: '345',
          description: 'Atún graso sellado con carbón binchotan',
          allergens: ['pescado'],
          portions: '80gr'
        },
        {
          title: 'ZUCCHINI TRUFA',
          price: '125',
          description: 'Finas láminas de calabaza asada a la mantequilla vegana, sazonadas con sal de colima y tartufata',
          allergens: [],
          portions: '70gr',
          isVegetarian: true
        },
        {
          title: 'SALMÓN',
          price: '200',
          description: '',
          allergens: ['pescado'],
          portions: '80gr'
        },
        {
          title: 'HAMACHI',
          price: '320',
          description: '',
          allergens: ['pescado'],
          portions: '80gr'
        },
        {
          title: 'ROBALO',
          price: '170',
          description: 'Toque de yuzu, ume, sal de Colima y brote de cilantro',
          allergens: ['pescado'],
          portions: '80gr'
        },
        {
          title: 'AKAMI',
          price: '300',
          description: 'Atún magro',
          allergens: ['pescado'],
          portions: '80gr'
        }
      ]
    },
    {
      name: 'NIGIRIS',
      dishes: [
        {
          title: 'UNI & IKURA',
          price: '300',
          description: 'Erizo & caviar de salmón',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'UNI',
          price: '250',
          description: 'Erizo de mar',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'AKAMI',
          price: '80',
          description: 'Nikiri y un toque de wasabi',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'CHU\'TORO',
          price: '100',
          description: 'Nikiri y un toque de jengibre',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'O\'TORO',
          price: '135',
          description: 'Sellado con salsa nikkiri, y un toque de wasabi',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'CHU\'TORO WAGYU',
          price: '140',
          description: 'Chu\'toro flameado con grasa de Wagyu, negi',
          allergens: ['pescado'],
          portions: '19gr'
        },
        {
          title: 'SALMÓN',
          price: '80',
          description: '',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'SALMÓN MANTEQUILLOSO',
          price: '125',
          description: 'Flameado a la mantequilla & ponzu, ralladura de limón amarillo, brote de cilantro',
          allergens: ['pescado', 'lácteos'],
          portions: '12gr'
        },
        {
          title: 'SHIITAKE ESPECIAL',
          price: '60',
          description: 'Hongo shiitake preparado con soya, chile serrano y cebollín',
          allergens: ['soja'],
          portions: '12gr',
          isVegetarian: true
        },
        {
          title: 'PARGO',
          price: '80',
          description: 'Yuzu, yuzukosho y un toque de furikake',
          allergens: ['pescado', 'sésamo'],
          portions: '12gr'
        },
        {
          title: 'HAMACHI CHOCO',
          price: '95',
          description: 'Chocolate oaxaqueño flameado y sal de Colima',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'HAMACHI UMAMI',
          price: '125',
          description: 'Yuzu-soya, hojita de cilantro, toque de sriracha de la casa',
          allergens: ['pescado', 'soja'],
          portions: '12gr'
        },
        {
          title: 'UNAGI',
          price: '105',
          description: 'Flameado con toque de tare',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'AGUACATE',
          price: '45',
          description: 'Salsa tare y ajonjolí',
          allergens: ['sésamo'],
          portions: '12gr',
          isVegetarian: true
        },
        {
          title: 'WAGYU A5',
          price: '280',
          description: 'Flameado con salsa tare y un toque de yuzukosho',
          allergens: [],
          portions: '12gr'
        },
        {
          title: 'HAMACHI NEGI & TRUFA',
          price: '100',
          description: 'Tartufata, cremoso de trufa y negi',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'HOTATE',
          price: '70',
          description: 'Callo de hacha',
          allergens: ['moluscos'],
          portions: '12gr'
        },
        {
          title: 'HONGO ENOKI',
          price: '95',
          description: 'Mantequilla vegana clarificada, tartufata',
          allergens: [],
          portions: '12gr',
          isVegetarian: true
        },
        {
          title: 'SALMÓN TORO',
          price: '95',
          description: 'Salmón graso con un toque de yuzu y yuzukosho con un toque de sal de Colima',
          allergens: ['pescado'],
          portions: '12gr'
        },
        {
          title: 'AKAMI ESPECIAL',
          price: '95',
          description: 'Sellado con nikkiri, reducción de soya, negi & lámina de ajo frito',
          allergens: ['pescado', 'soja'],
          portions: '12gr'
        },
        {
          title: 'O\'TORO ESPECIAL',
          price: '165',
          description: 'Miso cacahuate, limón eureka, chile serrano',
          allergens: ['pescado', 'soja'],
          portions: '12gr'
        },
        {
          title: 'ROBALO',
          price: '95',
          description: 'Salsa de la casa, yuzukosho y ume',
          allergens: ['pescado'],
          portions: '12gr'
        }
      ]
    },
    {
      name: 'HAND ROLLS',
      dishes: [
        {
          title: 'UNI',
          price: '300',
          description: 'Erizo de mar',
          allergens: ['pescado'],
          portions: '35gr'
        },
        {
          title: 'AKAMI',
          price: '145',
          description: 'Ajonjolí',
          allergens: ['pescado', 'sésamo'],
          portions: '35gr'
        },
        {
          title: 'CHU\'TORO',
          price: '165',
          description: 'Cebollín',
          allergens: ['pescado'],
          portions: '35gr'
        },
        {
          title: 'O\'TORO',
          price: '165',
          description: 'Cebollín',
          allergens: ['pescado'],
          portions: '35gr'
        },
        {
          title: 'SALMÓN',
          price: '105',
          description: '',
          allergens: ['pescado'],
          portions: '35gr'
        },
        {
          title: 'AGUACATE TEMPURA',
          price: '95',
          description: 'Salsa Tare',
          allergens: ['gluten'],
          portions: '35gr',
          isVegetarian: true
        },
        {
          title: 'EBI TEMPURA',
          price: '105',
          description: 'Camarón tempura, aguacate y salsa tare',
          allergens: ['crustáceos', 'gluten'],
          portions: '1pza'
        },
        {
          title: 'HOTATE',
          price: '125',
          description: 'Tartar de callo de hacha, con mayonesa, masago y ajonjolí',
          allergens: ['moluscos', 'sésamo'],
          portions: '35gr'
        },
        {
          title: 'HAMACHI NEGI & TRUFA',
          price: '175',
          description: 'Hamachi, negi, aceite de trufa, acompañado de ponzu trufada',
          allergens: ['pescado'],
          portions: '35gr'
        },
        {
          title: 'SPICY TUNA',
          price: '115',
          description: 'Atún spicy, pepino kiury',
          allergens: ['pescado'],
          portions: '35gr'
        },
        {
          title: 'SPICY SALMÓN',
          price: '105',
          description: 'Spicy mayo, pepino kiury',
          allergens: ['pescado'],
          portions: '35gr'
        },
        {
          title: 'WAGYU A5',
          price: '365',
          description: 'Toque de sal de Colima',
          allergens: [],
          portions: '35gr'
        },
        {
          title: 'VEGGIE SARADA',
          price: '95',
          description: 'Lechuga, daikon, pepino kiury, aguacate, salsa miso con cacahuate',
          allergens: ['soja'],
          portions: '35gr',
          isVegetarian: true
        },
        {
          title: 'ESPÁRRAGOS FLAMEADOS',
          price: '95',
          description: 'Aceite de ajonjolí',
          allergens: ['sésamo'],
          portions: '35gr',
          isVegetarian: true
        },
        {
          title: 'UNAGI',
          price: '155',
          description: 'Flameado, pepino kiury, salsa tare',
          allergens: ['pescado'],
          portions: '35gr'
        },
        {
          title: 'CRISPY SOFTSHELL CRAB',
          price: '135',
          description: 'Aguacate, pepino kiury',
          allergens: ['crustáceos', 'gluten'],
          portions: '35gr'
        },
        {
          title: 'SHROOMS',
          price: '115',
          description: 'Hongo enoki, hongo shimeji salteados con mantequilla vegana, paprika',
          allergens: [],
          portions: '35gr',
          isVegetarian: true
        }
      ]
    },
    {
      name: 'BOWLS',
      dishes: [
        {
          title: 'DELUXE',
          price: '380',
          description: 'Hamachi, akami, salmón, aguacate, sobre arroz shari',
          allergens: ['pescado'],
          portions: '110gr'
        },
        {
          title: 'AKAMI SALMÓN',
          price: '280',
          description: 'Salmón, akami, ajonjolí, cebollín, kizami nori y tzuma',
          allergens: ['pescado', 'sésamo'],
          portions: '80gr'
        },
        {
          title: 'WAGYU',
          price: '450',
          description: 'Wagyu A5 japonés, ajonjolí, cebollín, kizami nori y tzuma',
          allergens: ['sésamo'],
          portions: '80gr'
        },
        {
          title: 'VEGGIE',
          price: '250',
          description: 'Pepino kiury con limón eureka y togarashi, aguacate con ajonjolí, calabaza salteada con mantequilla vegana, ensalada de alga, edamames al vapor, papa frita y zanahoria, sobre arroz shari',
          allergens: ['soja', 'sésamo'],
          portions: '60gr',
          isVegetarian: true
        },
        {
          title: 'CHU\'TORO',
          price: '300',
          description: 'Chu\'toro, daikon, kizami nori, cebollín, ajonjolí',
          allergens: ['pescado', 'sésamo'],
          portions: '60gr'
        }
      ]
    },
    {
      name: 'MAKIS',
      dishes: [
        {
          title: 'DOBLE DRAGÓN',
          price: '315',
          description: 'Camarón tempura y espárragos por dentro, aguacate y hojuelas de hanakatsuo por fuera. Bañado en salsa de mango-trufa, ajonjolí y salsa tare',
          allergens: ['crustáceos', 'gluten', 'sésamo'],
          portions: '8 pzas, 300gr'
        },
        {
          title: 'SPICY TUNA',
          price: '260',
          description: 'Aguacate por dentro, spicy tuna, cebollín y hojuelas de tempura crujientes por fuera. Acompañado de salsa tare y spicy mayo de la casa, ajonjolí',
          allergens: ['pescado', 'gluten', 'sésamo'],
          portions: '8 pzas, 250gr'
        },
        {
          title: 'DARUMA',
          price: '325',
          description: 'Soft shell crab tempura y aguacate por dentro, masago y salsa tare por fuera',
          allergens: ['crustáceos', 'gluten'],
          portions: '8 pzas, 270gr'
        },
        {
          title: 'VEGGIE DRAGON',
          price: '230',
          description: 'Espárrago tempura y hongo enoki por dentro, cubierto con aguacate, nuestra salsa de mango-trufa, coco rallado, salsa tare',
          allergens: ['gluten'],
          portions: '8 pzas, 250gr',
          isVegetarian: true
        },
        {
          title: 'SENDAI',
          price: '365',
          description: 'Camarón tempura, espárrago, pepino y cebollín por dentro. Aguacate, tartar de hotate, spicy mayo, láminas de chile serrano y salsa tare por fuera',
          allergens: ['crustáceos', 'moluscos', 'gluten'],
          portions: '320gr'
        },
        {
          title: 'TZURAI HONO',
          price: '230',
          description: 'Salmón fresco, Pepino y aguacate por dentro, arroz por fuera, servido con salsa spicy, tanuki y cebollín',
          allergens: ['pescado'],
          portions: '300gr'
        },
        {
          title: 'EBINAGI',
          price: '335',
          description: 'Camarón tempura, Pepino y aguacate por dentro, anguila, salsa de anguila por fuera',
          allergens: ['crustáceos', 'pescado', 'gluten'],
          portions: '320gr'
        },
        {
          title: 'SAN-SHAKE',
          price: '345',
          description: 'Salmón fresco, piel de salmón frita e ikura con un toque de yuzu',
          allergens: ['pescado'],
          portions: '6 pzas, 150gr'
        },
        {
          title: 'ŌKI',
          price: '290',
          description: 'Pesca del día, aguacate, espárrago, negi, ensalada de alga y pepino',
          allergens: ['pescado'],
          portions: '5 pzas, 200gr'
        }
      ]
    },
    {
      name: 'CONCHAS',
      dishes: [
        {
          title: 'ALMEJA CHOCOLATA',
          price: '175',
          description: 'Estilo "tiradito". Yuzu, yuzukosho y sal de Colima',
          allergens: ['moluscos'],
          portions: '1 pza, 40gr'
        }
      ]
    },
    {
      name: 'SET MENU NIGIRI',
      dishes: [
        {
          title: 'SET MENU 3',
          price: '290',
          description: '- AKAMI\n- CHU\'TORO\n- O\'TORO',
          allergens: ['pescado'],
          portions: '36gr'
        },
        {
          title: 'SET MENU 5',
          price: '360',
          description: '- AKAMI\n- SALMÓN TORO\n- HAMACHI TRUFA\n- HOTATE\n- PARGO',
          allergens: ['pescado', 'moluscos'],
          portions: '60gr'
        },
        {
          title: 'SET MENU 7',
          price: '690',
          description: '- PARGO\n- CHU\'TORO\n- IKURA\n- O\'TORO\n- UNAGI\n- HAMACHI CHOCO\n- SALMÓN TORO',
          allergens: ['pescado'],
          portions: '84gr'
        },
        {
          title: 'SET MENU 9',
          price: '860',
          description: '- SALMÓN TORO\n- CHU\'TORO\n- O\'TORO\n- UNAGI\n- IKURA\n- HAMACHI TRUFA\n- HOTATE\n- PARGO\n- ROBALO',
          allergens: ['pescado', 'moluscos'],
          portions: '108gr'
        },
        {
          title: 'SET MENU VEGGIE',
          price: '210',
          description: '- AGUACATE\n- SHIITAKE ESPECIAL\n- HONGO ENOKI',
          allergens: [],
          isVegetarian: true
        }
      ]
    },
    {
      name: 'SET MENU HAND ROLLS',
      dishes: [
        {
          title: 'SET MENU 3',
          price: '410',
          description: '- SOPA MISO\n- AKAMI (Atún magro)\n- SALMÓN\n- HAMACHI NEGI & TRUFA\n(Cola amarilla, cebollín y trufa)',
          allergens: ['pescado', 'soja'],
          portions: '105gr'
        },
        {
          title: 'SET MENU 4',
          price: '480',
          description: '- SOPA MISO\n- AKAMI (Atún magro)\n- SALMÓN\n- HOTATE (Callo de hacha)\n- SPICY TUNA',
          allergens: ['pescado', 'moluscos', 'soja'],
          portions: '140gr'
        },
        {
          title: 'SET MENU 5',
          price: '640',
          description: '- SOPA MISO\n- CHU\'TORO (Atún graso)\n- SALMÓN\n- HOTATE (Callo de hacha)\n- EBI TEMPURA (Camarón tempura)\n- HAMACHI NEGI & TRUFA\n(Cola amarilla, cebollín y trufa)',
          allergens: ['pescado', 'moluscos', 'crustáceos', 'gluten', 'soja'],
          portions: '175gr'
        },
        {
          title: 'SET MENU 6',
          price: '780',
          description: '- SOPA MISO\n- O\'TORO (Atún graso)\n- SPICY TUNA\n- HOTATE (Callo de hacha)\n- EBI TEMPURA (Camarón tempura)\n- UNAGI\n- HAMACHI NEGI & TRUFA\n(Cola amarilla, cebollín y trufa)',
          allergens: ['pescado', 'moluscos', 'crustáceos', 'gluten', 'soja'],
          portions: '210gr'
        },
        {
          title: 'SET MENU VEGGIE',
          price: '290',
          description: '- ESPÁRRAGOS FLAMEADOS\n- EDAMAMES CON SAL DE COLIMA\n- VEGGIE SARADA\n(Lechuga, pepino, aguacate y nabo)\n- AGUACATE TEMPURA',
          allergens: ['soja', 'gluten', 'sésamo'],
          isVegetarian: true
        }
      ]
    },
    {
      name: 'POSTRES',
      dishes: [
        {
          title: 'CRÈME BRÛLÉE DE MATCHA',
          price: '145',
          description: '',
          allergens: ['lácteos', 'huevo'],
          portions: '200gr'
        },
        {
          title: 'CRÈME BRÛLÉE DE TARO',
          price: '145',
          description: '',
          allergens: ['lácteos', 'huevo'],
          portions: '200gr'
        },
        {
          title: 'SET DE MOCHIS',
          price: '260',
          description: 'Delicioso helado artesanal cubierto con una masa de arroz suave',
          allergens: ['lácteos', 'gluten'],
          portions: '3 pzas',
          extras: [
            {
              title: 'Extra',
              price: '90',
              description: 'A elegir:\n- COCO\n- CONEJITO\n- TARO\n- FERRERO\n- MATCHA\n- TEMPORADA',
              portions: '1 pza'
            }
          ]
        }
      ]
    }
  ]
}; 